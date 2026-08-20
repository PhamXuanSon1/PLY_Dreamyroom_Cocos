System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Color, Component, Label, Node, tween, v3, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _descriptor3, _crd, ccclass, property, Clock;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Color = _cc.Color;
      Component = _cc.Component;
      Label = _cc.Label;
      Node = _cc.Node;
      tween = _cc.tween;
      v3 = _cc.v3;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "d33a0J0tBZASIIIJo6s/ynG", "Clock", undefined);

      __checkObsolete__(['_decorator', 'Color', 'Component', 'Label', 'Node', 'Tween', 'tween', 'UI', 'v3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("Clock", Clock = (_dec = ccclass('Clock'), _dec2 = property(Label), _dec3 = property(Node), _dec(_class = (_class2 = class Clock extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "time", _descriptor, this);

          this.max = 0;

          _initializerDefineProperty(this, "label", _descriptor2, this);

          _initializerDefineProperty(this, "needle", _descriptor3, this);

          this.tween = null;
          this.changeColor = false;
        }

        setTime() {
          this.needle.eulerAngles = v3(0, 0, -(this.max - this.time) * 360 / 60);
          var seconds = this.time % 60;
          var secondsStr = seconds < 10 ? '0' + seconds : seconds.toString();
          var minutes = (this.time - seconds) / 60;
          var minutesStr = minutes.toString();
          this.label.string = minutesStr + ' : ' + secondsStr;
          if (!this.changeColor) if (this.time < 20) {
            this.changeColor = true;
            this.label.color = new Color(255, 0, 0);
          }
        }

        onTimeUp() {}

        count() {
          this.tween = tween({
            t: 0
          }).to(this.max, {
            t: 1
          }, {
            "onUpdate": (target, ratio) => {
              this.time = this.max - Math.floor(this.max * ratio);
              this.setTime();
            }
          }).call(() => {
            this.onTimeUp();
          }).start();
        }

        stop() {
          this.tween.stop();
        }

        start() {
          this.max = this.time;
          this.setTime(); // setTimeout(() => {
          //     this.count();
          // }, 1000);
        }

        update(deltaTime) {}

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "time", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "label", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "needle", [_dec3], {
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
//# sourceMappingURL=1848e9e227e21f6d4794b48d999241f5078bd0a9.js.map