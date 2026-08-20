System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7", "__unresolved_8"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Color, Camera, Vec3, ItemController, ItemGraphic, HolderSlot, SeatHandler, TweenUtil, WorldScrollManager, UIManager, BoxManager, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _class3, _crd, ccclass, property, ItemManager;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfItemController(extras) {
    _reporterNs.report("ItemController", "../item/ItemController", _context.meta, extras);
  }

  function _reportPossibleCrUseOfItemGraphic(extras) {
    _reporterNs.report("ItemGraphic", "../item/ItemGraphic", _context.meta, extras);
  }

  function _reportPossibleCrUseOfHolderSlot(extras) {
    _reporterNs.report("HolderSlot", "../utils/HolderSlot", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSeatHandler(extras) {
    _reporterNs.report("SeatHandler", "../utils/SeatHandler", _context.meta, extras);
  }

  function _reportPossibleCrUseOfTweenUtil(extras) {
    _reporterNs.report("TweenUtil", "../core/TweenUtil", _context.meta, extras);
  }

  function _reportPossibleCrUseOfWorldScrollManager(extras) {
    _reporterNs.report("WorldScrollManager", "./WorldScrollManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfUIManager(extras) {
    _reporterNs.report("UIManager", "./UIManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBoxManager(extras) {
    _reporterNs.report("BoxManager", "./BoxManager", _context.meta, extras);
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
      Color = _cc.Color;
      Camera = _cc.Camera;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      ItemController = _unresolved_2.ItemController;
    }, function (_unresolved_3) {
      ItemGraphic = _unresolved_3.ItemGraphic;
    }, function (_unresolved_4) {
      HolderSlot = _unresolved_4.HolderSlot;
    }, function (_unresolved_5) {
      SeatHandler = _unresolved_5.SeatHandler;
    }, function (_unresolved_6) {
      TweenUtil = _unresolved_6.TweenUtil;
    }, function (_unresolved_7) {
      WorldScrollManager = _unresolved_7.WorldScrollManager;
    }, function (_unresolved_8) {
      UIManager = _unresolved_8.UIManager;
    }, function (_unresolved_9) {
      BoxManager = _unresolved_9.BoxManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "7443bWYzgpFVYIijrjXbRoc", "ItemManager", undefined);
      /**
       * ItemManager — port từ Assets/_GAME/Script/Manager/ItemManager.cs (Unity)
       *
       * BỎ so với bản Unity:
       *   - optimizeForLuna / objectsToDisableForLuna / animatorsToDisableForLuna
       *   - ProgressTrackingManager (chỉ phục vụ AppLovin)
       *   - khối #if UNITY_EDITOR (AlignBarItemsInEditor)
       *
       * KHÁC bản Unity:
       *   - Bỏ Update() poll Input; InputManager gọi onAnyPointerDown().
       *   - SortingGroup không tồn tại trong Cocos nên bỏ đoạn tắt SortingGroup.
       */


      __checkObsolete__(['_decorator', 'Component', 'Node', 'Color', 'Camera', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("ItemManager", ItemManager = (_dec = ccclass('ItemManager'), _dec2 = property({
        tooltip: 'Lấy item từ cuối danh sách (từ dưới lên).'
      }), _dec3 = property({
        type: [Node],
        tooltip: 'Danh sách item sẽ rớt ra từ hộp.'
      }), _dec4 = property({
        type: [Node],
        tooltip: 'Thứ tự hiển thị bóng. Để trống = dùng itemList.'
      }), _dec5 = property({
        type: [Node],
        tooltip: 'Các vị trí chờ (Holder).'
      }), _dec6 = property({
        tooltip: 'Cho phép phóng to item khi lấy ra khỏi hộp.'
      }), _dec7 = property({
        tooltip: 'Lượng scale khi lấy ra khỏi hộp.'
      }), _dec8 = property({
        tooltip: 'Cho phép phóng to item khi đang kéo.'
      }), _dec9 = property({
        tooltip: 'Lượng scale khi đang kéo.'
      }), _dec10 = property({
        type: [Node],
        tooltip: 'Object BẬT khi click lần đầu.'
      }), _dec11 = property({
        type: [Node],
        tooltip: 'Object TẮT khi click lần đầu.'
      }), _dec12 = property({
        type: Node,
        tooltip: 'Object bật lên khi ghép xong item đầu tiên.'
      }), _dec13 = property({
        type: [Node],
        tooltip: 'Pháo hoa khi hoàn thành màn.'
      }), _dec14 = property({
        tooltip: 'Bao lâu không thao tác thì hiện hint (giây).'
      }), _dec15 = property({
        tooltip: 'Số item tối đa được gợi ý. -1 = vô hạn.'
      }), _dec16 = property({
        type: Node,
        tooltip: 'Bàn tay chỉ dẫn.'
      }), _dec17 = property({
        type: Node,
        tooltip: 'Bàn tay hướng dẫn ở đầu game.'
      }), _dec18 = property({
        tooltip: 'Số item mỗi đợt hiện bóng.'
      }), _dec19 = property({
        tooltip: 'Màu bóng ở vị trí đích.'
      }), _dec20 = property({
        tooltip: 'Màu đích khi phục hồi.'
      }), _dec21 = property({
        type: Camera,
        tooltip: 'Camera dùng để kiểm tra item có nằm trong khung hình.'
      }), _dec(_class = (_class2 = (_class3 = class ItemManager extends Component {
        constructor() {
          super(...arguments);

          // ---------------- Elements ----------------
          _initializerDefineProperty(this, "spawnFromLast", _descriptor, this);

          _initializerDefineProperty(this, "itemList", _descriptor2, this);

          _initializerDefineProperty(this, "shadowList", _descriptor3, this);

          _initializerDefineProperty(this, "holderItemList", _descriptor4, this);

          this.currentItemIndex = 0;

          // ---------------- Pop / Drag ----------------
          _initializerDefineProperty(this, "enablePopScale", _descriptor5, this);

          _initializerDefineProperty(this, "popScaleAmount", _descriptor6, this);

          _initializerDefineProperty(this, "enableDragScale", _descriptor7, this);

          _initializerDefineProperty(this, "dragScaleAmount", _descriptor8, this);

          // ---------------- First click ----------------
          _initializerDefineProperty(this, "objsToEnableOnFirstClick", _descriptor9, this);

          _initializerDefineProperty(this, "objsToDisableOnFirstClick", _descriptor10, this);

          this.isFirstClicked = false;
          // ---------------- Status ----------------
          this.lastInteractedItem = null;

          _initializerDefineProperty(this, "objToEnableAfterFirstItem", _descriptor11, this);

          _initializerDefineProperty(this, "WinConfetti", _descriptor12, this);

          // ---------------- Hint ----------------
          this.idleTimer = 0;

          _initializerDefineProperty(this, "idleTimeToHint", _descriptor13, this);

          _initializerDefineProperty(this, "maxHintItems", _descriptor14, this);

          this.hasShownHint = false;

          _initializerDefineProperty(this, "handHint", _descriptor15, this);

          _initializerDefineProperty(this, "handIntro", _descriptor16, this);

          this.isDragging = false;
          this.arrivedItemCount = 0;
          this.showedFirstDragHint = false;

          _initializerDefineProperty(this, "shadowBatchSize", _descriptor17, this);

          this.currentBatchItems = [];
          this.currentHolder = null;

          // ---------------- Target graphic ----------------
          _initializerDefineProperty(this, "targetShadowColor", _descriptor18, this);

          _initializerDefineProperty(this, "targetNormalColor", _descriptor19, this);

          _initializerDefineProperty(this, "mainCamera", _descriptor20, this);

          this.hintTweenRunning = false;
        }

        // ======================================================== lifecycle
        onLoad() {
          ItemManager.instance = this;
          (_crd && ItemGraphic === void 0 ? (_reportPossibleCrUseOfItemGraphic({
            error: Error()
          }), ItemGraphic) : ItemGraphic).targetShadowColor = this.targetShadowColor.clone();
          (_crd && ItemGraphic === void 0 ? (_reportPossibleCrUseOfItemGraphic({
            error: Error()
          }), ItemGraphic) : ItemGraphic).targetNormalColor = this.targetNormalColor.clone();
        }

        start() {
          if (this.handIntro) this.handIntro.active = false; // Unity: DOVirtual.DelayedCall(0.1f, ...)

          this.scheduleOnce(() => {
            var scroll = (_crd && WorldScrollManager === void 0 ? (_reportPossibleCrUseOfWorldScrollManager({
              error: Error()
            }), WorldScrollManager) : WorldScrollManager).instance;

            if (scroll && this.itemList.length > 0) {
              scroll.setupItems(this.itemList);
              this.updateVisibleShadows();
              this.idleTimer = this.idleTimeToHint; // bật hint ngay sau khi xếp xong
            }
          }, 0.1);
        }

        onDestroy() {
          if (ItemManager.instance === this) ItemManager.instance = null;
        }
        /** InputManager gọi mỗi lần chạm — thay phần poll Input trong Update bên Unity. */


        onAnyPointerDown() {
          this.enableFirstClickObjects();
          this.resetIdleTimer();
          this.hideHint();
        }

        update(dt) {
          var _instance, _instance2;

          // Cuộn thanh bar cũng tính là đang thao tác
          if ((_instance = (_crd && WorldScrollManager === void 0 ? (_reportPossibleCrUseOfWorldScrollManager({
            error: Error()
          }), WorldScrollManager) : WorldScrollManager).instance) != null && _instance.isScrolling()) {
            this.resetIdleTimer();
            this.hideHint();
          }

          if (this.isDragging) return;
          this.idleTimer += dt;

          if (this.idleTimer >= this.idleTimeToHint && !this.hasShownHint) {
            if (this.maxHintItems === -1 || this.arrivedItemCount < this.maxHintItems) {
              this.showHint();
              this.hasShownHint = true;
            }
          } // Hết item -> báo cho BoxManager


          var isListEmpty = this.spawnFromLast ? this.currentItemIndex < 0 : this.currentItemIndex >= this.itemList.length;
          if (isListEmpty) (_instance2 = (_crd && BoxManager === void 0 ? (_reportPossibleCrUseOfBoxManager({
            error: Error()
          }), BoxManager) : BoxManager).instance) == null || _instance2.handleEmptyItems();
        } // ======================================================== shadow batch

        /** Unity: UpdateVisibleShadows */


        updateVisibleShadows() {
          if (!this.itemList || this.itemList.length === 0) return;
          var shadowSrc = this.shadowList && this.shadowList.length > 0 ? this.shadowList : this.itemList; // 1. Dọn item đã ghép khỏi đợt hiện tại

          for (var i = this.currentBatchItems.length - 1; i >= 0; i--) {
            var it = this.currentBatchItems[i];
            if (!it || !it.isValid || it.isPlaced) this.currentBatchItems.splice(i, 1);
          } // 2. Đợt hiện tại xong hết -> nạp đợt tiếp theo


          var batchLimit = this.shadowBatchSize > 0 ? this.shadowBatchSize : 4;

          if (this.currentBatchItems.length === 0) {
            for (var node of shadowSrc) {
              if (!node || !node.isValid) continue;
              var item = node.getComponent(_crd && ItemController === void 0 ? (_reportPossibleCrUseOfItemController({
                error: Error()
              }), ItemController) : ItemController);

              if (item && !item.isPlaced && this.currentBatchItems.indexOf(item) < 0) {
                this.currentBatchItems.push(item);
                if (this.currentBatchItems.length >= batchLimit) break;
              }
            }
          } // 3. Bật bóng cho đợt hiện tại, tắt đích của item chưa tới lượt


          for (var _node of shadowSrc) {
            if (!_node || !_node.isValid) continue;

            var _item = _node.getComponent(_crd && ItemController === void 0 ? (_reportPossibleCrUseOfItemController({
              error: Error()
            }), ItemController) : ItemController);

            if (!_item || !_item.targetPoint) continue;
            if (_item.isPlaced) continue;

            if (this.currentBatchItems.indexOf(_item) >= 0) {
              var _item$itemGraphic;

              _item.targetPoint.active = true;
              (_item$itemGraphic = _item.itemGraphic) == null || _item$itemGraphic.handleTargetSprites(_item.targetPoint, true);
            } else {
              _item.targetPoint.active = false;
            }
          }
        } // ======================================================== first click

        /** Unity: EnableFirstClickObjects */


        enableFirstClickObjects() {
          if (this.isFirstClicked) return;
          this.isFirstClicked = true;

          for (var o of this.objsToEnableOnFirstClick) if (o != null && o.isValid) o.active = true;

          for (var _o of this.objsToDisableOnFirstClick) if (_o != null && _o.isValid) _o.active = false;
        } // ======================================================== item / holder

        /** Unity: GetCurrentItem */


        getCurrentItem() {
          if (this.currentItemIndex >= 0 && this.currentItemIndex < this.itemList.length) {
            var idx = this.currentItemIndex;
            this.currentItemIndex += this.spawnFromLast ? -1 : 1;
            return this.itemList[idx];
          }

          return null;
        }
        /** Unity: GetCurrentHolder — holder trống đầu tiên. */


        getCurrentHolder() {
          for (var h of this.holderItemList) {
            var slot = h == null ? void 0 : h.getComponent(_crd && HolderSlot === void 0 ? (_reportPossibleCrUseOfHolderSlot({
              error: Error()
            }), HolderSlot) : HolderSlot);

            if (slot && slot.isEmpty) {
              this.currentHolder = h;
              return h;
            }
          }

          return null;
        }

        hasAvailableHolder() {
          for (var h of this.holderItemList) {
            var slot = h == null ? void 0 : h.getComponent(_crd && HolderSlot === void 0 ? (_reportPossibleCrUseOfHolderSlot({
              error: Error()
            }), HolderSlot) : HolderSlot);
            if (slot && slot.isEmpty) return true;
          }

          return false;
        }

        getCurrentHolderInUse() {
          return this.currentHolder;
        }
        /** Unity: GetFirstItemInHolder */


        getFirstItemInHolder() {
          for (var h of this.holderItemList) {
            var slot = h == null ? void 0 : h.getComponent(_crd && HolderSlot === void 0 ? (_reportPossibleCrUseOfHolderSlot({
              error: Error()
            }), HolderSlot) : HolderSlot);

            if (slot && !slot.isEmpty && slot.itemInSlot) {
              var ic = slot.itemInSlot.getComponent(_crd && ItemController === void 0 ? (_reportPossibleCrUseOfItemController({
                error: Error()
              }), ItemController) : ItemController);
              if (ic && ic.targetPoint) return ic;
            }
          }

          return null;
        }

        setLastItem(item) {
          this.lastInteractedItem = item;
        }

        getLastItem() {
          return this.lastInteractedItem;
        }
        /** Unity: ItemArrivedAtTarget */


        itemArrivedAtTarget() {
          this.arrivedItemCount++;
          var ui = (_crd && UIManager === void 0 ? (_reportPossibleCrUseOfUIManager({
            error: Error()
          }), UIManager) : UIManager).instance;

          if (ui) {
            ui.tuSo++;
            ui.updateText();
          }

          if (this.arrivedItemCount === 1 && this.objToEnableAfterFirstItem) {
            this.objToEnableAfterFirstItem.active = true;
          }

          this.updateVisibleShadows();
        }

        isAllHolderEmpty() {
          var _instance$getActiveIt, _instance3;

          return ((_instance$getActiveIt = (_instance3 = (_crd && WorldScrollManager === void 0 ? (_reportPossibleCrUseOfWorldScrollManager({
            error: Error()
          }), WorldScrollManager) : WorldScrollManager).instance) == null ? void 0 : _instance3.getActiveItemsCount()) != null ? _instance$getActiveIt : 0) === 0;
        } // ======================================================== hint


        resetIdleTimer() {
          this.idleTimer = 0;
          this.hasShownHint = false;
        }

        hideHint() {
          if (this.handHint && this.handHint.activeInHierarchy) {
            (_crd && TweenUtil === void 0 ? (_reportPossibleCrUseOfTweenUtil({
              error: Error()
            }), TweenUtil) : TweenUtil).killAll(this.handHint);
            this.handHint.active = false;
            this.hintTweenRunning = false;
          }
        }
        /** Unity: ShowHint */


        showHint() {
          var item = this.getLastItem();

          if (!item || !item.isValid || !this.canUseItemHint(item) || !this.isItemOnScreen(item.node)) {
            item = this.getValidHintItem();
            if (item) this.setLastItem(item);
          }

          if (!item) {
            this.hideHint();
            return;
          }

          var ui = (_crd && UIManager === void 0 ? (_reportPossibleCrUseOfUIManager({
            error: Error()
          }), UIManager) : UIManager).instance;

          if (item.targetPoint && (!ui || ui.tuSo < ui.mauSo)) {
            this.runHintTween(item);
          }
        }
        /** Unity: ShowFirstDragHint */


        showFirstDragHint(item) {
          if (this.showedFirstDragHint) return;
          if (!item || !item.targetPoint) return;
          this.showedFirstDragHint = true;
          this.runHintTween(item);
        }
        /**
         * Bàn tay chạy từ item tới đích, lặp vô hạn.
         * Unity dùng DOTween.To(...).SetLoops(-1).SetTarget(handHint).
         */


        runHintTween(item) {
          var hand = this.handHint;
          if (!hand) return;
          (_crd && TweenUtil === void 0 ? (_reportPossibleCrUseOfTweenUtil({
            error: Error()
          }), TweenUtil) : TweenUtil).killAll(hand);
          hand.setWorldPosition(item.node.worldPosition.clone());
          hand.active = true;
          this.hintTweenRunning = true;
          var from = new Vec3();
          var to = new Vec3();
          var cur = new Vec3();
          (_crd && TweenUtil === void 0 ? (_reportPossibleCrUseOfTweenUtil({
            error: Error()
          }), TweenUtil) : TweenUtil).valueTo(2, t => {
            if (!hand.isValid || !item.isValid || !item.targetPoint) return;
            item.node.getWorldPosition(from);
            item.targetPoint.getWorldPosition(to);
            Vec3.lerp(cur, from, to, t);
            hand.setWorldPosition(cur);
          }, 'sineInOut', true);
        }
        /** Unity: CanUseItemHint */


        canUseItemHint(item) {
          if (!item || !item.isValid) return false;
          if (!item.targetPoint) return false;
          var seat = item.getComponent(_crd && SeatHandler === void 0 ? (_reportPossibleCrUseOfSeatHandler({
            error: Error()
          }), SeatHandler) : SeatHandler);
          return seat ? seat.canPlace() : true;
        }
        /** Unity: IsItemOnScreen — viewport -0.05 .. 1.05 */


        isItemOnScreen(node) {
          if (!node || !node.isValid) return false;
          var cam = this.mainCamera;
          if (!cam) return true; // không có camera thì đừng loại item

          var half = cam.orthoHeight;
          var halfW = half * (cam.camera ? cam.camera.aspect : 1);
          var c = cam.node.worldPosition;
          var p = node.worldPosition;
          var marginX = halfW * 2 * 0.05;
          var marginY = half * 2 * 0.05;
          return p.x >= c.x - halfW - marginX && p.x <= c.x + halfW + marginX && p.y >= c.y - half - marginY && p.y <= c.y + half + marginY;
        }
        /** Unity: GetValidHintItem */


        getValidHintItem() {
          var _instance$getActiveIt2, _instance4;

          var items = (_instance$getActiveIt2 = (_instance4 = (_crd && WorldScrollManager === void 0 ? (_reportPossibleCrUseOfWorldScrollManager({
            error: Error()
          }), WorldScrollManager) : WorldScrollManager).instance) == null ? void 0 : _instance4.getActiveItems()) != null ? _instance$getActiveIt2 : [];

          for (var it of items) {
            if (this.canUseItemHint(it) && this.isItemOnScreen(it.node)) return it;
          }

          return null;
        }

      }, _class3.instance = null, _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "spawnFromLast", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "itemList", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "shadowList", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "holderItemList", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "enablePopScale", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "popScaleAmount", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1.2;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "enableDragScale", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "dragScaleAmount", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1.1;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "objsToEnableOnFirstClick", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "objsToDisableOnFirstClick", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "objToEnableAfterFirstItem", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "WinConfetti", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "idleTimeToHint", [_dec14], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 5;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "maxHintItems", [_dec15], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 3;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "handHint", [_dec16], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, "handIntro", [_dec17], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor17 = _applyDecoratedDescriptor(_class2.prototype, "shadowBatchSize", [_dec18], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 4;
        }
      }), _descriptor18 = _applyDecoratedDescriptor(_class2.prototype, "targetShadowColor", [_dec19], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return new Color(51, 51, 51, 255);
        }
      }), _descriptor19 = _applyDecoratedDescriptor(_class2.prototype, "targetNormalColor", [_dec20], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return new Color(255, 255, 255, 255);
        }
      }), _descriptor20 = _applyDecoratedDescriptor(_class2.prototype, "mainCamera", [_dec21], {
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
//# sourceMappingURL=f4f77ea24fedd7f09da0d58af818105f9ec9b43e.js.map