System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, ParticleSystem2D, tween, v3, PoolMember, _dec, _class, _crd, ccclass, property, Cloud;

  function _reportPossibleCrUseOfPoolMember(extras) {
    _reporterNs.report("PoolMember", "../Pool/PoolMember", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      ParticleSystem2D = _cc.ParticleSystem2D;
      tween = _cc.tween;
      v3 = _cc.v3;
    }, function (_unresolved_2) {
      PoolMember = _unresolved_2.PoolMember;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "315c2k5pcxCGJnWkyQb1aex", "Cloud", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'ParticleSystem2D', 'tween', 'v3', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("Cloud", Cloud = (_dec = ccclass('Cloud'), _dec(_class = class Cloud extends (_crd && PoolMember === void 0 ? (_reportPossibleCrUseOfPoolMember({
        error: Error()
      }), PoolMember) : PoolMember) {
        constructor(...args) {
          super(...args);
          this.target = null;
          this.pts = [];
        }

        start() {}

        init() {
          this.pts = this.node.getComponentsInChildren(ParticleSystem2D);
          this.pts.forEach(pt => {
            pt.node.position = v3();
            pt.resetSystem();
          });
        }

        moveTo(pos, callback) {
          this.pts.forEach(pt => {
            pt.resetSystem();
          });
          let dir = pos.clone().subtract(this.pts[1].node.worldPosition);
          let time = dir.length() / 2000;
          tween(this.pts[1].node).to(time, {
            worldPosition: pos
          }).call(() => {
            callback && callback();
            this.despawn();
          }).start();
        }

        despawn() {
          this.pts.forEach(pt => {
            pt.resetSystem();
            pt.stopSystem();
          });
          this.node.active = false;
        }

        update(deltaTime) {
          try {
            if (this.target) {
              this.node.worldPosition = this.target.worldPosition.clone();
            } else {
              this.despawn();
            }
          } catch (error) {
            this.target = null;
            this.despawn();
          }
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=0b3c6902131ac852b7994d361119ae5111c2f674.js.map