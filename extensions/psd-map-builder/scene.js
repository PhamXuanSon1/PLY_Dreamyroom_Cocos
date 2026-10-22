'use strict';
/**
 * Chạy trong scene process (có `cc`). Dựng map bằng chính SceneBuilder của project rồi nối
 * kết quả vào ItemManager và các tool pipeline đang có trong scene.
 */

const cc = require('cc');

function cls(name) {
    return cc.js.getClassByName(name);
}

function walk(node, fn) {
    fn(node);
    for (const c of node.children) walk(c, fn);
}

function findByUuid(uuid) {
    const scene = cc.director.getScene();
    let hit = null;
    if (scene) walk(scene, (n) => { if (!hit && n.uuid === uuid) hit = n; });
    return hit;
}

function pathOf(node) {
    const parts = [];
    for (let n = node; n && !(n instanceof cc.Scene); n = n.parent) parts.unshift(n.name);
    return parts.join('/');
}

function compsInScene(name) {
    const C = cls(name);
    const scene = cc.director.getScene();
    return C && scene ? scene.getComponentsInChildren(C) : [];
}

/** Node cha xuất hiện nhiều nhất trong danh sách (folder chứa phần lớn node). */
function commonParent(nodes) {
    const count = new Map();
    for (const n of nodes) if (n && n.parent) count.set(n.parent, (count.get(n.parent) || 0) + 1);
    let best = null, max = 0;
    for (const [p, c] of count) if (c > max) { best = p; max = c; }
    return best;
}

function loadAsset(uuid) {
    return new Promise((resolve) => {
        if (!uuid) { resolve(null); return; }
        cc.assetManager.loadAny({ uuid }, (err, asset) => resolve(err ? null : asset));
    });
}

function snapshot() {
    try { Editor.Message.send('scene', 'snapshot'); } catch (e) { /* chỉ để Ctrl+Z được */ }
}

/**
 * Ứng viên làm gốc dựng map: node có SceneBuilder, cộng node phòng (BaseRoom) dù chưa có
 * SceneBuilder (buildLevel tự thêm) — phòng đứng đầu để không lỡ dựng nhầm vào node khác.
 */
function listRoots() {
    const SB = cls('SceneBuilder');
    const scene = cc.director.getScene();
    if (!SB || !scene) return { ok: false, roots: [], error: 'Không tìm thấy class SceneBuilder (script chưa compile?)' };
    const BaseRoom = cls('BaseRoom');
    const nodes = new Set(scene.getComponentsInChildren(SB).map((c) => c.node));
    if (BaseRoom) for (const c of scene.getComponentsInChildren(BaseRoom)) nodes.add(c.node);
    const roots = [...nodes].map((n) => {
        const sb = n.getComponent(SB);
        return {
            uuid: n.uuid,
            name: n.name,
            path: pathOf(n),
            childCount: n.children.length,
            isRoom: !!(BaseRoom && n.getComponent(BaseRoom)),
            hasBuilder: !!sb,
            spriteDir: sb ? sb.spriteDir : '',
            jsonUuid: sb && sb.sceneJson ? sb.sceneJson._uuid : '',
        };
    });
    roots.sort((a, b) => Number(b.isRoom) - Number(a.isRoom));
    return { ok: true, roots };
}

function nodeInfo(uuid) {
    const n = findByUuid(uuid);
    return n ? { uuid: n.uuid, name: n.name, path: pathOf(n), childCount: n.children.length } : null;
}

/**
 * args: { rootUuid, jsonUuid, data, spriteDir, items: [{ item, holder, name }], paths }
 */
async function buildLevel(args) {
    const log = [];
    const root = findByUuid(args.rootUuid);
    if (!root) return { ok: false, error: 'Không tìm thấy node gốc trong scene đang mở.' };

    const SB = cls('SceneBuilder');
    if (!SB) return { ok: false, error: 'Không tìm thấy class SceneBuilder (script chưa compile?)' };
    let sb = root.getComponent(SB);
    if (!sb) { sb = root.addComponent(SB); log.push(`Đã thêm SceneBuilder vào "${root.name}"`); }

    // Dựng từ dữ liệu vừa sinh (JsonAsset trong cache asset có thể còn bản cũ),
    // xong mới gán asset thật để sau này bấm "Build Now" tay vẫn ra đúng map.
    const temp = new cc.JsonAsset();
    temp.json = args.data;
    sb.sceneJson = temp;
    sb.spriteFolder = null;
    sb.spriteDir = args.spriteDir;
    sb.buildOnStart = false;
    await sb.build();

    const asset = await loadAsset(args.jsonUuid);
    sb.sceneJson = asset || null;
    if (!asset) log.push('⚠ Không load được JsonAsset — ô sceneJson của SceneBuilder để trống.');

    const map = sb.nodeMap;
    const levelRoot = map.get(args.paths.root) || null;
    const itemNodes = [], holderNodes = [], missing = [];
    for (const it of args.items) {
        const item = map.get(it.item), holder = map.get(it.holder);
        if (item) itemNodes.push(item); else missing.push(it.name);
        if (holder) holderNodes.push(holder);
    }
    if (missing.length) log.push(`⚠ Không thấy node item: ${missing.join(', ')}`);

    const itemsParent = map.get(args.paths.items) || commonParent(itemNodes);
    const holdersParent = commonParent(holderNodes);

    // BaseRoom bắt chạm (kéo phòng) theo contentSize của node -> phủ đúng cả map vừa dựng
    const BaseRoom = cls('BaseRoom');
    if (BaseRoom && root.getComponent(BaseRoom) && args.roomSize) {
        const ut = root.getComponent(cc.UITransform) || root.addComponent(cc.UITransform);
        ut.setContentSize(args.roomSize.width, args.roomSize.height);
        ut.setAnchorPoint(args.roomSize.anchorX ?? 0.5, args.roomSize.anchorY ?? 0.5);
        log.push(`Vùng kéo phòng (contentSize "${root.name}") = ${Math.round(args.roomSize.width)}×${Math.round(args.roomSize.height)}`);
    }
    const linked = [];

    // ---- ItemManager: danh sách item rớt ra từ hộp (UIManager.mauSo tự lấy theo độ dài list)
    for (const im of compsInScene('ItemManager')) {
        im.itemList = itemNodes.slice();
        if (im.storeTriggerItem && !im.storeTriggerItem.isValid) im.storeTriggerItem = null;
        linked.push(`ItemManager.itemList = ${itemNodes.length} item`);
    }

    // ---- các tool pipeline (nếu có trong scene)
    for (const t of compsInScene('AutoAssignByNameTool')) {
        const naming = args.naming || { prefix: 'Holder_', suffix: '' };
        t.itemParent = itemsParent;
        t.targetParent = levelRoot;
        t.prefix = naming.prefix;
        t.suffix = naming.suffix;
        t.recursive = true;
        linked.push(`AutoAssignByNameTool (Items ↔ ${naming.prefix}*${naming.suffix})`);
    }
    for (const t of compsInScene('SortItemsBySizeTool')) { t.parentNode = itemsParent; linked.push('SortItemsBySizeTool'); }
    for (const t of compsInScene('GridArrangeTool')) { t.parentNode = itemsParent; linked.push('GridArrangeTool'); }
    for (const t of compsInScene('GoToTargetTool')) { t.itemParent = itemsParent; linked.push('GoToTargetTool'); }
    for (const t of compsInScene('BringTargetsToTopTool')) {
        t.parentNode = holdersParent;
        t.itemSearchRoot = levelRoot;
        linked.push('BringTargetsToTopTool');
    }
    for (const t of compsInScene('LockImageNodesTool')) { t.searchRoot = levelRoot; linked.push('LockImageNodesTool'); }
    for (const t of compsInScene('CaptureNodeTool')) { t.targetNode = levelRoot; linked.push('CaptureNodeTool'); }

    snapshot();
    return {
        ok: true,
        log,
        linked,
        builtNodes: map.size,
        itemCount: itemNodes.length,
        root: pathOf(root),
        itemsParent: itemsParent ? pathOf(itemsParent) : '',
        holdersParent: holdersParent ? pathOf(holdersParent) : '',
    };
}

module.exports = {
    load() {},
    unload() {},
    methods: { listRoots, nodeInfo, buildLevel },
};
