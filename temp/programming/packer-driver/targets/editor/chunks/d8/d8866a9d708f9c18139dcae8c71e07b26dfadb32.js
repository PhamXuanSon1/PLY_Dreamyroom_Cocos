System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Sprite, _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _class3, _crd, ccclass, property, ChangeLight;

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

      _cclegacy._RF.push({}, "cfeacqKL0ZCsJOaAI01erwu", "ChangeLight", undefined);
      /**
       * ChangeLight — port từ Assets/_GAME/Script/Utils/ChangeLight.cs (Unity)
       *
       * KHÁC bản Unity: bỏ Update() poll mỗi frame VÀ thêm cờ isChanged.
       * Bản Unity thiếu cờ chặn nên gọi Change() lại mỗi frame sau khi thoả điều kiện
       * (bug #1 mục 10.3).
       */


      __checkObsolete__(['_decorator', 'Component', 'Node', 'Sprite']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("ChangeLight", ChangeLight = (_dec = ccclass('ChangeLight'), _dec2 = property({
        type: Node,
        tooltip: 'Ảnh sáng dùng để thay thế khi đủ điều kiện.'
      }), _dec3 = property({
        type: Node,
        tooltip: 'Item thứ 1 cần ghép xong.'
      }), _dec4 = property({
        type: Node,
        tooltip: 'Item thứ 2 cần ghép xong.'
      }), _dec(_class = (_class2 = (_class3 = class ChangeLight extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "Img2", _descriptor, this);

          _initializerDefineProperty(this, "Item1", _descriptor2, this);

          _initializerDefineProperty(this, "Item2", _descriptor3, this);

          this.isChanged = false;
        }

        static notifyItemPlaced() {
          for (const c of ChangeLight.all) {
            if (c && c.isValid) c.onAnyItemPlaced();
          }
        }

        onEnable() {
          if (ChangeLight.all.indexOf(this) < 0) ChangeLight.all.push(this);
        }

        onDisable() {
          const i = ChangeLight.all.indexOf(this);
          if (i >= 0) ChangeLight.all.splice(i, 1);
        }

        /** ItemController gọi mỗi khi có item bất kỳ được ghép xong. */
        onAnyItemPlaced() {
          var _this$Item, _this$Item2;

          if (this.isChanged) return;
          const a = (_this$Item = this.Item1) == null ? void 0 : _this$Item.getComponent('ItemController');
          const b = (_this$Item2 = this.Item2) == null ? void 0 : _this$Item2.getComponent('ItemController');
          if (!a || !b) return;
          if (!a.isPlaced || !b.isPlaced) return;
          this.change();
          this.isChanged = true;
        }

        change() {
          var _this$Img;

          const dst = this.getComponent(Sprite);
          const src = (_this$Img = this.Img2) == null ? void 0 : _this$Img.getComponent(Sprite);
          if (dst && src) dst.spriteFrame = src.spriteFrame;
        }

      }, _class3.all = [], _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "Img2", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "Item1", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "Item2", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=d8866a9d708f9c18139dcae8c71e07b26dfadb32.js.map