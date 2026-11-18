'use strict';

const fs = require('fs');
const path = require('path');

const PKG = 'item-order-editor';
const STATIC = path.join(__dirname, '..', '..', 'static');

exports.template = fs.readFileSync(path.join(STATIC, 'template', 'default.html'), 'utf8');
exports.style = fs.readFileSync(path.join(STATIC, 'style', 'default.css'), 'utf8');

exports.$ = {
    parentName: '#parentName',
    useSelected: '#useSelected',
    reload: '#reload',
    perColumn: '#perColumn',
    save: '#save',
    sortByList: '#sortByList',
    seatMode: '#seatMode',
    seatClear: '#seatClear',
    revealMode: '#revealMode',
    revealPanel: '#revealPanel',
    revealTitle: '#revealTitle',
    revealList: '#revealList',
    status: '#status',
    board: '#board',
};

function escapeHtml(text) {
    return String(text).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

function fileUrl(p) {
    return 'file:///' + String(p).replace(/\\/g, '/').replace(/^\/+/, '');
}

function loadPrefs() {
    try {
        return JSON.parse(localStorage.getItem(PKG) || '{}');
    } catch (e) {
        return {};
    }
}

function savePrefs(prefs) {
    try {
        localStorage.setItem(PKG, JSON.stringify(prefs));
    } catch (e) {
        /* convenience only */
    }
}

/** State của panel (không bind vào this để tránh đụng hàm lifecycle). */
const state = {
    parent: null,       // { uuid, name }
    columns: [],        // Item[][]
    picked: null,       // { col, row } — ô đang chọn để swap
    drag: null,         // { col, row }
    dirty: false,
    itemListOrder: null, // uuid theo ItemManager.itemList (thứ tự spawn) lúc load
    mode: 'order',      // 'order' = sắp thứ tự | 'seat' = điền SeatHandler.requiredItems | 'reveal' = gộp đồ nhỏ vào đồ đựng
    revealTarget: null, // uuid đồ đựng đang sửa (chế độ reveal)
    pops: {},           // uuid item -> [{ uuid, name, item? }] con nảy ra lần lượt của đích (item = uuid item gộp chờ Save)
    merged: {},         // uuid item gộp chờ Save -> { source, item (object để trả lại board) }
    popDirty: new Set(), // uuid đồ đựng đã đổi danh sách / thứ tự, chưa Save
    seatTarget: null,   // uuid item đang sửa requiredItems (chế độ seat)
    requires: {},       // uuid -> [uuid item bắt buộc ghép trước]
    seatDirty: new Set(), // uuid item đã đổi requiredItems, chưa Save
    names: {},          // uuid -> tên (để hiện tooltip)
};

exports.methods = {
    // ------------------------------------------------------------ status

    showStatus(message, level) {
        this.$.status.classList.remove('hidden', 'error', 'ok');
        if (level) {
            this.$.status.classList.add(level);
        }
        this.$.status.textContent = message;
    },

    hideStatus() {
        this.$.status.classList.add('hidden');
    },

    // ------------------------------------------------------------ data

    perColumn() {
        return Math.max(1, Math.floor(Number(this.$.perColumn.value) || 7));
    },

    flatten() {
        return state.columns.reduce((all, col) => all.concat(col), []);
    },

    /** Chia danh sách phẳng thành các cột, mỗi cột perColumn ô. */
    splitColumns(items) {
        const n = this.perColumn();
        const cols = [];
        for (let i = 0; i < items.length; i += n) {
            cols.push(items.slice(i, i + n));
        }
        return cols;
    },

    async loadFromSelection() {
        const res = await Editor.Message.request(PKG, 'get-selected-node').catch(() => null);
        const uuid = res && res.uuid;
        if (!uuid) {
            this.showStatus('Hãy chọn node cha (vd: Items) trong Hierarchy trước.', 'error');
            return;
        }
        await this.load(uuid);
    },

    async load(uuid) {
        const target = uuid || (state.parent && state.parent.uuid);
        if (!target) {
            this.showStatus('Chưa có node cha. Chọn node trong Hierarchy rồi bấm "Load selected node".', 'error');
            return;
        }
        this.showStatus('Đang đọc node con...');
        const res = await Editor.Message.request(PKG, 'load-children', target).catch((e) => ({ ok: false, error: String(e) }));
        if (!res || !res.ok) {
            this.showStatus((res && res.error) || 'Không đọc được node.', 'error');
            return;
        }
        state.parent = res.parent;
        state.columns = this.splitColumns(res.items);
        state.picked = null;
        state.dirty = false;
        state.itemListOrder = res.itemListOrder || null;
        state.requires = {};
        state.names = {};
        res.items.forEach((it) => {
            state.requires[it.uuid] = (it.requires || []).slice();
            state.names[it.uuid] = it.name;
        });
        state.seatDirty = new Set();
        if (state.seatTarget && !state.requires[state.seatTarget]) {
            state.seatTarget = null;
        }
        state.pops = {};
        res.items.forEach((it) => { state.pops[it.uuid] = (it.pops || []).slice(); });
        state.merged = {};
        state.popDirty = new Set();
        if (state.revealTarget && !state.pops[state.revealTarget]) {
            state.revealTarget = null;
        }
        this.$.parentName.textContent = res.parent.name + '  (' + res.items.length + ' items'
            + (res.skipped ? ', bỏ qua ' + res.skipped + ' node không phải item' : '') + ')';
        savePrefs({ parentUuid: res.parent.uuid, perColumn: this.perColumn() });
        if (!state.itemListOrder) {
            this.showStatus('Không tìm thấy ItemManager.itemList trong scene — Save chỉ đổi Hierarchy.', 'error');
        } else if (!this.matchesItemList()) {
            this.showStatus('Thứ tự Hierarchy đang KHÁC ItemManager.itemList (thứ tự spawn). '
                + 'Bấm "Xếp theo itemList" để lấy thứ tự spawn hiện tại trước khi chỉnh, nếu không Save sẽ ghi đè itemList.', 'error');
        } else {
            this.hideStatus();
        }
        this.render();
    },

    /** Thứ tự item trong panel có trùng thứ tự tương đối trong itemList không. */
    matchesItemList() {
        const list = state.itemListOrder || [];
        const inList = this.flatten().map((it) => it.uuid).filter((u) => list.includes(u));
        return inList.every((u, i) => i === 0 || list.indexOf(inList[i - 1]) < list.indexOf(u));
    },

    /** Sắp panel theo itemList; item không có trong list xuống cuối (giữ thứ tự cũ). */
    sortByItemList() {
        const list = state.itemListOrder;
        if (!state.parent || !list) {
            this.showStatus('Chưa đọc được ItemManager.itemList.', 'error');
            return;
        }
        const rank = (it) => {
            const i = list.indexOf(it.uuid);
            return i < 0 ? Number.MAX_SAFE_INTEGER : i;
        };
        const items = this.flatten().map((it, i) => ({ it, i }))
            .sort((a, b) => rank(a.it) - rank(b.it) || a.i - b.i)
            .map((x) => x.it);
        state.columns = this.splitColumns(items);
        state.picked = null;
        const missing = items.filter((it) => !list.includes(it.uuid)).length;
        this.showStatus('Đã xếp theo itemList' + (missing ? ' (' + missing + ' item không có trong list, để cuối)' : '')
            + '. Bấm Save để ghi thứ tự này vào Hierarchy.', missing ? 'error' : 'ok');
        this.markDirty();
    },

    async save() {
        if (!state.parent) {
            this.showStatus('Chưa load node cha.', 'error');
            return;
        }
        const uuids = this.flatten().map((it) => it.uuid);
        this.$.save.disabled = true;
        this.showStatus('Đang ghi thứ tự...');
        const res = await Editor.Message.request(PKG, 'apply-order', state.parent.uuid, uuids)
            .catch((e) => ({ ok: false, error: String(e) }));
        this.$.save.disabled = false;
        if (!res || !res.ok) {
            this.showStatus((res && res.error) || 'Ghi thất bại.', 'error');
            return;
        }
        let seatMsg = '';
        if (state.seatDirty.size) {
            const seats = {};
            state.seatDirty.forEach((u) => { seats[u] = state.requires[u] || []; });
            const sr = await Editor.Message.request(PKG, 'apply-seats', seats)
                .catch((e) => ({ ok: false, error: String(e) }));
            seatMsg = sr && sr.ok
                ? ' SeatHandler: ghi ' + sr.set + ' item' + (sr.removed ? ', gỡ ' + sr.removed : '') + '.'
                : ' SeatHandler LỖI: ' + ((sr && sr.error) || '?') + '.';
        }
        if (state.popDirty.size) {
            const merges = Object.keys(state.merged).map((u) => ({ source: state.merged[u].source, item: u }));
            const orders = {};
            state.popDirty.forEach((u) => { orders[u] = (state.pops[u] || []).map((p) => p.uuid); });
            const mr = await Editor.Message.request(PKG, 'apply-merges', merges, orders)
                .catch((e) => ({ ok: false, errors: [String(e)] }));
            seatMsg += mr && mr.ok && !mr.errors.length
                ? ' Gộp ' + mr.merged + ' item vào đồ đựng.'
                : ' Gộp đồ nhỏ LỖI: ' + (((mr && mr.errors) || []).join('; ') || '?') + '.';
        }
        await this.load(state.parent.uuid);
        const list = res.itemList || {};
        this.showStatus('Đã sắp xếp lại ' + uuids.length + ' node (' + res.moves + ' lần di chuyển). '
            + 'ItemManager.itemList: ' + (list.message || '?') + '.' + seatMsg + ' Nhấn Ctrl+S trong editor để lưu scene.',
            list.ok === false || list.missing || seatMsg.includes('LỖI') ? 'error' : 'ok');
    },

    // ------------------------------------------------------------ seat mode

    toggleSeatMode() {
        this.setMode(state.mode === 'seat' ? 'order' : 'seat');
    },

    toggleRevealMode() {
        this.setMode(state.mode === 'reveal' ? 'order' : 'reveal');
    },

    setMode(mode) {
        state.mode = mode;
        state.picked = null;
        state.seatTarget = null;
        state.revealTarget = null;
        if (mode === 'order') {
            this.hideStatus();
        }
        this.render();
    },

    // ------------------------------------------------------------ reveal mode (gộp đồ nhỏ vào đồ đựng)

    /** Chuột trái: chọn đồ đựng đang sửa (click lại = xong). */
    revealClick(item) {
        state.revealTarget = state.revealTarget === item.uuid ? null : item.uuid;
        this.render();
    },

    /** Chuột phải: gộp item này vào đồ đựng đang sửa -> biến khỏi board, đích của nó nảy ra khi ghép đồ đựng. */
    revealMerge(item) {
        const source = state.revealTarget;
        if (!source) {
            this.showStatus('Chuột trái vào đồ đựng trước, rồi mới chuột phải vào các item sẽ nảy ra.', 'error');
            return;
        }
        if (item.uuid === source) {
            return;
        }
        if (!item.targetUuid) {
            this.showStatus('"' + item.name + '" chưa gán Target Point -> không có gì để nảy ra.', 'error');
            return;
        }
        const pos = this.findPos(item.uuid);
        if (!pos) {
            return;
        }
        this.take(pos);
        this.normalize();
        state.merged[item.uuid] = { source, item };
        (state.pops[source] || (state.pops[source] = [])).push({ uuid: item.targetUuid, name: item.targetName || item.name, item: item.uuid });
        state.popDirty.add(source);
        state.dirty = true;
        this.render();
    },

    /** Bỏ gộp (chưa Save): item về lại cuối board. */
    revealUnmerge(index) {
        const source = state.revealTarget;
        const list = state.pops[source] || [];
        const entry = list[index];
        if (!entry || !entry.item) {
            return;
        }
        list.splice(index, 1);
        const m = state.merged[entry.item];
        delete state.merged[entry.item];
        if (m) {
            this.put({ col: state.columns.length, row: 0 }, m.item);
            this.normalize();
        }
        state.popDirty.add(source);
        this.render();
    },

    revealMove(index, delta) {
        const list = state.pops[state.revealTarget] || [];
        const to = index + delta;
        if (to < 0 || to >= list.length) {
            return;
        }
        list.splice(to, 0, list.splice(index, 1)[0]);
        state.popDirty.add(state.revealTarget);
        state.dirty = true;
        this.render();
    },

    findPos(uuid) {
        for (let c = 0; c < state.columns.length; c++) {
            const r = state.columns[c].findIndex((it) => it.uuid === uuid);
            if (r >= 0) return { col: c, row: r };
        }
        return null;
    },

    renderRevealPanel() {
        const source = state.mode === 'reveal' ? state.revealTarget : null;
        this.$.revealPanel.classList.toggle('hidden', !source);
        if (state.mode === 'reveal') {
            this.showStatus(source
                ? 'Đang sửa "' + (state.names[source] || source) + '": CHUỘT PHẢI vào item để gộp vào (item biến khỏi board, đích của nó nảy ra khi ghép xong đồ đựng). '
                    + 'Chuột trái item khác = đổi đồ đựng, click lại = xong. Save rồi Ctrl+S để ghi vào scene.'
                : 'Reveal mode: CHUỘT TRÁI chọn đồ đựng, rồi CHUỘT PHẢI các item sẽ nảy ra lần lượt sau khi ghép đồ đựng đó.');
        }
        if (!source) {
            return;
        }
        const list = state.pops[source] || [];
        this.$.revealTitle.textContent = 'Ghép xong "' + (state.names[source] || source) + '" -> nảy ra lần lượt (' + list.length + '):';
        const box = this.$.revealList;
        box.innerHTML = '';
        if (!list.length) {
            box.innerHTML = '<span class="hint">Chưa có. Chuột phải vào item trên board để gộp vào.</span>';
            return;
        }
        list.forEach((p, i) => {
            const row = document.createElement('div');
            row.className = 'reveal-row' + (p.item ? ' pending' : '');
            row.title = p.item ? 'Chưa Save — ✕ để trả item về board' : 'Đã gộp (con của đích đồ đựng). Muốn bỏ thì sửa trong Hierarchy.';
            row.innerHTML = '<span class="idx">' + (i + 1) + '</span>'
                + '<span class="name">' + escapeHtml(p.name) + '</span>'
                + '<button data-a="up" title="Lên"' + (i === 0 ? ' disabled' : '') + '>▲</button>'
                + '<button data-a="down" title="Xuống"' + (i === list.length - 1 ? ' disabled' : '') + '>▼</button>'
                + (p.item ? '<button data-a="del" title="Trả item về board">✕</button>' : '');
            row.addEventListener('click', (e) => {
                const a = e.target && e.target.dataset && e.target.dataset.a;
                if (a === 'up') this.revealMove(i, -1);
                else if (a === 'down') this.revealMove(i, 1);
                else if (a === 'del') this.revealUnmerge(i);
            });
            box.appendChild(row);
        });
    },

    /** Chế độ seat: click item -> chọn item để sửa / thêm-bỏ item bắt buộc. */
    seatClick(item) {
        const target = state.seatTarget;
        if (!target || item.uuid === target) {
            // chọn item để sửa (click lại item đang sửa = xong)
            state.seatTarget = target === item.uuid ? null : item.uuid;
            this.render();
            return;
        }
        const req = state.requires[target] || (state.requires[target] = []);
        const i = req.indexOf(item.uuid);
        if (i >= 0) {
            req.splice(i, 1);
        } else {
            if ((state.requires[item.uuid] || []).includes(target)) {
                this.showStatus('"' + item.name + '" đang cần "' + state.names[target]
                    + '" -> chọn ngược lại sẽ thành vòng lặp, không item nào ghép được.', 'error');
                return;
            }
            req.push(item.uuid);
        }
        state.seatDirty.add(target);
        state.dirty = true;
        this.render();
    },

    seatClearTarget() {
        const target = state.seatTarget;
        if (!target || !(state.requires[target] || []).length) {
            return;
        }
        state.requires[target] = [];
        state.seatDirty.add(target);
        state.dirty = true;
        this.render();
    },

    seatStatus() {
        const target = state.seatTarget;
        if (!target) {
            this.showStatus('Seat mode: click 1 item để chọn item cần khoá (item đó chỉ vào khay / ghép được khi các item bắt buộc đã ghép xong).');
            return;
        }
        const req = state.requires[target] || [];
        this.showStatus('Đang sửa "' + state.names[target] + '" — cần ghép trước: '
            + (req.length ? req.map((u) => state.names[u] || u).join(', ') : '(chưa có)')
            + '. Click item khác để thêm/bỏ, click lại "' + state.names[target] + '" để xong.');
    },

    // ------------------------------------------------------------ mutations

    markDirty() {
        state.dirty = true;
        this.render();
    },

    /** Lấy item ra khỏi vị trí (col,row) — trả về item. */
    take(pos) {
        return state.columns[pos.col].splice(pos.row, 1)[0];
    },

    /** Chèn item vào (col,row); tự tạo cột nếu col vượt quá. */
    put(pos, item) {
        while (state.columns.length <= pos.col) {
            state.columns.push([]);
        }
        const col = state.columns[pos.col];
        col.splice(Math.min(pos.row, col.length), 0, item);
    },

    /** Xoá cột rỗng, gộp lại theo perColumn để thứ tự phẳng luôn đúng. */
    normalize() {
        state.columns = this.splitColumns(this.flatten());
    },

    move(from, to) {
        if (from.col === to.col && from.row === to.row) {
            return;
        }
        const item = this.take(from);
        // Nếu cùng cột và kéo xuống dưới thì index đích lệch 1 sau khi take
        if (from.col === to.col && to.row > from.row) {
            to = { col: to.col, row: to.row - 1 };
        }
        this.put(to, item);
        this.normalize();
        state.picked = null;
        this.markDirty();
    },

    swap(a, b) {
        const ia = state.columns[a.col][a.row];
        state.columns[a.col][a.row] = state.columns[b.col][b.row];
        state.columns[b.col][b.row] = ia;
        state.picked = null;
        this.markDirty();
    },

    // ------------------------------------------------------------ render

    render() {
        const board = this.$.board;
        board.innerHTML = '';
        if (!state.parent) {
            board.innerHTML = '<div class="empty-board">Chọn node cha trong Hierarchy rồi bấm <b>Load selected node</b>.</div>';
            return;
        }
        if (!state.columns.length) {
            board.innerHTML = '<div class="empty-board">"' + escapeHtml(state.parent.name) + '" không có node con nào có ItemController.</div>';
            return;
        }

        const perCol = this.perColumn();
        let flatIndex = 0;
        state.columns.forEach((items, c) => {
            const colEl = document.createElement('div');
            colEl.className = 'column';
            colEl.dataset.col = String(c);
            colEl.innerHTML = '<div class="column-head"><span>Column ' + (c + 1) + '</span>'
                + '<span class="count">' + items.length + ' / ' + perCol + '</span></div>';
            const cells = document.createElement('div');
            cells.className = 'cells';
            colEl.appendChild(cells);

            items.forEach((item, r) => {
                cells.appendChild(this.renderCell(item, { col: c, row: r }, flatIndex++));
            });

            // Thả vào khoảng trống cuối cột
            colEl.addEventListener('dragover', (e) => {
                if (!state.drag) {
                    return;
                }
                e.preventDefault();
                colEl.classList.add('drop-target');
            });
            colEl.addEventListener('dragleave', () => colEl.classList.remove('drop-target'));
            colEl.addEventListener('drop', (e) => {
                if (!state.drag) {
                    return;
                }
                e.preventDefault();
                colEl.classList.remove('drop-target');
                // Nếu thả trúng cell thì cell đã xử lý + stopPropagation
                this.move(state.drag, { col: c, row: items.length });
                state.drag = null;
            });

            board.appendChild(colEl);
        });

        this.$.save.disabled = false;
        this.$.save.textContent = state.dirty || state.seatDirty.size || state.popDirty.size ? 'Save *' : 'Save';
        const seat = state.mode === 'seat';
        const reveal = state.mode === 'reveal';
        board.classList.toggle('seat-mode', seat || reveal);
        this.$.revealMode.textContent = reveal ? 'Reveal mode: ON' : 'Reveal mode';
        this.$.revealMode.setAttribute('type', reveal ? 'primary' : 'default');
        this.renderRevealPanel();
        this.$.seatMode.textContent = seat ? 'Seat mode: ON' : 'Seat mode';
        this.$.seatMode.setAttribute('type', seat ? 'primary' : 'default');
        this.$.seatClear.classList.toggle('hidden', !seat || !state.seatTarget);
        if (seat) {
            this.seatStatus();
        }
    },

    renderCell(item, pos, flatIndex) {
        const el = document.createElement('div');
        el.className = 'cell';
        if (flatIndex === 0) {
            el.classList.add('first');
        }
        if (!item.active) {
            el.classList.add('inactive');
        }
        if (state.picked && state.picked.col === pos.col && state.picked.row === pos.row) {
            el.classList.add('picked');
        }
        const seat = state.mode === 'seat';
        const requires = state.requires[item.uuid] || [];
        if (seat && state.seatTarget === item.uuid) {
            el.classList.add('seat-target');
        }
        const isReq = seat && !!state.seatTarget && (state.requires[state.seatTarget] || []).includes(item.uuid);
        if (isReq) {
            el.classList.add('seat-req');
        }
        if (state.mode === 'reveal' && state.revealTarget === item.uuid) {
            el.classList.add('seat-target');
        }
        const pops = state.pops[item.uuid] || [];
        el.draggable = state.mode === 'order';
        el.title = item.name + '\n' + item.width + ' x ' + item.height + (item.active ? '' : '\n(inactive)')
            + (requires.length ? '\nCần ghép trước: ' + requires.map((u) => state.names[u] || u).join(', ') : '');

        const thumb = item.thumb
            ? '<img class="thumb" src="' + escapeHtml(fileUrl(item.thumb)) + '" onerror="this.classList.add(\'empty\');this.removeAttribute(\'src\')">'
            : '<span class="thumb empty"></span>';

        el.innerHTML = '<span class="idx">' + (flatIndex + 1) + '</span>'
            + thumb
            + '<span class="info">'
            + '<span class="name">' + escapeHtml(item.name) + '</span>'
            + '<span class="size">' + Math.round(item.width) + '×' + Math.round(item.height) + '</span>'
            + '</span>'
            + this.seatBadge(requires, isReq)
            + (pops.length ? '<span class="badge reveal" title="Ghép xong nảy ra: ' + escapeHtml(pops.map((p) => p.name).join(', '))
                + '">✨' + pops.length + '</span>' : '');

        // ---- click: seat mode -> sửa requiredItems; order mode -> chọn 2 ô để swap
        el.addEventListener('click', () => {
            if (state.mode === 'seat') {
                this.seatClick(item);
                return;
            }
            if (state.mode === 'reveal') {
                this.revealClick(item);
                return;
            }
            if (!state.picked) {
                state.picked = pos;
                this.render();
                return;
            }
            if (state.picked.col === pos.col && state.picked.row === pos.row) {
                state.picked = null;
                this.render();
                return;
            }
            this.swap(state.picked, pos);
        });

        // ---- chuột phải (reveal mode): gộp item này vào đồ đựng đang sửa
        el.addEventListener('contextmenu', (e) => {
            if (state.mode !== 'reveal') {
                return;
            }
            e.preventDefault();
            e.stopPropagation();
            this.revealMerge(item);
        });

        // ---- drag & drop
        el.addEventListener('dragstart', (e) => {
            if (state.mode !== 'order') {
                e.preventDefault();
                return;
            }
            state.drag = pos;
            el.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', item.uuid);
        });
        el.addEventListener('dragend', () => {
            state.drag = null;
            el.classList.remove('dragging');
            this.$.board.querySelectorAll('.drop-before, .drop-after, .drop-target')
                .forEach((n) => n.classList.remove('drop-before', 'drop-after', 'drop-target'));
        });
        el.addEventListener('dragover', (e) => {
            if (!state.drag) {
                return;
            }
            e.preventDefault();
            e.stopPropagation();
            const rect = el.getBoundingClientRect();
            const after = e.clientY > rect.top + rect.height / 2;
            el.classList.toggle('drop-before', !after);
            el.classList.toggle('drop-after', after);
        });
        el.addEventListener('dragleave', () => {
            el.classList.remove('drop-before', 'drop-after');
        });
        el.addEventListener('drop', (e) => {
            if (!state.drag) {
                return;
            }
            e.preventDefault();
            e.stopPropagation();
            const rect = el.getBoundingClientRect();
            const after = e.clientY > rect.top + rect.height / 2;
            const from = state.drag;
            state.drag = null;
            this.move(from, { col: pos.col, row: pos.row + (after ? 1 : 0) });
        });

        return el;
    },

    /** Badge: "cần" khi đang được chọn làm item bắt buộc; 🔒n = số item bắt buộc (⚠ nếu có item không nằm trong itemList). */
    seatBadge(requires, isReq) {
        let html = '';
        if (isReq) {
            html += '<span class="badge req">cần</span>';
        }
        if (requires.length) {
            const list = state.itemListOrder;
            const missing = list ? requires.filter((u) => !list.includes(u)) : [];
            const tip = 'Cần ghép trước: ' + requires.map((u) => state.names[u] || u).join(', ')
                + (missing.length ? '\n⚠ Không có trong itemList: ' + missing.map((u) => state.names[u] || u).join(', ')
                    + ' -> khay có thể kẹt' : '');
            html += '<span class="badge lock' + (missing.length ? ' warn' : '') + '" title="' + escapeHtml(tip) + '">'
                + (missing.length ? '⚠' : '🔒') + requires.length + '</span>';
        }
        return html;
    },
};

exports.ready = async function () {
    const prefs = loadPrefs();
    if (prefs.perColumn) {
        this.$.perColumn.value = prefs.perColumn;
    }

    this.$.useSelected.addEventListener('confirm', this.loadFromSelection.bind(this));
    this.$.reload.addEventListener('confirm', () => this.load());
    this.$.save.addEventListener('confirm', this.save.bind(this));
    this.$.sortByList.addEventListener('confirm', this.sortByItemList.bind(this));
    this.$.seatMode.addEventListener('confirm', this.toggleSeatMode.bind(this));
    this.$.seatClear.addEventListener('confirm', this.seatClearTarget.bind(this));
    this.$.revealMode.addEventListener('confirm', this.toggleRevealMode.bind(this));
    this.$.perColumn.addEventListener('change', () => {
        savePrefs({ parentUuid: state.parent && state.parent.uuid, perColumn: this.perColumn() });
        if (state.parent) {
            this.normalize();
            this.render();
        }
    });

    this.render();
    if (prefs.parentUuid) {
        // Scene khác có thể không có node này -> load() sẽ báo lỗi nhẹ, không sao
        await this.load(prefs.parentUuid);
    }
};

exports.beforeClose = async function () {};
exports.close = function () {};
