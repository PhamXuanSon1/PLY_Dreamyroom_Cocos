System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Camera, Color, Component, Node, v3, _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _crd, ccclass, property, MainCamera;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Camera = _cc.Camera;
      Color = _cc.Color;
      Component = _cc.Component;
      Node = _cc.Node;
      v3 = _cc.v3;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "c324alHZgtEkK9H29z40VNS", "MainCamera", undefined);

      __checkObsolete__(['_decorator', 'Camera', 'Color', 'Component', 'Node', 'v3', 'Vec2', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("MainCamera", MainCamera = (_dec = ccclass('MainCamera'), _dec2 = property(Camera), _dec3 = property(Node), _dec4 = property(Node), _dec(_class = (_class2 = class MainCamera extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "camera", _descriptor, this);

          _initializerDefineProperty(this, "target", _descriptor2, this);

          _initializerDefineProperty(this, "door", _descriptor3, this);
        }

        moveTo(node, dt) {
          if (!node) return;
          let pos = node.worldPosition;
          let target = this.node.worldPosition; // console.log(pos, target);

          let diff = pos.clone().subtract(target);
          diff = v3(diff.x, 0, diff.z);
          let dir = diff.clone().normalize();
          let distance = diff.length();
          this.node.worldPosition = this.node.worldPosition.add(dir.multiplyScalar(3 * dt));

          if (this.door === this.target) {
            if (distance < 0.1) {
              this.door = null;
              return;
            }
          }

          if (distance < 0.1) {
            console.log('door');
            this.door = this.target;
          }
        }

        zoom(inOut) {
          this.camera.fov = inOut ? 45 : 55;
        }

        changeColor() {
          this.camera.clearColor = new Color().fromHEX('#4E141F');
        }

        onLoad() {}

        start() {}

        update(deltaTime) {}

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "camera", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "target", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "door", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=9d125984e655d44123432c8b294289471c3a1ab3.js.map