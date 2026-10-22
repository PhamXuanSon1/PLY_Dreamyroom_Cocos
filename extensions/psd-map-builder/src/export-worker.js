'use strict';
/**
 * Tiến trình con: đọc "bản export Unity" (JSON schema SceneBuilder do Tools/Cocos Export xuất,
 * + thư mục sprites/) và sinh manifest CÙNG định dạng psd-worker để panel dùng lại nguyên:
 * preview từng layer, hit-map, alpha, thumbnail.
 *
 *   node export-worker.js <jsonPath> <cacheDir>
 *
 * Layer = mọi node có sprite, trừ BG (nền lặp, quá rộng) và item trong Items (đang nằm ở
 * hàng chờ, không phải chỗ trong phòng). Vị trí lấy từ sprite.bounds (AABB world, y hướng lên).
 * Thêm manifest.export: thông tin để main dựng lại JSON theo item người dùng chọn.
 */

const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');
const { PREVIEW_SIZE, HIT_ALPHA, thumb, resize, flip } = require('./img');

const MANIFEST_VERSION = 1;

function send(msg) {
    if (process.send) process.send(msg);
    else if (msg.type !== 'progress') console.log(JSON.stringify(msg).slice(0, 400));
}

const baseName = (p) => p.slice(p.lastIndexOf('/') + 1);

function main() {
    const [jsonPath, cacheDir] = process.argv.slice(2);
    const stat = fs.statSync(jsonPath);
    const dir = path.dirname(jsonPath);
    const spritesDir = path.join(dir, 'sprites');
    const manifestPath = path.join(cacheDir, 'manifest.json');
    if (fs.existsSync(manifestPath)) {
        try {
            const old = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
            if (old.version === MANIFEST_VERSION && old.psd.size === stat.size && old.psd.mtimeMs === stat.mtimeMs) {
                send({ type: 'done', manifest: old, cached: true });
                return;
            }
        } catch (e) { /* đọc lại */ }
    }

    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    const nodes = data.nodes || [];
    const root = (data.meta && data.meta.exportRoot) || (nodes[0] && nodes[0].path) || '';
    const byPath = new Map(nodes.map((n) => [n.path, n]));
    const isUnder = (p, folder) => p.startsWith(`${root}/${folder}/`);

    // node hiện thực sự = chính nó và mọi tổ tiên đều active
    const activeInTree = (n) => {
        for (let x = n; x; x = x.parentPath ? byPath.get(x.parentPath) : null) if (!x.active) return false;
        return true;
    };

    // item (Items/X) -> đích: node tên "XPlace" (ưu tiên trong Placeholder)
    const byName = new Map();
    for (const n of nodes) {
        const k = baseName(n.path);
        if (!byName.has(k)) byName.set(k, []);
        byName.get(k).push(n);
    }
    const items = nodes.filter((n) => n.parentPath === `${root}/Items`);
    const targetOf = (itemNode) => {
        const c = byName.get(`${baseName(itemNode.path)}Place`) || [];
        return c.find((n) => isUnder(n.path, 'Placeholder')) || c[0] || null;
    };

    // layer = node có sprite, trừ BG và Items; thứ tự vẽ = layerValue, sortingOrder, thứ tự trong JSON
    const sprites = nodes
        .map((n, i) => ({ n, i }))
        .filter(({ n }) => n.sprite && n.sprite.bounds && !isUnder(n.path, 'BG') && !isUnder(n.path, 'Items'));
    sprites.sort((a, b) => (a.n.sprite.layerValue || 0) - (b.n.sprite.layerValue || 0)
        || a.n.sprite.sortingOrder - b.n.sprite.sortingOrder || a.i - b.i);

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const { n } of sprites) {
        const [x0, y0, x1, y1] = n.sprite.bounds;
        minX = Math.min(minX, x0); minY = Math.min(minY, y0); maxX = Math.max(maxX, x1); maxY = Math.max(maxY, y1);
    }
    const W = Math.max(1, Math.ceil(maxX - minX)), H = Math.max(1, Math.ceil(maxY - minY));
    const P = Math.min(1, PREVIEW_SIZE / Math.max(W, H));
    const PW = Math.max(1, Math.round(W * P)), PH = Math.max(1, Math.round(H * P));

    fs.rmSync(cacheDir, { recursive: true, force: true });
    for (const d of ['png', 'thumb', 'prev']) fs.mkdirSync(path.join(cacheDir, d), { recursive: true });

    const hit = new Uint16Array(PW * PH);
    const alphaChunks = [];
    let alphaSize = 0;
    const decoded = new Map();
    const load = (key) => {
        if (!decoded.has(key)) {
            const f = path.join(spritesDir, `${key}.png`);
            decoded.set(key, fs.existsSync(f) ? PNG.sync.read(fs.readFileSync(f)) : null);
        }
        return decoded.get(key);
    };
    const thumbDone = new Set();
    const layers = [];
    const idOfPath = new Map();

    sprites.forEach(({ n }, order) => {
        send({ type: 'progress', done: order, total: sprites.length, text: baseName(n.path) });
        const s = n.sprite;
        const [x0, y0, x1, y1] = s.bounds;
        const base = {
            id: order,
            order,
            name: baseName(n.path),
            path: n.path,
            group: n.parentPath ? n.parentPath.slice(root.length + 1) : '',
            hidden: !activeInTree(n),
            opacity: s.color ? s.color[3] : 1,
            warnings: [],
        };
        idOfPath.set(n.path, order);
        const png = load(s.key);
        if (!png) {
            base.warnings.push(`thiếu ảnh sprites/${s.key}.png`);
            layers.push({ ...base, empty: true });
            return;
        }
        // toạ độ "canvas" như PSD: gốc trái-trên, y hướng xuống, 1 đơn vị world = 1px
        const left = x0 - minX, top = maxY - y1, width = x1 - x0, height = y1 - y0;
        if (!thumbDone.has(s.key)) {
            fs.writeFileSync(path.join(cacheDir, 'thumb', `${s.key}.png`), PNG.sync.write(thumb(png), { filterType: 0 }));
            thumbDone.add(s.key);
        }
        const px = Math.round(left * P), py = Math.round(top * P);
        const pw = Math.max(1, Math.round((left + width) * P) - px), ph = Math.max(1, Math.round((top + height) * P) - py);
        const small = flip(resize(png, pw, ph), s.flipX, s.flipY);
        const prevKey = `${order}_${s.key}`;
        fs.writeFileSync(path.join(cacheDir, 'prev', `${prevKey}.png`), PNG.sync.write(small, { filterType: 0 }));
        const alpha = Buffer.alloc(pw * ph);
        for (let i = 0; i < pw * ph; i++) alpha[i] = small.data[i * 4 + 3];
        const a = alphaSize;
        alphaChunks.push(alpha);
        alphaSize += alpha.length;
        if (!base.hidden) {
            for (let y = 0; y < ph; y++) {
                const gy = py + y;
                if (gy < 0 || gy >= PH) continue;
                for (let x = 0; x < pw; x++) {
                    const gx = px + x;
                    if (gx >= 0 && gx < PW && alpha[y * pw + x] >= HIT_ALPHA) hit[gy * PW + gx] = order + 1;
                }
            }
        }
        layers.push({
            ...base,
            key: s.key,
            prevKey,
            left: Math.round(left), top: Math.round(top), width: Math.round(width), height: Math.round(height),
            prev: { x: px, y: py, w: pw, h: ph, a },
        });
    });

    fs.writeFileSync(path.join(cacheDir, 'hitmap.bin'), Buffer.from(hit.buffer));
    fs.writeFileSync(path.join(cacheDir, 'alpha.bin'), Buffer.concat(alphaChunks, alphaSize));

    // layer con (bóng / cut trong đích) -> layer tổ tiên gần nhất có sprite
    const links = [];
    for (const l of layers) {
        for (let p = byPath.get(l.path).parentPath; p; p = byPath.get(p) ? byPath.get(p).parentPath : null) {
            if (idOfPath.has(p)) { links.push([l.id, idOfPath.get(p)]); break; }
        }
    }
    // item Unity -> layer đích của nó, theo thứ tự trong Items (= thứ tự rớt)
    const planItems = [];
    const lost = [];
    for (const it of items) {
        const t = targetOf(it);
        if (t && idOfPath.has(t.path)) planItems.push(idOfPath.get(t.path));
        else lost.push(baseName(it.path));
    }
    const warnings = [];
    if (lost.length) warnings.push(`Item không tìm thấy đích "<tên>Place": ${lost.join(', ')}`);

    const manifest = {
        version: MANIFEST_VERSION,
        mode: 'export',
        preview: { width: PW, height: PH, scale: P, hitAlpha: HIT_ALPHA },
        psd: {
            path: jsonPath,
            name: (data.meta && data.meta.scene) || path.basename(jsonPath, '.json'),
            width: W,
            height: H,
            size: stat.size,
            mtimeMs: stat.mtimeMs,
        },
        cacheDir,
        layers,
        export: { json: jsonPath, spritesDir, root, origin: [minX, maxY] },
        plan: {
            mode: 'export',
            folder: dir,
            level: (data.meta && data.meta.scene) || '',
            items: planItems,
            links,
            chains: [],
            textures: {},
            warnings,
            stats: { planItems: items.length, textures: 0 },
        },
    };
    fs.writeFileSync(manifestPath, JSON.stringify(manifest));
    send({ type: 'done', manifest });
}

try {
    main();
} catch (e) {
    send({ type: 'error', message: e && e.stack ? e.stack : String(e) });
    process.exitCode = 1;
}
