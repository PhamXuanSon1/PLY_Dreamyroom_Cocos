'use strict';
/**
 * PSD Map Builder — entry của Editor (browser process).
 *
 *   scan       : chạy src/psd-worker.js (tiến trình con) -> PNG + thumbnail + manifest trong temp/
 *   createMap  : chép PNG layer dùng tới vào thư mục asset, ghi <Level>.json (schema SceneBuilder)
 *                + <Level>.psdmap.json (lựa chọn item, để mở lại sửa tiếp), refresh asset-db,
 *                rồi gọi scene.js dựng node + nối ItemManager / tool pipeline.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { fork } = require('child_process');
const { buildSceneJson } = require('./src/scene-json');

const PKG = 'psd-map-builder';
const SELECTION_EXT = '.psdmap.json';

let scanning = null;    // child process đang chạy

function log(msg) { console.log(`[${PKG}] ${msg}`); }

function projectPath(...p) { return path.join(Editor.Project.path, ...p); }

function cacheDirOf(psdPath) {
    const h = crypto.createHash('md5').update(path.resolve(psdPath).toLowerCase()).digest('hex').slice(0, 12);
    return projectPath('temp', PKG, h);
}

/** db://assets/a/b -> <project>/assets/a/b */
function urlToPath(url) {
    const m = /^db:\/\/assets\/?(.*)$/.exec(String(url).replace(/\\/g, '/').trim());
    if (!m) throw new Error(`Thư mục xuất phải bắt đầu bằng db://assets/ (đang là "${url}")`);
    return projectPath('assets', ...m[1].split('/').filter(Boolean));
}

function progress(data) {
    try { Editor.Message.send(PKG, 'progress', data); } catch (e) { /* panel đóng */ }
}

function sceneScript(method, ...args) {
    return Editor.Message.request('scene', 'execute-scene-script', { name: PKG, method, args });
}

// ---------------------------------------------------------------- scan

function runWorker(psdPath, cacheDir) {
    return new Promise((resolve, reject) => {
        if (scanning) { try { scanning.kill(); } catch (e) { /* đã thoát */ } }
        const child = fork(path.join(__dirname, 'src', 'psd-worker.js'), [psdPath, cacheDir], {
            env: { ...process.env, ELECTRON_RUN_AS_NODE: '1' },
            execArgv: ['--max-old-space-size=8192'],
            stdio: ['ignore', 'ignore', 'pipe', 'ipc'],
        });
        scanning = child;
        let stderr = '', result = null;
        child.stderr.on('data', (d) => { stderr += d; });
        child.on('message', (msg) => {
            if (msg.type === 'progress') progress({ phase: 'scan', ...msg });
            else result = msg;
        });
        child.on('exit', (code) => {
            if (scanning === child) scanning = null;
            if (result && result.type === 'done') resolve(result);
            else reject(new Error((result && result.message) || stderr.trim() || `worker thoát với mã ${code}`));
        });
    });
}

/** Tìm file lựa chọn đã lưu của PSD này trong assets (để mở lại tiếp tục chỉnh). */
function findSavedSelections(psdPath) {
    const target = path.resolve(psdPath).toLowerCase();
    const base = path.basename(psdPath).toLowerCase();
    const out = [];
    const walkDir = (dir, depth) => {
        if (depth > 6) return;
        let entries = [];
        try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch (e) { return; }
        for (const e of entries) {
            const p = path.join(dir, e.name);
            if (e.isDirectory()) walkDir(p, depth + 1);
            else if (e.name.endsWith(SELECTION_EXT)) {
                try {
                    const s = JSON.parse(fs.readFileSync(p, 'utf8'));
                    const sp = String(s.psdPath || '');
                    if (path.resolve(sp).toLowerCase() === target || path.basename(sp).toLowerCase() === base) {
                        out.push({ file: p, mtimeMs: fs.statSync(p).mtimeMs, selection: s });
                    }
                } catch (err) { /* bỏ qua file hỏng */ }
            }
        }
    };
    walkDir(projectPath('assets'), 0);
    out.sort((a, b) => b.mtimeMs - a.mtimeMs);
    return out.map((o) => o.selection);
}

async function scan(psdPath) {
    if (!psdPath || !fs.existsSync(psdPath)) return { ok: false, error: `Không thấy file PSD: ${psdPath}` };
    try {
        const t = Date.now();
        const res = await runWorker(psdPath, cacheDirOf(psdPath));
        log(`Quét ${path.basename(psdPath)}: ${res.manifest.layers.length} layer (${res.cached ? 'cache' : `${Date.now() - t}ms`})`);
        return { ok: true, manifest: res.manifest, cached: !!res.cached, saved: findSavedSelections(psdPath) };
    } catch (e) {
        return { ok: false, error: e.message };
    }
}

function cancelScan() {
    if (scanning) { scanning.kill(); scanning = null; return true; }
    return false;
}

// ---------------------------------------------------------------- create map

function sameFile(a, b) {
    try {
        const sa = fs.statSync(a), sb = fs.statSync(b);
        return sa.size === sb.size && fs.readFileSync(a).equals(fs.readFileSync(b));
    } catch (e) { return false; }
}

/** Meta tối thiểu để Creator import PNG thành sprite-frame ngay (không phải texture). Chỉ ghi khi chưa có meta -> uuid giữ nguyên qua các lần cập nhật. */
function writeSpriteMeta(pngPath) {
    const metaPath = `${pngPath}.meta`;
    if (fs.existsSync(metaPath)) return false;
    const meta = {
        ver: '1.0.27',
        importer: 'image',
        imported: false,
        uuid: crypto.randomUUID(),
        files: [],
        subMetas: {},
        userData: { type: 'sprite-frame', hasAlpha: true, fixAlphaTransparencyArtifacts: false },
    };
    fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2));
    return true;
}

/** PNG đã có meta kiểu texture (do import tay trước đó) -> đổi sang sprite-frame. */
async function ensureSpriteFrameType(urls) {
    let fixed = 0;
    for (const url of urls) {
        const meta = await Editor.Message.request('asset-db', 'query-asset-meta', url).catch(() => null);
        if (!meta || !meta.userData || meta.userData.type === 'sprite-frame') continue;
        meta.userData.type = 'sprite-frame';
        await Editor.Message.request('asset-db', 'save-asset-meta', url, JSON.stringify(meta)).catch(() => null);
        fixed++;
    }
    return fixed;
}

/**
 * payload: { psdPath, outUrl, levelName, rootUuid, items: [layerId], options: { scale, skipHidden, attachToItems, autoSave, buildScene } }
 */
async function createMap(payload) {
    const report = [];
    try {
        const { psdPath, levelName, rootUuid } = payload;
        const opts = payload.options || {};
        const outUrl = String(payload.outUrl || '').replace(/\\/g, '/').replace(/\/+$/, '');
        if (!levelName) throw new Error('Chưa đặt tên level.');
        const cacheDir = cacheDirOf(psdPath);
        const manifestPath = path.join(cacheDir, 'manifest.json');
        if (!fs.existsSync(manifestPath)) throw new Error('Chưa quét PSD (bấm Quét trước).');
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

        progress({ phase: 'export', text: 'Sinh JSON...' });
        const built = buildSceneJson(manifest, { items: payload.items }, { ...opts, levelName });

        // 1. ảnh
        const outDir = urlToPath(outUrl);
        fs.mkdirSync(outDir, { recursive: true });
        let copied = 0, metas = 0;
        built.usedKeys.forEach((key, i) => {
            const src = path.join(cacheDir, 'png', `${key}.png`);
            const dst = path.join(outDir, `${key}.png`);
            if (i % 20 === 0) progress({ phase: 'export', done: i, total: built.usedKeys.length, text: key });
            if (!sameFile(src, dst)) { fs.copyFileSync(src, dst); copied++; }
            if (writeSpriteMeta(dst)) metas++;
        });
        report.push(`Ảnh: ${built.usedKeys.length} layer (${copied} file mới/đổi) -> ${outUrl}`);

        // 2. JSON scene + lựa chọn
        const jsonFile = path.join(outDir, `${levelName}.json`);
        fs.writeFileSync(jsonFile, JSON.stringify(built.json));
        const byId = new Map(manifest.layers.map((l) => [l.id, l]));
        const selection = {
            tool: PKG,
            psdPath,
            levelName,
            outUrl,
            items: built.items.map((it) => ({ name: it.name, order: byId.get(it.layerId).order })),
            options: opts,
            savedAt: new Date().toISOString(),
        };
        fs.writeFileSync(path.join(outDir, `${levelName}${SELECTION_EXT}`), JSON.stringify(selection, null, 2));
        report.push(`JSON: ${levelName}.json (${built.json.nodes.length} node, ${built.items.length} item)`);

        // 3. import
        progress({ phase: 'import', text: 'Đang import vào asset-db...' });
        await Editor.Message.request('asset-db', 'refresh-asset', outUrl);
        const fixed = await ensureSpriteFrameType(built.usedKeys.map((k) => `${outUrl}/${k}.png`));
        if (fixed) report.push(`Đổi ${fixed} ảnh sang kiểu sprite-frame`);
        const jsonUuid = await Editor.Message.request('asset-db', 'query-uuid', `${outUrl}/${levelName}.json`);

        if (opts.buildScene === false) {
            return { ok: true, report, jsonUrl: `${outUrl}/${levelName}.json` };
        }
        if (!rootUuid) throw new Error('Chưa chọn node gốc trong scene (node có SceneBuilder, vd "Scale").');

        // 4. dựng trong scene + nối ItemManager / tool
        progress({ phase: 'build', text: 'SceneBuilder đang dựng node...' });
        const res = await sceneScript('buildLevel', {
            rootUuid,
            jsonUuid,
            data: built.json,
            spriteDir: outUrl.replace(/^db:\/\/assets\//, ''),
            items: built.items,
            paths: built.paths,
        });
        if (!res || !res.ok) throw new Error((res && res.error) || 'Dựng scene lỗi (xem Console).');
        report.push(`Dựng ${res.builtNodes} node dưới ${res.root}`);
        report.push(...res.log);
        if (res.linked.length) report.push(`Đã nối: ${res.linked.join(', ')}`);
        else report.push('⚠ Không thấy ItemManager / tool nào trong scene để nối.');

        if (opts.autoSave) {
            await Editor.Message.request('scene', 'save-scene');
            report.push('Đã lưu scene.');
        } else {
            report.push('Nhấn Ctrl+S để lưu scene.');
        }
        return { ok: true, report, result: res, metas };
    } catch (e) {
        console.error(`[${PKG}]`, e);
        return { ok: false, error: e.message, report };
    }
}

// ---------------------------------------------------------------- misc

async function pickPsd() {
    const r = await Editor.Dialog.select({
        title: 'Chọn file PSD',
        type: 'file',
        filters: [{ name: 'Photoshop', extensions: ['psd', 'psb'] }],
    });
    return (r && !r.canceled && r.filePaths && r.filePaths[0]) || '';
}

async function listRoots() {
    try { return await sceneScript('listRoots'); } catch (e) { return { ok: false, roots: [], error: e.message }; }
}

async function selectedRoot() {
    const uuid = Editor.Selection.getLastSelected('node');
    if (!uuid) return null;
    try { return await sceneScript('nodeInfo', uuid); } catch (e) { return null; }
}

exports.methods = {
    openPanel() { Editor.Panel.open(PKG); },
    pickPsd,
    scan,
    cancelScan,
    createMap,
    listRoots,
    selectedRoot,
    cacheDir(psdPath) { return cacheDirOf(psdPath); },
};

exports.load = function () {};
exports.unload = function () { cancelScan(); };
