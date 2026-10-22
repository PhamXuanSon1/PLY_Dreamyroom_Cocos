'use strict';
/**
 * Bản export Unity (JSON SceneBuilder, cách xếp map giữ nguyên) + item người dùng chọn -> JSON để dựng.
 *
 * Bản export không mang component gameplay (project Unity gốc dùng HItem/HSlot), nên ở đây:
 *   - đích đã chọn có item sẵn trong <root>/Items  -> item đó + ItemController.targetPoint = đích
 *   - đích đã chọn chưa có item                     -> tạo item mới trong Items (cùng sprite với đích)
 *   - item Unity có đích KHÔNG được chọn            -> bỏ item, đích ở lại làm đồ trang trí tĩnh
 * Mọi node khác (BG, Base, Placeholder, bóng/cut con của đích) giữ nguyên vị trí, sortingOrder.
 */

const ITEM_ORDER_BASE = 100000;   // sortingOrder item mới: luôn trên phòng (item nằm ở hàng chờ)

const baseName = (p) => p.slice(p.lastIndexOf('/') + 1);

/**
 * manifest: từ export-worker; src: JSON export gốc; selection.items: [layerId đích] theo thứ tự rớt.
 * Trả về { json, items: [{ layerId, name, item, holder }], usedKeys, paths, seats }
 */
function buildExportJson(manifest, src, selection) {
    const root = manifest.export.root;
    const itemsPath = `${root}/Items`;
    const byId = new Map(manifest.layers.map((l) => [l.id, l]));
    const nodes = src.nodes.map((n) => JSON.parse(JSON.stringify(n)));
    const byPath = new Map(nodes.map((n) => [n.path, n]));

    const targetPaths = (selection.items || []).map((id) => byId.get(id)).filter((l) => l && !l.empty).map((l) => l.path);
    const selected = new Set(targetPaths);

    // item Unity -> đích "<tên>Place" (ưu tiên trong Placeholder)
    const byName = new Map();
    for (const n of nodes) {
        const k = baseName(n.path);
        if (!byName.has(k)) byName.set(k, []);
        byName.get(k).push(n);
    }
    const itemOfTarget = new Map();
    const dropRoots = [];
    for (const it of nodes.filter((n) => n.parentPath === itemsPath)) {
        const c = byName.get(`${baseName(it.path)}Place`) || [];
        const t = c.find((n) => n.path.startsWith(`${root}/Placeholder/`)) || c[0];
        if (t && selected.has(t.path) && !itemOfTarget.has(t.path)) itemOfTarget.set(t.path, it);
        else dropRoots.push(it.path);
    }
    const dropped = (p) => dropRoots.some((r) => p === r || p.startsWith(`${r}/`));
    const out = nodes.filter((n) => !dropped(n.path));

    if (!byPath.has(itemsPath)) {
        out.push({ path: itemsPath, parentPath: root, active: true, pos: [0, 0, 0], rot: [0, 0, 0], scale: [1, 1, 1] });
    }
    const used = new Set(out.filter((n) => n.parentPath === itemsPath).map((n) => baseName(n.path)));

    const items = [];
    targetPaths.forEach((tp, index) => {
        const target = byPath.get(tp);
        target.active = true;   // đích phải còn trong cây; ItemManager tự ẩn lúc vào game
        let item = itemOfTarget.get(tp);
        if (!item) {
            const raw = baseName(tp).replace(/Place$/, '') || baseName(tp);
            let name = raw;
            for (let i = 2; used.has(name); i++) name = `${raw} (${i})`;
            used.add(name);
            item = {
                path: `${itemsPath}/${name}`,
                parentPath: itemsPath,
                active: true,
                pos: target.pos.slice(),
                rot: target.rot.slice(),
                scale: target.scale.slice(),
                sprite: { ...JSON.parse(JSON.stringify(target.sprite)), sortingOrder: ITEM_ORDER_BASE + index },
            };
            out.push(item);
        }
        item.active = true;
        item.components = (item.components || []).filter((c) => c.type !== 'ItemController');
        item.components.push({ type: 'ItemController', fields: { targetPoint: `@node:${tp}` } });
        const l = byId.get((selection.items || [])[index]);
        items.push({ layerId: l ? l.id : -1, name: baseName(item.path), item: item.path, holder: tp });
    });

    const json = {
        ...src,
        meta: { ...(src.meta || {}), source: 'psd-map-builder (unity export)', exportedAt: new Date().toISOString() },
        nodes: out,
        conflicts: [],
    };
    const usedKeys = [...new Set(out.filter((n) => n.sprite).map((n) => n.sprite.key))];
    return { json, items, usedKeys, seats: 0, paths: { root, items: itemsPath } };
}

module.exports = { buildExportJson };
