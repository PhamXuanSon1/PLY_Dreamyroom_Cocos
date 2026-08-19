System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, lerp, Mask, Size, Sprite, UITransform, v2, v3, Vec2, Vec3, PoolMember, World, Ulis, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _crd, ccclass, property, executeInEditMode, Black;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfPoolMember(extras) {
    _reporterNs.report("PoolMember", "../Pool/PoolMember", _context.meta, extras);
  }

  function _reportPossibleCrUseOfWorld(extras) {
    _reporterNs.report("World", "db://assets/7.Scripts/Manager/World", _context.meta, extras);
  }

  function _reportPossibleCrUseOfUlis(extras) {
    _reporterNs.report("Ulis", "./Ulis", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      lerp = _cc.lerp;
      Mask = _cc.Mask;
      Size = _cc.Size;
      Sprite = _cc.Sprite;
      UITransform = _cc.UITransform;
      v2 = _cc.v2;
      v3 = _cc.v3;
      Vec2 = _cc.Vec2;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      PoolMember = _unresolved_2.PoolMember;
    }, function (_unresolved_3) {
      World = _unresolved_3.World;
    }, function (_unresolved_4) {
      Ulis = _unresolved_4.default;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "26245Xkg6pJer4V7wIyg250", "Black", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Graphics', 'lerp', 'Mask', 'Node', 'Size', 'Sprite', 'UITransform', 'v2', 'v3', 'Vec2', 'Vec3']);

      ({
        ccclass,
        property,
        executeInEditMode
      } = _decorator);

      _export("Black", Black = (_dec = ccclass('Black'), _dec2 = property(Mask), _dec3 = property([Vec3]), _dec4 = property(Sprite), _dec5 = property(Size), _dec6 = property({
        slide: true,
        range: [0, 360, 1]
      }), _dec7 = property({
        slide: true,
        range: [0, 1, 0.01]
      }), _dec8 = property({
        slide: true,
        range: [0, 1, 0.01]
      }), _dec9 = property({
        slide: true,
        range: [0, 1, 0.01]
      }), _dec(_class = (_class2 = class Black extends (_crd && PoolMember === void 0 ? (_reportPossibleCrUseOfPoolMember({
        error: Error()
      }), PoolMember) : PoolMember) {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "mask", _descriptor, this);

          this.stencil = null;

          _initializerDefineProperty(this, "points", _descriptor2, this);

          _initializerDefineProperty(this, "sprite", _descriptor3, this);

          this.isRevert = false;

          _initializerDefineProperty(this, "size", _descriptor4, this);

          this.diagonal = 0;

          _initializerDefineProperty(this, "rotation", _descriptor5, this);

          _initializerDefineProperty(this, "fill", _descriptor6, this);

          _initializerDefineProperty(this, "begin", _descriptor7, this);

          _initializerDefineProperty(this, "end", _descriptor8, this);

          this.map = new Map();
        }

        despawn() {
          this.init();
          (_crd && World === void 0 ? (_reportPossibleCrUseOfWorld({
            error: Error()
          }), World) : World).ins.poolManager.despawn(this);
        }

        setMask(points = null) {
          if (points.length == 0) return;

          if (this.isRevert) {
            this.mask.inverted = true;

            if (this.fill > 0.5) {
              let dF = 1 - this.fill;
              let d = 1 - 2 * dF;
              this.sprite.node.position = v3(0, this.diagonal * d, 0);
            } else {
              let dF = 1 - this.fill;
              let d = this.fill - dF;
              this.sprite.node.position = v3(0, this.diagonal * d, 0);
            }
          }

          let mask = this.mask;
          this.stencil = mask._graphics;
          this.stencil.clear();
          this.stencil.moveTo(points[0].x, points[0].y);
          points.forEach((point, i) => {
            // if( i == points.length / 2 ) {
            //     let c = v3(points[i - 1].x + point.x, points[i - 1].y + point.y, 0).multiplyScalar(0.5);
            //     this.stencil.quadraticCurveTo(c.x, c.y - 10, point.x, point.y);
            // } else {
            //     this.stencil.lineTo(point.x, point.y);
            // }
            this.stencil.lineTo(point.x, point.y);
          });
          this.stencil.lineTo(points[0].x, points[0].y);
          this.stencil.fill();
          this.points = points;
        }

        init() {
          let mask = this.mask;
          this.stencil = mask._graphics;
          this.stencil.clear();
          let stencil = this.stencil;
          stencil._isDrawing = true;
        }

        addSprite(sprite = this.sprite, rotation = this.rotation) {
          this.sprite = sprite;
          const dRot = sprite.node.worldRotation.clone();
          this.node.eulerAngles = v3(0, 0, rotation);
          (_crd && Ulis === void 0 ? (_reportPossibleCrUseOfUlis({
            error: Error()
          }), Ulis) : Ulis).addToParent(sprite.node, this.mask.node);
          sprite.node.worldRotation = dRot;
          sprite.node.scale = v3(1, 1, 1);
          this.size = sprite.node.getComponent(UITransform).contentSize;
          this.map.set("rotation", rotation);
          this.rotation = rotation;
        }

        setFill(begin = this.begin, end = this.end, ratio = this.fill) {
          this.begin = begin;
          this.end = end;
          this.fill = ratio;
          let r = lerp(begin, end, ratio);
          let bl = v2(-1, -1);
          let br = v2(1, -1);
          let tr = v2(1, 1);
          let tl = v2(-1, 1);
          let leftLerp = Vec2.lerp(v2(), bl, tl, r);
          let rightLerp = Vec2.lerp(v2(), br, tr, r);
          let p = [bl, br, rightLerp, leftLerp];
          this.diagonal = Vec2.distance(v2(), v2(this.size.x, this.size.y));
          this.diagonal *= this.sprite.node.scale.x;
          let points = p.map(pt => {
            return v3(pt.x * this.diagonal / 2, pt.y * this.diagonal / 2, 0);
          }); // if(this.isRevert) 

          {
            let bl3 = v3(points[0].x, points[0].y - this.diagonal, 0);
            let br3 = v3(points[1].x, points[1].y - this.diagonal, 0);
            points[0] = bl3;
            points[1] = br3;
          }
          this.setMask(points);
          this.map.set("fill", r);
        }

        start() {// this.init();
          // this.addSprite();
          // this.setFill(0, 1, this.fill);
        }

        update(deltaTime) {
          this.map.forEach((value, key) => {
            if (this[key] != value) {
              this.map.set(key, this[key]);

              if (key == "fill") {
                this.setFill(this.begin, this.end, this.fill);
              }

              if (key == "rotation") {
                this.addSprite(this.sprite, this.rotation);
              }
            }
          });
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "mask", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "points", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "sprite", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "size", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return new Size(100, 100);
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "rotation", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 45;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "fill", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.5;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "begin", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.5;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "end", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.5;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=7e5d3b66dbec073820bf11cd3ab999642efe1ffb.js.map