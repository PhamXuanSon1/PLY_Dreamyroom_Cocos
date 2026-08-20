System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, color, _crd, ccclass, property;

  /**
   * Get the color of a pixel from a sprite frame.
   * @param {SpriteFrame} spriteFrame - The sprite frame.
   * @param {number} px - The x position of the pixel, normalized between 0 and 1.
   * @param {number} py - The y position of the pixel, normalized between 0 and 1.
   * @returns {Color} The color of the pixel.
   */
  function getColorFromImage(spriteFrame, px, py) {
    let sr = spriteFrame.texture;
    let h = sr.height;
    let w = sr.width;
    let image = sr.image;
    let refData = readImagePixels(image);
    let x = px * w | 0;
    let y = py * h | 0;
    return getPixel(x, y, w, refData);
  }

  function getPixel(x, y, width, refData) {
    let i = (y * width + x) * 4;
    return color(refData[i], refData[i + 1], refData[i + 2], refData[i + 3]);
  }

  function readImagePixels(image) {
    if (image.isCompressed) return null;
    const src = image.data;
    if (!src) return null;

    if (src instanceof Uint8Array || src instanceof Uint8ClampedArray) {
      return null;
    }

    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(src, 0, 0);
    return ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  }

  function findNearestColor(target, palette) {
    let bestIndex = -1;
    let bestDist = Infinity;

    for (let i = 0; i < palette.length; i++) {
      const c = palette[i];
      const dr = target.r - c.r;
      const dg = target.g - c.g;
      const db = target.b - c.b;
      const dist = dr * dr + dg * dg + db * db;

      if (dist < bestDist) {
        bestDist = dist;
        bestIndex = i;
      }
    }

    return {
      color: palette[bestIndex],
      index: bestIndex,
      distance: Math.sqrt(bestDist)
    };
  }

  _export({
    getColorFromImage: getColorFromImage,
    getPixel: getPixel,
    readImagePixels: readImagePixels,
    findNearestColor: findNearestColor
  });

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      color = _cc.color;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "d5e27nF7P5A56dI9chxQUKf", "ReadImagePixel", undefined);

      __checkObsolete__(['_decorator', 'Color', 'color', 'ImageAsset', 'SpriteFrame', 'Texture2D']);

      ({
        ccclass,
        property
      } = _decorator);

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=ad04c105bc1e0c00d7d638a092db6c5aead05b0e.js.map