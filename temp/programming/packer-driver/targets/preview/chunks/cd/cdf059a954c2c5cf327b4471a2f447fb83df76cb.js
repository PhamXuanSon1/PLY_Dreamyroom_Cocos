System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Vec3, tween, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _crd, ccclass, property, HolderSlot;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Node = _cc.Node;
      Vec3 = _cc.Vec3;
      tween = _cc.tween;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "5a2b1JxbqJAH5K/oYIC5WGI", "HolderSlot", undefined);
      /**
       * HolderSlot — port từ Assets/_GAME/Script/Utils/HolderSlot.cs (Unity)
       *
       * ⚠ Bên Unity `itemInSlot.position` trả về COPY. Cocos `node.worldPosition` trả về
       *   REFERENCE dùng chung -> phải .clone(), nếu không bobbing sẽ trôi dần.
       *   Xem COCOS_MIGRATION_PLAN.md mục 4.2.
       */


      __checkObsolete__(['_decorator', 'Component', 'Node', 'Vec3', 'tween', 'Tween']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("HolderSlot", HolderSlot = (_dec = ccclass('HolderSlot'), _dec2 = property({
        tooltip: 'Slot này đang trống hay đã có item.'
      }), _dec3 = property({
        type: Node,
        tooltip: 'Vị trí neo gốc của slot.'
      }), _dec4 = property({
        type: Node,
        tooltip: 'Item hiện đang nằm trong slot.'
      }), _dec5 = property({
        tooltip: 'Khoảng cách nhấp nhô lên xuống (px).'
      }), _dec6 = property({
        tooltip: 'Thời gian 1 chu kỳ nhấp nhô (giây).'
      }), _dec(_class = (_class2 = class HolderSlot extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "isEmpty", _descriptor, this);

          _initializerDefineProperty(this, "originPosition", _descriptor2, this);

          _initializerDefineProperty(this, "itemInSlot", _descriptor3, this);

          _initializerDefineProperty(this, "bobbingDistance", _descriptor4, this);

          _initializerDefineProperty(this, "bobbingDuration", _descriptor5, this);

          this.bobbing = null;
        }

        start() {
          if (!this.originPosition) this.originPosition = this.node;
        }

        lockSlot() {
          this.isEmpty = false;
        }

        setItem(item) {
          this.itemInSlot = item;
          this.isEmpty = false;
          this.startBobbingAnimation();
        }

        clearSlot() {
          this.stopBobbingAnimation();
          this.itemInSlot = null;
          this.isEmpty = true;
        }

        startBobbingAnimation() {
          var item = this.itemInSlot;
          if (!item || !item.isValid) return;
          this.stopBobbingAnimation(); // .clone() BẮT BUỘC — xem ghi chú đầu file

          var startPos = item.worldPosition.clone();
          var upPos = new Vec3(startPos.x, startPos.y + this.bobbingDistance, startPos.z);
          var half = this.bobbingDuration / 2;
          this.bobbing = tween(item).repeatForever(tween(item).to(half, {
            worldPosition: upPos
          }, {
            easing: 'sineInOut'
          }).to(half, {
            worldPosition: startPos
          }, {
            easing: 'sineInOut'
          })).start();
        }

        stopBobbingAnimation() {
          if (this.bobbing) {
            this.bobbing.stop();
            this.bobbing = null;
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "isEmpty", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "originPosition", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "itemInSlot", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "bobbingDistance", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 30;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "bobbingDuration", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1.5;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=cdf059a954c2c5cf327b4471a2f447fb83df76cb.js.map