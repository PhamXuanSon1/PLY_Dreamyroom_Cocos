System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Vec3, Camera, math, ItemController, InputManager, InputPriority, TweenUtil, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _class3, _crd, ccclass, property, WorldScrollManager;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfItemController(extras) {
    _reporterNs.report("ItemController", "../item/ItemController", _context.meta, extras);
  }

  function _reportPossibleCrUseOfInputManager(extras) {
    _reporterNs.report("InputManager", "../core/InputManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfInputPriority(extras) {
    _reporterNs.report("InputPriority", "../core/InputManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfIPointerHandler(extras) {
    _reporterNs.report("IPointerHandler", "../core/InputManager", _context.meta, extras);
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
      Vec3 = _cc.Vec3;
      Camera = _cc.Camera;
      math = _cc.math;
    }, function (_unresolved_2) {
      ItemController = _unresolved_2.ItemController;
    }, function (_unresolved_3) {
      InputManager = _unresolved_3.InputManager;
      InputPriority = _unresolved_3.InputPriority;
    }, function (_unresolved_4) {
      TweenUtil = _unresolved_4.TweenUtil;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "620e0C2aVxLgIO8nf/GmBZn", "WorldScrollManager", undefined);
      /**
       * WorldScrollManager — port từ Assets/_GAME/Script/Manager/WorldScrollManager.cs (Unity)
       *
       * KHÁC bản Unity:
       *   - Không tự poll Input; đăng ký làm IPointerHandler ở mức ưu tiên Scroll,
       *     nên item luôn được ưu tiên trước (Item = 10 < Scroll = 30).
       *   - cam.ViewportToWorldPoint -> tự tính mép màn hình từ orthoHeight + aspect.
       *   - DOTween.IsTweening -> TweenUtil.isTweening.
       *
       * Mọi khoảng cách ở đây là PIXEL (exporter đã nhân K).
       */


      __checkObsolete__(['_decorator', 'Component', 'Node', 'Vec3', 'EventTouch', 'Camera', 'math']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("WorldScrollManager", WorldScrollManager = (_dec = ccclass('WorldScrollManager'), _dec2 = property({
        type: Node,
        tooltip: 'Anchor lấy toạ độ Y cho item trên thanh bar.'
      }), _dec3 = property({
        type: Camera,
        tooltip: 'Camera dùng để tính mép trái/phải màn hình.'
      }), _dec4 = property({
        tooltip: 'Khoảng cách từ mép trái màn hình tới item đầu (px).'
      }), _dec5 = property({
        tooltip: 'Khoảng cách tối thiểu từ mép phải tới item cuối (px).'
      }), _dec6 = property({
        tooltip: 'Khoảng cách giữa các item (px).'
      }), _dec7 = property({
        tooltip: 'Ngưỡng phân biệt Cuộn và Click (px).'
      }), _dec(_class = (_class2 = (_class3 = class WorldScrollManager extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "itemAnchor", _descriptor, this);

          _initializerDefineProperty(this, "mainCamera", _descriptor2, this);

          _initializerDefineProperty(this, "leftPadding", _descriptor3, this);

          _initializerDefineProperty(this, "rightPadding", _descriptor4, this);

          _initializerDefineProperty(this, "spacing", _descriptor5, this);

          _initializerDefineProperty(this, "dragThreshold", _descriptor6, this);

          this.activeItems = [];
          this.itemBaseX = new Map();
          this.scrolling = false;
          this.lastPointer = new Vec3();
          this.currentScrollOffset = 0;
          this.minX = 0;
          this.maxX = 0;
          this.currentDraggedItem = null;
          this.inputPriority = (_crd && InputPriority === void 0 ? (_reportPossibleCrUseOfInputPriority({
            error: Error()
          }), InputPriority) : InputPriority).Scroll;
        }

        // ======================================================== lifecycle
        onLoad() {
          WorldScrollManager.instance = this;
        }

        onEnable() {
          (_crd && InputManager === void 0 ? (_reportPossibleCrUseOfInputManager({
            error: Error()
          }), InputManager) : InputManager).register(this);
        }

        onDisable() {
          (_crd && InputManager === void 0 ? (_reportPossibleCrUseOfInputManager({
            error: Error()
          }), InputManager) : InputManager).unregister(this);
        }

        onDestroy() {
          if (WorldScrollManager.instance === this) WorldScrollManager.instance = null;
        } // ======================================================== mép màn hình

        /** Unity: cam.ViewportToWorldPoint(0,0).x + leftPadding */


        getStartX() {
          var cam = this.mainCamera;
          if (!cam) return this.node.worldPosition.x;
          var halfW = cam.orthoHeight * (cam.camera ? cam.camera.aspect : 1);
          return cam.node.worldPosition.x - halfW + this.leftPadding;
        }

        screenRightX() {
          var cam = this.mainCamera;
          if (!cam) return this.node.worldPosition.x;
          var halfW = cam.orthoHeight * (cam.camera ? cam.camera.aspect : 1);
          return cam.node.worldPosition.x + halfW;
        }
        /** Unity: CalculateScrollLimits */


        calculateScrollLimits(maxItemX) {
          this.maxX = 0;

          if (this.mainCamera) {
            this.minX = this.screenRightX() - this.rightPadding - maxItemX;
          } else {
            this.minX = -(maxItemX - this.getStartX());
          }

          if (this.minX > this.maxX) this.minX = this.maxX;
        } // ======================================================== xếp item

        /** Unity: SetupItems */


        setupItems(items) {
          this.activeItems.length = 0;
          this.itemBaseX.clear();
          this.currentScrollOffset = 0;
          var startX = this.getStartX();
          var maxItemX = startX;

          for (var node of items) {
            if (!node || !node.isValid) continue;
            var item = node.getComponent(_crd && ItemController === void 0 ? (_reportPossibleCrUseOfItemController({
              error: Error()
            }), ItemController) : ItemController);
            if (!item) continue;
            this.activeItems.push(item);
            this.itemBaseX.set(item, startX);
            node.active = true;
            var targetY = this.itemAnchor ? this.itemAnchor.worldPosition.y : node.worldPosition.y;
            node.setWorldPosition(startX, targetY, node.worldPosition.z);
            var g = item.itemGraphic;

            if (g) {
              node.setScale(g.listScale.clone());
              node.eulerAngles = g.listRotation.clone();
            }

            maxItemX = startX;
            startX += this.spacing;
          }

          this.calculateScrollLimits(maxItemX);
        } // ======================================================== input

        /** Cuộn nhận sự kiện ở bất kỳ đâu — item đã được ưu tiên trước. */


        hitTest(_worldPos) {
          return this.activeItems.length > 0;
        }

        onPointerDown(worldPos, _ev) {
          // Đang kéo item thì không cuộn (Unity: if (!ItemManager.isDragging) HandleInput()).
          // Thực tế InputManager đã chặn sẵn vì item bắt sự kiện trước, đây là lớp bảo hiểm.
          if (this.currentDraggedItem) return false;
          this.lastPointer.set(worldPos);
          this.scrolling = false;
          return true; // giữ chuỗi move/up để còn phân biệt cuộn hay click
        }

        onPointerMove(worldPos, _ev) {
          var dx = worldPos.x - this.lastPointer.x;
          var dy = worldPos.y - this.lastPointer.y;

          if (!this.scrolling && Math.abs(dx) > this.dragThreshold && Math.abs(dx) > Math.abs(dy)) {
            this.scrolling = true;
          }

          if (this.scrolling) {
            this.currentScrollOffset = math.clamp(this.currentScrollOffset + dx, this.minX, this.maxX);
            this.lastPointer.set(worldPos);
          }
        }

        onPointerUp() {
          this.scrolling = false;
        }

        onPointerCancel() {
          this.scrolling = false;
        }

        isScrolling() {
          return this.scrolling;
        } // ======================================================== cập nhật vị trí


        update() {
          if (this.activeItems.length === 0) return;
          this.updateAllItemsPositions();
        }
        /** Unity: UpdateAllItemsPositions */


        updateAllItemsPositions() {
          var anchorY = this.itemAnchor ? this.itemAnchor.worldPosition.y : 0;

          for (var item of this.activeItems) {
            if (!item || !item.isValid) continue;
            if (item === this.currentDraggedItem) continue; // Bỏ qua item đang animate (bay về khay / dồn danh sách)

            if ((_crd && TweenUtil === void 0 ? (_reportPossibleCrUseOfTweenUtil({
              error: Error()
            }), TweenUtil) : TweenUtil).isTweening(item.node)) continue;
            var baseX = this.itemBaseX.get(item);
            if (baseX === undefined) continue;
            var p = item.node.worldPosition;
            var y = this.itemAnchor ? anchorY : p.y;
            item.node.setWorldPosition(baseX + this.currentScrollOffset, y, p.z);
          }
        }
        /** Unity: ReorganizeList */


        reorganizeList(animate) {
          if (animate === void 0) {
            animate = false;
          }

          var startX = this.getStartX();
          var maxItemX = startX;

          for (var item of this.activeItems) {
            if (!item || !item.isValid) continue;
            this.itemBaseX.set(item, startX); // Item đang bị kéo thì không cộng spacing, để chỗ trống được lấp

            if (item === this.currentDraggedItem) continue;
            var p = item.node.worldPosition;
            var targetY = this.itemAnchor ? this.itemAnchor.worldPosition.y : p.y;
            var target = new Vec3(startX + this.currentScrollOffset, targetY, p.z);
            if (animate) (_crd && TweenUtil === void 0 ? (_reportPossibleCrUseOfTweenUtil({
              error: Error()
            }), TweenUtil) : TweenUtil).moveTo(item.node, target, 0.3, 'quadOut');else item.node.setWorldPosition(target);
            maxItemX = startX;
            startX += this.spacing;
          }

          this.calculateScrollLimits(maxItemX);
        } // ======================================================== hook từ ItemController

        /** Unity: ItemPickedUp */


        itemPickedUp(item) {
          if (this.activeItems.indexOf(item) < 0) return;
          this.currentDraggedItem = item;
          this.reorganizeList(true);
        }
        /** Unity: ItemReturned */


        itemReturned(item) {
          var _this$itemBaseX$get;

          if (this.activeItems.indexOf(item) < 0 || this.currentDraggedItem !== item) return;
          this.currentDraggedItem = null;
          this.reorganizeList(true);
          var baseX = (_this$itemBaseX$get = this.itemBaseX.get(item)) != null ? _this$itemBaseX$get : item.node.worldPosition.x;
          var p = item.node.worldPosition;
          var targetY = this.itemAnchor ? this.itemAnchor.worldPosition.y : p.y;
          (_crd && TweenUtil === void 0 ? (_reportPossibleCrUseOfTweenUtil({
            error: Error()
          }), TweenUtil) : TweenUtil).killAll(item.node);
          (_crd && TweenUtil === void 0 ? (_reportPossibleCrUseOfTweenUtil({
            error: Error()
          }), TweenUtil) : TweenUtil).moveTo(item.node, new Vec3(baseX + this.currentScrollOffset, targetY, p.z), 0.3, 'quadOut', () => {
            var _item$itemGraphic;

            (_item$itemGraphic = item.itemGraphic) == null ? void 0 : _item$itemGraphic.restoreOriginalLayers();
          });
          var g = item.itemGraphic;

          if (g) {
            (_crd && TweenUtil === void 0 ? (_reportPossibleCrUseOfTweenUtil({
              error: Error()
            }), TweenUtil) : TweenUtil).scaleTo(item.node, g.listScale, 0.3);
            (_crd && TweenUtil === void 0 ? (_reportPossibleCrUseOfTweenUtil({
              error: Error()
            }), TweenUtil) : TweenUtil).rotateTo(item.node, g.listRotation, 0.3);
          }
        }
        /** Unity: ItemPlaced */


        itemPlaced(item) {
          var i = this.activeItems.indexOf(item);
          if (i < 0) return;
          this.activeItems.splice(i, 1);
          this.itemBaseX.delete(item);
          if (this.currentDraggedItem === item) this.currentDraggedItem = null;
          this.reorganizeList(true);
        }

        getActiveItemsCount() {
          return this.activeItems.length;
        }

        getActiveItems() {
          return this.activeItems;
        }

      }, _class3.instance = null, _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "itemAnchor", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "mainCamera", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "leftPadding", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 200;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "rightPadding", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 200;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "spacing", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 200;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "dragThreshold", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 20;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=9fe13de5c53a79c4d32bf38c4103121fb156410d.js.map