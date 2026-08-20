System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, ObjectPool, PoolType, _dec, _class, _crd, ccclass, BlinkEffect;

  function _reportPossibleCrUseOfObjectPool(extras) {
    _reporterNs.report("ObjectPool", "../core/ObjectPool", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPoolType(extras) {
    _reporterNs.report("PoolType", "../core/ObjectPool", _context.meta, extras);
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
    }, function (_unresolved_2) {
      ObjectPool = _unresolved_2.ObjectPool;
      PoolType = _unresolved_2.PoolType;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "9dd37NBQwhHBIjL6Lw5o8v7", "BlinkEffect", undefined);
      /** BlinkEffect — port từ Assets/_GamePlay_/Scripts/Effect/BlinkEffect.cs (Unity) */


      __checkObsolete__(['_decorator', 'Component']);

      ({
        ccclass
      } = _decorator);

      _export("BlinkEffect", BlinkEffect = (_dec = ccclass('BlinkEffect'), _dec(_class = class BlinkEffect extends Component {
        /** Unity: DeSpawnByTime — Invoke(nameof(DeSpawn), 2f) */
        deSpawnByTime(delay = 2) {
          this.scheduleOnce(() => this.deSpawn(), delay);
        }

        deSpawn() {
          var _instance;

          (_instance = (_crd && ObjectPool === void 0 ? (_reportPossibleCrUseOfObjectPool({
            error: Error()
          }), ObjectPool) : ObjectPool).instance) == null || _instance.despawn((_crd && PoolType === void 0 ? (_reportPossibleCrUseOfPoolType({
            error: Error()
          }), PoolType) : PoolType).BlinkFX, this.node);
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=ca551bbbef26f77ac5f3bde3e4e87402271d1650.js.map