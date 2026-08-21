System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Vec3, tween, Tween, randomRange, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _class3, _crd, ccclass, property, ItemMovement;

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
      Vec3 = _cc.Vec3;
      tween = _cc.tween;
      Tween = _cc.Tween;
      randomRange = _cc.randomRange;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "5340fRe9upGxoQbAhXJRpWS", "ItemMovement", undefined);
      /**
       * ItemMovement — port từ Assets/_GAME/Script/Item/ItemMovement.cs (Unity)
       *
       * Bảng đổi DOTween -> cc.tween:
       *   DOScale(v, t).SetEase(Ease.OutQuad) -> tween(node).to(t, {scale:v}, {easing:'quadOut'})
       *   DORotate / DOLocalRotate           -> to(t, {eulerAngles:v})
       *   Ease.OutBack                       -> 'backOut'
       *   transform.DOKill()                 -> Tween.stopAllByTarget(node)
       *
       * Xem COCOS_MIGRATION_PLAN.md mục 4.6.
       */


      __checkObsolete__(['_decorator', 'Component', 'Node', 'Vec3', 'tween', 'Tween', 'randomRange']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("ItemMovement", ItemMovement = (_dec = ccclass('ItemMovement'), _dec2 = property({
        type: Vec3,
        visible: false
      }), _dec3 = property({
        type: Vec3,
        visible: false
      }), _dec(_class = (_class2 = (_class3 = class ItemMovement extends Component {
        constructor(...args) {
          super(...args);

          // ---- field khớp tên bản Unity ----
          // Bên Unity 2 field này gán trong Awake, trong scene chúng là [0,0,0].
          // Nên phải tự tính lại lúc onLoad, đừng tin giá trị từ JSON.
          _initializerDefineProperty(this, "originalScale", _descriptor, this);

          _initializerDefineProperty(this, "originalRotation", _descriptor2, this);

          this.isScaling = false;
        }

        onLoad() {
          this.captureOriginal();
        }

        start() {
          // SceneBuilder gán field ở pass 2, có thể ghi đè bằng [0,0,0] từ JSON.
          // Bắt lại ở start() cho chắc.
          if (this.originalScale.equals(Vec3.ZERO)) this.captureOriginal();
        }

        captureOriginal() {
          this.originalScale = this.node.scale.clone();
          this.originalRotation = this.node.eulerAngles.clone();
        }
        /** Unity: StartDragAnimation */


        startDragAnimation() {
          Tween.stopAllByTarget(this.node);
          this.isScaling = true;
          const target = ItemMovement.enableDragScale ? new Vec3(this.originalScale.x * ItemMovement.dragScaleAmount, this.originalScale.y * ItemMovement.dragScaleAmount, this.originalScale.z * ItemMovement.dragScaleAmount) : this.originalScale.clone();
          tween(this.node).to(0.2, {
            scale: target
          }, {
            easing: 'quadOut'
          }).start(); // trả lại rotation gốc

          tween(this.node).to(0.3, {
            eulerAngles: this.originalRotation.clone()
          }, {
            easing: 'quadOut'
          }).start();
        }
        /** Unity: CancelDragAnimation */


        cancelDragAnimation(targetScale, targetRotation) {
          Tween.stopAllByTarget(this.node);
          this.isScaling = false;
          tween(this.node).to(0.2, {
            scale: targetScale.clone()
          }, {
            easing: 'quadOut'
          }).start();
          tween(this.node).to(0.2, {
            eulerAngles: targetRotation.clone()
          }, {
            easing: 'quadOut'
          }).start();
        }
        /** Unity: MoveToPosition — bám thẳng theo con trỏ, không nội suy. */


        moveToPosition(worldPos) {
          this.node.setWorldPosition(worldPos);
        }
        /** Unity: StopDragAnimation */


        stopDragAnimation() {
          if (ItemMovement.enableDragScale && this.isScaling) {
            tween(this.node).to(0.5, {
              scale: this.originalScale.clone()
            }, {
              easing: 'quadOut'
            }).call(() => {
              this.isScaling = false;
            }).start();
          } else {
            this.isScaling = false;
          }
        }
        /** Unity: SnapFailedAnimation — xoay lệch ngẫu nhiên khi thả hụt. */


        snapFailedAnimation() {
          const randomZ = randomRange(-30, 30);
          tween(this.node).to(0.25, {
            eulerAngles: new Vec3(0, 0, randomZ)
          }, {
            easing: 'backOut'
          }).start();
        }
        /** Unity: MoveToTarget — bay vào vị trí đích rồi gọi callback. */


        moveToTarget(target, duration, onComplete) {
          const dest = target.worldPosition.clone();
          tween(this.node).to(duration, {
            worldPosition: dest
          }, {
            easing: 'quadOut'
          }).call(() => onComplete == null ? void 0 : onComplete()).start();
        }

      }, _class3.enableDragScale = true, _class3.dragScaleAmount = 1.1, _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "originalScale", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return new Vec3(1, 1, 1);
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "originalRotation", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return new Vec3(0, 0, 0);
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=67c19381901eca0ecc438fe1c89cd45e0f265dda.js.map