System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, sp, _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _crd, ccclass, property, BoxState, BoxGraphic;

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
      sp = _cc.sp;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "5ca73XTUP1C1r2MPWB4sw6D", "BoxGraphic", undefined);
      /**
       * BoxGraphic — port từ Assets/_GAME/Script/Box/BoxGraphic.cs (Unity)
       *
       * Tên animation Spine giữ NGUYÊN XI như bản Unity.
       * Bên Unity ChangeSpine() chạy trong Update; ở đây dùng schedule 0.1s cho rẻ.
       */


      __checkObsolete__(['_decorator', 'Component', 'sp']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("BoxState", BoxState = /*#__PURE__*/function (BoxState) {
        BoxState[BoxState["Closed"] = 0] = "Closed";
        BoxState[BoxState["Opened"] = 1] = "Opened";
        BoxState[BoxState["CLickBox"] = 2] = "CLickBox";
        BoxState[BoxState["FirstOpen"] = 3] = "FirstOpen";
        BoxState[BoxState["OpenLoopBreak"] = 4] = "OpenLoopBreak";
        BoxState[BoxState["ReadyOpen"] = 5] = "ReadyOpen";
        return BoxState;
      }({}));

      _export("BoxGraphic", BoxGraphic = (_dec = ccclass('BoxGraphic'), _dec2 = property({
        type: sp.Skeleton,
        tooltip: 'Spine điều khiển hiệu ứng hộp.'
      }), _dec3 = property({
        tooltip: 'Bao lâu không thao tác thì hộp tự hé mở (giây).'
      }), _dec4 = property({
        tooltip: 'Hộp giữ trạng thái hé mở bao lâu trước khi lặp lại.'
      }), _dec5 = property({
        tooltip: 'Bật chế độ tự hé mở để gọi chú ý.'
      }), _dec(_class = (_class2 = class BoxGraphic extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "boxSkeleton", _descriptor, this);

          _initializerDefineProperty(this, "autoOpenDelay", _descriptor2, this);

          _initializerDefineProperty(this, "openedDuration", _descriptor3, this);

          _initializerDefineProperty(this, "autoOpenEnabled", _descriptor4, this);

          this.idleTimer = 0;
          this.currentState = BoxState.Closed;
          this.autoCloseScheduled = false;
        }

        onLoad() {
          this.schedule(this.tick, 0.1);
        }

        onDestroy() {
          this.unschedule(this.tick);
        }
        /** Unity: ChangeSpine trong Update */


        tick() {
          if (!this.boxSkeleton) return;
          if (!this.autoOpenEnabled) return;
          if (this.currentState === BoxState.Opened) return;
          this.idleTimer += 0.1;

          if (this.idleTimer >= this.autoOpenDelay) {
            this.changeState(BoxState.Opened);
          }
        }

        setAutoOpenEnabled(enabled) {
          this.autoOpenEnabled = enabled;
          if (enabled) this.idleTimer = 0;
        }
        /** Unity: ChangeState */


        changeState(newState) {
          if (!this.boxSkeleton) return;
          if (this.currentState === newState) return;
          this.unscheduleAllCallbacks();
          this.schedule(this.tick, 0.1);
          this.autoCloseScheduled = false;
          this.currentState = newState;
          this.idleTimer = 0;

          switch (this.currentState) {
            case BoxState.Closed:
              this.boxSkeleton.setAnimation(0, 'Setup-A-2', false);
              break;

            case BoxState.Opened:
              this.restartOpenedAnimation();
              break;

            case BoxState.CLickBox:
              this.boxSkeleton.setAnimation(0, '3-OPEN-click', false);
              break;

            case BoxState.FirstOpen:
              this.boxSkeleton.setAnimation(0, '2-OPEN', false);
              break;

            case BoxState.ReadyOpen:
              this.restartReadyOpenAnimation();
              break;

            default:
              break;
          }
        }

        restartReadyOpenAnimation() {
          if (!this.boxSkeleton) return;
          this.boxSkeleton.setAnimation(0, '1-ready-Loop', false);
          this.autoCloseScheduled = true;
          this.scheduleOnce(() => {
            if (this.currentState === BoxState.ReadyOpen) this.restartReadyOpenAnimation();
          }, this.openedDuration);
        }

        restartOpenedAnimation() {
          if (!this.boxSkeleton) return;
          this.boxSkeleton.setAnimation(0, '3-OPEN-loop-break', false);
          this.autoCloseScheduled = true;
          this.scheduleOnce(() => {
            if (this.currentState === BoxState.Opened) this.restartOpenedAnimation();
          }, this.openedDuration);
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "boxSkeleton", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "autoOpenDelay", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 4;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "openedDuration", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 4;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "autoOpenEnabled", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=24a4ef1f9fe9eebcb8c9a5bcadf06ec5ec3cd586.js.map