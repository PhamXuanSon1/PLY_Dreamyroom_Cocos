System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Vec3, math, TweenUtil, _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _crd, ccclass, property, BallFollowFill;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfTweenUtil(extras) {
    _reporterNs.report("TweenUtil", "../core/TweenUtil", _context.meta, extras);
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
      Vec3 = _cc.Vec3;
      math = _cc.math;
    }, function (_unresolved_2) {
      TweenUtil = _unresolved_2.TweenUtil;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "2806fOTaCRD+pCoBEkOykrl", "BallFollowFill", undefined);
      /** BallFollowFill — port từ Assets/_GAME/Script/Utils/BallFollowFill.cs (Unity) */


      __checkObsolete__(['_decorator', 'Component', 'Node', 'Vec3', 'math']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("BallFollowFill", BallFollowFill = (_dec = ccclass('BallFollowFill'), _dec2 = property({
        type: Node,
        tooltip: 'Icon tròn chạy theo thanh tiến trình.'
      }), _dec3 = property({
        type: Node,
        tooltip: 'Mốc trái của thanh (0%).'
      }), _dec4 = property({
        type: Node,
        tooltip: 'Mốc phải của thanh (100%).'
      }), _dec(_class = (_class2 = class BallFollowFill extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "ballIcon", _descriptor, this);

          _initializerDefineProperty(this, "leftPoint", _descriptor2, this);

          _initializerDefineProperty(this, "rightPoint", _descriptor3, this);

          this.isIntroMoving = true;

          /**
           * Tổng số item. UIManager gán trong start().
           * KHÔNG import ItemManager ở đây: UIManager -> BallFollowFill -> ItemManager
           * -> UIManager là vòng, mà @property của UIManager cần BallFollowFill ngay
           * lúc nạp module.
           */
          this.total = 0;
        }

        start() {
          if (this.ballIcon && this.leftPoint) {
            this.ballIcon.setWorldPosition(this.leftPoint.worldPosition.clone());
          }

          this.introMove();
        }
        /** Unity: IntroMove — chạy 2 giây rồi mở khoá updateBall */


        introMove() {
          if (!this.ballIcon || !this.leftPoint || !this.rightPoint) {
            this.isIntroMoving = false;
            return;
          }

          var p = this.ballIcon.worldPosition;
          var targetX = math.lerp(this.leftPoint.worldPosition.x, this.rightPoint.worldPosition.x, 0);
          (_crd && TweenUtil === void 0 ? (_reportPossibleCrUseOfTweenUtil({
            error: Error()
          }), TweenUtil) : TweenUtil).moveTo(this.ballIcon, new Vec3(targetX, p.y, p.z), 2, 'linear', () => {
            this.isIntroMoving = false;
          });
        }
        /** Unity: UpdateBall */


        updateBall(tuSo) {
          if (!this.ballIcon || !this.leftPoint || !this.rightPoint) return;
          if (this.total <= 0) return;
          var t = math.clamp01(tuSo / this.total);
          var targetX = math.lerp(this.leftPoint.worldPosition.x, this.rightPoint.worldPosition.x, t);
          var p = this.ballIcon.worldPosition;
          this.ballIcon.setWorldPosition(targetX, p.y, p.z);
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "ballIcon", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "leftPoint", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "rightPoint", [_dec4], {
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
//# sourceMappingURL=2e910e14d480d617df246d7b07451e37efb47829.js.map