System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Material, SpriteFrame, SpriteRenderer, Texture2D, World, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _class3, _crd, ccclass, property, SkinManager;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfWorld(extras) {
    _reporterNs.report("World", "db://assets/7.Scripts/Manager/World", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Material = _cc.Material;
      SpriteFrame = _cc.SpriteFrame;
      SpriteRenderer = _cc.SpriteRenderer;
      Texture2D = _cc.Texture2D;
    }, function (_unresolved_2) {
      World = _unresolved_2.World;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "4e71cQotCdDDL+cLVZZsV9t", "SkinManager", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Material', 'Node', 'SpriteFrame', 'SpriteRenderer', 'Texture2D']);

      ({
        ccclass,
        property
      } = _decorator); // @ccclass class SpriteFramePair {
      //     @property(SpriteFrame)
      //     public spriteFrame: SpriteFrame = null;
      //     @property(SpriteFrame)
      //     public skin: SpriteFrame = null;
      // }

      _export("SkinManager", SkinManager = (_dec = ccclass('SkinManager'), _dec2 = property([Material]), _dec3 = property([Texture2D]), _dec4 = property([SpriteFrame]), _dec5 = property([SpriteFrame]), _dec6 = property([SpriteRenderer]), _dec(_class = (_class2 = (_class3 = class SkinManager extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "materials", _descriptor, this);

          _initializerDefineProperty(this, "matSkins", _descriptor2, this);

          _initializerDefineProperty(this, "frames", _descriptor3, this);

          _initializerDefineProperty(this, "skins", _descriptor4, this);

          _initializerDefineProperty(this, "sprites", _descriptor5, this);
        }

        static get ins() {
          return this.instance;
        }

        changeMat() {
          this.materials.forEach((mat, i) => {
            mat.setProperty("emissiveMap", this.matSkins[i]);
            mat.setProperty("emissiveScaleMap", this.matSkins[i]);
          });
        }

        changeSpriteRenderer(renderer) {
          return this.skins[this.frames.indexOf(renderer.spriteFrame)];
        }

        changeSkin() {
          this.changeMat();
          this.sprites.forEach((sprite, i) => {
            sprite.spriteFrame = this.skins[this.frames.indexOf(sprite.spriteFrame)];
          });
          (_crd && World === void 0 ? (_reportPossibleCrUseOfWorld({
            error: Error()
          }), World) : World).ins.camera.changeColor();
        }

        start() {
          SkinManager.instance = this;
        }

        update(deltaTime) {}

      }, _class3.instance = null, _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "materials", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "matSkins", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "frames", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "skins", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "sprites", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=31de1db432446a7192962bba19c378b981c24cda.js.map