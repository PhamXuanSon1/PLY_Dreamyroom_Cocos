System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, BoxController, BoxGraphic, BoxState, _dec, _dec2, _class, _class2, _descriptor, _class3, _crd, ccclass, property, BoxManager;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfBoxController(extras) {
    _reporterNs.report("BoxController", "../box/BoxController", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBoxGraphic(extras) {
    _reporterNs.report("BoxGraphic", "../box/BoxGraphic", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBoxState(extras) {
    _reporterNs.report("BoxState", "../box/BoxGraphic", _context.meta, extras);
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
      Node = _cc.Node;
    }, function (_unresolved_2) {
      BoxController = _unresolved_2.BoxController;
    }, function (_unresolved_3) {
      BoxGraphic = _unresolved_3.BoxGraphic;
      BoxState = _unresolved_3.BoxState;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "a6ea43aOlxAz6bFfiu6QFfx", "BoxManager", undefined);
      /** BoxManager — port từ Assets/_GAME/Script/Manager/BoxManager.cs (Unity) */


      __checkObsolete__(['_decorator', 'Component', 'Node']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("BoxManager", BoxManager = (_dec = ccclass('BoxManager'), _dec2 = property({
        type: Node,
        tooltip: 'Object chiếc hộp trong scene.'
      }), _dec(_class = (_class2 = (_class3 = class BoxManager extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "box", _descriptor, this);

          this.boxController = null;
          this.boxGraphic = null;

          /** Đảm bảo animation kết thúc chỉ chạy đúng 1 lần. */
          this.isBoxHandled = false;
        }

        onLoad() {
          BoxManager.instance = this;

          if (this.box) {
            this.boxController = this.box.getComponent(_crd && BoxController === void 0 ? (_reportPossibleCrUseOfBoxController({
              error: Error()
            }), BoxController) : BoxController);
            this.boxGraphic = this.box.getComponent(_crd && BoxGraphic === void 0 ? (_reportPossibleCrUseOfBoxGraphic({
              error: Error()
            }), BoxGraphic) : BoxGraphic);
          }
        }

        onDestroy() {
          if (BoxManager.instance === this) BoxManager.instance = null;
        }
        /** Unity: HandleEmptyItems — hết item thì mở hộp rồi 2s sau bay đi. */


        handleEmptyItems() {
          if (this.isBoxHandled || !this.boxGraphic) return;
          this.isBoxHandled = true;
          this.boxGraphic.changeState((_crd && BoxState === void 0 ? (_reportPossibleCrUseOfBoxState({
            error: Error()
          }), BoxState) : BoxState).Opened);
          this.scheduleOnce(() => {
            var _this$boxController;

            return (_this$boxController = this.boxController) == null ? void 0 : _this$boxController.goToEndPos();
          }, 2);
        }

      }, _class3.instance = null, _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "box", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=f37b5d73a6885defb492fdb99a3ad80ef935a4ee.js.map