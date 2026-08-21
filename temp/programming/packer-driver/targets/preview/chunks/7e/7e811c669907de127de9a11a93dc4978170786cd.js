System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, CCString, MeshRenderer, PoolMember, _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _dec5, _dec6, _class4, _class5, _descriptor4, _crd, ccclass, property, MeshAsset, MeshLoader;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

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
      CCString = _cc.CCString;
      MeshRenderer = _cc.MeshRenderer;
    }, function (_unresolved_2) {
      PoolMember = _unresolved_2.PoolMember;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "14a9e1i+nBBSoR5XW1rEP6R", "MeshLoader", undefined);

      __checkObsolete__(['_decorator', 'CCString', 'Component', 'MeshRenderer', 'Node']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("MeshAsset", MeshAsset = (_dec = ccclass('MeshAsset'), _dec2 = property(MeshRenderer), _dec3 = property(CCString), _dec4 = property(CCString), _dec(_class = (_class2 = class MeshAsset {
        constructor() {
          _initializerDefineProperty(this, "renderMesh", _descriptor, this);

          _initializerDefineProperty(this, "mesPath", _descriptor2, this);

          _initializerDefineProperty(this, "matPath", _descriptor3, this);
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "renderMesh", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "mesPath", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return "";
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "matPath", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return "";
        }
      })), _class2)) || _class));

      _export("MeshLoader", MeshLoader = (_dec5 = ccclass('MeshLoader'), _dec6 = property([MeshAsset]), _dec5(_class4 = (_class5 = class MeshLoader extends (_crd && PoolMember === void 0 ? (_reportPossibleCrUseOfPoolMember({
        error: Error()
      }), PoolMember) : PoolMember) {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "meshAssets", _descriptor4, this);
        }

        bindMeshAndMaterial() {}

        start() {}

        update(deltaTime) {}

      }, (_descriptor4 = _applyDecoratedDescriptor(_class5.prototype, "meshAssets", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      })), _class5)) || _class4));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=7e811c669907de127de9a11a93dc4978170786cd.js.map