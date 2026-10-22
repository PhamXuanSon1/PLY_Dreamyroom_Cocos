'use strict';
/**
 * Đọc "folder level" do pipeline PSD -> Unity xuất ra, vd:
 *
 *   Level2007/
 *     Level_2007.psd            PSD gốc (vẫn quét để có preview + vị trí chuẩn)
 *     manifest.json             layer đã chuẩn hoá tên: name/raw_name, bbox, kind, shadow_of
 *     build-plan-unity.json     decor / items (shadowName, cuts, extraShadows, chain) / waves
 *     Asset_Level2007/Textures, BaseTextures   PNG đã cắt + thu nhỏ, tên = manifest name
 *
 * Kết quả là "plan" quy về id layer trong manifest của psd-worker, để panel chọn sẵn item,
 * gắn sẵn bóng / mảng che, xếp thứ tự rớt theo waves, và main dùng ảnh thu nhỏ của folder.
 */

const fs = require('fs');
const path = require('path');
const { sanitizeKey } = require('./naming');

function readJson(p) {
    try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch (e) { return null; }
}

/** Tìm các file của folder level. Trả null nếu không có PSD. */
function detectFolder(dir) {
    let entries = [];
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch (e) { return null; }
    const files = entries.filter((e) => e.isFile()).map((e) => e.name);
    const psd = files.find((f) => /\.(psd|psb)$/i.test(f));
    if (!psd) return null;
    const textureDirs = [];
    for (const e of entries) {
        if (!e.isDirectory()) continue;
        for (const sub of ['Textures', 'BaseTextures']) {
            const p = path.join(dir, e.name, sub);
            if (fs.existsSync(p)) textureDirs.push(p);
        }
    }
    for (const sub of ['Textures', 'BaseTextures']) {
        const p = path.join(dir, sub);
        if (fs.existsSync(p)) textureDirs.push(p);
    }
    const plan = files.find((f) => /^build-plan.*\.json$/i.test(f));
    return {
        dir,
        psdPath: path.join(dir, psd),
        manifestPath: files.includes('manifest.json') ? path.join(dir, 'manifest.json') : '',
        planPath: plan ? path.join(dir, plan) : '',
        textureDirs,
        level: (/(\d+)/.exec(path.basename(dir)) || [])[1] || '',
    };
}

/** Kích thước PNG từ header IHDR (không cần decode). */
function pngSize(p) {
    try {
        const fd = fs.openSync(p, 'r');
        const b = Buffer.alloc(24);
        fs.readSync(fd, b, 0, 24, 0);
        fs.closeSync(fd);
        return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
    } catch (e) { return null; }
}

/**
 * info: kết quả detectFolder, psdManifest: manifest của psd-worker.
 * Trả về {
 *   items: [layerId] theo thứ tự waves,
 *   links: [[childId, ownerId]]  bóng / cut / extraShadows,
 *   chains: [[itemId, requiredItemId]]  item chỉ ghép được sau item kia,
 *   textures: { [layerId]: { file, left, top, width, height } }  ảnh folder + bbox PSD,
 *   warnings: [string], stats
 * }
 */
function buildPlan(info, psdManifest) {
    const warnings = [];
    const manifest = info.manifestPath ? readJson(info.manifestPath) : null;
    const plan = info.planPath ? readJson(info.planPath) : null;
    if (!manifest) warnings.push('Không đọc được manifest.json — không gắn được tên chuẩn hoá / ảnh folder.');
    if (!plan) warnings.push('Không có build-plan*.json — không có danh sách item / waves gợi ý.');

    const layers = psdManifest.layers.filter((l) => !l.empty);
    const mLayers = (manifest && manifest.layers) || [];
    const mByName = new Map(mLayers.map((l) => [l.name, l]));

    // tên chuẩn hoá (manifest) -> id layer PSD: khớp raw_name rồi tên đã sanitize; trùng thì lấy layer gần bbox nhất
    const idCache = new Map();
    const resolve = (name) => {
        if (!name) return -1;
        if (idCache.has(name)) return idCache.get(name);
        const ml = mByName.get(name);
        const raw = ml ? ml.raw_name : name;
        let cands = layers.filter((l) => l.name === raw);
        if (!cands.length) cands = layers.filter((l) => l.name.trim() === String(raw).trim());
        if (!cands.length) {
            const k = sanitizeKey(name).toLowerCase();
            cands = layers.filter((l) => sanitizeKey(l.name).toLowerCase() === k);
        }
        let id = -1;
        if (cands.length === 1) id = cands[0].id;
        else if (cands.length > 1) {
            const bb = ml && ml.bbox;
            const dist = (l) => (bb ? Math.abs(l.left - bb[0]) + Math.abs(l.top - bb[1]) : Math.abs(l.order - (ml ? ml.i : 0)));
            id = cands.sort((a, b) => dist(a) - dist(b))[0].id;
        }
        idCache.set(name, id);
        return id;
    };

    const missing = new Set();
    const need = (name) => {
        const id = resolve(name);
        if (id < 0 && name) missing.add(name);
        return id;
    };

    // ---- items theo waves (waves thiếu item nào thì nối theo thứ tự items)
    const items = [];
    const seen = new Set();
    const pushItem = (name) => {
        const id = need(name);
        if (id >= 0 && !seen.has(id)) { seen.add(id); items.push(id); }
    };
    if (plan) {
        for (const w of plan.waves || []) for (const n of w.items || []) pushItem(n);
        for (const it of plan.items || []) pushItem(it.name);
    }

    // ---- gắn layer phụ: shadowName, cuts, extraShadows (+ shadow_of trong manifest)
    const links = [];
    const linked = new Set();
    const link = (childName, ownerName) => {
        const c = need(childName), o = need(ownerName);
        if (c < 0 || o < 0 || c === o || linked.has(c)) return;
        linked.add(c);
        links.push([c, o]);
    };
    for (const it of (plan && plan.items) || []) {
        if (it.shadowName) link(it.shadowName, it.name);
        for (const c of it.cuts || []) link(c.name, it.name);
        for (const s of it.extraShadows || []) link(s.name, it.name);
    }
    for (const ml of mLayers) if (ml.shadow_of) link(ml.name, ml.shadow_of);

    // ---- chain: item nằm trong / trên item khác -> chỉ ghép sau item đó (SeatHandler.requiredItems)
    const chains = [];
    for (const it of (plan && plan.items) || []) {
        if (!it.chain) continue;
        const a = need(it.name), b = need(it.chain);
        if (a >= 0 && b >= 0 && a !== b) chains.push([a, b]);
    }

    // ---- ảnh thu nhỏ của folder: tên file = manifest name, vị trí = bbox PSD trong manifest
    const textures = {};
    const extraTextures = [];
    for (const dir of info.textureDirs) {
        for (const f of fs.readdirSync(dir)) {
            if (!/\.png$/i.test(f)) continue;
            const name = f.slice(0, -4);
            const ml = mByName.get(name);
            const id = ml ? resolve(name) : -1;
            if (!ml || id < 0) { extraTextures.push(name); continue; }
            const [l, t, r, b] = ml.bbox;
            const size = pngSize(path.join(dir, f));
            textures[id] = { file: path.join(dir, f), left: l, top: t, width: r - l, height: b - t, texW: size && size.w, texH: size && size.h };
        }
    }
    if (missing.size) warnings.push(`Tên trong plan không khớp layer PSD nào: ${[...missing].slice(0, 12).join(', ')}${missing.size > 12 ? '…' : ''}`);
    if (extraTextures.length) warnings.push(`Ảnh trong folder không có trong manifest (bỏ qua, dùng ảnh PSD nếu có layer): ${extraTextures.join(', ')}`);

    return {
        folder: info.dir,
        level: (plan && plan.level) || info.level,
        items,
        links,
        chains,
        textures,
        warnings,
        stats: { planItems: ((plan && plan.items) || []).length, textures: Object.keys(textures).length },
    };
}

module.exports = { detectFolder, buildPlan };
