/**
 * ShadowReuseTool — bớt ảnh phải tải lúc load game.
 *
 * Ảnh bóng "<tên>_sd.png" xuất từ Unity phần lớn chỉ là hình của "<tên>.png" tô đen, alpha ~70.
 * Mỗi ảnh riêng như vậy tốn thêm 1 texture + 6-7 request ở Preview và 1 lần giải nén ảnh ở bản build.
 * Tool so pixel từng cặp: bóng nào đúng là "ảnh gốc tô đen" thì cho Sprite bóng dùng luôn SpriteFrame
 * của ảnh gốc + màu (0, 0, 0, độ đậm của bóng). Bóng có hình khác ảnh gốc (vd ghế chỉ có bóng chân,
 * bóng chậu cây là hình elip nhỏ) thì giữ nguyên.
 *
 * Cách dùng (trong Editor):
 *   1. Gắn component này vào 1 node bất kỳ (hoặc để SceneBuilder tự gọi sau khi Build).
 *   2. (Tuỳ chọn) kéo node gốc cần quét vào `root` — để trống = cả scene.
 *   3. Tick "Preview" để xem danh sách ở Console, tick "Apply" để đổi, rồi Ctrl+S.
 */

import { _decorator, Component, Node, Sprite, SpriteFrame, Color, assetManager, director } from 'cc';
import { EDITOR } from 'cc/env';

const { ccclass, property, executeInEditMode, menu } = _decorator;

const Ed: any = (globalThis as any).Editor;
const TAG = '[ShadowReuse]';
const SHADOW_RE = /_sd$/i;

/** Ngưỡng so ảnh: alpha bóng ≈ alpha ảnh gốc * k/255, màu bóng gần đen. */
export interface ShadowReuseOptions {
    /** Sai lệch alpha trung bình tối đa (0-255) giữa bóng thật và ảnh gốc tô đen. */
    maxMeanAlphaError: number;
    /** 99.5% điểm ảnh phải sai lệch alpha dưới mức này. */
    maxP995AlphaError: number;
    /** Màu trung bình (RGB) của bóng phải tối hơn mức này. */
    maxShadowRgb: number;
}

const DEFAULTS: ShadowReuseOptions = { maxMeanAlphaError: 1.5, maxP995AlphaError: 20, maxShadowRgb: 25 };

interface Match { main: SpriteFrame; alpha: number; mae: number }

@ccclass('ShadowReuseTool')
@executeInEditMode(true)
@menu('Pipeline/ShadowReuseTool')
export class ShadowReuseTool extends Component {

    @property({ type: Node, tooltip: 'Node gốc cần quét. Để trống = cả scene.' })
    root: Node | null = null;

    @property({ tooltip: 'Sai lệch alpha trung bình tối đa (0-255) giữa bóng thật và ảnh gốc tô đen.' })
    maxMeanAlphaError = DEFAULTS.maxMeanAlphaError;

    @property({ tooltip: 'Tick để IN danh sách bóng đổi được / không đổi được ra Console (không sửa gì).' })
    get preview(): boolean { return false; }
    set preview(v: boolean) { if (v) void ShadowReuseTool.run(this.root ?? director.getScene(), false, this.opts()); }

    @property({ tooltip: 'Tick để ĐỔI các Sprite bóng sang ảnh gốc tô đen. Xong nhấn Ctrl+S.' })
    get apply(): boolean { return false; }
    set apply(v: boolean) { if (v) void ShadowReuseTool.run(this.root ?? director.getScene(), true, this.opts()); }

    /** db:// thư mục -> (tên file lowercase -> uuid SpriteFrame), làm mới mỗi lần run(). */
    private static dirCache = new Map<string, Map<string, string>>();

    private opts(): ShadowReuseOptions {
        return { ...DEFAULTS, maxMeanAlphaError: this.maxMeanAlphaError };
    }

    // ======================================================== core

    /** Quét `root`, so từng ảnh bóng với ảnh gốc; apply = true thì đổi Sprite. Trả số Sprite đã đổi. */
    static async run(root: Node | null, apply: boolean, opts: ShadowReuseOptions = DEFAULTS): Promise<number> {
        if (!EDITOR || !Ed) { console.warn(`${TAG} Chỉ chạy trong Editor.`); return 0; }
        if (!root) return 0;
        ShadowReuseTool.dirCache.clear();

        const sprites = root.getComponentsInChildren(Sprite)
            .filter((s) => s.spriteFrame && SHADOW_RE.test(s.spriteFrame.name));
        if (sprites.length === 0) { console.log(`${TAG} Không có Sprite bóng (_sd) nào.`); return 0; }

        // Mỗi ảnh bóng chỉ so 1 lần dù nhiều node dùng chung
        const results = new Map<string, Match | string>();   // uuid frame bóng -> match | lý do bỏ qua
        for (const s of sprites) {
            const sd = s.spriteFrame!;
            if (results.has(sd.uuid)) continue;
            results.set(sd.uuid, await ShadowReuseTool.check(sd, opts));
        }

        let changed = 0;
        const skipped: string[] = [];
        for (const s of sprites) {
            const r = results.get(s.spriteFrame!.uuid)!;
            if (typeof r === 'string') { skipped.push(`${s.spriteFrame!.name}: ${r}`); continue; }
            if (apply) {
                s.spriteFrame = r.main;
                s.color = new Color(0, 0, 0, r.alpha);
            }
            changed++;
        }

        const okFrames = [...results.values()].filter((r) => typeof r !== 'string').length;
        console.log(`${TAG} ${apply ? 'Đã đổi' : 'Đổi được'} ${changed}/${sprites.length} Sprite bóng`
            + ` (${okFrames}/${results.size} ảnh _sd -> không cần tải nữa).`);
        const uniqueSkipped = [...new Set(skipped)];
        if (uniqueSkipped.length) console.log(`${TAG} Giữ nguyên ${uniqueSkipped.length} ảnh:\n   ${uniqueSkipped.join('\n   ')}`);
        if (apply && changed > 0) {
            try { Ed.Message.send('scene', 'snapshot'); } catch { /* để Ctrl+Z được */ }
            console.log(`${TAG} Nhấn Ctrl+S để lưu scene.`);
        }
        return changed;
    }

    /** So ảnh bóng với ảnh gốc cùng thư mục. Trả Match hoặc lý do không đổi được. */
    private static async check(sd: SpriteFrame, opts: ShadowReuseOptions): Promise<Match | string> {
        const main = await ShadowReuseTool.findMainFrame(sd);
        if (!main) return 'không thấy ảnh gốc';

        const a = ShadowReuseTool.pixels(sd);
        const b = ShadowReuseTool.pixels(main);
        if (!a || !b) return 'không đọc được pixel';
        if (a.width !== b.width || a.height !== b.height) return `khác kích thước (${a.width}x${a.height} vs ${b.width}x${b.height})`;

        // Độ đậm của bóng = alpha phân vị 95% trong vùng có hình
        const hist = new Uint32Array(256);
        let rgbSum = 0, inside = 0;
        for (let i = 0; i < a.data.length; i += 4) {
            const al = a.data[i + 3];
            if (al <= 8) continue;
            hist[al]++; inside++;
            rgbSum += (a.data[i] + a.data[i + 1] + a.data[i + 2]) / 3;
        }
        if (inside === 0) return 'ảnh bóng trống';
        const k = ShadowReuseTool.percentile(hist, inside, 0.95);
        const rgb = rgbSum / inside;
        if (rgb > opts.maxShadowRgb) return `bóng không phải màu đen (RGB ~${rgb.toFixed(0)})`;

        // Bóng dự đoán = alpha ảnh gốc * k/255 -> so với bóng thật
        const errHist = new Uint32Array(256);
        let errSum = 0;
        const n = a.width * a.height;
        for (let i = 0; i < a.data.length; i += 4) {
            const e = Math.min(255, Math.round(Math.abs(b.data[i + 3] * k / 255 - a.data[i + 3])));
            errHist[e]++; errSum += e;
        }
        const mae = errSum / n;
        const p995 = ShadowReuseTool.percentile(errHist, n, 0.995);
        if (mae > opts.maxMeanAlphaError || p995 > opts.maxP995AlphaError) {
            return `hình bóng khác ảnh gốc (sai lệch TB ${mae.toFixed(2)}, p99.5 ${p995})`;
        }
        return { main, alpha: k, mae };
    }

    private static percentile(hist: Uint32Array, total: number, p: number): number {
        const target = total * p;
        let acc = 0;
        for (let v = 0; v < hist.length; v++) { acc += hist[v]; if (acc >= target) return v; }
        return hist.length - 1;
    }

    /** "<thư mục>/<tên>_sd.png" -> SpriteFrame của "<thư mục>/<tên>.png" (không phân biệt hoa/thường). */
    private static async findMainFrame(sd: SpriteFrame): Promise<SpriteFrame | null> {
        const imageUuid = sd.uuid.split('@')[0];
        const info = await Ed.Message.request('asset-db', 'query-asset-info', imageUuid);
        const url: string | undefined = info?.url;
        if (!url) return null;
        const dir = url.substring(0, url.lastIndexOf('/'));
        const mainName = url.substring(url.lastIndexOf('/') + 1).replace(/_sd(\.[^.]+)$/i, '$1').toLowerCase();

        // asset-db: "dir/*" không trả gì, phải "dir/**/*" rồi tự lọc đúng thư mục. Cache theo thư mục.
        let frames = ShadowReuseTool.dirCache.get(dir);
        if (!frames) {
            const all: any[] = await Ed.Message.request('asset-db', 'query-assets',
                { pattern: `${dir}/**/*`, ccType: 'cc.SpriteFrame' }) ?? [];
            frames = new Map();
            for (const i of all) {
                const file = String(i.url ?? '').replace(/\/spriteFrame$/i, '');   // ".../<tên>.png"
                const slash = file.lastIndexOf('/');
                if (file.substring(0, slash) === dir) frames.set(file.substring(slash + 1).toLowerCase(), i.uuid);
            }
            ShadowReuseTool.dirCache.set(dir, frames);
        }
        const hit = frames.has(mainName) ? { uuid: frames.get(mainName)! } : null;
        if (!hit) return null;
        return new Promise((resolve) => {
            assetManager.loadAny({ uuid: hit.uuid }, (err: Error | null, asset: SpriteFrame) => resolve(err ? null : asset));
        });
    }

    /** Đọc RGBA của cả ảnh gốc (không trim) bằng canvas. */
    private static pixels(frame: SpriteFrame): ImageData | null {
        const img: any = (frame.texture as any)?.image;
        const src = img?.data;
        if (!src || !img.width || !img.height) return null;
        const cv = document.createElement('canvas');
        cv.width = img.width; cv.height = img.height;
        const ctx = cv.getContext('2d', { willReadFrequently: true } as any) as CanvasRenderingContext2D | null;
        if (!ctx) return null;
        ctx.drawImage(src, 0, 0);
        return ctx.getImageData(0, 0, cv.width, cv.height);
    }
}
