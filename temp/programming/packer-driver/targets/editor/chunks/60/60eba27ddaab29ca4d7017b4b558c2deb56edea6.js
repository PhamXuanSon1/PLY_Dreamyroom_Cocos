System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7", "__unresolved_8", "__unresolved_9", "__unresolved_10", "__unresolved_11", "__unresolved_12"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Vec3, InputManager, InputPriority, ItemGraphic, ItemMovement, OpenItem, ItemManager, WorldScrollManager, SeatHandler, TurnOnSpine, ChangeLight, SoundManager, ObjectPool, PoolType, BlinkEffect, _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _crd, ccclass, property, ItemController;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfInputManager(extras) {
    _reporterNs.report("InputManager", "../core/InputManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfInputPriority(extras) {
    _reporterNs.report("InputPriority", "../core/InputManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfIPointerHandler(extras) {
    _reporterNs.report("IPointerHandler", "../core/InputManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfItemGraphic(extras) {
    _reporterNs.report("ItemGraphic", "./ItemGraphic", _context.meta, extras);
  }

  function _reportPossibleCrUseOfItemMovement(extras) {
    _reporterNs.report("ItemMovement", "./ItemMovement", _context.meta, extras);
  }

  function _reportPossibleCrUseOfOpenItem(extras) {
    _reporterNs.report("OpenItem", "./OpenItem", _context.meta, extras);
  }

  function _reportPossibleCrUseOfItemManager(extras) {
    _reporterNs.report("ItemManager", "../managers/ItemManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfWorldScrollManager(extras) {
    _reporterNs.report("WorldScrollManager", "../managers/WorldScrollManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSeatHandler(extras) {
    _reporterNs.report("SeatHandler", "../utils/SeatHandler", _context.meta, extras);
  }

  function _reportPossibleCrUseOfHolderSlot(extras) {
    _reporterNs.report("HolderSlot", "../utils/HolderSlot", _context.meta, extras);
  }

  function _reportPossibleCrUseOfTurnOnSpine(extras) {
    _reporterNs.report("TurnOnSpine", "../utils/TurnOnSpine", _context.meta, extras);
  }

  function _reportPossibleCrUseOfChangeLight(extras) {
    _reporterNs.report("ChangeLight", "../utils/ChangeLight", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSoundManager(extras) {
    _reporterNs.report("SoundManager", "../core/SoundManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfObjectPool(extras) {
    _reporterNs.report("ObjectPool", "../core/ObjectPool", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPoolType(extras) {
    _reporterNs.report("PoolType", "../core/ObjectPool", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBlinkEffect(extras) {
    _reporterNs.report("BlinkEffect", "../effects/BlinkEffect", _context.meta, extras);
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
    }, function (_unresolved_2) {
      InputManager = _unresolved_2.InputManager;
      InputPriority = _unresolved_2.InputPriority;
    }, function (_unresolved_3) {
      ItemGraphic = _unresolved_3.ItemGraphic;
    }, function (_unresolved_4) {
      ItemMovement = _unresolved_4.ItemMovement;
    }, function (_unresolved_5) {
      OpenItem = _unresolved_5.OpenItem;
    }, function (_unresolved_6) {
      ItemManager = _unresolved_6.ItemManager;
    }, function (_unresolved_7) {
      WorldScrollManager = _unresolved_7.WorldScrollManager;
    }, function (_unresolved_8) {
      SeatHandler = _unresolved_8.SeatHandler;
    }, function (_unresolved_9) {
      TurnOnSpine = _unresolved_9.TurnOnSpine;
    }, function (_unresolved_10) {
      ChangeLight = _unresolved_10.ChangeLight;
    }, function (_unresolved_11) {
      SoundManager = _unresolved_11.SoundManager;
    }, function (_unresolved_12) {
      ObjectPool = _unresolved_12.ObjectPool;
      PoolType = _unresolved_12.PoolType;
    }, function (_unresolved_13) {
      BlinkEffect = _unresolved_13.BlinkEffect;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "ffc0cLfAodA74vrf0OBrhVQ", "ItemController", undefined);
      /**
       * ItemController — port từ Assets/_GAME/Script/Item/ItemController.cs (Unity)
       *
       * Khác biệt CỐ Ý so với bản Unity:
       *   - BỎ Update(). Bên Unity mỗi item tự poll Input và tự Physics.RaycastAll
       *     toàn màn hình (O(n) raycast mỗi lần click). Ở đây InputManager gọi vào.
       *   - Thay Physics.RaycastAll bằng hit-test AABB trong UI space.
       *   - Thay sortingOrder bằng lớp kéo (ItemGraphic.bringToFront).
       *
       * Xem COCOS_MIGRATION_PLAN.md mục 5.2 / 5.3.
       */


      __checkObsolete__(['_decorator', 'Component', 'Node', 'Vec3', 'EventTouch']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("ItemController", ItemController = (_dec = ccclass('ItemController'), _dec2 = property({
        type: Node,
        tooltip: 'Vị trí đích mà item cần được kéo vào để ghép.'
      }), _dec3 = property({
        tooltip: 'Khoảng cách tối thiểu để item tự hút vào đích, tính bằng PIXEL.'
      }), _dec4 = property({
        tooltip: 'Thời gian bay vào vị trí đích (giây).'
      }), _dec5 = property({
        tooltip: 'Tên FxType phát khi đặt đúng chỗ, vd "Grass", "HeavyWood".'
      }), _dec(_class = (_class2 = class ItemController extends Component {
        constructor(...args) {
          super(...args);

          // ---- liên kết map, do exporter mang sang ----
          _initializerDefineProperty(this, "targetPoint", _descriptor, this);

          // ---- tham số tinh chỉnh: đặt và sửa THẲNG BÊN COCOS ----
          _initializerDefineProperty(this, "snapDistance", _descriptor2, this);

          _initializerDefineProperty(this, "moveDuration", _descriptor3, this);

          _initializerDefineProperty(this, "materialType", _descriptor4, this);

          /** Đã ghép vào đích chưa. Trạng thái runtime. */
          this.isPlaced = false;
          this.itemGraphic = null;
          this.itemMovement = null;
          this.currentHolderSlot = null;
          this.inputPriority = (_crd && InputPriority === void 0 ? (_reportPossibleCrUseOfInputPriority({
            error: Error()
          }), InputPriority) : InputPriority).Item;
          this.dragging = false;
          this.moving = false;
        }

        // ======================================================== lifecycle
        onLoad() {
          var _this$getComponent, _this$getComponent2;

          this.itemGraphic = (_this$getComponent = this.getComponent(_crd && ItemGraphic === void 0 ? (_reportPossibleCrUseOfItemGraphic({
            error: Error()
          }), ItemGraphic) : ItemGraphic)) != null ? _this$getComponent : this.addComponent(_crd && ItemGraphic === void 0 ? (_reportPossibleCrUseOfItemGraphic({
            error: Error()
          }), ItemGraphic) : ItemGraphic);
          this.itemMovement = (_this$getComponent2 = this.getComponent(_crd && ItemMovement === void 0 ? (_reportPossibleCrUseOfItemMovement({
            error: Error()
          }), ItemMovement) : ItemMovement)) != null ? _this$getComponent2 : this.addComponent(_crd && ItemMovement === void 0 ? (_reportPossibleCrUseOfItemMovement({
            error: Error()
          }), ItemMovement) : ItemMovement);
        }

        onEnable() {
          var _this$getComponent3, _this$getComponent4;

          if (!this.itemGraphic) this.itemGraphic = (_this$getComponent3 = this.getComponent(_crd && ItemGraphic === void 0 ? (_reportPossibleCrUseOfItemGraphic({
            error: Error()
          }), ItemGraphic) : ItemGraphic)) != null ? _this$getComponent3 : this.addComponent(_crd && ItemGraphic === void 0 ? (_reportPossibleCrUseOfItemGraphic({
            error: Error()
          }), ItemGraphic) : ItemGraphic);
          if (!this.itemMovement) this.itemMovement = (_this$getComponent4 = this.getComponent(_crd && ItemMovement === void 0 ? (_reportPossibleCrUseOfItemMovement({
            error: Error()
          }), ItemMovement) : ItemMovement)) != null ? _this$getComponent4 : this.addComponent(_crd && ItemMovement === void 0 ? (_reportPossibleCrUseOfItemMovement({
            error: Error()
          }), ItemMovement) : ItemMovement);
          (_crd && InputManager === void 0 ? (_reportPossibleCrUseOfInputManager({
            error: Error()
          }), InputManager) : InputManager).register(this);
        }

        onDisable() {
          (_crd && InputManager === void 0 ? (_reportPossibleCrUseOfInputManager({
            error: Error()
          }), InputManager) : InputManager).unregister(this);
        } // ======================================================== input


        hitTest(worldPos) {
          if (this.isPlaced || this.moving) return false;
          return (_crd && InputManager === void 0 ? (_reportPossibleCrUseOfInputManager({
            error: Error()
          }), InputManager) : InputManager).hitTestSelfOrChildren(this.node, worldPos);
        }
        /** Unity: PickUpItem */


        onPointerDown(_worldPos, _ev) {
          var _instance, _this$currentHolderSl, _instance2;

          if (this.isPlaced || this.moving) return false;
          (_instance = (_crd && SoundManager === void 0 ? (_reportPossibleCrUseOfSoundManager({
            error: Error()
          }), SoundManager) : SoundManager).instance) == null ? void 0 : _instance.playFx('PickItem');
          this.itemMovement.startDragAnimation();
          this.dragging = true; // Unity: ItemManager.layerTop++ rồi SaveLayersAndSetTo20

          this.itemGraphic.bringToFront();
          const im = (_crd && ItemManager === void 0 ? (_reportPossibleCrUseOfItemManager({
            error: Error()
          }), ItemManager) : ItemManager).instance;

          if (im) {
            im.isDragging = true;
            im.setLastItem(this);
            im.resetIdleTimer();
            if (im.handHint) im.handHint.active = false;
          }

          (_this$currentHolderSl = this.currentHolderSlot) == null ? void 0 : _this$currentHolderSl.stopBobbingAnimation();
          (_instance2 = (_crd && WorldScrollManager === void 0 ? (_reportPossibleCrUseOfWorldScrollManager({
            error: Error()
          }), WorldScrollManager) : WorldScrollManager).instance) == null ? void 0 : _instance2.itemPickedUp(this);
          return true;
        }

        onPointerMove(worldPos, _ev) {
          if (!this.dragging) return;
          this.itemMovement.moveToPosition(worldPos);
        }
        /** Unity: phần GetMouseButtonUp trong Update */


        onPointerUp(_worldPos, _ev) {
          if (!this.dragging) return;
          this.dragging = false;
          this.itemMovement.stopDragAnimation();
          const im = (_crd && ItemManager === void 0 ? (_reportPossibleCrUseOfItemManager({
            error: Error()
          }), ItemManager) : ItemManager).instance;

          if (im) {
            im.isDragging = false;
            im.resetIdleTimer();
          }

          this.checkSnap();
        }

        onPointerCancel() {
          if (!this.dragging) return;
          this.dragging = false;
          this.itemMovement.stopDragAnimation();
          if ((_crd && ItemManager === void 0 ? (_reportPossibleCrUseOfItemManager({
            error: Error()
          }), ItemManager) : ItemManager).instance) (_crd && ItemManager === void 0 ? (_reportPossibleCrUseOfItemManager({
            error: Error()
          }), ItemManager) : ItemManager).instance.isDragging = false;
          this.snapFailed();
        } // ======================================================== snap

        /** Unity: CheckSnap */


        checkSnap() {
          if (!this.targetPoint || !this.targetPoint.isValid) {
            this.snapFailed();
            return;
          }

          const distance = Vec3.distance(this.node.worldPosition, this.targetPoint.worldPosition);

          if (distance < this.snapDistance) {
            // Unity: nếu có SeatHandler thì phải thoả điều kiện tiên quyết
            const seat = this.getComponent(_crd && SeatHandler === void 0 ? (_reportPossibleCrUseOfSeatHandler({
              error: Error()
            }), SeatHandler) : SeatHandler);

            if (seat && !seat.canPlace()) {
              console.log('[ItemController] Phải đặt item khác trước!');
              this.snapFailed();
              return;
            }

            this.moveToTarget();
          } else {
            this.snapFailed();
          }
        }
        /** Thả hụt: xoay lệch rồi trả item về thanh bar. */


        snapFailed() {
          this.itemMovement.snapFailedAnimation();

          if (this.currentHolderSlot) {
            this.currentHolderSlot.startBobbingAnimation();
            this.itemGraphic.restoreOriginalLayers();
          } else if ((_crd && WorldScrollManager === void 0 ? (_reportPossibleCrUseOfWorldScrollManager({
            error: Error()
          }), WorldScrollManager) : WorldScrollManager).instance) {
            // restoreOriginalLayers được gọi sau khi bay về đích
            (_crd && WorldScrollManager === void 0 ? (_reportPossibleCrUseOfWorldScrollManager({
              error: Error()
            }), WorldScrollManager) : WorldScrollManager).instance.itemReturned(this);
          } else {
            this.itemGraphic.restoreOriginalLayers();
          }
        }
        /** Unity: MoveToTarget */


        moveToTarget() {
          var _instance3;

          const target = this.targetPoint;
          this.moving = true;
          (_instance3 = (_crd && WorldScrollManager === void 0 ? (_reportPossibleCrUseOfWorldScrollManager({
            error: Error()
          }), WorldScrollManager) : WorldScrollManager).instance) == null ? void 0 : _instance3.itemPlaced(this);
          this.itemMovement.moveToTarget(target, this.moveDuration, () => {
            var _this$getComponent5, _this$getComponent6, _instance4, _instance5, _instance6;

            // bật đích lên sau khi đã bay tới nơi
            target.active = true;

            for (const child of target.children) child.active = true;

            this.isPlaced = true;
            (_this$getComponent5 = this.getComponent(_crd && TurnOnSpine === void 0 ? (_reportPossibleCrUseOfTurnOnSpine({
              error: Error()
            }), TurnOnSpine) : TurnOnSpine)) == null ? void 0 : _this$getComponent5.activateSpine();
            (_this$getComponent6 = this.getComponent(_crd && OpenItem === void 0 ? (_reportPossibleCrUseOfOpenItem({
              error: Error()
            }), OpenItem) : OpenItem)) == null ? void 0 : _this$getComponent6.onItemPlaced();
            (_instance4 = (_crd && SoundManager === void 0 ? (_reportPossibleCrUseOfSoundManager({
              error: Error()
            }), SoundManager) : SoundManager).instance) == null ? void 0 : _instance4.playFx(this.materialType);

            if (this.currentHolderSlot) {
              this.currentHolderSlot.clearSlot();
              this.currentHolderSlot = null;
            }

            this.itemGraphic.restoreOriginalLayers();
            this.itemGraphic.matchItemSortingOrderToTarget(target); // Unity: transform.rotation = targetPoint.rotation

            this.node.setWorldRotation(target.worldRotation);
            this.itemGraphic.restoreTargetSprites();
            this.moving = false;
            (_crd && InputManager === void 0 ? (_reportPossibleCrUseOfInputManager({
              error: Error()
            }), InputManager) : InputManager).unregister(this); // Unity tắt item đi, để hình ở đích hiện lên thay

            this.node.active = false;
            this.spawnBlinkEffect(target);
            (_instance5 = (_crd && ItemManager === void 0 ? (_reportPossibleCrUseOfItemManager({
              error: Error()
            }), ItemManager) : ItemManager).instance) == null ? void 0 : _instance5.itemArrivedAtTarget();
            (_instance6 = (_crd && ItemManager === void 0 ? (_reportPossibleCrUseOfItemManager({
              error: Error()
            }), ItemManager) : ItemManager).instance) == null ? void 0 : _instance6.setLastItem(null);
            (_crd && ChangeLight === void 0 ? (_reportPossibleCrUseOfChangeLight({
              error: Error()
            }), ChangeLight) : ChangeLight).notifyItemPlaced();
          });
        }
        /** Unity: Ply_Pool.Ins.Spawn<BlinkEffect>(PoolType.BlinkFX, ...) */


        spawnBlinkEffect(target) {
          var _fx$getComponent;

          const pool = (_crd && ObjectPool === void 0 ? (_reportPossibleCrUseOfObjectPool({
            error: Error()
          }), ObjectPool) : ObjectPool).instance;
          if (!pool) return;
          const fx = pool.spawn((_crd && PoolType === void 0 ? (_reportPossibleCrUseOfPoolType({
            error: Error()
          }), PoolType) : PoolType).BlinkFX, target.worldPosition);
          if (!fx) return;
          fx.setParent(target, true);
          fx.active = true;
          (_fx$getComponent = fx.getComponent(_crd && BlinkEffect === void 0 ? (_reportPossibleCrUseOfBlinkEffect({
            error: Error()
          }), BlinkEffect) : BlinkEffect)) == null ? void 0 : _fx$getComponent.deSpawnByTime(2);
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "targetPoint", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "snapDistance", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 200;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "moveDuration", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.2;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "materialType", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return '';
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=60eba27ddaab29ca4d7017b4b558c2deb56edea6.js.map