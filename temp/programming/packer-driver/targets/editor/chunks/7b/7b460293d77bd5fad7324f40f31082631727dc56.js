System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, input, Input, Vec3, Vec2, UITransform, Layers, ItemGraphic, ItemManager, _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _class3, _crd, ccclass, property, executeInEditMode, Ed, InputPriority, DreamyInputManager;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfItemGraphic(extras) {
    _reporterNs.report("ItemGraphic", "../item/ItemGraphic", _context.meta, extras);
  }

  function _reportPossibleCrUseOfItemManager(extras) {
    _reporterNs.report("ItemManager", "../managers/ItemManager", _context.meta, extras);
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
      input = _cc.input;
      Input = _cc.Input;
      Vec3 = _cc.Vec3;
      Vec2 = _cc.Vec2;
      UITransform = _cc.UITransform;
      Layers = _cc.Layers;
    }, function (_unresolved_2) {
      ItemGraphic = _unresolved_2.ItemGraphic;
    }, function (_unresolved_3) {
      ItemManager = _unresolved_3.ItemManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "f7ad4CQqd5ArYyLlhPKnxVG", "DreamyInputManager", undefined);
      /**
       * InputManager — gom toàn bộ input về một chỗ.
       *
       * Bên Unity, 5 script cùng poll Input mỗi frame (ItemController — MỖI item!,
       * BoxController, WorldScrollManager, BaseRoom, UIManager) và thứ tự ưu tiên
       * do Unity quyết định ngẫu nhiên. Port 1-1 sang Cocos sẽ vỡ.
       *
       * Ở đây: đăng ký input MỘT LẦN, rồi dispatch theo chuỗi ưu tiên tường minh.
       * Handler đầu tiên trả true sẽ "bắt" (capture) và giữ chuỗi move/up tiếp theo.
       *
       * Đặt component này lên 1 node bất kỳ trong scene (vd node "Root").
       * Xem COCOS_MIGRATION_PLAN.md mục 5.2.
       */


      __checkObsolete__(['_decorator', 'Component', 'Node', 'input', 'Input', 'EventTouch', 'Vec3', 'Vec2', 'UITransform', 'Layers']);

      ({
        ccclass,
        property,
        executeInEditMode
      } = _decorator);
      Ed = globalThis.Editor;
      /** Số nhỏ = ưu tiên cao. Khớp thứ tự ở plan mục 5.2. */

      _export("InputPriority", InputPriority = /*#__PURE__*/function (InputPriority) {
        InputPriority[InputPriority["UI"] = 0] = "UI";
        InputPriority[InputPriority["Item"] = 10] = "Item";
        InputPriority[InputPriority["Box"] = 20] = "Box";
        InputPriority[InputPriority["Scroll"] = 30] = "Scroll";
        InputPriority[InputPriority["Room"] = 40] = "Room";
        return InputPriority;
      }({}));
      /**
       * Nhận pinch 2 ngón. Tách riêng khỏi IPointerHandler vì chuỗi capture 1 ngón
       * bị huỷ ngay khi ngón thứ 2 chạm xuống.
       */


      _export("DreamyInputManager", DreamyInputManager = (_dec = ccclass('DreamyInputManager'), _dec2 = executeInEditMode(true), _dec3 = property({
        type: Node,
        tooltip: 'Node chứa lớp kéo (item đang cầm sẽ tạm nằm dưới đây để nổi lên trên cùng).\n' + 'Để trống = tự dò / dùng chính node này.'
      }), _dec4 = property({
        type: Layers.BitMask,
        tooltip: 'Chỉ các Node có Layer nằm trong mask này mới nhận click / kéo thả (vd: chỉ tick layer "Item", "UI_2D", v.v.). Mặc định: Tất cả.'
      }), _dec5 = property({
        tooltip: 'In log chi tiết mỗi lần bắt/nhả sự kiện'
      }), _dec(_class = _dec2(_class = (_class2 = (_class3 = class DreamyInputManager extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "dragLayerRoot", _descriptor, this);

          // ---- Cấu hình LayerMask nhận Click / Touch ----
          _initializerDefineProperty(this, "interactableLayers", _descriptor2, this);

          _initializerDefineProperty(this, "verbose", _descriptor3, this);

          this.handlers = [];
          this.pinchHandlers = [];
          this.captor = null;
          this.activeTouches = 0;

          /** Khoảng cách giữa 2 ngón ở frame trước, -1 = chưa có. */
          this.lastPinchDistance = -1;
        }

        // ------------------------------------------------------------ lifecycle
        onLoad() {
          DreamyInputManager.instance = this;

          if (this.dragLayerRoot) {
            (_crd && ItemGraphic === void 0 ? (_reportPossibleCrUseOfItemGraphic({
              error: Error()
            }), ItemGraphic) : ItemGraphic).dragLayerRoot = this.dragLayerRoot;
          } else {
            (_crd && ItemGraphic === void 0 ? (_reportPossibleCrUseOfItemGraphic({
              error: Error()
            }), ItemGraphic) : ItemGraphic).dragLayerRoot = this.node;
          }
        }
        /** Kiểm tra xem một Node có Layer hợp lệ để nhận Click/Touch hay không */


        static isNodeInteractable(node) {
          if (!node || !node.isValid || !node.activeInHierarchy) return false;
          const m = DreamyInputManager.instance;

          if (m && m.interactableLayers !== -1 && m.interactableLayers !== 0xffffffff) {
            if ((m.interactableLayers & node.layer) === 0) {
              return false;
            }
          }

          return true;
        }

        onEnable() {
          input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
          input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
          input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
          input.on(Input.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
        }

        onDisable() {
          input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
          input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
          input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
          input.off(Input.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
        }

        onDestroy() {
          if (DreamyInputManager.instance === this) DreamyInputManager.instance = null;
        } // ------------------------------------------------------------ đăng ký


        static register(h) {
          const m = DreamyInputManager.instance;
          if (m && m.handlers.indexOf(h) < 0) m.handlers.push(h);
        }

        static unregister(h) {
          const m = DreamyInputManager.instance;
          if (!m) return;
          const i = m.handlers.indexOf(h);
          if (i >= 0) m.handlers.splice(i, 1);
          if (m.captor === h) m.captor = null;
        }

        static registerPinch(h) {
          const m = DreamyInputManager.instance;
          if (m && m.pinchHandlers.indexOf(h) < 0) m.pinchHandlers.push(h);
        }

        static unregisterPinch(h) {
          const m = DreamyInputManager.instance;
          if (!m) return;
          const i = m.pinchHandlers.indexOf(h);
          if (i >= 0) m.pinchHandlers.splice(i, 1);
        } // ------------------------------------------------------------ dispatch


        onTouchStart(ev) {
          var _ev$getAllTouches$len, _ev$getAllTouches, _instance;

          this.activeTouches = (_ev$getAllTouches$len = (_ev$getAllTouches = ev.getAllTouches()) == null ? void 0 : _ev$getAllTouches.length) != null ? _ev$getAllTouches$len : 1; // Unity: if (Input.touchCount >= 2) { isDragging = false; return; }

          if (this.activeTouches >= 2) {
            this.cancelCaptor();
            return;
          }

          if (!DreamyInputManager.canInput) return;
          const worldPos = DreamyInputManager.toWorld(ev); // Broadcast: ItemManager cần biết mọi lần chạm (reset idle timer, first-click,
          // bắn CHALLENGE_STARTED). KHÔNG nuốt sự kiện — bên Unity đây là phần
          // ItemManager.Update tự poll Input.

          (_instance = (_crd && ItemManager === void 0 ? (_reportPossibleCrUseOfItemManager({
            error: Error()
          }), ItemManager) : ItemManager).instance) == null ? void 0 : _instance.onAnyPointerDown();
          const candidates = this.handlers.filter(h => h.node && h.node.isValid && h.node.activeInHierarchy && DreamyInputManager.isNodeInteractable(h.node) && h.hitTest(worldPos)).sort((a, b) => a.inputPriority - b.inputPriority || -DreamyInputManager.compareRenderOrder(a.node, b.node));

          for (const h of candidates) {
            if (h.onPointerDown(worldPos, ev)) {
              this.captor = h;
              if (this.verbose) console.log('[InputManager] bắt bởi', h.node.name);
              return;
            }
          }
        }

        onTouchMove(ev) {
          var _ev$getAllTouches2, _this$captor$onPointe, _this$captor;

          const touches = (_ev$getAllTouches2 = ev.getAllTouches()) != null ? _ev$getAllTouches2 : [];
          this.activeTouches = touches.length || 1;

          if (this.activeTouches >= 2) {
            this.cancelCaptor();
            this.handlePinch(touches);
            return;
          }

          this.lastPinchDistance = -1;
          if (!this.captor) return;
          (_this$captor$onPointe = (_this$captor = this.captor).onPointerMove) == null ? void 0 : _this$captor$onPointe.call(_this$captor, DreamyInputManager.toWorld(ev), ev);
        }
        /** Unity: BaseRoom.HandleZoom — so khoảng cách 2 ngón giữa frame này và frame trước. */


        handlePinch(touches) {
          if (this.pinchHandlers.length === 0 || touches.length < 2) return;
          const a = touches[0].getUILocation();
          const b = touches[1].getUILocation();
          const dist = Vec2.distance(a, b);

          if (this.lastPinchDistance >= 0) {
            const delta = dist - this.lastPinchDistance;

            if (Math.abs(delta) > 0.01) {
              for (const h of this.pinchHandlers) h.onPinch(delta);
            }
          }

          this.lastPinchDistance = dist;
        }

        onTouchEnd(ev) {
          this.activeTouches = 0;
          this.lastPinchDistance = -1;
          const c = this.captor;
          this.captor = null;
          c == null ? void 0 : c.onPointerUp == null ? void 0 : c.onPointerUp(DreamyInputManager.toWorld(ev), ev);
          if (this.verbose && c) console.log('[InputManager] nhả', c.node.name);
        }

        onTouchCancel(ev) {
          this.activeTouches = 0;
          this.lastPinchDistance = -1;
          const c = this.captor;
          this.captor = null; // TOUCH_CANCEL vẫn phải xử lý như nhả tay, nếu không item sẽ dính vào chuột

          c == null ? void 0 : c.onPointerUp == null ? void 0 : c.onPointerUp(DreamyInputManager.toWorld(ev), ev);
        }

        cancelCaptor() {
          var _ref, _c$onPointerCancel;

          const c = this.captor;
          this.captor = null;
          if (c) (_ref = (_c$onPointerCancel = c.onPointerCancel) != null ? _c$onPointerCancel : c.onPointerUp) == null ? void 0 : _ref.call(c, c.node.worldPosition, undefined);
        } // ------------------------------------------------------------ helper

        /**
         * Vị trí chạm trong world space của UI.
         * getUILocation() dùng chung hệ toạ độ với worldPosition của node UI.
         * ⚠ Nếu item bị lệch khi kéo thì đây là chỗ đầu tiên cần soi.
         */


        static toWorld(ev) {
          if (!ev) return new Vec3();
          const p = ev.getUILocation();
          return new Vec3(p.x, p.y, 0);
        }
        /** Thay cho Physics.RaycastAll — hit-test AABB trong UI space (có kiểm tra LayerMask). */


        static hitTestNode(node, worldPos) {
          if (!DreamyInputManager.isNodeInteractable(node)) return false;
          const ut = node.getComponent(UITransform);
          if (!ut) return false;
          return ut.getBoundingBoxToWorld().contains(new Vec2(worldPos.x, worldPos.y));
        }
        /** Trúng chính node này hoặc con của nó (thay ItemController.IsHitSelf bên Unity). */


        static hitTestSelfOrChildren(node, worldPos) {
          if (DreamyInputManager.hitTestNode(node, worldPos)) return true;

          for (const c of node.children) {
            if (!c.activeInHierarchy) continue;
            if (DreamyInputManager.hitTestSelfOrChildren(c, worldPos)) return true;
          }

          return false;
        }
        /**
         * So thứ tự render. > 0 nghĩa là `a` nằm TRÊN `b`.
         * Cocos render theo thứ tự duyệt cây, nên so chuỗi siblingIndex từ gốc xuống.
         * Đây là thứ thay cho "chọn hit có sortingOrder cao nhất" bên Unity.
         */


        static compareRenderOrder(a, b) {
          const pa = DreamyInputManager.siblingPath(a);
          const pb = DreamyInputManager.siblingPath(b);
          const n = Math.min(pa.length, pb.length);

          for (let i = 0; i < n; i++) {
            if (pa[i] !== pb[i]) return pa[i] - pb[i];
          }

          return pa.length - pb.length; // con render sau cha
        }

        static siblingPath(node) {
          const path = [];

          for (let n = node; n && n.parent; n = n.parent) {
            path.push(n.getSiblingIndex());
          }

          return path.reverse();
        }

      }, _class3.canInput = true, _class3.instance = null, _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "dragLayerRoot", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "interactableLayers", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0xffffffff;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "verbose", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      })), _class2)) || _class) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=7b460293d77bd5fad7324f40f31082631727dc56.js.map