System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, PlayableSDK, ALEvent, UIManager, ItemManager, _dec, _dec2, _class, _class2, _descriptor, _class3, _crd, ccclass, property, ProgressTrackingManager;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfPlayableSDK(extras) {
    _reporterNs.report("PlayableSDK", "../sdk/PlayableSDK", _context.meta, extras);
  }

  function _reportPossibleCrUseOfALEvent(extras) {
    _reporterNs.report("ALEvent", "../sdk/PlayableSDK", _context.meta, extras);
  }

  function _reportPossibleCrUseOfUIManager(extras) {
    _reporterNs.report("UIManager", "./UIManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfItemManager(extras) {
    _reporterNs.report("ItemManager", "./ItemManager", _context.meta, extras);
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
    }, function (_unresolved_2) {
      PlayableSDK = _unresolved_2.PlayableSDK;
      ALEvent = _unresolved_2.ALEvent;
    }, function (_unresolved_3) {
      UIManager = _unresolved_3.UIManager;
    }, function (_unresolved_4) {
      ItemManager = _unresolved_4.ItemManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "01f9aeXo8VElIM+NI6+ZbDu", "ProgressTrackingManager", undefined);
      /**
       * ProgressTrackingManager — port từ Assets/_GAME/Script/Manager/ProgressTrackingManager.cs
       * Bắn mốc 25/50/75/100% cho SDK quảng cáo.
       */


      __checkObsolete__(['_decorator', 'Component']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("ProgressTrackingManager", ProgressTrackingManager = (_dec = ccclass('ProgressTrackingManager'), _dec2 = property({
        tooltip: 'Tổng số điểm tối đa. Tự suy ra nếu để 0.'
      }), _dec(_class = (_class2 = (_class3 = class ProgressTrackingManager extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "maxScore", _descriptor, this);

          this.currentScore = 0;
          this.currentPercent = 0;
          this.isStarted = false;
          this.pass25 = false;
          this.pass50 = false;
          this.pass75 = false;
          this.pass100 = false;
        }

        get CurrentScore() {
          return this.currentScore;
        }

        get CurrentPercent() {
          return this.currentPercent;
        }

        onLoad() {
          if (ProgressTrackingManager.instance && ProgressTrackingManager.instance !== this) {
            this.node.destroy();
            return;
          }

          ProgressTrackingManager.instance = this;
        }

        start() {
          this.resetProgress();
          var dyn = this.getDynamicMaxScore();
          if (dyn > 0) this.maxScore = dyn;
        }

        onDestroy() {
          if (ProgressTrackingManager.instance === this) ProgressTrackingManager.instance = null;
        }
        /** Unity: StartChallenge — gọi ở lần chạm đầu tiên. */


        startChallenge() {
          if (this.isStarted) return;
          this.isStarted = true;
          (_crd && PlayableSDK === void 0 ? (_reportPossibleCrUseOfPlayableSDK({
            error: Error()
          }), PlayableSDK) : PlayableSDK).track((_crd && ALEvent === void 0 ? (_reportPossibleCrUseOfALEvent({
            error: Error()
          }), ALEvent) : ALEvent).CHALLENGE_STARTED);
        }

        resetProgress() {
          this.currentScore = 0;
          this.currentPercent = 0;
          this.isStarted = false;
          this.pass25 = this.pass50 = this.pass75 = this.pass100 = false;
        }

        addProgress(amount) {
          if (amount === void 0) {
            amount = 1;
          }

          this.updateGameProgress(this.currentScore + amount);
        }
        /** Unity: UpdateGameProgress */


        updateGameProgress(score) {
          if (this.maxScore <= 0) this.maxScore = this.getDynamicMaxScore();

          if (this.maxScore <= 0) {
            console.warn('[ProgressTrackingManager] maxScore chưa được thiết lập.');
            return;
          }

          this.currentScore = Math.max(0, Math.min(score, this.maxScore));
          if (!this.isStarted && this.currentScore > 0) this.isStarted = true;
          var pct = Math.floor(this.currentScore * 100 / this.maxScore);
          this.currentPercent = pct;

          if (pct >= 25 && !this.pass25) {
            (_crd && PlayableSDK === void 0 ? (_reportPossibleCrUseOfPlayableSDK({
              error: Error()
            }), PlayableSDK) : PlayableSDK).track((_crd && ALEvent === void 0 ? (_reportPossibleCrUseOfALEvent({
              error: Error()
            }), ALEvent) : ALEvent).CHALLENGE_PASS_25);
            this.pass25 = true;
          }

          if (pct >= 50 && !this.pass50) {
            (_crd && PlayableSDK === void 0 ? (_reportPossibleCrUseOfPlayableSDK({
              error: Error()
            }), PlayableSDK) : PlayableSDK).track((_crd && ALEvent === void 0 ? (_reportPossibleCrUseOfALEvent({
              error: Error()
            }), ALEvent) : ALEvent).CHALLENGE_PASS_50);
            this.pass50 = true;
          }

          if (pct >= 75 && !this.pass75) {
            (_crd && PlayableSDK === void 0 ? (_reportPossibleCrUseOfPlayableSDK({
              error: Error()
            }), PlayableSDK) : PlayableSDK).track((_crd && ALEvent === void 0 ? (_reportPossibleCrUseOfALEvent({
              error: Error()
            }), ALEvent) : ALEvent).CHALLENGE_PASS_75);
            this.pass75 = true;
          }

          if (pct >= 100 && !this.pass100) {
            (_crd && PlayableSDK === void 0 ? (_reportPossibleCrUseOfPlayableSDK({
              error: Error()
            }), PlayableSDK) : PlayableSDK).track((_crd && ALEvent === void 0 ? (_reportPossibleCrUseOfALEvent({
              error: Error()
            }), ALEvent) : ALEvent).CHALLENGE_SOLVED);
            this.pass100 = true;
          }
        }

        getDynamicMaxScore() {
          var ui = (_crd && UIManager === void 0 ? (_reportPossibleCrUseOfUIManager({
            error: Error()
          }), UIManager) : UIManager).instance;
          if (ui && ui.endGameCount > 0) return ui.endGameCount;
          var im = (_crd && ItemManager === void 0 ? (_reportPossibleCrUseOfItemManager({
            error: Error()
          }), ItemManager) : ItemManager).instance;
          if (im && im.itemList && im.itemList.length > 0) return im.itemList.length;
          if (ui && ui.mauSo > 0) return ui.mauSo;
          return this.maxScore;
        }

      }, _class3.instance = null, _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "maxScore", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=ffe754f310c833a7aab38df08d5384df747a8e9a.js.map