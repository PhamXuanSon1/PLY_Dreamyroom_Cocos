'use strict';
/**
 * Tiến trình con: đọc PSD, xuất mỗi layer thành PNG (đã cắt viền trong suốt) + thumbnail
 * vào thư mục cache, ghi manifest.json mô tả layer.
 *
 * Chạy tách khỏi tiến trình Editor vì ag-psd giữ toàn bộ pixel trong RAM (PSD 5k×5k ~1GB).
 *
 *   node psd-worker.js <psdPath> <cacheDir>
 *
 * Gửi về cha (process.send): { type: 'progress', done, total, text } | { type: 'done', manifest } | { type: 'error', message }
 */

const fs = require('fs');
const path = require('path');
const ag = require('ag-psd');
const { PNG } = require('pngjs');
const { sanitizeKey } = require('./naming');

const MANIFEST_VERSION = 3;
const THUMB_SIZE = 72;
/** Cạnh dài nhất của ảnh xem trước cả map trong panel. */
const PREVIEW_SIZE = 1600;
/** Alpha tối thiểu để 1 pixel preview tính là "trúng" layer khi click. */
const HIT_ALPHA = 40;

// ag-psd cần createImageData; không có canvas trong Node nên tự cấp mảng pixel.
ag.initializeCanvas(
    () => { throw new Error('canvas không khả dụng trong worker'); },
    undefined,
    (w, h) => ({ width: w, height: h, data: new Uint8ClampedArray(w * h * 4) }),
);

function send(msg) {
    if (process.send) process.send(msg);
    else if (msg.type !== 'progress') console.log(JSON.stringify(msg).slice(0, 400));
}

/** Nhân alpha của layer với layer mask (nếu có và đang bật). */
function applyMask(layer, img) {
    const m = layer.mask;
    if (!m || m.disabled || !m.imageData) return false;
    const md = m.imageData;
    const mx = m.left ?? 0, my = m.top ?? 0;
    const def = m.defaultColor ?? 255;
    const lx = layer.left ?? 0, ly = layer.top ?? 0;
    const d = img.data;
    for (let y = 0; y < img.height; y++) {
        for (let x = 0; x < img.width; x++) {
            const u = lx + x - mx, v = ly + y - my;
            const mv = (u >= 0 && v >= 0 && u < md.width && v < md.height) ? md.data[(v * md.width + u) * 4] : def;
            const i = (y * img.width + x) * 4 + 3;
            d[i] = (d[i] * mv / 255) | 0;
        }
    }
    return true;
}

/** Khung chứa pixel có alpha > 0, hoặc null nếu layer trống. */
function opaqueRect(img) {
    const { width: w, height: h, data: d } = img;
    let minX = w, minY = h, maxX = -1, maxY = -1;
    for (let y = 0; y < h; y++) {
        const row = y * w * 4;
        for (let x = 0; x < w; x++) {
            if (d[row + x * 4 + 3] === 0) continue;
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
        }
    }
    return maxX < 0 ? null : { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
}

function crop(img, r) {
    const png = new PNG({ width: r.w, height: r.h });
    const src = img.data, dst = png.data;
    for (let y = 0; y < r.h; y++) {
        const s = ((r.y + y) * img.width + r.x) * 4;
        dst.set(src.subarray(s, s + r.w * 4), y * r.w * 4);
    }
    return png;
}

/** Thumbnail vừa ô THUMB_SIZE. */
function thumb(png) {
    const k = Math.min(1, THUMB_SIZE / Math.max(png.width, png.height));
    return resize(png, Math.max(1, Math.round(png.width * k)), Math.max(1, Math.round(png.height * k)));
}

/** Thu nhỏ kiểu box-sample (lấy tối đa 4×4 mẫu mỗi ô, trộn theo alpha). */
function resize(png, w, h) {
    const out = new PNG({ width: w, height: h });
    const sx = png.width / w, sy = png.height / h;
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const x0 = Math.floor(x * sx), x1 = Math.max(x0 + 1, Math.floor((x + 1) * sx));
            const y0 = Math.floor(y * sy), y1 = Math.max(y0 + 1, Math.floor((y + 1) * sy));
            let r = 0, g = 0, b = 0, a = 0, n = 0;
            for (let v = y0; v < y1; v += Math.max(1, ((y1 - y0) / 4) | 0)) {
                for (let u = x0; u < x1; u += Math.max(1, ((x1 - x0) / 4) | 0)) {
                    const i = (v * png.width + u) * 4;
                    const al = png.data[i + 3];
                    r += png.data[i] * al; g += png.data[i + 1] * al; b += png.data[i + 2] * al; a += al; n++;
                }
            }
            const o = (y * w + x) * 4;
            if (a > 0) { out.data[o] = r / a; out.data[o + 1] = g / a; out.data[o + 2] = b / a; }
            out.data[o + 3] = a / n;
        }
    }
    return out;
}

/** Duyệt cây layer, trả danh sách layer lá theo thứ tự vẽ (dưới -> trên). */
function flatten(children, group, groupHidden, out) {
    for (const l of children || []) {
        if (l.children) {
            const g = group ? `${group}/${l.name}` : l.name;
            flatten(l.children, g, groupHidden || !!l.hidden, out);
        } else {
            out.push({ layer: l, group: group || '', groupHidden });
        }
    }
    return out;
}

function main() {
    const [psdPath, cacheDir] = process.argv.slice(2);
    if (!psdPath || !cacheDir) throw new Error('Thiếu tham số: psd-worker.js <psdPath> <cacheDir>');

    const stat = fs.statSync(psdPath);
    const manifestPath = path.join(cacheDir, 'manifest.json');
    if (fs.existsSync(manifestPath)) {
        try {
            const old = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
            if (old.version === MANIFEST_VERSION && old.psd.size === stat.size && old.psd.mtimeMs === stat.mtimeMs) {
                send({ type: 'done', manifest: old, cached: true });
                return;
            }
        } catch (e) { /* cache hỏng -> đọc lại */ }
    }

    send({ type: 'progress', done: 0, total: 1, text: 'Đang đọc PSD...' });
    const psd = ag.readPsd(fs.readFileSync(psdPath), {
        useImageData: true,
        skipCompositeImageData: true,
        skipThumbnail: true,
        skipLinkedFilesData: true,
    });

    fs.rmSync(cacheDir, { recursive: true, force: true });
    fs.mkdirSync(path.join(cacheDir, 'png'), { recursive: true });
    fs.mkdirSync(path.join(cacheDir, 'thumb'), { recursive: true });

    // Ảnh xem trước: mỗi layer 1 PNG nhỏ đặt đúng chỗ trên khung PW×PH, cộng hit-map
    // (Uint16, mỗi pixel = id+1 của layer trên cùng có hình ở đó) để panel click chọn layer.
    const P = Math.min(1, PREVIEW_SIZE / Math.max(psd.width, psd.height));
    const PW = Math.max(1, Math.round(psd.width * P)), PH = Math.max(1, Math.round(psd.height * P));
    const hit = new Uint16Array(PW * PH);
    fs.mkdirSync(path.join(cacheDir, 'prev'), { recursive: true });
    const writePreview = (png, left, top, key, id, hidden) => {
        const x0 = Math.round(left * P), y0 = Math.round(top * P);
        const w = Math.max(1, Math.round((left + png.width) * P) - x0);
        const h = Math.max(1, Math.round((top + png.height) * P) - y0);
        const small = resize(png, w, h);
        fs.writeFileSync(path.join(cacheDir, 'prev', `${key}.png`), PNG.sync.write(small, { filterType: 0 }));
        for (let y = 0; y < h; y++) {
            const gy = y0 + y;
            if (gy < 0 || gy >= PH) continue;
            for (let x = 0; x < w; x++) {
                const gx = x0 + x;
                if (gx < 0 || gx >= PW) continue;
                if (!hidden && small.data[(y * w + x) * 4 + 3] >= HIT_ALPHA) hit[gy * PW + gx] = id + 1;
            }
        }
        return { x: x0, y: y0, w, h };
    };

    const flat = flatten(psd.children, '', false, []);
    const usedKeys = new Set();
    const layers = [];

    flat.forEach(({ layer: l, group, groupHidden }, order) => {
        send({ type: 'progress', done: order, total: flat.length, text: l.name });
        const warnings = [];
        const base = {
            id: order,
            order,
            name: String(l.name || `Layer ${order}`),
            group,
            hidden: !!l.hidden || groupHidden,
            opacity: l.opacity ?? 1,
            blendMode: l.blendMode || 'normal',
        };
        if (base.blendMode !== 'normal' && base.blendMode !== 'pass through') {
            warnings.push(`blend mode "${base.blendMode}" sẽ thành Normal`);
        }
        if (l.clipping) warnings.push('clipping mask không được hỗ trợ — xuất nguyên layer');
        if (l.effects && !l.effects.disabled) warnings.push('layer style (effects) không xuất được');
        if (l.adjustment) warnings.push('adjustment layer — bỏ qua');

        const img = l.imageData;
        if (!img || !img.width || !img.height) {
            layers.push({ ...base, empty: true, warnings });
            return;
        }
        if (applyMask(l, img)) warnings.push('đã áp layer mask');

        const r = opaqueRect(img);
        if (!r) {
            layers.push({ ...base, empty: true, warnings });
            l.imageData = undefined;
            return;
        }

        let key = sanitizeKey(base.name);
        for (let i = 2; usedKeys.has(key.toLowerCase()); i++) key = `${sanitizeKey(base.name)}_${i}`;
        usedKeys.add(key.toLowerCase());

        const png = crop(img, r);
        fs.writeFileSync(path.join(cacheDir, 'png', `${key}.png`), PNG.sync.write(png, { filterType: 4, deflateLevel: 6 }));
        fs.writeFileSync(path.join(cacheDir, 'thumb', `${key}.png`), PNG.sync.write(thumb(png), { filterType: 0 }));
        l.imageData = undefined;   // nhả RAM sớm

        const left = (l.left ?? 0) + r.x, top = (l.top ?? 0) + r.y;
        const prev = writePreview(png, left, top, key, order, base.hidden);
        layers.push({ ...base, key, left, top, width: r.w, height: r.h, prev, warnings });
    });

    fs.writeFileSync(path.join(cacheDir, 'hitmap.bin'), Buffer.from(hit.buffer));

    const manifest = {
        version: MANIFEST_VERSION,
        preview: { width: PW, height: PH, scale: P },
        psd: {
            path: psdPath,
            name: path.basename(psdPath, path.extname(psdPath)),
            width: psd.width,
            height: psd.height,
            size: stat.size,
            mtimeMs: stat.mtimeMs,
        },
        cacheDir,
        layers,
    };
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 1));
    send({ type: 'done', manifest });
}

try {
    main();
} catch (e) {
    send({ type: 'error', message: e && e.stack ? e.stack : String(e) });
    process.exitCode = 1;
}
