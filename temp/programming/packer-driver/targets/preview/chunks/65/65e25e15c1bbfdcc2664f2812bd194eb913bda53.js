System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Sprite, UITransform, v3, _dec, _class, _class2, _crd, ccclass, property, SpriteSizeSetter;

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Sprite = _cc.Sprite;
      UITransform = _cc.UITransform;
      v3 = _cc.v3;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "6f8a32o9hVP6ZHCQAuZLb1E", "SpriteSizeSetter", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Sprite', 'UITransform', 'v3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("SpriteSizeSetter", SpriteSizeSetter = (_dec = ccclass('SpriteSizeSetter'), _dec(_class = (_class2 = class SpriteSizeSetter extends Component {
        constructor() {
          super(...arguments);
          this._setSize = false;
        }

        start() {}

        set setSize(value) {
          this._setSize = value;

          if (value) {
            this.setSprite();
          }
        }

        get setSize() {
          return this._setSize;
        }

        setSprite() {
          var uis = this.node.getComponentsInChildren(Sprite).map(s => s.getComponent(UITransform)).filter(u => u);
          uis.forEach(uit => {
            var scale = uit.node.scale;
            var w = uit.width * scale.x;
            var h = uit.height * scale.y;
            uit.node.scale = v3(1, 1, 1);
            uit.width = w;
            uit.height = h;
          });
        }

        update(deltaTime) {}

      }, (_applyDecoratedDescriptor(_class2.prototype, "setSize", [property], Object.getOwnPropertyDescriptor(_class2.prototype, "setSize"), _class2.prototype)), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=65e25e15c1bbfdcc2664f2812bd194eb913bda53.js.map