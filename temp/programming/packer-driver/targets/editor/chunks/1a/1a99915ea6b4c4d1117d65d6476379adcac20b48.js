System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7", "__unresolved_8", "__unresolved_9", "__unresolved_10"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, randomRange, DreamyInputManager, InputPriority, BoxGraphic, BoxState, ItemManager, UIManager, BaseRoomManager, ItemController, HolderSlot, HandOfBox, SoundManager, FxType, TweenUtil, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _crd, ccclass, property, BoxController;

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

  function _reportPossibleCrUseOfBoxGraphic(extras) {
    _reporterNs.report("BoxGraphic", "./BoxGraphic", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBoxState(extras) {
    _reporterNs.report("BoxState", "./BoxGraphic", _context.meta, extras);
  }

  function _reportPossibleCrUseOfItemManager(extras) {
    _reporterNs.report("ItemManager", "../managers/ItemManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfUIManager(extras) {
    _reporterNs.report("UIManager", "../managers/UIManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBaseRoomManager(extras) {
    _reporterNs.report("BaseRoomManager", "../managers/BaseRoomManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfItemController(extras) {
    _reporterNs.report("ItemController", "../item/ItemController", _context.meta, extras);
  }

  function _reportPossibleCrUseOfHolderSlot(extras) {
    _reporterNs.report("HolderSlot", "../utils/HolderSlot", _context.meta, extras);
  }

  function _reportPossibleCrUseOfHandOfBox(extras) {
    _reporterNs.report("HandOfBox", "../utils/HandOfBox", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSoundManager(extras) {
    _reporterNs.report("SoundManager", "../core/SoundManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfFxType(extras) {
    _reporterNs.report("FxType", "../core/SoundManager", _context.meta, extras);
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
      randomRange = _cc.randomRange;
    }, function (_unresolved_2) {
      DreamyInputManager = _unresolved_2.DreamyInputManager;
      InputPriority = _unresolved_2.InputPriority;
    }, function (_unresolved_3) {
      BoxGraphic = _unresolved_3.BoxGraphic;
      BoxState = _unresolved_3.BoxState;
    }, function (_unresolved_4) {
      ItemManager = _unresolved_4.ItemManager;
    }, function (_unresolved_5) {
      UIManager = _unresolved_5.UIManager;
    }, function (_unresolved_6) {
      BaseRoomManager = _unresolved_6.BaseRoomManager;
    }, function (_unresolved_7) {
      ItemController = _unresolved_7.ItemController;
    }, function (_unresolved_8) {
      HolderSlot = _unresolved_8.HolderSlot;
    }, function (_unresolved_9) {
      HandOfBox = _unresolved_9.HandOfBox;
    }, function (_unresolved_10) {
      SoundManager = _unresolved_10.SoundManager;
      FxType = _unresolved_10.FxType;
    }, function (_unresolved_11) {
      TweenUtil = _unresolved_11.TweenUtil;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "7ced8p9/QlE6LGvtBUi7hOy", "BoxController", undefined);
      /**
       * BoxController — port từ Assets/_GAME/Script/Box/BoxController.cs (Unity)
       *
       * KHÁC bản Unity:
       *   - Không poll Input + Physics.Raycast; đăng ký IPointerHandler ở mức Box.
       *   - DOJump -> TweenUtil.jumpTo.
       *   - SaveLayersAndSetTo20 -> ItemGraphic.bringToFront (lớp kéo).
       *   - Bỏ SetLayerRecursively (dead code bên Unity, không nơi nào gọi).
       */


      __checkObsolete__(['_decorator', 'Component', 'Node', 'Vec3', 'EventTouch', 'randomRange']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("BoxController", BoxController = (_dec = ccclass('BoxController'), _dec2 = property({
        type: Node,
        tooltip: 'Vị trí item rớt ra từ hộp.'
      }), _dec3 = property({
        type: Node,
        tooltip: 'Vị trí hộp bay tới trước khi biến mất.'
      }), _dec4 = property({
        type: Node,
        tooltip: 'Vị trí hộp di chuyển tới sau intro.'
      }), _dec5 = property({
        type: Node,
        tooltip: 'Bàn tay/chữ hướng dẫn click vào hộp.'
      }), _dec6 = property({
        type: _crd && HandOfBox === void 0 ? (_reportPossibleCrUseOfHandOfBox({
          error: Error()
        }), HandOfBox) : HandOfBox,
        tooltip: 'Script di chuyển bàn tay theo hộp lúc intro.'
      }), _dec7 = property({
        type: Node,
        tooltip: 'Thanh trượt UI hiện khi bắt đầu tương tác.'
      }), _dec8 = property({
        type: Node,
        tooltip: 'Object slogan.'
      }), _dec9 = property({
        tooltip: 'Đã xong lượt click tutorial mở hộp đầu tiên chưa.'
      }), _dec(_class = (_class2 = class BoxController extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "StartTf", _descriptor, this);

          _initializerDefineProperty(this, "endTf", _descriptor2, this);

          _initializerDefineProperty(this, "MoveAfterIntroPosOfBox", _descriptor3, this);

          _initializerDefineProperty(this, "handText", _descriptor4, this);

          _initializerDefineProperty(this, "handOfBox", _descriptor5, this);

          _initializerDefineProperty(this, "slider", _descriptor6, this);

          _initializerDefineProperty(this, "sloganText", _descriptor7, this);

          _initializerDefineProperty(this, "finishedTutorial", _descriptor8, this);

          this.isClicked = false;
          this.boxGraphic = null;
          this.inputPriority = (_crd && InputPriority === void 0 ? (_reportPossibleCrUseOfInputPriority({
            error: Error()
          }), InputPriority) : InputPriority).Box;
        }

        // ======================================================== lifecycle
        onLoad() {
          var _this$boxGraphic;

          this.boxGraphic = this.getComponent(_crd && BoxGraphic === void 0 ? (_reportPossibleCrUseOfBoxGraphic({
            error: Error()
          }), BoxGraphic) : BoxGraphic);
          (_this$boxGraphic = this.boxGraphic) == null || _this$boxGraphic.changeState((_crd && BoxState === void 0 ? (_reportPossibleCrUseOfBoxState({
            error: Error()
          }), BoxState) : BoxState).ReadyOpen);
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
        } // ======================================================== input


        hitTest(worldPos) {
          if (this.isClicked) return false;
          return (_crd && DreamyInputManager === void 0 ? (_reportPossibleCrUseOfDreamyInputManager({
            error: Error()
          }), DreamyInputManager) : DreamyInputManager).hitTestSelfOrChildren(this.node, worldPos);
        }

        onPointerDown(_worldPos, _ev) {
          if (this.isClicked) return false;
          this.onClick();
          return true;
        } // ======================================================== logic

        /** Unity: OnClick */


        onClick() {
          var _instance, _instance2, _this$boxGraphic4;

          if (this.isClicked) return;
          (_instance = (_crd && SoundManager === void 0 ? (_reportPossibleCrUseOfSoundManager({
            error: Error()
          }), SoundManager) : SoundManager).instance) == null || _instance.playFx((_crd && FxType === void 0 ? (_reportPossibleCrUseOfFxType({
            error: Error()
          }), FxType) : FxType).ClickBox);
          const im = (_crd && ItemManager === void 0 ? (_reportPossibleCrUseOfItemManager({
            error: Error()
          }), ItemManager) : ItemManager).instance;

          if (im) {
            if (im.handIntro) im.handIntro.active = false;
            im.enableFirstClickObjects();
          }

          (_instance2 = (_crd && UIManager === void 0 ? (_reportPossibleCrUseOfUIManager({
            error: Error()
          }), UIManager) : UIManager).instance) == null || _instance2.activateGameLogoAndPlaynow();
          if (this.handText) this.handText.active = false;
          this.isClicked = true;
          if (this.slider) this.slider.active = true; // ---- CLICK ĐẦU TIÊN ----

          if (!this.finishedTutorial) {
            var _this$boxGraphic2, _this$handOfBox;

            (_this$boxGraphic2 = this.boxGraphic) == null || _this$boxGraphic2.changeState((_crd && BoxState === void 0 ? (_reportPossibleCrUseOfBoxState({
              error: Error()
            }), BoxState) : BoxState).FirstOpen);
            (_crd && TweenUtil === void 0 ? (_reportPossibleCrUseOfTweenUtil({
              error: Error()
            }), TweenUtil) : TweenUtil).delayedCall(this, 1, () => this.spawnItem());

            if (this.MoveAfterIntroPosOfBox) {
              (_crd && TweenUtil === void 0 ? (_reportPossibleCrUseOfTweenUtil({
                error: Error()
              }), TweenUtil) : TweenUtil).moveTo(this.node, this.MoveAfterIntroPosOfBox.worldPosition, 1.2, 'linear');
            }

            (_this$handOfBox = this.handOfBox) == null || _this$handOfBox.moveAfterIntro(1.2);

            const finish = () => {
              var _this$boxGraphic3;

              this.finishedTutorial = true;
              this.isClicked = false;
              (_this$boxGraphic3 = this.boxGraphic) == null || _this$boxGraphic3.setAutoOpenEnabled(true);
            };

            if ((_crd && BaseRoomManager === void 0 ? (_reportPossibleCrUseOfBaseRoomManager({
              error: Error()
            }), BaseRoomManager) : BaseRoomManager).instance) (_crd && BaseRoomManager === void 0 ? (_reportPossibleCrUseOfBaseRoomManager({
              error: Error()
            }), BaseRoomManager) : BaseRoomManager).instance.playIntroAnimation(finish);else finish();
            return;
          } // ---- NHỮNG CLICK SAU ----


          (_this$boxGraphic4 = this.boxGraphic) == null || _this$boxGraphic4.changeState((_crd && BoxState === void 0 ? (_reportPossibleCrUseOfBoxState({
            error: Error()
          }), BoxState) : BoxState).CLickBox);
          this.spawnItem();
          this.isClicked = false;
        }
        /** Unity: SpawnItem */


        spawnItem() {
          var _itemScript$itemGraph;

          if (!this.StartTf) return;
          const im = (_crd && ItemManager === void 0 ? (_reportPossibleCrUseOfItemManager({
            error: Error()
          }), ItemManager) : ItemManager).instance;
          if (!im) return;

          if (!im.hasAvailableHolder()) {
            console.warn('[BoxController] Hết holder trống!');
            return;
          }

          const currentItem = im.getCurrentItem();

          if (!currentItem) {
            console.warn('[BoxController] Hết item rồi!');
            return;
          }

          currentItem.setWorldPosition(this.StartTf.worldPosition.clone());
          currentItem.active = true;
          const pop = im.enablePopScale ? im.popScaleAmount : 1;
          currentItem.setScale(pop, pop, pop);
          const itemScript = currentItem.getComponent(_crd && ItemController === void 0 ? (_reportPossibleCrUseOfItemController({
            error: Error()
          }), ItemController) : ItemController);
          itemScript == null || (_itemScript$itemGraph = itemScript.itemGraphic) == null || _itemScript$itemGraph.bringToFront();
          currentItem.setRotationFromEuler(0, 0, randomRange(-90, 90));
          const holder = im.getCurrentHolder();
          if (!holder) return;
          const holderSlot = holder.getComponent(_crd && HolderSlot === void 0 ? (_reportPossibleCrUseOfHolderSlot({
            error: Error()
          }), HolderSlot) : HolderSlot);

          if (holderSlot) {
            holderSlot.isEmpty = false;
            if (itemScript) itemScript.currentHolderSlot = holderSlot;
          } // Unity: DOJump(holder.position, 1.5f, 1, 1f).SetEase(Ease.OutBack)


          (_crd && TweenUtil === void 0 ? (_reportPossibleCrUseOfTweenUtil({
            error: Error()
          }), TweenUtil) : TweenUtil).jumpTo(currentItem, holder.worldPosition, 150, 1, 1, 'backOut', () => {
            if (!holderSlot) return;
            holderSlot.setItem(currentItem);
            if (itemScript) im.showFirstDragHint(itemScript);
          });
        }
        /** Unity: GoToEndPos */


        goToEndPos() {
          if (!this.endTf) return;
          (_crd && TweenUtil === void 0 ? (_reportPossibleCrUseOfTweenUtil({
            error: Error()
          }), TweenUtil) : TweenUtil).moveTo(this.node, this.endTf.worldPosition, 0.5, 'sineInOut', () => {
            this.node.active = false;
          });
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "StartTf", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "endTf", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "MoveAfterIntroPosOfBox", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "handText", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "handOfBox", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "slider", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "sloganText", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "finishedTutorial", [_dec9], {
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
//# sourceMappingURL=1a99915ea6b4c4d1117d65d6476379adcac20b48.js.map