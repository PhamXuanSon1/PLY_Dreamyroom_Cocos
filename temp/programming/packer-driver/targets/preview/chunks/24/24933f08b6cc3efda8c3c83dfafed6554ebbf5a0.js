System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, ParticleSystem2D, PoolMember, World, _dec, _class, _crd, ccclass, property, VFX;

  function _reportPossibleCrUseOfPoolMember(extras) {
    _reporterNs.report("PoolMember", "../Pool/PoolMember", _context.meta, extras);
  }

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
      ParticleSystem2D = _cc.ParticleSystem2D;
    }, function (_unresolved_2) {
      PoolMember = _unresolved_2.PoolMember;
    }, function (_unresolved_3) {
      World = _unresolved_3.World;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "bad9b+bhlJAfJPf1UUn9TMC", "VFX", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'ParticleSystem2D']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("VFX", VFX = (_dec = ccclass('VFX'), _dec(_class = class VFX extends (_crd && PoolMember === void 0 ? (_reportPossibleCrUseOfPoolMember({
        error: Error()
      }), PoolMember) : PoolMember) {
        constructor() {
          super(...arguments);
          this.particles = [];
        }

        start() {}

        init() {
          this.particles = this.node.getComponentsInChildren(ParticleSystem2D);
          this.particles.forEach(pt => {
            pt.resetSystem();
          });
          setTimeout(() => {
            (_crd && World === void 0 ? (_reportPossibleCrUseOfWorld({
              error: Error()
            }), World) : World).ins.despawn(this.node);
          }, 1000);
        }

        update(deltaTime) {}

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=24933f08b6cc3efda8c3c83dfafed6554ebbf5a0.js.map