System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Camera, Component, geometry, Input, input, KeyCode, PhysicsSystem, World, _dec, _dec2, _class, _class2, _descriptor, _descriptor2, _class3, _crd, ccclass, property, PointerController;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfWorld(extras) {
    _reporterNs.report("World", "./World", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Camera = _cc.Camera;
      Component = _cc.Component;
      geometry = _cc.geometry;
      Input = _cc.Input;
      input = _cc.input;
      KeyCode = _cc.KeyCode;
      PhysicsSystem = _cc.PhysicsSystem;
    }, function (_unresolved_2) {
      World = _unresolved_2.World;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "9139eNzuOVLIqCXwAIlE1Xg", "PointerController", undefined);

      __checkObsolete__(['_decorator', 'Camera', 'Component', 'EventKeyboard', 'EventTouch', 'geometry', 'Input', 'input', 'KeyCode', 'Node', 'PhysicsSystem', 'Vec2']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("PointerController", PointerController = (_dec = ccclass('PointerController'), _dec2 = property(Camera), _dec(_class = (_class2 = (_class3 = class PointerController extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "camera", _descriptor, this);

          this.raycast = new geometry.Ray();
          this.currentSlot = null;
          this.desSlot = null;
          this.moving = false;
          this.speed = 35;
          this.firstCake = false;

          _initializerDefineProperty(this, "creativeMode", _descriptor2, this);

          this.currentNode = null;
        }

        static get ins() {
          if (!this.instance) {
            this.instance = new PointerController();
          }

          return this.instance;
        }

        onLoad() {
          PointerController.instance = this;
        }

        bindingEvent() {
          input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
          input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
          input.on(Input.EventType.TOUCH_END || Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        }

        unBindingEvent() {
          input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
          input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
          input.off(Input.EventType.TOUCH_END || Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        }

        onStore() {
          console.log("binding");
          input.on(Input.EventType.TOUCH_START, () => {
            (_crd && World === void 0 ? (_reportPossibleCrUseOfWorld({
              error: Error()
            }), World) : World).ins.ui.openStore();
          });
        }

        onTouchStart(event) {
          var _this$rayCastDetect;

          if (this.moving) return;
          let slot = (_this$rayCastDetect = this.rayCastDetect(event.getLocation())) == null ? void 0 : _this$rayCastDetect.slot;

          if (slot) {}
        }

        onTouchMove(event) {
          if (this.moving) return;
        }

        onTouchEnd(event) {
          if (this.moving) return;
        }

        rayCastDetect(pos, layer = 1) {
          this.camera.screenPointToRay(pos.x, pos.y, this.raycast);

          if (PhysicsSystem.instance.raycast(this.raycast)) {
            let result = PhysicsSystem.instance.raycastResults;

            for (let i = 0; i < result.length; i++) {
              let slot = result[i].collider.node;
              let hitPoint = result[i].hitPoint;

              if (slot.layer === layer) {
                return {
                  slot: slot,
                  hitPoint: hitPoint
                };
              }
            }

            return null;
          }
        }

        onKeyDown(event) {
          let multiplier = 0.05;
          let angle = 0.5;
          if (this.currentNode) switch (event.keyCode) {
            case KeyCode.SPACE:
              console.log("Print Data");
              break;

            case KeyCode.KEY_A:
              this.currentNode.position = this.currentNode.position.add3f(-multiplier, 0, 0);
              break;

            case KeyCode.KEY_W:
              this.currentNode.position = this.currentNode.position.add3f(0, 0, -multiplier);
              break;

            case KeyCode.KEY_D:
              this.currentNode.position = this.currentNode.position.add3f(multiplier, 0, 0);
              break;

            case KeyCode.KEY_S:
              this.currentNode.position = this.currentNode.position.add3f(0, 0, multiplier);
              break;

            case KeyCode.KEY_Q:
              this.currentNode.eulerAngles = this.currentNode.eulerAngles.add3f(0, -angle, 0);
              break;

            case KeyCode.KEY_E:
              this.currentNode.eulerAngles = this.currentNode.eulerAngles.add3f(0, angle, 0);
              break;
          }
        }

        start() {
          if (this.creativeMode) {
            input.on(Input.EventType.KEY_PRESSING, this.onKeyDown, this);
            input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
          } // this.bindingEvent();

        }

        update(deltaTime) {}

      }, _class3.instance = null, _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "camera", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "creativeMode", [property], {
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
//# sourceMappingURL=931405f78898d5d99381ce05d031e99f5ae5b6e8.js.map