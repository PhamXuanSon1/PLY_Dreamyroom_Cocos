System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Label, Sprite, tween, UITransform, v3, Vec3, _dec, _class, _crd, ccclass, property, IQ;

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Label = _cc.Label;
      Sprite = _cc.Sprite;
      tween = _cc.tween;
      UITransform = _cc.UITransform;
      v3 = _cc.v3;
      Vec3 = _cc.Vec3;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "a83ddu5IkNKhL/rkW9eeteO", "IQ", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Label', 'Node', 'Sprite', 'tween', 'Tween', 'UITransform', 'v3', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("IQ", IQ = (_dec = ccclass('IQ'), _dec(_class = class IQ extends Component {
        constructor(...args) {
          super(...args);
          this.iqTween = null;
          // @property(Sprite)
          this.fill = null;
          // @property(Node)
          this.needle = null;
          this.label = null;
          this.total = 0;
          this.count = 0;
        }

        init(total) {
          this.total = total;
          let sp = this.getComponentsInChildren(Sprite);
          this.fill = sp.find(s => s.node.name == "Fill");
          this.needle = sp.find(s => s.node.name == "Needle").node;
          this.label = this.getComponentInChildren(Label);
          this.onIq();
        }

        setProgress() {
          this.count++;
          this.onIq();
        }

        onIq() {
          var _this$iqTween;

          const r = this.fill.fillRange;
          let range = this.count / this.total;

          if (range >= 0.9) {// ui.bindingToStore();
          }

          this.label.string = (range * 100 | 0) + "%";
          let dt = range - r;
          let uit = this.fill.getComponent(UITransform);
          let scale = this.fill.node.getWorldScale();
          let pos = this.fill.node.getWorldPosition();
          let pos0 = pos.clone();
          let pos1 = pos.clone();
          pos0.x = pos.x - scale.x * uit.width * 0.5;
          pos1.x = pos.x + scale.x * uit.width * 0.5;
          pos0 = this.needle.parent.inverseTransformPoint(v3(), pos0);
          pos1 = this.needle.parent.inverseTransformPoint(v3(), pos1);
          let t = this;
          t.needle.position = Vec3.lerp(v3(), pos0, pos1, r + 1 * dt);
          (_this$iqTween = this.iqTween) == null || _this$iqTween.stop();
          this.iqTween = tween(this.fill).to(0.2, {
            fillRange: range
          }, {
            onUpdate(target, ratio) {
              t.needle.position = Vec3.lerp(v3(), pos0, pos1, r + ratio * dt);
            }

          }).start();
        }

        update(deltaTime) {}

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=0e528187a4817455522fe7ad2ef3582c2a8675d6.js.map