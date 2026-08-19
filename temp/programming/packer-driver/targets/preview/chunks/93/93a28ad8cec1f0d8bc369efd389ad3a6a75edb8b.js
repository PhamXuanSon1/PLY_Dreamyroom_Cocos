System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Input, input, Node, v3, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _class3, _crd, ccclass, property, Joystick;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Input = _cc.Input;
      input = _cc.input;
      Node = _cc.Node;
      v3 = _cc.v3;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "644a2w3lIRHiJCiywr1MyFK", "Joystick", undefined);

      __checkObsolete__(['_decorator', 'Component', 'EventTouch', 'Input', 'input', 'Node', 'v3', 'Vec2']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("Joystick", Joystick = (_dec = ccclass('Joystick'), _dec2 = property(Node), _dec3 = property(Node), _dec(_class = (_class2 = (_class3 = class Joystick extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "dot", _descriptor, this);

          _initializerDefineProperty(this, "active", _descriptor2, this);

          this.sPos = null;
          this.dir = null;
        }

        onLoad() {
          Joystick.instance = this;
        }

        bindingStart() {}

        bindingMove() {}

        bindingEnd() {}

        onTouchStart(event) {
          this.active.active = true;
          var touch = event.touch;
          this.sPos = touch.getUILocation();
          this.node.worldPosition = v3(this.sPos.x, this.sPos.y, 0);
          this.bindingStart();
        }

        onTouchMove(event) {
          var touch = event.touch;
          var pos = touch.getUILocation();
          this.dir = pos.subtract(this.sPos);
          var len = this.dir.length();
          var r = 80;
          this.dir = this.dir.normalize();
          this.dot.worldPosition = v3(this.dir.x, this.dir.y, 0).multiplyScalar(r).add(this.node.worldPosition);
          this.bindingMove();
        }

        onTouchEnd(event) {
          this.active.active = false;
          this.dir = null;
          this.dot.worldPosition = v3(0, 0, 0);
          this.bindingEnd(); // setTimeout(() => {
          //     if(!this.active.active) {
          //         this.active.active = true;
          //         this.active.position = v3(100, 100, 0);
          //     }
          // }, 2000);
        }

        binding() {
          input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
          input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
          input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this); // this.active.active = true;
          // this.active.position = v3(300, 600, 0);
        }

        start() {}

        bindingUpdate(dt) {}

        update(deltaTime) {
          if (this.dir) {
            this.bindingUpdate(deltaTime);
          }
        }

      }, _class3.instance = null, _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "dot", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "active", [_dec3], {
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
//# sourceMappingURL=93a28ad8cec1f0d8bc369efd389ad3a6a75edb8b.js.map