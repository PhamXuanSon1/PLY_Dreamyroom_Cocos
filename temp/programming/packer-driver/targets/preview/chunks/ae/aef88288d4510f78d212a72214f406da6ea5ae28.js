System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7", "__unresolved_8", "__unresolved_9", "__unresolved_10", "__unresolved_11", "__unresolved_12", "__unresolved_13"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Vec3, BoxCollider2D, Vec2, Enum, DreamyInputManager, InputPriority, ItemGraphic, ItemMovement, OpenItem, ItemManager, WorldScrollManager, SeatHandler, TurnOnSpine, ChangeLight, ObjectPool, PoolType, BlinkEffect, sm, SoundType, DreamySoundManager, _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _crd, ccclass, property, MaterialType, ItemController;

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

  function _reportPossibleCrUseOfObjectPool(extras) {
    _reporterNs.report("ObjectPool", "../core/ObjectPool", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPoolType(extras) {
    _reporterNs.report("PoolType", "../core/ObjectPool", _context.meta, extras);
  }

  function _reportPossibleCrUseOfBlinkEffect(extras) {
    _reporterNs.report("BlinkEffect", "../effects/BlinkEffect", _context.meta, extras);
  }

  function _reportPossibleCrUseOfsm(extras) {
    _reporterNs.report("sm", "../../Manager/SoundManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSoundType(extras) {
    _reporterNs.report("SoundType", "../../Manager/SoundManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfDreamySoundManager(extras) {
    _reporterNs.report("DreamySoundManager", "../core/SoundManager", _context.meta, extras);
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
      BoxCollider2D = _cc.BoxCollider2D;
      Vec2 = _cc.Vec2;
      Enum = _cc.Enum;
    }, function (_unresolved_2) {
      DreamyInputManager = _unresolved_2.DreamyInputManager;
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
      ObjectPool = _unresolved_11.ObjectPool;
      PoolType = _unresolved_11.PoolType;
    }, function (_unresolved_12) {
      BlinkEffect = _unresolved_12.BlinkEffect;
    }, function (_unresolved_13) {
      sm = _unresolved_13.sm;
      SoundType = _unresolved_13.SoundType;
    }, function (_unresolved_14) {
      DreamySoundManager = _unresolved_14.SoundManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "ffc0cLfAodA74vrf0OBrhVQ", "ItemController", undefined);
      /**
       * ItemController — Quản lý tương tác, kéo thả và ghép item vào vị trí đích (Target).
       * Sử dụng hệ thống âm thanh từ PLY_SoundManager (sm).
       */


      __checkObsolete__(['_decorator', 'Component', 'Node', 'Vec3', 'EventTouch', 'BoxCollider2D', 'UITransform', 'Vec2', 'Enum']);

      ({
        ccclass,
        property
      } = _decorator);
      /** Danh sách các loại âm thanh chất liệu tuỳ chọn khi ghép đúng */

      _export("MaterialType", MaterialType = /*#__PURE__*/function (MaterialType) {
        MaterialType[MaterialType["None"] = 0] = "None";
        MaterialType[MaterialType["ClickBox"] = 1] = "ClickBox";
        MaterialType[MaterialType["PickItem"] = 2] = "PickItem";
        MaterialType[MaterialType["HeavyWood"] = 3] = "HeavyWood";
        MaterialType[MaterialType["SmallWood"] = 4] = "SmallWood";
        MaterialType[MaterialType["Cloth"] = 5] = "Cloth";
        MaterialType[MaterialType["DropMetal"] = 6] = "DropMetal";
        MaterialType[MaterialType["Glass"] = 7] = "Glass";
        MaterialType[MaterialType["DropOnFloor"] = 8] = "DropOnFloor";
        MaterialType[MaterialType["Cat1"] = 9] = "Cat1";
        MaterialType[MaterialType["Cat2"] = 10] = "Cat2";
        MaterialType[MaterialType["Cat3"] = 11] = "Cat3";
        MaterialType[MaterialType["Water"] = 12] = "Water";
        MaterialType[MaterialType["BurnOn"] = 13] = "BurnOn";
        MaterialType[MaterialType["BookOpen"] = 14] = "BookOpen";
        MaterialType[MaterialType["CapyDrop"] = 15] = "CapyDrop";
        MaterialType[MaterialType["Grass"] = 16] = "Grass";
        MaterialType[MaterialType["Chair"] = 17] = "Chair";
        MaterialType[MaterialType["CoinBag"] = 18] = "CoinBag";
        MaterialType[MaterialType["GoldChest"] = 19] = "GoldChest";
        MaterialType[MaterialType["WoodenFish"] = 20] = "WoodenFish";
        MaterialType[MaterialType["Window"] = 21] = "Window";
        MaterialType[MaterialType["WoodenDoor"] = 22] = "WoodenDoor";
        MaterialType[MaterialType["Skeleton"] = 23] = "Skeleton";
        MaterialType[MaterialType["WoodenChair"] = 24] = "WoodenChair";
        MaterialType[MaterialType["ComCop"] = 25] = "ComCop";
        MaterialType[MaterialType["Rem"] = 26] = "Rem";
        MaterialType[MaterialType["ClothesDrop"] = 27] = "ClothesDrop";
        MaterialType[MaterialType["Decor"] = 28] = "Decor";
        return MaterialType;
      }({}));

      Enum(MaterialType);

      _export("ItemController", ItemController = (_dec = ccclass('ItemController'), _dec2 = property({
        type: Node,
        tooltip: 'Vị trí đích mà item cần được kéo vào để ghép.'
      }), _dec3 = property({
        tooltip: 'Khoảng cách tối thiểu để item tự hút vào đích (pixel).'
      }), _dec4 = property({
        tooltip: 'Thời gian bay vào vị trí đích (giây).'
      }), _dec5 = property({
        type: Enum(MaterialType),
        tooltip: 'Âm thanh chất liệu tuỳ chọn khi ghép đúng (None = không phát/tuỳ chọn).'
      }), _dec(_class = (_class2 = class ItemController extends Component {
        constructor() {
          super(...arguments);

          // ---- Vị trí đích ----
          _initializerDefineProperty(this, "targetPoint", _descriptor, this);

          // ---- Tham số kéo thả & Snap ----
          _initializerDefineProperty(this, "snapDistance", _descriptor2, this);

          _initializerDefineProperty(this, "moveDuration", _descriptor3, this);

          _initializerDefineProperty(this, "materialType", _descriptor4, this);

          /** Đã ghép thành công vào đích hay chưa */
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

        // ======================================================== Lifecycle
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
          (_crd && DreamyInputManager === void 0 ? (_reportPossibleCrUseOfDreamyInputManager({
            error: Error()
          }), DreamyInputManager) : DreamyInputManager).register(this);
        }

        onDisable() {
          (_crd && DreamyInputManager === void 0 ? (_reportPossibleCrUseOfDreamyInputManager({
            error: Error()
          }), DreamyInputManager) : DreamyInputManager).unregister(this);
        } // ======================================================== Input & HitTest


        hitTest(worldPos) {
          if (this.isPlaced || this.moving || !this.node.activeInHierarchy) return false; // 1. Kiểm tra qua BoxCollider2D nếu có

          var col = this.getComponent(BoxCollider2D);

          if (col && col.worldAABB) {
            if (col.worldAABB.contains(new Vec2(worldPos.x, worldPos.y))) {
              return true;
            }
          } // 2. Kiểm tra qua UITransform AABB


          return (_crd && DreamyInputManager === void 0 ? (_reportPossibleCrUseOfDreamyInputManager({
            error: Error()
          }), DreamyInputManager) : DreamyInputManager).hitTestSelfOrChildren(this.node, worldPos);
        }
        /** Bắt đầu nhấc item lên (Pick) */


        onPointerDown(_worldPos, _ev) {
          var _this$currentHolderSl, _instance2;

          if (this.isPlaced || this.moving) return false; // 1. Phát âm thanh Pick từ PLY_SoundManager

          if (_crd && sm === void 0 ? (_reportPossibleCrUseOfsm({
            error: Error()
          }), sm) : sm) {
            (_crd && sm === void 0 ? (_reportPossibleCrUseOfsm({
              error: Error()
            }), sm) : sm).playSound((_crd && SoundType === void 0 ? (_reportPossibleCrUseOfSoundType({
              error: Error()
            }), SoundType) : SoundType).Pick);
          } else {
            var _instance;

            (_instance = (_crd && DreamySoundManager === void 0 ? (_reportPossibleCrUseOfDreamySoundManager({
              error: Error()
            }), DreamySoundManager) : DreamySoundManager).instance) == null ? void 0 : _instance.playFx('PickItem');
          } // 2. Animation & đưa lên lớp kéo trên cùng


          this.itemMovement.startDragAnimation();
          this.dragging = true;
          this.itemGraphic.bringToFront(); // 3. Thông báo cho ItemManager

          var im = (_crd && ItemManager === void 0 ? (_reportPossibleCrUseOfItemManager({
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
        /** Di chuyển theo ngón tay / chuột */


        onPointerMove(worldPos, _ev) {
          if (!this.dragging) return;
          this.itemMovement.moveToPosition(worldPos);
        }
        /** Thả tay (Pointer Up) */


        onPointerUp(_worldPos, _ev) {
          if (!this.dragging) return;
          this.dragging = false;
          this.itemMovement.stopDragAnimation();
          var im = (_crd && ItemManager === void 0 ? (_reportPossibleCrUseOfItemManager({
            error: Error()
          }), ItemManager) : ItemManager).instance;

          if (im) {
            im.isDragging = false;
            im.resetIdleTimer();
          }

          this.checkSnap();
        }
        /** Huỷ thao tác giữa chừng */


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
        } // ======================================================== Snap Logic

        /** Kiểm tra xem item có đủ gần đích để ghép không */


        checkSnap() {
          if (!this.targetPoint || !this.targetPoint.isValid) {
            this.snapFailed();
            return;
          }

          var distance = Vec3.distance(this.node.worldPosition, this.targetPoint.worldPosition);

          if (distance <= this.snapDistance) {
            // Kiểm tra điều kiện phụ (SeatHandler nếu có)
            var seat = this.getComponent(_crd && SeatHandler === void 0 ? (_reportPossibleCrUseOfSeatHandler({
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
        /** Thả trượt: Bay về vị trí ban đầu + phát âm thanh LandFail */


        snapFailed() {
          if (_crd && sm === void 0 ? (_reportPossibleCrUseOfsm({
            error: Error()
          }), sm) : sm) {
            (_crd && sm === void 0 ? (_reportPossibleCrUseOfsm({
              error: Error()
            }), sm) : sm).playSound((_crd && SoundType === void 0 ? (_reportPossibleCrUseOfSoundType({
              error: Error()
            }), SoundType) : SoundType).LandFail);
          }

          this.itemMovement.snapFailedAnimation();

          if (this.currentHolderSlot) {
            this.currentHolderSlot.startBobbingAnimation();
            this.itemGraphic.restoreOriginalLayers();
          } else if ((_crd && WorldScrollManager === void 0 ? (_reportPossibleCrUseOfWorldScrollManager({
            error: Error()
          }), WorldScrollManager) : WorldScrollManager).instance) {
            (_crd && WorldScrollManager === void 0 ? (_reportPossibleCrUseOfWorldScrollManager({
              error: Error()
            }), WorldScrollManager) : WorldScrollManager).instance.itemReturned(this);
          } else {
            this.itemGraphic.restoreOriginalLayers();
          }
        }
        /** Ghép đúng: Bay vào Target + bật Target + phát âm thanh Done/LandRight */


        moveToTarget() {
          var _instance3;

          var target = this.targetPoint;
          this.moving = true;
          (_instance3 = (_crd && WorldScrollManager === void 0 ? (_reportPossibleCrUseOfWorldScrollManager({
            error: Error()
          }), WorldScrollManager) : WorldScrollManager).instance) == null ? void 0 : _instance3.itemPlaced(this);
          this.itemMovement.moveToTarget(target, this.moveDuration, () => {
            var _this$getComponent5, _this$getComponent6, _instance5, _instance6;

            // 1. Kích hoạt Target và tất cả các node con của Target
            target.active = true;

            for (var child of target.children) {
              child.active = true;
            }

            this.isPlaced = true; // 2. Kích hoạt spine hoặc trigger phụ

            (_this$getComponent5 = this.getComponent(_crd && TurnOnSpine === void 0 ? (_reportPossibleCrUseOfTurnOnSpine({
              error: Error()
            }), TurnOnSpine) : TurnOnSpine)) == null ? void 0 : _this$getComponent5.activateSpine();
            (_this$getComponent6 = this.getComponent(_crd && OpenItem === void 0 ? (_reportPossibleCrUseOfOpenItem({
              error: Error()
            }), OpenItem) : OpenItem)) == null ? void 0 : _this$getComponent6.onItemPlaced(); // 3. Phát âm thanh Done / LandRight từ PLY_SoundManager

            if (_crd && sm === void 0 ? (_reportPossibleCrUseOfsm({
              error: Error()
            }), sm) : sm) {
              (_crd && sm === void 0 ? (_reportPossibleCrUseOfsm({
                error: Error()
              }), sm) : sm).playSound((_crd && SoundType === void 0 ? (_reportPossibleCrUseOfSoundType({
                error: Error()
              }), SoundType) : SoundType).Done);
            }

            if (this.materialType !== MaterialType.None) {
              var _instance4;

              var soundName = MaterialType[this.materialType];
              (_instance4 = (_crd && DreamySoundManager === void 0 ? (_reportPossibleCrUseOfDreamySoundManager({
                error: Error()
              }), DreamySoundManager) : DreamySoundManager).instance) == null ? void 0 : _instance4.playFx(soundName);
            } // 4. Giải phóng slot nếu nằm trong thanh bar


            if (this.currentHolderSlot) {
              this.currentHolderSlot.clearSlot();
              this.currentHolderSlot = null;
            }

            this.itemGraphic.restoreOriginalLayers();
            this.itemGraphic.matchItemSortingOrderToTarget(target);
            this.node.setWorldRotation(target.worldRotation);
            this.itemGraphic.restoreTargetSprites();
            this.moving = false;
            (_crd && DreamyInputManager === void 0 ? (_reportPossibleCrUseOfDreamyInputManager({
              error: Error()
            }), DreamyInputManager) : DreamyInputManager).unregister(this); // 5. Ẩn item đi (hình ảnh ở Target đã hiện lên thay thế)

            this.node.active = false; // 6. Hiệu ứng Blink / Star FX

            this.spawnBlinkEffect(target); // 7. Báo cho ItemManager tiến độ

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
        /** Spawn hiệu ứng lấp lánh khi đặt đúng */


        spawnBlinkEffect(target) {
          var _fx$getComponent;

          var pool = (_crd && ObjectPool === void 0 ? (_reportPossibleCrUseOfObjectPool({
            error: Error()
          }), ObjectPool) : ObjectPool).instance;
          if (!pool) return;
          var fx = pool.spawn((_crd && PoolType === void 0 ? (_reportPossibleCrUseOfPoolType({
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
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "snapDistance", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 200;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "moveDuration", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.2;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "materialType", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return MaterialType.None;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=aef88288d4510f78d212a72214f406da6ea5ae28.js.map