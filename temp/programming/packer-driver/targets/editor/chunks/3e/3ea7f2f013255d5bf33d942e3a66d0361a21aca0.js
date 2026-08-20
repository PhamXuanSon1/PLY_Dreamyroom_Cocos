System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Vec3, math, input, Input, DreamyInputManager, InputPriority, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _crd, ccclass, property, BaseRoom;

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

  function _reportPossibleCrUseOfIPinchHandler(extras) {
    _reporterNs.report("IPinchHandler", "../core/DreamyInputManager", _context.meta, extras);
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
      math = _cc.math;
      input = _cc.input;
      Input = _cc.Input;
    }, function (_unresolved_2) {
      DreamyInputManager = _unresolved_2.DreamyInputManager;
      InputPriority = _unresolved_2.InputPriority;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "743202QFOhIJLvvGdn8M2fR", "BaseRoom", undefined);
      /**
       * BaseRoom — port từ Assets/_GAME/Script/Utils/BaseRoom.cs (Unity)
       * Pan 1 ngón (chỉ trục X) + pinch zoom 2 ngón + mouse wheel cho desktop.
       *
       * KHÁC bản Unity:
       *   - Không poll Input; pan đi qua InputManager ở mức ưu tiên Room (thấp nhất),
       *     nên chạm trúng item / hộp / thanh bar đều được ưu tiên trước.
       *   - Pinch nhận qua InputManager.registerPinch vì chuỗi capture 1-ngón
       *     bị huỷ khi có ngón thứ 2.
       *
       * Mọi khoảng cách là PIXEL.
       */


      __checkObsolete__(['_decorator', 'Component', 'Node', 'Vec3', 'EventTouch', 'math', 'input', 'Input', 'EventMouse']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("BaseRoom", BaseRoom = (_dec = ccclass('BaseRoom'), _dec2 = property({
        type: Node,
        tooltip: 'Giới hạn phải khi kéo màn.'
      }), _dec3 = property({
        type: Node,
        tooltip: 'Giới hạn trái khi kéo màn.'
      }), _dec4 = property({
        tooltip: 'Tốc độ pinch zoom trên mobile.'
      }), _dec5 = property({
        tooltip: 'Tốc độ zoom bằng con lăn chuột (desktop).'
      }), _dec6 = property({
        tooltip: 'Tỉ lệ scale nhỏ nhất.'
      }), _dec7 = property({
        tooltip: 'Tỉ lệ scale lớn nhất.'
      }), _dec8 = property({
        tooltip: 'Tốc độ kéo trượt màn hình.'
      }), _dec(_class = (_class2 = class BaseRoom extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "rightLimitPos", _descriptor, this);

          _initializerDefineProperty(this, "leftLimitPos", _descriptor2, this);

          _initializerDefineProperty(this, "mobileZoomSpeed", _descriptor3, this);

          _initializerDefineProperty(this, "editorZoomSpeed", _descriptor4, this);

          _initializerDefineProperty(this, "minScaleMultiplier", _descriptor5, this);

          _initializerDefineProperty(this, "maxScaleMultiplier", _descriptor6, this);

          _initializerDefineProperty(this, "panSpeed", _descriptor7, this);

          this.inputPriority = (_crd && InputPriority === void 0 ? (_reportPossibleCrUseOfInputPriority({
            error: Error()
          }), InputPriority) : InputPriority).Room;
          this.originalLocalScale = new Vec3(1, 1, 1);
          this.currentScaleFactor = 1;
          this.originalScaleInitialized = false;
          this.interactionEnabled = false;
          this.dragStartWorld = new Vec3();
          this.roomStartPosition = new Vec3();
          this.dragging = false;
        }

        // ======================================================== lifecycle
        onLoad() {
          if (!this.originalScaleInitialized) {
            this.originalLocalScale = this.node.scale.clone();
            this.currentScaleFactor = 1;
            this.originalScaleInitialized = true;
          }
        }

        onEnable() {
          (_crd && DreamyInputManager === void 0 ? (_reportPossibleCrUseOfDreamyInputManager({
            error: Error()
          }), DreamyInputManager) : DreamyInputManager).register(this);
          (_crd && DreamyInputManager === void 0 ? (_reportPossibleCrUseOfDreamyInputManager({
            error: Error()
          }), DreamyInputManager) : DreamyInputManager).registerPinch(this);
          input.on(Input.EventType.MOUSE_WHEEL, this.onMouseWheel, this);
        }

        onDisable() {
          (_crd && DreamyInputManager === void 0 ? (_reportPossibleCrUseOfDreamyInputManager({
            error: Error()
          }), DreamyInputManager) : DreamyInputManager).unregister(this);
          (_crd && DreamyInputManager === void 0 ? (_reportPossibleCrUseOfDreamyInputManager({
            error: Error()
          }), DreamyInputManager) : DreamyInputManager).unregisterPinch(this);
          input.off(Input.EventType.MOUSE_WHEEL, this.onMouseWheel, this);
        }
        /** Unity: InitializeOriginalScale */


        initializeOriginalScale(originalScale) {
          this.originalLocalScale = originalScale.clone();
          this.currentScaleFactor = this.originalLocalScale.x !== 0 ? this.node.scale.x / this.originalLocalScale.x : 1;
          this.originalScaleInitialized = true;
        }

        enableInteraction() {
          this.interactionEnabled = true;
        } // ======================================================== pan


        hitTest(worldPos) {
          if (!this.interactionEnabled) return false;
          return (_crd && DreamyInputManager === void 0 ? (_reportPossibleCrUseOfDreamyInputManager({
            error: Error()
          }), DreamyInputManager) : DreamyInputManager).hitTestSelfOrChildren(this.node, worldPos);
        }

        onPointerDown(worldPos, _ev) {
          if (!this.interactionEnabled) return false;
          this.dragging = true;
          this.dragStartWorld.set(worldPos);
          this.roomStartPosition.set(this.node.worldPosition);
          return true;
        }

        onPointerMove(worldPos, _ev) {
          if (!this.dragging) return;
          const diffX = worldPos.x - this.dragStartWorld.x;
          const target = new Vec3(this.roomStartPosition.x + diffX * this.panSpeed, this.roomStartPosition.y, this.roomStartPosition.z);
          this.node.setWorldPosition(this.clampPosition(target));
        }

        onPointerUp() {
          this.dragging = false;
        }

        onPointerCancel() {
          this.dragging = false;
        } // ======================================================== zoom

        /** Pinch 2 ngón. delta > 0 = xoè ra = phóng to. */


        onPinch(deltaDistance) {
          if (!this.interactionEnabled) return;
          this.dragging = false; // đang pinch thì không pan

          this.setScaleFactor(this.currentScaleFactor + deltaDistance * this.mobileZoomSpeed);
        }

        onMouseWheel(ev) {
          if (!this.interactionEnabled) return;
          const scroll = ev.getScrollY();
          if (Math.abs(scroll) < 0.01) return; // Chuẩn hoá về ±1 rồi nhân tốc độ, tránh phụ thuộc đơn vị của từng browser

          const dir = scroll > 0 ? 1 : -1;
          this.setScaleFactor(this.currentScaleFactor * (1 + dir * this.editorZoomSpeed));
        }

        setScaleFactor(factor) {
          this.currentScaleFactor = math.clamp(factor, this.minScaleMultiplier, this.maxScaleMultiplier);
          this.node.setScale(this.originalLocalScale.x * this.currentScaleFactor, this.originalLocalScale.y * this.currentScaleFactor, this.originalLocalScale.z * this.currentScaleFactor);
          this.node.setWorldPosition(this.clampPosition(this.node.worldPosition.clone()));
        } // ======================================================== clamp

        /** Unity: ClampPosition — chỉ kẹp trục X. */


        clampPosition(position) {
          var _this$leftLimitPos, _this$rightLimitPos;

          const left = (_this$leftLimitPos = this.leftLimitPos) == null ? void 0 : _this$leftLimitPos.worldPosition.x;
          const right = (_this$rightLimitPos = this.rightLimitPos) == null ? void 0 : _this$rightLimitPos.worldPosition.x;

          if (left !== undefined && right !== undefined) {
            position.x = math.clamp(position.x, Math.min(left, right), Math.max(left, right));
          } else if (left !== undefined) {
            position.x = Math.max(position.x, left);
          } else if (right !== undefined) {
            position.x = Math.min(position.x, right);
          }

          return position;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "rightLimitPos", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "leftLimitPos", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "mobileZoomSpeed", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.005;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "editorZoomSpeed", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.1;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "minScaleMultiplier", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.8;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "maxScaleMultiplier", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1.2;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "panSpeed", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=3ea7f2f013255d5bf33d942e3a66d0361a21aca0.js.map