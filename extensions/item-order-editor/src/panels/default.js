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
    mode: 'order',      // 'order' = sắp thứ tự | 'seat' = điền SeatHandler.requiredItems
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
        await this.load(state.parent.uuid);
        const list = res.itemList || {};
        this.showStatus('Đã sắp xếp lại ' + uuids.length + ' node (' + res.moves + ' lần di chuyển). '
            + 'ItemManager.itemList: ' + (list.message || '?') + '.' + seatMsg + ' Nhấn Ctrl+S trong editor để lưu scene.',
            list.ok === false || list.missing || seatMsg.includes('LỖI') ? 'error' : 'ok');
    },

    // ------------------------------------------------------------ seat mode

    toggleSeatMode() {
        state.mode = state.mode === 'seat' ? 'order' : 'seat';
        state.picked = null;
        state.seatTarget = null;
        if (state.mode === 'order') {
            this.hideStatus();
        }
        this.render();
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
        this.$.save.textContent = state.dirty || state.seatDirty.size ? 'Save *' : 'Save';
        const seat = state.mode === 'seat';
        board.classList.toggle('seat-mode', seat);
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
        el.draggable = !seat;
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
            + this.seatBadge(requires, isReq);

        // ---- click: seat mode -> sửa requiredItems; order mode -> chọn 2 ô để swap
        el.addEventListener('click', () => {
            if (state.mode === 'seat') {
                this.seatClick(item);
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

        // ---- drag & drop
        el.addEventListener('dragstart', (e) => {
            if (state.mode === 'seat') {
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
