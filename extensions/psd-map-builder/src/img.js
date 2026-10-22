'use strict';
/** Xử lý ảnh dùng chung cho psd-worker và export-worker (pngjs, không cần canvas). */

const { PNG } = require('pngjs');

const THUMB_SIZE = 72;
/** Cạnh dài nhất của ảnh xem trước cả map trong panel. */
const PREVIEW_SIZE = 1600;
/** Alpha tối thiểu để 1 pixel preview tính là "trúng" layer khi click. */
const HIT_ALPHA = 40;

/** Thumbnail vừa ô THUMB_SIZE. */
function thumb(png) {
    const k = Math.min(1, THUMB_SIZE / Math.max(png.width, png.height));
    return resize(png, Math.max(1, Math.round(png.width * k)), Math.max(1, Math.round(png.height * k)));
}

/** Thu nhỏ kiểu box-sample (lấy tối đa 4×4 mẫu mỗi ô, trộn theo alpha). */
function resize(png, w, h) {
    const out = new PNG({ width: w, height: h });
    const sx = png.width / w, sy = png.height / h;
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const x0 = Math.floor(x * sx), x1 = Math.max(x0 + 1, Math.floor((x + 1) * sx));
            const y0 = Math.floor(y * sy), y1 = Math.max(y0 + 1, Math.floor((y + 1) * sy));
            let r = 0, g = 0, b = 0, a = 0, n = 0;
            for (let v = y0; v < y1; v += Math.max(1, ((y1 - y0) / 4) | 0)) {
                for (let u = x0; u < x1; u += Math.max(1, ((x1 - x0) / 4) | 0)) {
                    const i = (v * png.width + u) * 4;
                    const al = png.data[i + 3];
                    r += png.data[i] * al; g += png.data[i + 1] * al; b += png.data[i + 2] * al; a += al; n++;
                }
            }
            const o = (y * w + x) * 4;
            if (a > 0) { out.data[o] = r / a; out.data[o + 1] = g / a; out.data[o + 2] = b / a; }
            out.data[o + 3] = a / n;
        }
    }
    return out;
}

/** Lật ảnh theo trục X / Y (sprite flipX / flipY). */
function flip(png, fx, fy) {
    if (!fx && !fy) return png;
    const out = new PNG({ width: png.width, height: png.height });
    for (let y = 0; y < png.height; y++) {
        for (let x = 0; x < png.width; x++) {
            const sx = fx ? png.width - 1 - x : x, sy = fy ? png.height - 1 - y : y;
            png.data.copy(out.data, (y * png.width + x) * 4, (sy * png.width + sx) * 4, (sy * png.width + sx) * 4 + 4);
        }
    }
    return out;
}

module.exports = { THUMB_SIZE, PREVIEW_SIZE, HIT_ALPHA, thumb, resize, flip };
