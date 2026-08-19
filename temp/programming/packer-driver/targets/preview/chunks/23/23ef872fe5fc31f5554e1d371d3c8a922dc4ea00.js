System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Color, Component, Input, input, KeyCode, Sprite, colors, ColorType, _dec, _class, _class2, _descriptor, _crd, ccclass, property, Tool;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfcolors(extras) {
    _reporterNs.report("colors", "../Gameplay/Data", _context.meta, extras);
  }

  function _reportPossibleCrUseOfColorType(extras) {
    _reporterNs.report("ColorType", "../Gameplay/Data", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Color = _cc.Color;
      Component = _cc.Component;
      Input = _cc.Input;
      input = _cc.input;
      KeyCode = _cc.KeyCode;
      Sprite = _cc.Sprite;
    }, function (_unresolved_2) {
      colors = _unresolved_2.colors;
      ColorType = _unresolved_2.ColorType;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "5473dw0jmpKn7mYGvEUH3VJ", "Tool", undefined);

      __checkObsolete__(['_decorator', 'BoxCollider', 'CCObject', 'Color', 'Component', 'EventKeyboard', 'EventTouch', 'Input', 'input', 'KeyCode', 'Node', 'RenderTexture', 'Sprite', 'Texture2D', 'v2', 'v3', 'Vec2', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("Tool", Tool = (_dec = ccclass('Tool'), _dec(_class = (_class2 = class Tool extends Component {
        constructor() {
          super(...arguments);
          this.color = (_crd && ColorType === void 0 ? (_reportPossibleCrUseOfColorType({
            error: Error()
          }), ColorType) : ColorType).Red;
          this.deletable = false;

          _initializerDefineProperty(this, "savePng", _descriptor, this);

          this.map = new Map();
        }

        init() {
          input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
          var tut = "Key_D: increase color\nKey A: decrease color\nKey C: toggle deletable\nKey Z: toggle selectable\nKey X: swap choosings\nKey S: shuffle box color\nKey F: toggle jigsaw\n";
          console.log(tut);
        }

        onJigsawTouch(event) {
          var target = event.target;
          this.onTouch(target);
        }

        onTouch(target) {
          var value = this.map.get(target);

          if (value.y == 1) {
            value.y = 0;
            target.getComponent(Sprite).color = Color.BLACK;
          } else {
            value.y = 1;
            target.getComponent(Sprite).color = Color.WHITE;
          }

          this.map.set(target, value);
        }

        onKeyDown(event) {
          var length = (_crd && colors === void 0 ? (_reportPossibleCrUseOfcolors({
            error: Error()
          }), colors) : colors).length;

          if (event.keyCode == KeyCode.KEY_D) {
            this.color++;
            if (this.color >= length) this.color = 0;
            console.log(this.color, (_crd && ColorType === void 0 ? (_reportPossibleCrUseOfColorType({
              error: Error()
            }), ColorType) : ColorType)[this.color]);
          } else if (event.keyCode == KeyCode.KEY_A) {
            this.color--;
            if (this.color < 0) this.color = length - 1;
            console.log(this.color, (_crd && ColorType === void 0 ? (_reportPossibleCrUseOfColorType({
              error: Error()
            }), ColorType) : ColorType)[this.color]);
          } else if (event.keyCode == KeyCode.KEY_C) {
            if (this.deletable === null) {
              this.deletable = true;
            } else if (this.deletable === true) {
              this.deletable = false;
            } else {
              this.deletable = null;
            }

            console.log("Deletable", this.deletable);
          } else if (event.keyCode == KeyCode.KEY_S) {} else if (event.keyCode == KeyCode.KEY_F) {} else if (event.keyCode == KeyCode.KEY_Z) {} else if (event.keyCode == KeyCode.KEY_X) {} else if (event.keyCode == KeyCode.KEY_E) {} else if (event.keyCode == KeyCode.KEY_Q) {} else if (event.keyCode == KeyCode.KEY_W) {} else if (event.keyCode == KeyCode.KEY_B) {} else if (event.keyCode == KeyCode.KEY_N) {} else if (event.keyCode == KeyCode.KEY_M) {} else if (event.keyCode == KeyCode.SPACE) {
            this.printData();
          }
        }

        onRayCast(node, hitpoint) {}

        printData() {
          var data = {
            slots: [],
            boxes: [],
            pixels: []
          };
          console.log("export const Data = " + JSON.stringify(data)); // if(this.savePng) this.savePNG(sand.texData, sand.index.x, sand.index.y, "sand.png");
        }

        savePNG(data, width, height, name) {
          var canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          var ctx = canvas.getContext('2d');
          var imgData = ctx.createImageData(width, height); // đảo Y vì GPU ngược

          for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
              var src = (y * width + x) * 4;
              var dst = (y * width + x) * 4;
              imgData.data[dst] = data[src];
              imgData.data[dst + 1] = data[src + 1];
              imgData.data[dst + 2] = data[src + 2];
              imgData.data[dst + 3] = data[src + 3];
            }
          }

          ctx.putImageData(imgData, 0, 0);
          var link = document.createElement('a');
          link.download = name;
          link.href = canvas.toDataURL("image/png");
          link.click();
        }

        update(deltaTime) {}

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "savePng", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=23ef872fe5fc31f5554e1d371d3c8a922dc4ea00.js.map