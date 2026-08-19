System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, input, Input, Vec3, Vec2, UITransform, Layers, ui, sm, ItemGraphic, ItemManager, _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _class3, _crd, ccclass, property, executeInEditMode, ipm, InputPriority, InputManager;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfui(extras) {
    _reporterNs.report("ui", "./UI", _context.meta, extras);
  }

  function _reportPossibleCrUseOfsm(extras) {
    _reporterNs.report("sm", "./SoundManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfItemGraphic(extras) {
    _reporterNs.report("ItemGraphic", "../MyScript/item/ItemGraphic", _context.meta, extras);
  }

  function _reportPossibleCrUseOfItemManager(extras) {
    _reporterNs.report("ItemManager", "../MyScript/managers/ItemManager", _context.meta, extras);
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
      ui = _unresolved_2.ui;
    }, function (_unresolved_3) {
      sm = _unresolved_3.sm;
    }, function (_unresolved_4) {
      ItemGraphic = _unresolved_4.ItemGraphic;
    }, function (_unresolved_5) {
      ItemManager = _unresolved_5.ItemManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "9af7cuQ4ftO/YNfz4JJfyYl", "InputManager", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'input', 'Input', 'EventTouch', 'Vec3', 'Vec2', 'UITransform', 'Layers']);

      ({
        ccclass,
        property,
        executeInEditMode
      } = _decorator);

      _export("ipm", ipm = null);
      /** Số nhỏ = ưu tiên cao. */


      _export("InputPriority", InputPriority = /*#__PURE__*/function (InputPriority) {
        InputPriority[InputPriority["UI"] = 0] = "UI";
        InputPriority[InputPriority["Item"] = 10] = "Item";
        InputPriority[InputPriority["Box"] = 20] = "Box";
        InputPriority[InputPriority["Scroll"] = 30] = "Scroll";
        InputPriority[InputPriority["Room"] = 40] = "Room";
        return InputPriority;
      }({}));

      _export("InputManager", InputManager = (_dec = ccclass('InputManager'), _dec2 = executeInEditMode(true), _dec3 = property({
        type: Node,
        tooltip: 'Node chứa lớp kéo (item đang cầm sẽ tạm nằm dưới đây để nổi lên trên cùng). Để trống = tự dò / dùng chính node này.'
      }), _dec4 = property({
        type: Layers.BitMask,
        tooltip: 'Chỉ các Node có Layer nằm trong mask này mới nhận click / kéo thả (vd: chỉ tick layer "Item", "UI_2D", v.v.). Mặc định: Tất cả.'
      }), _dec5 = property({
        tooltip: 'In log chi tiết mỗi lần bắt/nhả sự kiện'
      }), _dec(_class = _dec2(_class = (_class2 = (_class3 = class InputManager extends Component {
        constructor(...args) {
          super(...args);
          // ---- Playable Ads Properties ----
          this.isFirtMove = true;

          // ---- DreamyRoom Properties ----
          _initializerDefineProperty(this, "dragLayerRoot", _descriptor, this);

          _initializerDefineProperty(this, "interactableLayers", _descriptor2, this);

          _initializerDefineProperty(this, "verbose", _descriptor3, this);

          this.handlers = [];
          this.pinchHandlers = [];
          this.captor = null;
          this.activeTouches = 0;
          this.lastPinchDistance = -1;
        }

        // ------------------------------------------------------------ Lifecycle
        onLoad() {
          InputManager.instance = this;

          _export("ipm", ipm = this);

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

        start() {
          this.binding();
        }

        onEnable() {
          this.binding();
        }

        onDisable() {
          this.offBinding();
        }

        onDestroy() {
          if (InputManager.instance === this) InputManager.instance = null;
          if (ipm === this) _export("ipm", ipm = null);
        } // ------------------------------------------------------------ Playable Ads Touch Hooks


        bindingStart(event) {}

        bindingMove(event) {}

        bindingEnd(event) {}

        bindingUpdate() {}

        fisrtTap() {
          if (this.isFirtMove) {
            var _ref, _ref2;

            this.isFirtMove = false;
            (_ref = _crd && sm === void 0 ? (_reportPossibleCrUseOfsm({
              error: Error()
            }), sm) : sm) == null ? void 0 : _ref.playBgMusic();
            (_ref2 = _crd && ui === void 0 ? (_reportPossibleCrUseOfui({
              error: Error()
            }), ui) : ui) == null ? void 0 : _ref2.firstMove();
          }
        } // ------------------------------------------------------------ Binding & Event Listener


        binding() {
          input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
          input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
          input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
          input.on(Input.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
        }

        offBinding() {
          input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
          input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
          input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
          input.off(Input.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
        } // ------------------------------------------------------------ Registration


        static register(h) {
          const m = InputManager.instance;
          if (m && m.handlers.indexOf(h) < 0) m.handlers.push(h);
        }

        static unregister(h) {
          const m = InputManager.instance;
          if (!m) return;
          const i = m.handlers.indexOf(h);
          if (i >= 0) m.handlers.splice(i, 1);
          if (m.captor === h) m.captor = null;
        }

        static registerPinch(h) {
          const m = InputManager.instance;
          if (m && m.pinchHandlers.indexOf(h) < 0) m.pinchHandlers.push(h);
        }

        static unregisterPinch(h) {
          const m = InputManager.instance;
          if (!m) return;
          const i = m.pinchHandlers.indexOf(h);
          if (i >= 0) m.pinchHandlers.splice(i, 1);
        }
        /** Kiểm tra xem một Node có Layer hợp lệ để nhận Click/Touch hay không */


        static isNodeInteractable(node) {
          if (!node || !node.isValid || !node.activeInHierarchy) return false;
          const m = InputManager.instance;

          if (m && m.interactableLayers !== -1 && m.interactableLayers !== 0xffffffff) {
            if ((m.interactableLayers & node.layer) === 0) {
              return false;
            }
          }

          return true;
        } // ------------------------------------------------------------ Dispatching


        onTouchStart(ev) {
          var _ev$getAllTouches$len, _ev$getAllTouches, _instance;

          this.fisrtTap();
          this.bindingStart(ev);
          this.activeTouches = (_ev$getAllTouches$len = (_ev$getAllTouches = ev.getAllTouches()) == null ? void 0 : _ev$getAllTouches.length) != null ? _ev$getAllTouches$len : 1;

          if (this.activeTouches >= 2) {
            this.cancelCaptor();
            return;
          }

          if (!InputManager.canInput) return;
          const worldPos = InputManager.toWorld(ev);
          (_instance = (_crd && ItemManager === void 0 ? (_reportPossibleCrUseOfItemManager({
            error: Error()
          }), ItemManager) : ItemManager).instance) == null ? void 0 : _instance.onAnyPointerDown();
          const candidates = this.handlers.filter(h => h.node && h.node.isValid && h.node.activeInHierarchy && InputManager.isNodeInteractable(h.node) && h.hitTest(worldPos)).sort((a, b) => a.inputPriority - b.inputPriority || -InputManager.compareRenderOrder(a.node, b.node));

          for (const h of candidates) {
            if (h.onPointerDown(worldPos, ev)) {
              this.captor = h;
              if (this.verbose) console.log('[InputManager] Bắt bởi', h.node.name);
              return;
            }
          }
        }

        onTouchMove(ev) {
          var _ev$getAllTouches2, _this$captor;

          this.bindingMove(ev);
          const touches = (_ev$getAllTouches2 = ev.getAllTouches()) != null ? _ev$getAllTouches2 : [];
          this.activeTouches = touches.length || 1;

          if (this.activeTouches >= 2) {
            this.cancelCaptor();
            this.handlePinch(touches);
            return;
          }

          const worldPos = InputManager.toWorld(ev);
          (_this$captor = this.captor) == null ? void 0 : _this$captor.onPointerMove == null ? void 0 : _this$captor.onPointerMove(worldPos, ev);
        }

        handlePinch(touches) {
          if (touches.length < 2) return;
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
          this.bindingEnd(ev);
          this.activeTouches = 0;
          this.lastPinchDistance = -1;
          const c = this.captor;
          this.captor = null;
          c == null ? void 0 : c.onPointerUp == null ? void 0 : c.onPointerUp(InputManager.toWorld(ev), ev);
          if (this.verbose && c) console.log('[InputManager] Nhả', c.node.name);
        }

        onTouchCancel(ev) {
          this.onTouchEnd(ev);
        }

        cancelCaptor() {
          var _ref3, _c$onPointerCancel;

          const c = this.captor;
          this.captor = null;
          if (c) (_ref3 = (_c$onPointerCancel = c.onPointerCancel) != null ? _c$onPointerCancel : c.onPointerUp) == null ? void 0 : _ref3.call(c, c.node.worldPosition, undefined);
        }

        update(deltaTime) {
          this.bindingUpdate();
        } // ------------------------------------------------------------ Helpers


        static toWorld(ev) {
          if (!ev) return new Vec3();
          const p = ev.getUILocation();
          return new Vec3(p.x, p.y, 0);
        }

        static hitTestNode(node, worldPos) {
          if (!InputManager.isNodeInteractable(node)) return false;
          const ut = node.getComponent(UITransform);
          if (!ut) return false;
          return ut.getBoundingBoxToWorld().contains(new Vec2(worldPos.x, worldPos.y));
        }

        static hitTestSelfOrChildren(node, worldPos) {
          if (InputManager.hitTestNode(node, worldPos)) return true;

          for (const c of node.children) {
            if (!c.activeInHierarchy) continue;
            if (InputManager.hitTestSelfOrChildren(c, worldPos)) return true;
          }

          return false;
        }

        static compareRenderOrder(a, b) {
          const pa = InputManager.siblingPath(a);
          const pb = InputManager.siblingPath(b);
          const n = Math.min(pa.length, pb.length);

          for (let i = 0; i < n; i++) {
            if (pa[i] !== pb[i]) return pa[i] - pb[i];
          }

          return pa.length - pb.length;
        }

        static siblingPath(node) {
          const path = [];

          for (let n = node; n && n.parent; n = n.parent) {
            path.push(n.getSiblingIndex());
          }

          return path.reverse();
        }

      }, _class3.instance = null, _class3.canInput = true, _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "dragLayerRoot", [_dec3], {
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
//# sourceMappingURL=9fede6fb4b8afd12a746a87889815a4008000266.js.map