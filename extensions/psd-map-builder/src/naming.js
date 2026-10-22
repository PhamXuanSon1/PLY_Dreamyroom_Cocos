'use strict';
/**
 * Quy ước tên layer trong PSD (dùng chung cho main, worker và panel).
 *
 * Layer phụ đi kèm 1 layer chính, nhận ra theo tên:
 *   <tên>_sd / _ad / _shadow   -> bóng đổ      (shadow)
 *   <tên>_fx / _glow           -> hiệu ứng sáng (fx)
 *   <tên>_cut / _top, front_<tên> -> mảng che phía trước (front)
 *
 * Tìm layer chính cho layer phụ, theo thứ tự:
 *   1. Tên trùng đúng <tên> (không phân biệt hoa/thường), ưu tiên cùng group.
 *   2. Tên có cùng tiền tố (vd "tu_cut" -> "tu_sach_to", "nen3cay1_fx" -> "nen3cay")
 *      VÀ hình chồng lên nhau đủ nhiều; nhiều ứng viên thì lấy cái chồng nhiều nhất.
 *   3. Người dùng gắn / gỡ tay trong panel (overrides) — luôn thắng 2 bước trên.
 */

const SUFFIX_RE = /^(.+?)[ _-](sd|ad|shadow|fx|glow|cut|top)$/i;
const PREFIX_RE = /^front[ _-](.+)$/i;

const ROLE_OF_TAG = {
    sd: 'shadow', ad: 'shadow', shadow: 'shadow',
    fx: 'fx', glow: 'fx',
    cut: 'front', top: 'front',
};

/** Tỉ lệ diện tích layer phụ phải nằm trong layer chính để gắn theo tiền tố (bước 2). */
const MIN_PREFIX_OVERLAP = 0.3;

/** Tên file / key sprite an toàn: chỉ [A-Za-z0-9_-], SceneBuilder tra key không phân biệt hoa/thường. */
function sanitizeKey(name) {
    const s = String(name)
        .normalize('NFD').replace(/[̀-ͯ]/g, '')
        .replace(/đ/g, 'd').replace(/Đ/g, 'D')
        .replace(/[^A-Za-z0-9_-]+/g, '_')
        .replace(/^_+|_+$/g, '');
    return s || 'layer';
}

/** { base, role } nếu tên là layer phụ, ngược lại null. */
function parseAttachment(name) {
    const n = String(name).trim();
    let m = SUFFIX_RE.exec(n);
    if (m) return { base: m[1].trim(), role: ROLE_OF_TAG[m[2].toLowerCase()] };
    m = PREFIX_RE.exec(n);
    if (m) return { base: m[1].trim(), role: 'front' };
    return null;
}

/** Vai trò khi gắn tay: theo hậu tố nếu có, không thì coi là mảng che (hiện khi ghép xong). */
function roleOf(name) {
    const a = parseAttachment(name);
    return a ? a.role : 'front';
}

/** Phần diện tích của `a` nằm trong `b` (0..1), theo khung layer trong PSD. */
function overlapRatio(a, b) {
    const w = Math.min(a.left + a.width, b.left + b.width) - Math.max(a.left, b.left);
    const h = Math.min(a.top + a.height, b.top + b.height) - Math.max(a.top, b.top);
    if (w <= 0 || h <= 0) return 0;
    return (w * h) / Math.max(1, a.width * a.height);
}

/** "tu" ~ "tu_sach_to", "nen3cay1" ~ "nen3cay": tên này là tiền tố của tên kia. */
function prefixRelated(a, b) {
    const x = a.toLowerCase(), y = b.toLowerCase();
    return x !== y && (x.startsWith(y) || y.startsWith(x));
}

/**
 * Gắn layer phụ vào layer chính. Trả về Map id layer phụ -> { ownerId, role, how }.
 *   how: 'name' (trùng tên) | 'prefix' (tiền tố + chồng hình) | 'manual' (gắn tay)
 *
 * options.auto      = false: bỏ bước 1-2 (chỉ dùng gắn tay)
 * options.overrides = [[childId, ownerId]] — ownerId < 0 nghĩa là gỡ ra thành layer độc lập.
 */
function linkAttachments(layers, options = {}) {
    const auto = options.auto !== false;
    const byId = new Map(layers.map((l) => [l.id, l]));
    const out = new Map();

    if (auto) {
        const byName = new Map();
        for (const l of layers) {
            const k = l.name.trim().toLowerCase();
            if (!byName.has(k)) byName.set(k, []);
            byName.get(k).push(l);
        }
        const mains = layers.filter((l) => !parseAttachment(l.name));
        for (const l of layers) {
            const a = parseAttachment(l.name);
            if (!a) continue;
            const exact = (byName.get(a.base.toLowerCase()) || []).filter((o) => o !== l && !parseAttachment(o.name));
            if (exact.length) {
                const owner = exact.find((o) => o.group === l.group) || exact[0];
                out.set(l.id, { ownerId: owner.id, role: a.role, how: 'name' });
                continue;
            }
            let best = null, bestOverlap = MIN_PREFIX_OVERLAP;
            for (const o of mains) {
                if (o === l || !prefixRelated(o.name.trim(), a.base)) continue;
                const r = overlapRatio(l, o);
                if (r >= bestOverlap) { best = o; bestOverlap = r; }
            }
            if (best) out.set(l.id, { ownerId: best.id, role: a.role, how: 'prefix' });
        }
    }

    for (const [childId, ownerId] of options.overrides || []) {
        if (!byId.has(childId)) continue;
        if (ownerId === null || ownerId === undefined || ownerId < 0) { out.delete(childId); continue; }
        if (!byId.has(ownerId) || ownerId === childId) continue;
        out.set(childId, { ownerId, role: roleOf(byId.get(childId).name), how: 'manual' });
    }

    // Layer chính của 1 layer phụ lại là layer phụ của layer khác -> trỏ thẳng về gốc; vòng lặp thì gỡ.
    for (const [childId, link] of [...out]) {
        let owner = link.ownerId;
        const seen = new Set([childId]);
        while (out.has(owner) && !seen.has(owner)) { seen.add(owner); owner = out.get(owner).ownerId; }
        if (seen.has(owner)) out.delete(childId);
        else link.ownerId = owner;
    }
    return out;
}

module.exports = { sanitizeKey, parseAttachment, linkAttachments, roleOf };
