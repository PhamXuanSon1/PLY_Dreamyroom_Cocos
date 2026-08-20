System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Label, Sprite, sys, DreamyInputManager, InputPriority, ItemManager, BallFollowFill, TweenUtil, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _class3, _crd, ccclass, property, UIManager;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfDreamyInputManager(extras) {
    _reporterNs.report("DreamyInputManager", "../core/DreamyInputManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfInputPriority(extras) {
    _reporterNs.report("InputPriority", "../core/DreamyInputManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfIPointerHandler(extras) {
    _reporterNs.report("IPointerHandler", "../core/DreamyInputManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfItemManager(extras) {
    _reporterNs.report("ItemManager", "./ItemManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBallFollowFill(extras) {
    _reporterNs.report("BallFollowFill", "../utils/BallFollowFill", _context.meta, extras);
  }

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
      Label = _cc.Label;
      Sprite = _cc.Sprite;
      sys = _cc.sys;
    }, function (_unresolved_2) {
      DreamyInputManager = _unresolved_2.DreamyInputManager;
      InputPriority = _unresolved_2.InputPriority;
    }, function (_unresolved_3) {
      ItemManager = _unresolved_3.ItemManager;
    }, function (_unresolved_4) {
      BallFollowFill = _unresolved_4.BallFollowFill;
    }, function (_unresolved_5) {
      TweenUtil = _unresolved_5.TweenUtil;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "545bd04h19Ba6vJsGvv0/qJ", "UIManager", undefined);
      /**
       * UIManager — port từ Assets/_GAME/Script/Manager/UIManager.cs (Unity)
       *
       * BỎ so với bản Unity (theo yêu cầu):
       *   - AppLovinAnalytics.Track(...) và ALEvent
       *   - LifeCycle.GameEnded() / Playable.InstallFullGame()  -> mở URL store
       *   - ProgressTrackingManager
       *   - SetupUIPosition() và toàn bộ phần cân màn theo orientation
       *     (bên Cocos dùng Widget của Canvas, không tính tay)
       *   - Physics.Raycast bắt layer "Download" -> dùng Button/handler tử tế
       */


      __checkObsolete__(['_decorator', 'Component', 'Node', 'Label', 'Sprite', 'EventTouch', 'Vec3', 'sys']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("UIManager", UIManager = (_dec = ccclass('UIManager'), _dec2 = property({
        type: Node,
        tooltip: 'Logo game.'
      }), _dec3 = property({
        type: Node,
        tooltip: 'Nút Play Now.'
      }), _dec4 = property({
        type: Label,
        tooltip: 'Chữ tiến trình, vd 1/12.'
      }), _dec5 = property({
        type: Sprite,
        tooltip: 'Thanh tiến trình. Type phải để FILLED.'
      }), _dec6 = property({
        type: _crd && BallFollowFill === void 0 ? (_reportPossibleCrUseOfBallFollowFill({
          error: Error()
        }), BallFollowFill) : BallFollowFill,
        tooltip: 'Icon chạy theo thanh tiến trình.'
      }), _dec7 = property({
        tooltip: 'Tử số — số item đã ghép.'
      }), _dec8 = property({
        tooltip: 'Mẫu số — tổng số item. Start() sẽ lấy từ ItemManager.itemList.'
      }), _dec9 = property({
        tooltip: 'Số item hoàn thành để mở màn End Game.'
      }), _dec10 = property({
        type: Node,
        tooltip: 'Canvas UI trong lúc chơi.'
      }), _dec11 = property({
        type: Node,
        tooltip: 'Canvas màn hình thắng.'
      }), _dec12 = property({
        tooltip: 'URL store mở khi bấm CTA. Thay cho Playable.InstallFullGame().'
      }), _dec(_class = (_class2 = (_class3 = class UIManager extends Component {
        constructor() {
          super(...arguments);

          // ---------------- UI ----------------
          _initializerDefineProperty(this, "GameLogo", _descriptor, this);

          _initializerDefineProperty(this, "Playnow", _descriptor2, this);

          _initializerDefineProperty(this, "textNumber", _descriptor3, this);

          _initializerDefineProperty(this, "progressBar", _descriptor4, this);

          _initializerDefineProperty(this, "ballFollowFill", _descriptor5, this);

          // ---------------- Progress ----------------
          _initializerDefineProperty(this, "tuSo", _descriptor6, this);

          _initializerDefineProperty(this, "mauSo", _descriptor7, this);

          _initializerDefineProperty(this, "endGameCount", _descriptor8, this);

          this.isGameEnded = false;

          // ---------------- Canvas ----------------
          _initializerDefineProperty(this, "GameUICanvas", _descriptor9, this);

          _initializerDefineProperty(this, "EndUICanvas", _descriptor10, this);

          _initializerDefineProperty(this, "storeUrl", _descriptor11, this);

          this.inputPriority = (_crd && InputPriority === void 0 ? (_reportPossibleCrUseOfInputPriority({
            error: Error()
          }), InputPriority) : InputPriority).UI;
        }

        // ======================================================== lifecycle
        onLoad() {
          UIManager.instance = this;
        }

        onEnable() {
          (_crd && DreamyInputManager === void 0 ? (_reportPossibleCrUseOfDreamyInputManager({
            error: Error()
          }), DreamyInputManager) : DreamyInputManager).register(this);
        }

        onDisable() {
          (_crd && DreamyInputManager === void 0 ? (_reportPossibleCrUseOfDreamyInputManager({
            error: Error()
          }), DreamyInputManager) : DreamyInputManager).unregister(this);
        }

        onDestroy() {
          if (UIManager.instance === this) UIManager.instance = null;
        }

        start() {
          this.tuSo = 0;
          var im = (_crd && ItemManager === void 0 ? (_reportPossibleCrUseOfItemManager({
            error: Error()
          }), ItemManager) : ItemManager).instance;
          if (im && im.itemList.length > 0) this.mauSo = im.itemList.length; // BallFollowFill cố ý không import ItemManager (tránh phụ thuộc vòng)

          if (this.ballFollowFill) this.ballFollowFill.total = this.mauSo;
          this.updateText(); // Unity: DOTween.To(() => tuSo, x => {tuSo = x; UpdateText();}, 0, 2f)
          // Đếm về 0 trong 2 giây — giữ nguyên để khớp nhịp intro.

          (_crd && TweenUtil === void 0 ? (_reportPossibleCrUseOfTweenUtil({
            error: Error()
          }), TweenUtil) : TweenUtil).valueTo(2, () => this.updateText(), 'linear');
          if (this.GameLogo) this.GameLogo.active = true;
          if (this.Playnow) this.Playnow.active = true;
        }
        /** Unity: ActivateGameLogoAndPlaynow */


        activateGameLogoAndPlaynow() {
          if (this.GameLogo) this.GameLogo.active = true;
          if (this.Playnow) this.Playnow.active = true;
        } // ======================================================== input

        /** Sau khi end game, chạm bất kỳ đâu -> mở store. */


        hitTest(_worldPos) {
          return this.isGameEnded;
        }

        onPointerDown(_worldPos, _ev) {
          if (!this.isGameEnded) return false;
          this.gotoStore();
          return true; // nuốt sự kiện
        } // ======================================================== progress

        /** Unity: UpdateText */


        updateText() {
          if (this.textNumber) this.textNumber.string = this.tuSo + "/" + this.mauSo;
          var percent = this.mauSo > 0 ? this.tuSo / this.mauSo : 0;
          if (this.progressBar) this.progressBar.fillRange = percent;

          if (this.ballFollowFill && !this.ballFollowFill.isIntroMoving) {
            this.ballFollowFill.updateBall(this.tuSo);
          }

          this.checkEndGame();
        }

        checkEndGame() {
          var _im$arrivedItemCount;

          if (this.isGameEnded) return;
          var im = (_crd && ItemManager === void 0 ? (_reportPossibleCrUseOfItemManager({
            error: Error()
          }), ItemManager) : ItemManager).instance;
          var arrived = (_im$arrivedItemCount = im == null ? void 0 : im.arrivedItemCount) != null ? _im$arrivedItemCount : this.tuSo;

          if (this.tuSo >= this.mauSo || arrived >= this.endGameCount) {
            this.isGameEnded = true;
            (_crd && DreamyInputManager === void 0 ? (_reportPossibleCrUseOfDreamyInputManager({
              error: Error()
            }), DreamyInputManager) : DreamyInputManager).canInput = false;
            if (this.GameUICanvas) this.GameUICanvas.active = false;
            if (this.EndUICanvas) this.EndUICanvas.active = true;
            if (this.GameLogo) this.GameLogo.active = false;
            if (this.Playnow) this.Playnow.active = false;

            if (im) {
              for (var c of im.WinConfetti) if (c != null && c.isValid) c.active = true;
            } // Cho phép chạm để mở store


            (_crd && DreamyInputManager === void 0 ? (_reportPossibleCrUseOfDreamyInputManager({
              error: Error()
            }), DreamyInputManager) : DreamyInputManager).canInput = true;
          }
        }
        /** Unity: GotoStore — bỏ Luna/AppLovin, chỉ mở URL. */


        gotoStore() {
          if (!this.storeUrl) {
            console.log('[UIManager] gotoStore() — chưa đặt storeUrl.');
            return;
          }

          sys.openURL(this.storeUrl);
        }

      }, _class3.instance = null, _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "GameLogo", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "Playnow", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "textNumber", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "progressBar", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "ballFollowFill", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "tuSo", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "mauSo", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 12;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "endGameCount", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 12;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "GameUICanvas", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "EndUICanvas", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "storeUrl", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return '';
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=43ec13f8ebbc96e7ce9aac8b7146fc06b6e20cbb.js.map