'use strict';
/**
 * Quy ước tên layer trong PSD (dùng chung cho main, worker và panel).
 *
 * Layer phụ đi kèm 1 layer chính, nhận ra theo tên:
 *   <tên>_sd / _ad / _shadow   -> bóng đổ      (shadow)
 *   <tên>_fx / _glow           -> hiệu ứng sáng (fx)
 *   <tên>_cut / _top, front_<tên> -> mảng che phía trước (front)
 * Layer phụ chỉ được gắn khi có layer chính trùng <tên> (không phân biệt hoa/thường).
 */

const SUFFIX_RE = /^(.+?)[ _-](sd|ad|shadow|fx|glow|cut|top)$/i;
const PREFIX_RE = /^front[ _-](.+)$/i;

const ROLE_OF_TAG = {
    sd: 'shadow', ad: 'shadow', shadow: 'shadow',
    fx: 'fx', glow: 'fx',
    cut: 'front', top: 'front',
};

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

/**
 * Gắn layer phụ vào layer chính. Trả về Map id layer phụ -> { ownerId, role }.
 * Layer chính được ưu tiên tìm trong cùng group, sau đó toàn PSD.
 */
function linkAttachments(layers) {
    const byName = new Map();
    for (const l of layers) {
        const k = l.name.trim().toLowerCase();
        if (!byName.has(k)) byName.set(k, []);
        byName.get(k).push(l);
    }
    const out = new Map();
    for (const l of layers) {
        const a = parseAttachment(l.name);
        if (!a) continue;
        const owners = (byName.get(a.base.toLowerCase()) || []).filter((o) => o !== l && !parseAttachment(o.name));
        if (owners.length === 0) continue;
        const owner = owners.find((o) => o.group === l.group) || owners[0];
        out.set(l.id, { ownerId: owner.id, role: a.role });
    }
    return out;
}

module.exports = { sanitizeKey, parseAttachment, linkAttachments };
