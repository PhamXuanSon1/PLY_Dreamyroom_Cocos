System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, _dec, _dec2, _class, _class2, _descriptor, _crd, ccclass, property, SeatHandler;

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
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "c7853c7kjJNkKe43RIAgbDr", "SeatHandler", undefined);
      /**
       * SeatHandler — port từ Assets/_GAME/Script/Utils/SeatHandler.cs (Unity)
       *
       * Khác bản Unity: dùng cờ `isPlaced` thay vì đo khoảng cách < 0.1.
       * Bản Unity kiểm tra Vector3.Distance(item, targetPoint) < 0.1 nên nếu item
       * vô tình nằm gần đích (chưa ghép) thì vẫn tính là đã đặt — bug #7 mục 10.3.
       */


      __checkObsolete__(['_decorator', 'Component', 'Node']);

      ({
        ccclass,
        property
      } = _decorator);
      /**
       * Khai báo kiểu Node chứ không phải ItemController: SeatHandler và ItemController
       * import lẫn nhau, mà @property được đánh giá NGAY LÚC NẠP MODULE — dùng
       * [ItemController] ở đây sẽ nhận undefined nếu module kia chưa nạp xong.
       * Lấy component ở runtime là an toàn.
       */

      _export("SeatHandler", SeatHandler = (_dec = ccclass('SeatHandler'), _dec2 = property({
        type: [Node],
        tooltip: 'Các item bắt buộc phải được ghép xong thì item này mới đặt được.'
      }), _dec(_class = (_class2 = class SeatHandler extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "requiredItems", _descriptor, this);
        }

        canPlace() {
          if (!this.requiredItems || this.requiredItems.length === 0) return true;

          for (var node of this.requiredItems) {
            if (!node || !node.isValid) continue; // import động để không tạo phụ thuộc vòng lúc nạp module

            var item = node.getComponent('ItemController');
            if (!item) continue;
            if (!item.targetPoint) continue;
            if (!item.isPlaced) return false;
          }

          return true;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "requiredItems", [_dec2], {
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
//# sourceMappingURL=5a3e339d1f3585249e0db84b118b1ab315d23a71.js.map