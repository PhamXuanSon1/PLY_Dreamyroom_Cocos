'use strict';
/**
 * manifest (từ psd-worker) + lựa chọn item -> JSON đúng schema SceneBuilder.ts đọc.
 *
 * Cây dựng ra (toạ độ 1px PSD = 1 đơn vị, gốc ở tâm canvas PSD):
 *
 *   <Level>                    scale = options.scale
 *     Base/<layer>             layer trang trí (không phải item), giữ nguyên thứ tự PSD
 *     Holders/Holder_<item>    ĐÍCH của item, nằm trong phòng đúng thứ tự PSD
 *       ├─ <item>_fx / _top / _cut / front_<item>   (hiện khi ghép xong)
 *     Items/<item>             item kéo thả: ItemController.targetPoint -> Holder_<item>
 *       └─ <item>_sd           bóng đổ (ItemController tự dò theo tên "_sd")
 *
 * Item dùng layerValue 1 nên luôn vẽ trên phòng và không xen thứ tự với Holders
 * -> SceneBuilder không phải hoà tan / tách folder Items.
 */

const { linkAttachments } = require('./naming');

const K = 100;
const PPU = 100;
const ITEM_LAYER = 1;
const SHADOW_RE = /(_sd(\b|_)|shadow)/i;

function buildSceneJson(manifest, selection, options) {
    const W = manifest.psd.width, H = manifest.psd.height;
    const L = options.levelName;
    const skipHidden = options.skipHidden !== false;
    const attach = options.attachToItems !== false;

    const usable = manifest.layers.filter((l) => !l.empty && !(skipHidden && l.hidden));
    const byId = new Map(usable.map((l) => [l.id, l]));
    const links = linkAttachments(usable, { auto: attach, overrides: selection.links });

    // item hợp lệ: tồn tại, không phải layer phụ của layer khác
    const itemIds = (selection.items || []).filter((id) => byId.has(id) && !links.has(id));
    const itemSet = new Set(itemIds);

    const nodes = [];
    const namesUnder = new Map();
    const uniq = (parentPath, name) => {
        if (!namesUnder.has(parentPath)) namesUnder.set(parentPath, new Set());
        const used = namesUnder.get(parentPath);
        let n = name;
        for (let i = 2; used.has(n); i++) n = `${name} (${i})`;
        used.add(n);
        return n;
    };

    const center = (l) => [l.left + l.width / 2 - W / 2, H / 2 - (l.top + l.height / 2)];
    const bounds = (l) => {
        const [cx, cy] = center(l);
        return [cx - l.width / 2, cy - l.height / 2, cx + l.width / 2, cy + l.height / 2];
    };
    const sprite = (l, sortingOrder, layerValue) => ({
        key: l.key,
        guid: '',
        ppu: PPU,
        nativeSize: [l.width, l.height],
        pivot: [0.5, 0.5],
        color: [1, 1, 1, Math.round((l.opacity ?? 1) * 1000) / 1000],
        sortingOrder,
        layerValue,
        bounds: bounds(l),
        flipX: false,
        flipY: false,
    });
    const folder = (name) => {
        const p = `${L}/${name}`;
        uniq(L, name);
        nodes.push({ path: p, parentPath: L, active: true, pos: [0, 0, 0], rot: [0, 0, 0], scale: [1, 1, 1] });
        return p;
    };
    const add = (parentPath, name, l, pos, extra) => {
        const p = `${parentPath}/${uniq(parentPath, name)}`;
        nodes.push({
            path: p, parentPath, active: !l.hidden,
            pos: [pos[0], pos[1], 0], rot: [0, 0, 0], scale: [1, 1, 1],
            ...extra,
        });
        return p;
    };
    const rel = (l, owner) => {
        const [a, b] = center(l), [c, d] = center(owner);
        return [a - c, b - d];
    };

    const s = options.scale || 1;
    nodes.push({ path: L, parentPath: null, active: true, pos: [0, 0, 0], rot: [0, 0, 0], scale: [s, s, s] });
    const basePath = folder('Base');
    const holdersPath = folder('Holders');
    const itemsPath = folder('Items');

    const childrenOf = new Map();       // ownerId -> [{ layer, role }]
    for (const [id, link] of links) {
        if (!childrenOf.has(link.ownerId)) childrenOf.set(link.ownerId, []);
        childrenOf.get(link.ownerId).push({ layer: byId.get(id), role: link.role });
    }

    // Base: mọi layer không thuộc item (kể cả layer phụ của layer không phải item)
    for (const l of usable) {
        const link = links.get(l.id);
        if (itemSet.has(l.id) || (link && itemSet.has(link.ownerId))) continue;
        add(basePath, l.name, l, center(l), { sprite: sprite(l, l.order, 0) });
    }

    // Items + Holders, theo thứ tự itemIds (= ItemManager.itemList)
    const items = [];
    itemIds.forEach((id, index) => {
        const l = byId.get(id);
        const holder = add(holdersPath, `Holder_${l.name}`, l, center(l), { sprite: sprite(l, l.order, 0) });
        const item = add(itemsPath, l.name, l, center(l), {
            active: true,
            sprite: sprite(l, index * 10 + 5, ITEM_LAYER),
            components: [{ type: 'ItemController', fields: { targetPoint: `@node:${holder}` } }],
        });
        for (const { layer: c, role } of childrenOf.get(id) || []) {
            if (role === 'shadow') {
                const name = SHADOW_RE.test(c.name) ? c.name : `${l.name}_sd`;
                add(item, name, c, rel(c, l), { active: true, sprite: sprite(c, index * 10 + 4, ITEM_LAYER) });
            } else {
                add(holder, c.name, c, rel(c, l), { active: true, sprite: sprite(c, c.order, 0) });
            }
        }
        items.push({ layerId: id, name: l.name, item, holder });
    });

    const json = {
        meta: {
            K,
            scene: manifest.psd.name,
            exportRoot: L,
            source: 'psd-map-builder',
            psd: manifest.psd.path,
            distancesInPx: true,
            exportInactive: true,
            exportedAt: new Date().toISOString(),
        },
        assetMap: {},
        nodes,
        conflicts: [],
    };
    const usedKeys = [...new Set(nodes.filter((n) => n.sprite).map((n) => n.sprite.key))];
    return { json, items, paths: { root: L, base: basePath, holders: holdersPath, items: itemsPath }, usedKeys };
}

module.exports = { buildSceneJson };
