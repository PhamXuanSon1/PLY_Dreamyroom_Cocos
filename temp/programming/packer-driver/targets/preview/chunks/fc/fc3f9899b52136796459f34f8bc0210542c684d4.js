System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, color, Component, Material, v3, Vec3, colors, _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _crd, ccclass, property, Mats;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function AdjustSaturation(color, sat) {
    var gray = Vec3.dot(color, v3(0.299, 0.587, 0.114)); // return mix(vec3(gray), color, sat);

    return Vec3.lerp(v3(), v3(gray, gray, gray), color, sat);
  }

  function _reportPossibleCrUseOfcolors(extras) {
    _reporterNs.report("colors", "../Gameplay/Data", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      color = _cc.color;
      Component = _cc.Component;
      Material = _cc.Material;
      v3 = _cc.v3;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      colors = _unresolved_2.colors;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "cf9951s/FxMhKPe9KRUl+vA", "Mats", undefined);

      __checkObsolete__(['_decorator', 'Color', 'color', 'Component', 'Material', 'Node', 'v3', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("Mats", Mats = (_dec = ccclass('Mats'), _dec2 = property([Material]), _dec3 = property({
        slide: true,
        range: [-254, 254],
        step: 1
      }), _dec4 = property({
        slide: true,
        range: [-10, 10],
        step: 1
      }), _dec(_class = (_class2 = class Mats extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "mats", _descriptor, this);

          _initializerDefineProperty(this, "dark", _descriptor2, this);

          _initializerDefineProperty(this, "sat", _descriptor3, this);

          this._on = false;
        }

        get on() {
          return this._on;
        }

        set on(v) {
          // this._on = v;
          this.changeColor();
        }

        changeColor() {
          console.log("set color to mats");
          this.mats.forEach((m, i) => {
            var c = (_crd && colors === void 0 ? (_reportPossibleCrUseOfcolors({
              error: Error()
            }), colors) : colors)[i].clone();
            c.r += this.dark;
            c.g += this.dark;
            c.b += this.dark;
            this.sat = 1;
            var satColor = AdjustSaturation(v3(c.r / 255, c.g / 255, c.b / 255), this.sat).multiplyScalar(255);
            c = color(satColor.x, satColor.y, satColor.z, 255);
            m.setProperty("mainColor", c);
            var a = (_crd && colors === void 0 ? (_reportPossibleCrUseOfcolors({
              error: Error()
            }), colors) : colors)[i].clone();
            var dt = 150;
            if (a.r > dt) a.r -= dt;else a.r = 20;
            if (a.g > dt) a.g -= dt;else a.g = 20;
            if (a.b > dt) a.b -= dt;else a.b = 20;
            m.setProperty("baseColor", a);
          });
        }

        start() {}

        update(deltaTime) {}

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "mats", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "dark", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "sat", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1.5;
        }
      }), _applyDecoratedDescriptor(_class2.prototype, "on", [property], Object.getOwnPropertyDescriptor(_class2.prototype, "on"), _class2.prototype)), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=fc3f9899b52136796459f34f8bc0210542c684d4.js.map