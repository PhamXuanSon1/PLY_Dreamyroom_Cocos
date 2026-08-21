System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, MeshLoader, AssetsManagerCustom, _dec, _class, _class2, _crd, ccclass, property, Tooth;

  function _reportPossibleCrUseOfMeshLoader(extras) {
    _reporterNs.report("MeshLoader", "./MeshLoader", _context.meta, extras);
  }

  function _reportPossibleCrUseOfAssetsManagerCustom(extras) {
    _reporterNs.report("AssetsManagerCustom", "../Manager/AssetsManagerCustom", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
    }, function (_unresolved_2) {
      MeshLoader = _unresolved_2.MeshLoader;
    }, function (_unresolved_3) {
      AssetsManagerCustom = _unresolved_3.AssetsManagerCustom;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "f25b6FFtOdNUISeQCSl+n57", "Tooth", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("Tooth", Tooth = (_dec = ccclass('Tooth'), _dec(_class = (_class2 = class Tooth extends (_crd && MeshLoader === void 0 ? (_reportPossibleCrUseOfMeshLoader({
        error: Error()
      }), MeshLoader) : MeshLoader) {
        bindMeshAndMaterial() {
          this.meshAssets[0].renderMesh.mesh = (_crd && AssetsManagerCustom === void 0 ? (_reportPossibleCrUseOfAssetsManagerCustom({
            error: Error()
          }), AssetsManagerCustom) : AssetsManagerCustom).ins.assetInfos.get(this.meshAssets[0].mesPath);
          this.meshAssets[0].renderMesh.material = (_crd && AssetsManagerCustom === void 0 ? (_reportPossibleCrUseOfAssetsManagerCustom({
            error: Error()
          }), AssetsManagerCustom) : AssetsManagerCustom).ins.assetInfos.get(this.meshAssets[0].matPath);
        }

        start() {
          Tooth.instances.push(this);
        }

        update(deltaTime) {}

      }, _class2.instances = [], _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=1877fc80bbfab7ac06770d535576559eced36c4d.js.map