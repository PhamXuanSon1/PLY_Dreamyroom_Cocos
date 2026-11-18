'use strict';
/**
 * Editor entry point: đọc cây node con của 1 node cha (tên, active, contentSize,
 * thumbnail sprite, SeatHandler.requiredItems) và ghi lại thứ tự siblingIndex qua message
 * `scene` `move-array-element` (có undo, tự đánh dấu scene dirty) + ghi SeatHandler.
 */

const PKG = 'item-order-editor';

function log(message) {
    console.log('[' + PKG + '] ' + message);
}

// ---------------------------------------------------------------- node dump helpers

function dumpValue(v) {
    return v && typeof v === 'object' && 'value' in v ? v.value : v;
}

function findComp(dump, type) {
    const comps = (dump && dump.__comps__) || [];
    return comps.find((c) => c && (c.type === type || c.__type__ === type)) || null;
}

function compProp(comp, key) {
    if (!comp) {
        return undefined;
    }
    const value = comp.value && typeof comp.value === 'object' ? comp.value : comp;
    return dumpValue(value[key]);
}

/** Node là item (spawn ra từ hộp) khi có component ItemController. */
const ITEM_COMPONENT = 'ItemController';

function isItem(dump) {
    return !!findComp(dump, ITEM_COMPONENT);
}

/** Item bắt buộc phải ghép trước: SeatHandler.requiredItems (uuid). */
const SEAT_COMPONENT = 'SeatHandler';

function seatRequires(dump) {
    const seat = findComp(dump, SEAT_COMPONENT);
    const list = compProp(seat, 'requiredItems');
    if (!Array.isArray(list)) {
        return [];
    }
    return list.map((e) => { const v = dumpValue(e); return (v && v.uuid) || ''; }).filter(Boolean);
}

/**
 * Đồ nhỏ nảy ra lần lượt sau khi ghép đồ đựng (MistakeHintMode.revealSmallItems): con trực tiếp của
 * đích đồ đựng, tên kết thúc bằng "Place" hoặc bắt đầu bằng "Holder_". Thứ tự nảy = thứ tự Hierarchy.
 */
const POP_RE = /(Place$|^Holder_)/;

function targetOf(dump) {
    const t = compProp(findComp(dump, ITEM_COMPONENT), 'targetPoint');
    return (t && t.uuid) || '';
}

async function nodeName(uuid) {
    const dump = uuid ? await queryNode(uuid) : null;
    return dump ? String(dumpValue(dump.name) || '') : '';
}

/** Con nảy ra lần lượt của node đích (theo thứ tự Hierarchy). */
async function popsOf(targetUuid) {
    const tree = targetUuid ? await queryTree(targetUuid) : null;
    return ((tree && tree.children) || [])
        .filter((c) => POP_RE.test(c.name))
        .map((c) => ({ uuid: c.uuid, name: c.name }));
}

/**
 * Sắp lại các con có trong `ordered` của parentUuid theo thứ tự đó; con khác giữ nguyên slot.
 * Dùng move-array-element (có undo). Trả về số lần di chuyển.
 */
async function reorderChildren(parentUuid, ordered) {
    const tree = await queryTree(parentUuid);
    if (!tree) {
        return 0;
    }
    const current = (tree.children || []).map((c) => c.uuid);
    const list = ordered.filter((u) => current.includes(u));
    const queue = list.slice();
    const wanted = current.map((u) => (list.includes(u) ? queue.shift() : u));
    let moves = 0;
    for (let target = 0; target < wanted.length; target++) {
        const from = current.indexOf(wanted[target]);
        if (from === target) {
            continue;
        }
        await Editor.Message.request('scene', 'move-array-element', {
            uuid: parentUuid,
            path: 'children',
            target: from,
            offset: target - from,
        });
        current.splice(from, 1);
        current.splice(target, 0, wanted[target]);
        moves++;
    }
    return moves;
}

/** Dump mảng cc.Node cho set-property. */
function nodeArrayDump(uuids) {
    return { type: 'cc.Node', isArray: true, value: uuids.map((u) => ({ type: 'cc.Node', value: u ? { uuid: u } : null })) };
}

function uuidsOfArrayDump(listDump) {
    return ((listDump && listDump.value) || []).map((e) => (e && e.value && e.value.uuid) || '');
}

/**
 * Gỡ các node `removed` khỏi mọi danh sách item trong scene: ItemManager.itemList,
 * MapPhaseManager.singleItems, MapPhaseManager.phases[*].itemList / afterComplete.
 */
async function removeFromItemLists(removed) {
    const root = await queryTree();
    const owners = [];
    (function walk(n) {
        if ((n.components || []).some((c) => c.type === MANAGER_COMPONENT || c.type === 'MapPhaseManager')) {
            owners.push(n.uuid);
        }
        (n.children || []).forEach(walk);
    })(root || {});

    let count = 0;
    const strip = async (uuid, path, listDump) => {
        const cur = uuidsOfArrayDump(listDump);
        const next = cur.filter((u) => !removed.includes(u));
        if (next.length === cur.length) {
            return;
        }
        await Editor.Message.request('scene', 'set-property', { uuid, path, dump: nodeArrayDump(next) });
        count += cur.length - next.length;
    };
    for (const uuid of owners) {
        const dump = await queryNode(uuid);
        const comps = (dump && dump.__comps__) || [];
        for (let i = 0; i < comps.length; i++) {
            const c = comps[i];
            const v = (c && c.value) || {};
            if (c.type === MANAGER_COMPONENT) {
                await strip(uuid, '__comps__.' + i + '.itemList', v.itemList);
            } else if (c.type === 'MapPhaseManager') {
                await strip(uuid, '__comps__.' + i + '.singleItems', v.singleItems);
                const phases = (v.phases && v.phases.value) || [];
                for (let j = 0; j < phases.length; j++) {
                    const p = (phases[j] && phases[j].value) || {};
                    await strip(uuid, '__comps__.' + i + '.phases.' + j + '.itemList', p.itemList);
                    await strip(uuid, '__comps__.' + i + '.phases.' + j + '.afterComplete', p.afterComplete);
                }
            }
        }
    }
    return count;
}

async function queryNode(uuid) {
    try {
        return await Editor.Message.request('scene', 'query-node', uuid);
    } catch (e) {
        return null;
    }
}

async function queryTree(uuid) {
    try {
        return await Editor.Message.request('scene', 'query-node-tree', uuid);
    } catch (e) {
        return null;
    }
}

/** Ảnh thumbnail (đường dẫn file trong library) của 1 spriteFrame uuid. */
async function thumbnailOf(spriteFrameUuid) {
    if (!spriteFrameUuid) {
        return '';
    }
    // spriteFrame là sub-asset "xxx@f9941" -> ảnh nằm ở asset cha "xxx"
    const texUuid = String(spriteFrameUuid).split('@')[0];
    for (const id of [spriteFrameUuid, texUuid]) {
        const info = await Editor.Message.request('asset-db', 'query-asset-info', id).catch(() => null);
        if (!info) {
            continue;
        }
        const lib = info.library || {};
        const file = lib['.png'] || lib['.jpg'] || lib['.jpeg'] || lib['.webp'] || info.file;
        if (file && /\.(png|jpe?g|webp|bmp|gif)$/i.test(file)) {
            return file;
        }
    }
    return '';
}

/** Tìm spriteFrame uuid trên node hoặc node con (tối đa depth cấp). */
async function findSpriteFrame(treeNode, depth) {
    const dump = await queryNode(treeNode.uuid);
    const sprite = findComp(dump, 'cc.Sprite');
    const sf = compProp(sprite, 'spriteFrame');
    if (sf && sf.uuid) {
        return sf.uuid;
    }
    if (depth <= 0) {
        return '';
    }
    // Ưu tiên node ảnh chính "Image"; node bóng ("xxx_sd" / "...shadow") xét sau cùng,
    // nếu không thumbnail sẽ lấy nhầm ảnh bóng (con _sd thường đứng trước Image).
    const rank = (c) => (c.name === 'Image' ? 0 : /(_sd|shadow)$/i.test(c.name) ? 2 : 1);
    const children = (treeNode.children || []).slice().sort((a, b) => rank(a) - rank(b));
    for (const child of children) {
        const found = await findSpriteFrame(child, depth - 1);
        if (found) {
            return found;
        }
    }
    return '';
}

// ---------------------------------------------------------------- ItemManager.itemList

const MANAGER_COMPONENT = 'ItemManager';

/** Node đầu tiên trong scene có component ItemManager (từ query-node-tree). */
function findManagerNode(treeNode) {
    if ((treeNode.components || []).some((c) => c.type === MANAGER_COMPONENT)) {
        return treeNode;
    }
    for (const child of treeNode.children || []) {
        const found = findManagerNode(child);
        if (found) {
            return found;
        }
    }
    return null;
}

/** { managerUuid, index (vị trí component), uuids } của ItemManager.itemList, hoặc null. */
async function readItemList() {
    const root = await queryTree();
    const managerNode = root && findManagerNode(root);
    if (!managerNode) {
        return null;
    }
    const dump = await queryNode(managerNode.uuid);
    const comps = (dump && dump.__comps__) || [];
    const index = comps.findIndex((c) => c && c.type === MANAGER_COMPONENT);
    const listDump = index >= 0 && comps[index].value && comps[index].value.itemList;
    if (!listDump || !Array.isArray(listDump.value)) {
        return null;
    }
    const uuids = listDump.value.map((e) => (e && e.value && e.value.uuid) || '');
    return { managerUuid: managerNode.uuid, index, uuids };
}

/**
 * Sắp lại ItemManager.itemList theo `ordered` (uuid item theo thứ tự panel).
 * Chỉ đổi chỗ các phần tử có trong panel; phần tử khác (item ở node cha khác,
 * ô null) giữ nguyên vị trí -> không thêm/bớt item nào khỏi list.
 */
async function syncItemList(ordered) {
    const list = await readItemList();
    if (!list) {
        return { ok: false, message: 'không tìm thấy ' + MANAGER_COMPONENT + '.itemList trong scene' };
    }
    const { managerUuid, index } = list;
    const current = list.uuids;
    const inList = ordered.filter((u) => current.includes(u));
    const queue = inList.slice();
    const next = current.map((u) => (inList.includes(u) ? queue.shift() : u));
    const missing = ordered.length - inList.length;

    if (next.every((u, i) => u === current[i])) {
        return { ok: true, changed: false, missing, message: 'đã đúng thứ tự' };
    }

    await Editor.Message.request('scene', 'set-property', {
        uuid: managerUuid,
        path: '__comps__.' + index + '.itemList',
        dump: {
            type: 'cc.Node',
            isArray: true,
            value: next.map((u) => ({ type: 'cc.Node', value: u ? { uuid: u } : null })),
        },
    });
    return {
        ok: true,
        changed: true,
        missing,
        message: 'đã sắp lại ' + inList.length + ' phần tử'
            + (missing ? ' (' + missing + ' item không có trong list)' : ''),
    };
}

// ---------------------------------------------------------------- methods

exports.methods = {
    openPanel() {
        Editor.Panel.open(PKG);
    },

    /** Node đang chọn trong Hierarchy. */
    getSelectedNode() {
        let uuids = [];
        try {
            uuids = Editor.Selection.getSelected('node') || [];
        } catch (e) {
            uuids = [];
        }
        return { uuid: uuids[0] || '' };
    },

    /** Danh sách node con của parentUuid theo siblingIndex hiện tại. */
    async loadChildren(parentUuid) {
        if (!parentUuid) {
            return { ok: false, error: 'Chưa chọn node cha.' };
        }
        const tree = await queryTree(parentUuid);
        if (!tree) {
            return { ok: false, error: 'Không tìm thấy node ' + parentUuid + ' trong scene đang mở.' };
        }
        const items = [];
        let skipped = 0;
        for (const child of tree.children || []) {
            const dump = await queryNode(child.uuid);
            if (!isItem(dump)) {
                skipped++;
                continue;
            }
            const ut = findComp(dump, 'cc.UITransform');
            const size = compProp(ut, 'contentSize') || {};
            const sfUuid = await findSpriteFrame(child, 2);
            items.push({
                uuid: child.uuid,
                name: child.name,
                active: child.active !== false,
                width: Number(size.width) || 0,
                height: Number(size.height) || 0,
                thumb: await thumbnailOf(sfUuid),
                hasSeat: !!findComp(dump, SEAT_COMPONENT),
                requires: seatRequires(dump),
                targetUuid: targetOf(dump),
                targetName: await nodeName(targetOf(dump)),
                pops: await popsOf(targetOf(dump)),
            });
        }
        const list = await readItemList();
        return {
            ok: true,
            parent: { uuid: tree.uuid, name: tree.name },
            items,
            skipped,
            itemListOrder: list ? list.uuids : null,
        };
    },

    /**
     * Ghi thứ tự mới: `uuids` là danh sách uuid node con theo thứ tự mong muốn.
     * Dùng move-array-element từng bước để editor có undo + đánh dấu dirty.
     */
    async applyOrder(parentUuid, uuids) {
        const tree = await queryTree(parentUuid);
        if (!tree) {
            return { ok: false, error: 'Không tìm thấy node cha trong scene.' };
        }
        const current = (tree.children || []).map((c) => c.uuid);
        const ordered = uuids.filter((u) => current.includes(u));
        // Chỉ thay các slot đang là item trong panel; node không phải item (FX, ...)
        // và item mới thêm sau khi load giữ nguyên siblingIndex hiện tại.
        const queue = ordered.slice();
        const wanted = current.map((u) => (ordered.includes(u) ? queue.shift() : u));

        let moves = 0;
        for (let target = 0; target < wanted.length; target++) {
            const from = current.indexOf(wanted[target]);
            if (from === target) {
                continue;
            }
            await Editor.Message.request('scene', 'move-array-element', {
                uuid: parentUuid,
                path: 'children',
                target: from,
                offset: target - from,
            });
            current.splice(from, 1);
            current.splice(target, 0, wanted[target]);
            moves++;
        }

        const itemList = await syncItemList(ordered);

        try {
            await Editor.Message.request('scene', 'snapshot');
        } catch (e) {
            /* editor cũ không có snapshot */
        }
        log('applied order for "' + tree.name + '": ' + moves + ' move(s), itemList: ' + itemList.message
            + '. Nhấn Ctrl+S để lưu scene.');
        return { ok: true, moves, order: wanted, itemList };
    },

    /**
     * Ghi SeatHandler.requiredItems: `seats` = { itemUuid: [requiredUuid...] } (chỉ item đã đổi).
     * List rỗng -> gỡ component SeatHandler; chưa có component -> thêm.
     */
    async applySeats(seats) {
        let set = 0;
        let removed = 0;
        for (const uuid of Object.keys(seats || {})) {
            const required = (seats[uuid] || []).filter((u) => u && u !== uuid);
            let dump = await queryNode(uuid);
            if (!dump) {
                continue;
            }
            let seat = findComp(dump, SEAT_COMPONENT);
            if (!required.length) {
                if (seat) {
                    await Editor.Message.request('scene', 'remove-component', { uuid: dumpValue(seat.value.uuid) });
                    removed++;
                }
                continue;
            }
            if (!seat) {
                await Editor.Message.request('scene', 'create-component', { uuid, component: SEAT_COMPONENT });
                dump = await queryNode(uuid);
            }
            const index = (dump.__comps__ || []).findIndex((c) => c && c.type === SEAT_COMPONENT);
            if (index < 0) {
                continue;
            }
            await Editor.Message.request('scene', 'set-property', {
                uuid,
                path: '__comps__.' + index + '.requiredItems',
                dump: {
                    type: 'cc.Node',
                    isArray: true,
                    value: required.map((u) => ({ type: 'cc.Node', value: { uuid: u } })),
                },
            });
            set++;
        }
        try {
            await Editor.Message.request('scene', 'snapshot');
        } catch (e) {
            /* editor cũ không có snapshot */
        }
        log('SeatHandler: ghi ' + set + ' item, gỡ ' + removed + ' component. Nhấn Ctrl+S để lưu scene.');
        return { ok: true, set, removed };
    },

    /**
     * Gộp item vào đồ đựng (đồ nhỏ nảy ra lần lượt khi ghép đồ đựng — MistakeHintMode):
     *   merges = [{ source, item }]: đích của `item` thành con của đích `source` (giữ vị trí world),
     *   tên chưa khớp "...Place" / "Holder_..." thì thêm hậu tố "Place"; node item bị xoá + gỡ khỏi danh sách item.
     *   orders = { sourceItemUuid: [uuid con nảy ra theo thứ tự] }: sắp lại siblingIndex các con đó.
     */
    async applyMerges(merges, orders) {
        const removed = [];
        const errors = [];
        for (const m of merges || []) {
            const srcTarget = targetOf(await queryNode(m.source));
            const itemDump = await queryNode(m.item);
            const itemTarget = targetOf(itemDump);
            const itemName = itemDump ? String(dumpValue(itemDump.name)) : m.item;
            if (!srcTarget || !itemTarget) {
                errors.push(itemName + ': thiếu Target Point');
                continue;
            }
            // Đích của item là tổ tiên của đích đồ đựng -> set-parent sẽ tạo vòng
            let p = await queryNode(srcTarget);
            let cyclic = false;
            for (let guard = 0; p && guard < 64; guard++) {
                const parentUuid = (dumpValue(p.parent) || {}).uuid;
                if (!parentUuid) break;
                if (parentUuid === itemTarget) { cyclic = true; break; }
                p = await queryNode(parentUuid);
            }
            if (cyclic || srcTarget === itemTarget) {
                errors.push(itemName + ': đích nằm bao ngoài đích đồ đựng');
                continue;
            }
            await Editor.Message.request('scene', 'set-parent', { parent: srcTarget, uuids: [itemTarget], keepWorldTransform: true });
            const name = await nodeName(itemTarget);
            if (!POP_RE.test(name)) {
                await Editor.Message.request('scene', 'set-property', { uuid: itemTarget, path: 'name', dump: { type: 'String', value: name + 'Place' } });
            }
            removed.push(m.item);
        }
        const unlisted = removed.length ? await removeFromItemLists(removed) : 0;
        for (const uuid of removed) {
            await Editor.Message.request('scene', 'remove-node', { uuid });
        }
        let moves = 0;
        for (const source of Object.keys(orders || {})) {
            const srcTarget = targetOf(await queryNode(source));
            if (srcTarget) moves += await reorderChildren(srcTarget, orders[source]);
        }
        try {
            await Editor.Message.request('scene', 'snapshot');
        } catch (e) {
            /* editor cũ không có snapshot */
        }
        log('Gộp ' + removed.length + ' item vào đồ đựng (gỡ ' + unlisted + ' chỗ trong danh sách item), sắp lại ' + moves
            + ' node' + (errors.length ? ', lỗi: ' + errors.join('; ') : '') + '. Nhấn Ctrl+S để lưu scene.');
        return { ok: true, merged: removed.length, moves, errors };
    },
};

exports.load = function () {};
exports.unload = function () {};
