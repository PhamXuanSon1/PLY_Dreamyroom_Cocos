System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Sprite, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _crd, ccclass, property, OpenItem;

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
      Sprite = _cc.Sprite;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "d19dcNnb31CvrVbchBj6hrv", "OpenItem", undefined);
      /**
       * OpenItem — port từ Assets/_GAME/Script/Item/OpenItem.cs (Unity)
       *
       * KHÁC bản Unity: bỏ Update() poll khoảng cách mỗi frame (bug #2 mục 10.3),
       * ItemController gọi thẳng onItemPlaced() khi ghép xong.
       */


      __checkObsolete__(['_decorator', 'Component', 'Node', 'Sprite']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("OpenItem", OpenItem = (_dec = ccclass('OpenItem'), _dec2 = property({
        type: [Node],
        tooltip: 'Object ĐƯỢC BẬT khi item vào đúng đích.'
      }), _dec3 = property({
        type: [Node],
        tooltip: 'Object BỊ TẮT khi item vào đúng đích.'
      }), _dec(_class = (_class2 = class OpenItem extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "open", _descriptor, this);

          _initializerDefineProperty(this, "close", _descriptor2, this);

          this.isOpened = false;
        }

        /** ItemController gọi khi item đã ghép xong. */
        onItemPlaced() {
          if (this.isOpened) return;
          this.isOpened = true; // Unity: xoá sprite của chính item đi

          const sr = this.getComponent(Sprite);
          if (sr) sr.spriteFrame = null;

          for (const n of this.open) if (n != null && n.isValid) n.active = true;

          for (const n of this.close) if (n != null && n.isValid) n.active = false;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "open", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "close", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=bf2fd9b3e2c784410f83de7354a341bca4daadbe.js.map