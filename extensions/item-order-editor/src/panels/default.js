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
        await this.load(state.parent.uuid);
        const list = res.itemList || {};
        this.showStatus('Đã sắp xếp lại ' + uuids.length + ' node (' + res.moves + ' lần di chuyển). '
            + 'ItemManager.itemList: ' + (list.message || '?') + '. Nhấn Ctrl+S trong editor để lưu scene.',
            list.ok === false || list.missing ? 'error' : 'ok');
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
        this.$.save.textContent = state.dirty ? 'Save *' : 'Save';
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
        el.draggable = true;
        el.title = item.name + '\n' + item.width + ' x ' + item.height + (item.active ? '' : '\n(inactive)');

        const thumb = item.thumb
            ? '<img class="thumb" src="' + escapeHtml(fileUrl(item.thumb)) + '" onerror="this.classList.add(\'empty\');this.removeAttribute(\'src\')">'
            : '<span class="thumb empty"></span>';

        el.innerHTML = '<span class="idx">' + (flatIndex + 1) + '</span>'
            + thumb
            + '<span class="info">'
            + '<span class="name">' + escapeHtml(item.name) + '</span>'
            + '<span class="size">' + Math.round(item.width) + '×' + Math.round(item.height) + '</span>'
            + '</span>';

        // ---- click: chọn 2 ô để swap
        el.addEventListener('click', () => {
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
