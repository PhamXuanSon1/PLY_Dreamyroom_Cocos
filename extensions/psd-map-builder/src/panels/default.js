'use strict';

const fs = require('fs');
const path = require('path');
const { sanitizeKey, linkAttachments } = require('../naming');

const PKG = 'psd-map-builder';
const STATIC = path.join(__dirname, '..', '..', 'static');

exports.template = fs.readFileSync(path.join(STATIC, 'template', 'default.html'), 'utf8');
exports.style = fs.readFileSync(path.join(STATIC, 'style', 'default.css'), 'utf8');

exports.$ = {
    cacheInfo: '#cacheInfo',
    psdPath: '#psdPath',
    pickPsd: '#pickPsd',
    scan: '#scan',
    levelName: '#levelName',
    outUrl: '#outUrl',
    root: '#root',
    useSelected: '#useSelected',
    reloadRoots: '#reloadRoots',
    scale: '#scale',
    skipHidden: '#skipHidden',
    attach: '#attach',
    order: '#order',
    autoSave: '#autoSave',
    fit: '#fit',
    zoomLabel: '#zoomLabel',
    dim: '#dim',
    stage: '#stage',
    world: '#world',
    tip: '#tip',
    stageEmpty: '#stageEmpty',
    filter: '#filter',
    show: '#show',
    checkVisible: '#checkVisible',
    uncheckAll: '#uncheckAll',
    count: '#count',
    list: '#list',
    progress: '#progress',
    bar: '#bar',
    progressText: '#progressText',
    status: '#status',
    exportOnly: '#exportOnly',
    create: '#create',
};

const DEFAULT_PREFS = { psdPath: '', scale: 0.6, skipHidden: true, attach: true, order: 'bottomUp', autoSave: false, dim: false };

function loadPrefs() {
    try { return { ...DEFAULT_PREFS, ...JSON.parse(localStorage.getItem(PKG) || '{}') }; } catch (e) { return { ...DEFAULT_PREFS }; }
}

function savePrefs(p) {
    try { localStorage.setItem(PKG, JSON.stringify(p)); } catch (e) { /* chỉ để tiện */ }
}

function esc(t) {
    return String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

function fileUrl(p) {
    return 'file:///' + String(p).replace(/\\/g, '/').replace(/^\/+/, '');
}

/** "Level_882_nhà bí ngô hlw" -> "Level_882" */
function defaultLevelName(psdName) {
    const m = /level[ _-]?(\d+)/i.exec(psdName);
    return m ? `Level_${m[1]}` : sanitizeKey(psdName);
}

const ROLE_LABEL = { shadow: 'bóng', fx: 'fx', front: 'che trước' };
const MIN_ZOOM = 0.05;
const MAX_ZOOM = 8;

const state = {
    manifest: null,
    byId: new Map(),
    links: new Map(),       // layerId phụ -> { ownerId, role }
    childrenOf: new Map(),  // ownerId -> [{ id, role }]
    items: new Set(),       // layerId đang là item
    picked: [],             // thứ tự chọn
    lastClicked: -1,
    rows: [],               // layer chính đang hiện trên list, theo thứ tự
    roots: [],
    busy: false,
    // bản đồ xem trước
    imgs: new Map(),        // layerId -> <img>
    hit: null,              // Uint16Array, id+1 của layer trên cùng tại mỗi pixel preview
    view: { x: 0, y: 0, z: 1 },
    autoFit: true,
    hoverId: -1,
    drag: null,
};

exports.methods = {
    // ------------------------------------------------------------ status

    showStatus(text, level) {
        const el = this.$.status;
        el.classList.remove('hidden', 'ok', 'error');
        if (level) el.classList.add(level);
        el.textContent = text;
    },

    setProgress(done, total, text) {
        this.$.progress.classList.remove('hidden');
        this.$.bar.style.width = total ? `${Math.round((done / total) * 100)}%` : '100%';
        this.$.progressText.textContent = text || '';
    },

    hideProgress() {
        this.$.progress.classList.add('hidden');
    },

    /** main.js gửi qua message "progress". */
    onProgress(data) {
        if (!data) return;
        const label = { scan: 'Quét', export: 'Xuất', import: 'Import', build: 'Dựng' }[data.phase] || '';
        this.setProgress(data.done || 0, data.total || 0, `${label}: ${data.text || ''}`);
    },

    setBusy(b) {
        state.busy = b;
        for (const k of ['scan', 'create', 'exportOnly', 'pickPsd']) {
            if (b) this.$[k].setAttribute('disabled', '');
            else this.$[k].removeAttribute('disabled');
        }
    },

    // ------------------------------------------------------------ prefs / options

    readOptions() {
        return {
            scale: Number(this.$.scale.value) || 1,
            skipHidden: this.$.skipHidden.checked,
            attachToItems: this.$.attach.checked,
            order: this.$.order.value,
            autoSave: this.$.autoSave.checked,
        };
    },

    persist() {
        const o = this.readOptions();
        savePrefs({
            psdPath: this.$.psdPath.value.trim(), scale: o.scale, skipHidden: o.skipHidden,
            attach: o.attachToItems, order: o.order, autoSave: o.autoSave, dim: this.$.dim.checked,
        });
    },

    // ------------------------------------------------------------ roots

    async reloadRoots(preferUuid) {
        const res = await Editor.Message.request(PKG, 'list-roots').catch((e) => ({ ok: false, error: e.message, roots: [] }));
        const keep = preferUuid || this.$.root.value;
        state.roots = (res && res.roots) || [];
        this.renderRoots(keep);
        if (res && !res.ok && res.error) this.showStatus(res.error, 'error');
    },

    renderRoots(selectUuid) {
        const sel = this.$.root;
        sel.innerHTML = state.roots.length
            ? state.roots.map((r) => `<option value="${esc(r.uuid)}">${esc(r.name)}${r.isRoom ? ' (phòng)' : ''} — ${r.childCount} con — ${esc(r.path)}</option>`).join('')
            : '<option value="">(không có node SceneBuilder — chọn node rồi bấm "Node đang chọn")</option>';
        if (selectUuid && state.roots.some((r) => r.uuid === selectUuid)) sel.value = selectUuid;
    },

    async useSelected() {
        const info = await Editor.Message.request(PKG, 'selected-root').catch(() => null);
        if (!info) { this.showStatus('Chưa chọn node nào trong Hierarchy.', 'error'); return; }
        if (!state.roots.some((r) => r.uuid === info.uuid)) state.roots.unshift({ ...info, isRoom: false });
        this.renderRoots(info.uuid);
    },

    // ------------------------------------------------------------ scan

    async pickPsd() {
        const p = await Editor.Message.request(PKG, 'pick-psd');
        if (!p) return;
        this.$.psdPath.value = p;
        this.persist();
        await this.scan();
    },

    async scan() {
        const psdPath = this.$.psdPath.value.trim();
        if (!psdPath) { this.showStatus('Chưa chọn file PSD.', 'error'); return; }
        this.persist();
        this.setBusy(true);
        this.setProgress(0, 0, 'Đang đọc PSD (lần đầu có thể mất ~15s)...');
        try {
            const res = await Editor.Message.request(PKG, 'scan', psdPath);
            if (!res.ok) { this.showStatus(res.error, 'error'); return; }
            this.applyManifest(res.manifest, res.saved && res.saved[0]);
            this.$.cacheInfo.textContent = `${res.manifest.psd.width}×${res.manifest.psd.height} · ${res.manifest.layers.length} layer${res.cached ? ' · từ cache' : ''}`;
        } finally {
            this.hideProgress();
            this.setBusy(false);
        }
    },

    applyManifest(manifest, saved) {
        state.manifest = manifest;
        state.byId = new Map(manifest.layers.map((l) => [l.id, l]));
        state.items.clear();
        state.picked = [];
        state.lastClicked = -1;

        let restored = '';
        if (saved) {
            this.$.levelName.value = saved.levelName || '';
            this.$.outUrl.value = saved.outUrl || '';
            const o = saved.options || {};
            if (o.scale) this.$.scale.value = o.scale;
            if (o.skipHidden !== undefined) this.$.skipHidden.checked = o.skipHidden;
            if (o.attachToItems !== undefined) this.$.attach.checked = o.attachToItems;
            if (o.order) this.$.order.value = o.order;
            // khớp item theo tên (PSD sửa thêm/bớt layer thì id đổi), trùng tên thì lấy order gần nhất
            const lost = [];
            for (const it of saved.items || []) {
                const cands = manifest.layers.filter((l) => l.name === it.name && !l.empty);
                if (!cands.length) { lost.push(it.name); continue; }
                cands.sort((a, b) => Math.abs(a.order - it.order) - Math.abs(b.order - it.order));
                this.setItem(cands[0].id, true);
            }
            restored = `Đã khôi phục ${state.items.size} item từ lần tạo trước (${saved.savedAt || ''}).`
                + (lost.length ? `\n⚠ Không còn layer: ${lost.join(', ')}` : '');
        } else {
            const level = defaultLevelName(manifest.psd.name);
            this.$.levelName.value = level;
            this.$.outUrl.value = `db://assets/3.Sprites/${level}`;
            // group tên "Items" trong PSD -> chọn sẵn
            for (const l of manifest.layers) {
                if (!l.empty && /(^|\/)items?$/i.test(l.group)) this.setItem(l.id, true);
            }
        }
        this.relink();
        this.buildStage();
        this.refresh();
        this.showStatus(restored || 'Click vào đồ vật trên bản đồ (hoặc tick ở danh sách) để chọn item chơi được, rồi bấm Tạo map.', restored ? 'ok' : '');
    },

    relink() {
        const m = state.manifest;
        state.links = new Map();
        state.childrenOf = new Map();
        if (!m) return;
        if (this.$.attach.checked) state.links = linkAttachments(m.layers.filter((l) => !l.empty));
        for (const [id, link] of state.links) {
            if (!state.childrenOf.has(link.ownerId)) state.childrenOf.set(link.ownerId, []);
            state.childrenOf.get(link.ownerId).push({ id, role: link.role });
        }
        // layer phụ không được là item
        for (const id of [...state.items]) if (state.links.has(id)) this.setItem(id, false);
    },

    isSkipped(l) {
        return !l || l.empty || (this.$.skipHidden.checked && l.hidden);
    },

    /** Layer phụ -> layer chính của nó; layer chính -> chính nó. */
    ownerOf(id) {
        const link = state.links.get(id);
        return link ? link.ownerId : id;
    },

    setItem(id, on) {
        if (on) {
            if (!state.items.has(id)) { state.items.add(id); state.picked.push(id); }
        } else {
            state.items.delete(id);
            state.picked = state.picked.filter((x) => x !== id);
        }
    },

    toggleItem(id) {
        const l = state.byId.get(id);
        if (this.isSkipped(l) || state.links.has(id)) return false;
        this.setItem(id, !state.items.has(id));
        return true;
    },

    itemOrder() {
        const m = state.manifest;
        if (!m) return [];
        const mode = this.$.order.value;
        if (mode === 'picked') return state.picked.filter((id) => state.items.has(id));
        const ids = [...state.items].sort((a, b) => state.byId.get(a).order - state.byId.get(b).order);
        return mode === 'topDown' ? ids.reverse() : ids;
    },

    /** Vẽ lại mọi thứ phụ thuộc vào lựa chọn item. */
    refresh() {
        this.renderList();
        this.updateStage();
    },

    // ------------------------------------------------------------ bản đồ xem trước

    buildStage() {
        const m = state.manifest;
        const world = this.$.world;
        world.innerHTML = '';
        state.imgs.clear();
        state.hit = null;
        if (!m || !m.preview) {
            this.$.stageEmpty.classList.remove('hidden');
            this.$.stageEmpty.innerHTML = 'Cache cũ không có ảnh xem trước — bấm <b>Quét</b> lại.';
            return;
        }
        this.$.stageEmpty.classList.add('hidden');
        world.style.width = `${m.preview.width}px`;
        world.style.height = `${m.preview.height}px`;

        const stamp = m.psd.mtimeMs | 0;
        const frag = document.createDocumentFragment();
        for (const l of m.layers) {
            if (!l.prev) continue;
            const img = document.createElement('img');
            img.src = `${fileUrl(path.join(m.cacheDir, 'prev', `${l.key}.png`))}?v=${stamp}`;
            img.style.left = `${l.prev.x}px`;
            img.style.top = `${l.prev.y}px`;
            img.style.width = `${l.prev.w}px`;
            img.style.height = `${l.prev.h}px`;
            if ((l.opacity ?? 1) < 1) img.style.opacity = String(l.opacity);
            frag.appendChild(img);
            state.imgs.set(l.id, img);
        }
        const shade = document.createElement('div');
        shade.className = 'shade';
        frag.appendChild(shade);
        world.appendChild(frag);

        try {
            const buf = fs.readFileSync(path.join(m.cacheDir, 'hitmap.bin'));
            state.hit = new Uint16Array(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.length));
        } catch (e) {
            state.hit = null;
        }
        state.autoFit = true;
        this.fit();
    },

    /** Đồng bộ class của ảnh preview theo item đang chọn / layer ẩn / hover. */
    updateStage() {
        if (!state.manifest) return;
        const hovOwner = state.hoverId;
        for (const [id, img] of state.imgs) {
            const l = state.byId.get(id);
            const owner = this.ownerOf(id);
            const isOwner = owner === id;
            const selected = state.items.has(owner);
            img.classList.toggle('off', this.isSkipped(l));
            img.classList.toggle('sel', selected && isOwner);
            img.classList.toggle('selKid', selected && !isOwner);
            img.classList.toggle('hov', owner === hovOwner && isOwner);
        }
        this.$.world.classList.toggle('dim', this.$.dim.checked);
    },

    applyView() {
        const v = state.view;
        this.$.world.style.transform = `translate(${v.x}px, ${v.y}px) scale(${v.z})`;
        this.$.world.style.setProperty('--g', `${(2.5 / v.z).toFixed(2)}px`);
        const m = state.manifest;
        // % theo kích thước PSD thật (preview đã thu nhỏ m.preview.scale)
        this.$.zoomLabel.textContent = m && m.preview ? `${Math.round(v.z * m.preview.scale * 100)}%` : '';
    },

    fit() {
        const m = state.manifest;
        if (!m || !m.preview) return;
        const r = this.$.stage.getBoundingClientRect();
        if (r.width < 10 || r.height < 10) return;
        const z = Math.min(r.width / m.preview.width, r.height / m.preview.height) * 0.97;
        state.view = { z, x: (r.width - m.preview.width * z) / 2, y: (r.height - m.preview.height * z) / 2 };
        this.applyView();
    },

    zoomAt(px, py, factor) {
        const v = state.view;
        const z = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, v.z * factor));
        const k = z / v.z;
        state.view = { z, x: px - (px - v.x) * k, y: py - (py - v.y) * k };
        state.autoFit = false;
        this.applyView();
    },

    /** Zoom tới 1 layer (double-click dòng trong list). */
    focusLayer(id) {
        const l = state.byId.get(id);
        if (!l || !l.prev) return;
        const r = this.$.stage.getBoundingClientRect();
        const z = Math.min(MAX_ZOOM, Math.min(r.width / l.prev.w, r.height / l.prev.h) * 0.45);
        state.view = { z, x: r.width / 2 - (l.prev.x + l.prev.w / 2) * z, y: r.height / 2 - (l.prev.y + l.prev.h / 2) * z };
        state.autoFit = false;
        this.applyView();
    },

    /** Layer chính (đang hiện, không bị bỏ qua) dưới con trỏ, hoặc -1. */
    hitTest(clientX, clientY) {
        const m = state.manifest;
        if (!m || !state.hit) return -1;
        const r = this.$.stage.getBoundingClientRect();
        const v = state.view;
        const x = Math.floor((clientX - r.left - v.x) / v.z);
        const y = Math.floor((clientY - r.top - v.y) / v.z);
        if (x < 0 || y < 0 || x >= m.preview.width || y >= m.preview.height) return -1;
        const raw = state.hit[y * m.preview.width + x];
        if (!raw) return -1;
        const owner = this.ownerOf(raw - 1);
        return this.isSkipped(state.byId.get(owner)) ? -1 : owner;
    },

    setHover(id, clientX, clientY) {
        const tip = this.$.tip;
        if (id !== state.hoverId) {
            state.hoverId = id;
            this.updateStage();
            for (const el of this.$.list.querySelectorAll('.layer.hov')) el.classList.remove('hov');
            const row = this.$.list.querySelector(`.layer[data-id="${id}"]`);
            if (row) row.classList.add('hov');
        }
        if (id < 0 || clientX === undefined) { tip.classList.add('hidden'); return; }
        const l = state.byId.get(id);
        const n = this.itemOrder().indexOf(id);
        tip.innerHTML = `${esc(l.name)} ${n >= 0 ? `<b>· item #${n + 1}</b>` : '<span style="opacity:.7">· click để chọn</span>'}`;
        const r = this.$.stage.getBoundingClientRect();
        tip.style.left = `${Math.min(clientX - r.left + 14, r.width - tip.offsetWidth - 4)}px`;
        tip.style.top = `${Math.max(4, clientY - r.top - 28)}px`;
        tip.classList.remove('hidden');
    },

    onStagePointerDown(e) {
        if (e.button !== 0 && e.button !== 1) return;
        try { this.$.stage.setPointerCapture(e.pointerId); } catch (err) { /* pointer giả lập */ }
        state.drag = { x: e.clientX, y: e.clientY, vx: state.view.x, vy: state.view.y, moved: false, button: e.button };
    },

    onStagePointerMove(e) {
        const d = state.drag;
        if (d) {
            const dx = e.clientX - d.x, dy = e.clientY - d.y;
            if (!d.moved && Math.hypot(dx, dy) > 4) {
                d.moved = true;
                this.$.stage.classList.add('panning');
                this.setHover(-1);
            }
            if (d.moved) {
                state.view.x = d.vx + dx;
                state.view.y = d.vy + dy;
                state.autoFit = false;
                this.applyView();
                return;
            }
        }
        if (this._hoverRaf) return;
        const cx = e.clientX, cy = e.clientY;
        this._hoverRaf = requestAnimationFrame(() => {
            this._hoverRaf = 0;
            this.setHover(this.hitTest(cx, cy), cx, cy);
        });
    },

    onStagePointerUp(e) {
        const d = state.drag;
        state.drag = null;
        this.$.stage.classList.remove('panning');
        if (!d || d.moved || d.button !== 0) return;
        const id = this.hitTest(e.clientX, e.clientY);
        if (id < 0 || !this.toggleItem(id)) return;
        this.refresh();
        this.setHover(id, e.clientX, e.clientY);
        this.revealRow(id);
    },

    onStageWheel(e) {
        e.preventDefault();
        const r = this.$.stage.getBoundingClientRect();
        this.zoomAt(e.clientX - r.left, e.clientY - r.top, Math.exp(-e.deltaY * 0.0015));
    },

    // ------------------------------------------------------------ list

    visibleLayers() {
        const m = state.manifest;
        if (!m) return [];
        const q = this.$.filter.value.trim().toLowerCase();
        const show = this.$.show.value;
        const out = [];
        // như Photoshop: layer trên cùng ở đầu; layer phụ gộp vào dòng layer chính
        for (const l of [...m.layers].reverse()) {
            if (state.links.has(l.id) || l.empty) continue;
            const kids = (state.childrenOf.get(l.id) || []).map((c) => state.byId.get(c.id));
            const hay = [l.name, l.group, ...kids.map((k) => k.name)].join(' ').toLowerCase();
            if (q && !hay.includes(q)) continue;
            const isItem = state.items.has(l.id);
            if (show === 'items' && !isItem) continue;
            if (show === 'rest' && isItem) continue;
            out.push(l);
        }
        if (show === 'items') {
            const order = this.itemOrder();
            out.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
        }
        return out;
    },

    renderList() {
        const m = state.manifest;
        if (!m) return;
        state.rows = this.visibleLayers();
        const order = this.itemOrder();
        const indexOf = new Map(order.map((id, i) => [id, i + 1]));
        const stamp = m.psd.mtimeMs | 0;
        const top = this.$.list.scrollTop;

        const html = state.rows.map((l, rowIndex) => {
            const isItem = state.items.has(l.id);
            const skipped = this.isSkipped(l);
            const cls = ['layer'];
            if (isItem) cls.push('item');
            if (l.hidden) cls.push('hiddenLayer');
            if (skipped) cls.push('skipped');
            if (l.id === state.hoverId) cls.push('hov');

            const badges = [];
            const kids = state.childrenOf.get(l.id) || [];
            if (kids.length) {
                const names = kids.map((k) => `${ROLE_LABEL[k.role]}: ${state.byId.get(k.id).name}`).join('\n');
                badges.push(`<span class="badge child" title="${esc(names)}">+${[...new Set(kids.map((k) => ROLE_LABEL[k.role]))].join(', ')}</span>`);
            }
            if (l.hidden) badges.push('<span class="badge">ẩn</span>');
            if ((l.opacity ?? 1) < 1) badges.push(`<span class="badge">${Math.round(l.opacity * 100)}%</span>`);
            for (const w of l.warnings || []) badges.push(`<span class="badge warn" title="${esc(w)}">⚠ ${esc(w.length > 22 ? `${w.slice(0, 20)}…` : w)}</span>`);

            const thumb = `<img class="thumb" loading="lazy" src="${fileUrl(path.join(m.cacheDir, 'thumb', `${l.key}.png`))}?v=${stamp}">`;
            return `<div class="${cls.join(' ')}" data-row="${rowIndex}" data-id="${l.id}" title="${esc(l.name)}${l.group ? `\nGroup: ${esc(l.group)}` : ''}\n${l.width}×${l.height}px">
                <input type="checkbox" ${isItem ? 'checked' : ''} ${skipped ? 'disabled' : ''}>${thumb}
                <div class="info">
                    <span class="name">${esc(l.name)}</span>
                    <span class="meta"><span>${l.width}×${l.height}</span>${badges.join('')}</span>
                </div>
                <span class="itemNo">${isItem ? `#${indexOf.get(l.id)}` : ''}</span>
            </div>`;
        }).join('');

        this.$.list.innerHTML = html || '<div class="empty">Không có layer nào khớp bộ lọc.</div>';
        this.$.list.scrollTop = top;
        const usable = m.layers.filter((l) => !this.isSkipped(l) && !state.links.has(l.id)).length;
        this.$.count.innerHTML = `<b>${state.items.size}</b> item / ${usable} layer`;
    },

    /** Cuộn tới dòng của layer trong list và nháy sáng. */
    revealRow(id) {
        const row = this.$.list.querySelector(`.layer[data-id="${id}"]`);
        if (!row) return;
        row.scrollIntoView({ block: 'nearest' });
        row.classList.remove('flash');
        void row.offsetWidth;
        row.classList.add('flash');
    },

    onListClick(event) {
        const rowEl = event.target.closest('.layer');
        if (!rowEl) return;
        const index = Number(rowEl.dataset.row);
        const l = state.rows[index];
        if (!l || this.isSkipped(l)) return;
        const on = !state.items.has(l.id);

        if (event.shiftKey && state.lastClicked >= 0) {
            const [a, b] = [Math.min(state.lastClicked, index), Math.max(state.lastClicked, index)];
            for (let i = a; i <= b; i++) {
                const r = state.rows[i];
                if (r && !this.isSkipped(r)) this.setItem(r.id, on);
            }
        } else {
            this.setItem(l.id, on);
        }
        state.lastClicked = index;
        this.refresh();
    },

    onListHover(event) {
        const rowEl = event.target.closest('.layer');
        const id = rowEl ? Number(rowEl.dataset.id) : -1;
        if (id !== state.hoverId) {
            state.hoverId = id;
            this.updateStage();
        }
    },

    bulk(on) {
        if (!state.manifest) return;
        if (on) {
            for (const l of state.rows) if (!this.isSkipped(l)) this.setItem(l.id, true);
        } else {
            state.items.clear();
            state.picked = [];
        }
        this.refresh();
    },

    // ------------------------------------------------------------ create

    async create(buildScene) {
        if (state.busy) return;
        if (!state.manifest) { this.showStatus('Chưa quét PSD.', 'error'); return; }
        const items = this.itemOrder().filter((id) => !this.isSkipped(state.byId.get(id)));
        if (buildScene && items.length === 0) {
            const ok = await Editor.Dialog.warn('Chưa chọn item nào — map sẽ chỉ có phòng, không có gì để kéo. Vẫn tạo?', { buttons: ['Tạo', 'Huỷ'], cancel: 1 });
            if (ok.response !== 0) return;
        }
        const rootUuid = this.$.root.value;
        if (buildScene) {
            const root = state.roots.find((r) => r.uuid === rootUuid);
            if (root && root.childCount > 0) {
                const ok = await Editor.Dialog.warn(`Node gốc "${root.path}" đang có ${root.childCount} node con — SceneBuilder sẽ XOÁ hết rồi dựng lại map. Tiếp tục?`, { buttons: ['Dựng lại', 'Huỷ'], cancel: 1 });
                if (ok.response !== 0) return;
            }
        }
        this.persist();
        this.setBusy(true);
        this.setProgress(0, 0, 'Bắt đầu...');
        try {
            const opts = this.readOptions();
            const res = await Editor.Message.request(PKG, 'create-map', {
                psdPath: this.$.psdPath.value.trim(),
                outUrl: this.$.outUrl.value.trim(),
                levelName: this.$.levelName.value.trim(),
                rootUuid,
                items,
                options: { ...opts, buildScene },
            });
            const text = [...(res.report || []), ...(res.ok ? [] : [`✖ ${res.error}`])].join('\n');
            this.showStatus(text, res.ok ? 'ok' : 'error');
            if (res.ok && buildScene) await this.reloadRoots(rootUuid);
        } catch (e) {
            this.showStatus(e.message, 'error');
        } finally {
            this.hideProgress();
            this.setBusy(false);
        }
    },
};

exports.ready = async function () {
    const p = loadPrefs();
    this.$.psdPath.value = p.psdPath;
    this.$.scale.value = p.scale;
    this.$.skipHidden.checked = p.skipHidden;
    this.$.attach.checked = p.attach;
    this.$.order.value = p.order;
    this.$.autoSave.checked = p.autoSave;
    this.$.dim.checked = p.dim;

    this.$.pickPsd.addEventListener('confirm', () => this.pickPsd());
    this.$.scan.addEventListener('confirm', () => this.scan());
    this.$.psdPath.addEventListener('keydown', (e) => { if (e.key === 'Enter') this.scan(); });
    this.$.useSelected.addEventListener('confirm', () => this.useSelected());
    this.$.reloadRoots.addEventListener('confirm', () => this.reloadRoots());
    this.$.filter.addEventListener('input', () => this.renderList());
    this.$.show.addEventListener('change', () => this.renderList());
    this.$.order.addEventListener('change', () => { this.persist(); this.renderList(); });
    this.$.skipHidden.addEventListener('change', () => { this.persist(); this.refresh(); });
    this.$.attach.addEventListener('change', () => { this.persist(); this.relink(); this.refresh(); });
    this.$.dim.addEventListener('change', () => { this.persist(); this.updateStage(); });
    for (const k of ['scale', 'autoSave']) this.$[k].addEventListener('change', () => this.persist());
    this.$.checkVisible.addEventListener('confirm', () => this.bulk(true));
    this.$.uncheckAll.addEventListener('confirm', () => this.bulk(false));
    this.$.list.addEventListener('click', (e) => this.onListClick(e));
    this.$.list.addEventListener('dblclick', (e) => {
        const row = e.target.closest('.layer');
        if (row) this.focusLayer(Number(row.dataset.id));
    });
    this.$.list.addEventListener('mouseover', (e) => this.onListHover(e));
    this.$.list.addEventListener('mouseleave', () => { state.hoverId = -1; this.updateStage(); });
    this.$.exportOnly.addEventListener('confirm', () => this.create(false));
    this.$.create.addEventListener('confirm', () => this.create(true));

    const stage = this.$.stage;
    this.$.fit.addEventListener('confirm', () => { state.autoFit = true; this.fit(); });
    stage.addEventListener('pointerdown', (e) => this.onStagePointerDown(e));
    stage.addEventListener('pointermove', (e) => this.onStagePointerMove(e));
    stage.addEventListener('pointerup', (e) => this.onStagePointerUp(e));
    stage.addEventListener('pointerleave', () => { if (!state.drag) this.setHover(-1); });
    stage.addEventListener('wheel', (e) => this.onStageWheel(e), { passive: false });
    this._resizeObs = new ResizeObserver(() => { if (state.autoFit) this.fit(); });
    this._resizeObs.observe(stage);

    await this.reloadRoots();
    if (p.psdPath && fs.existsSync(p.psdPath)) await this.scan();
};

exports.close = function () {
    if (this._resizeObs) this._resizeObs.disconnect();
};
