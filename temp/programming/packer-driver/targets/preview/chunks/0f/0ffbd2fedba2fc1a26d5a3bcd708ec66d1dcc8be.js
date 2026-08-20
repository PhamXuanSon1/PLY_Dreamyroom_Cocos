System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Enum, _dec, _class, _class2, _descriptor, _crd, ccclass, property, PoolType, PoolMember;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Enum = _cc.Enum;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "ab9dfBLlyZMX6wvrfMaKSf0", "PoolMember", undefined); // Learn TypeScript:
      //  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
      // Learn Attribute:
      //  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
      // Learn life-cycle callbacks:
      //  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html
      // const {ccclass, property} = cc._decorator;


      __checkObsolete__(['_decorator', 'Component', 'Node', 'Prefab', 'instantiate', 'Vec3', 'Quat', 'Enum']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("PoolType", PoolType = /*#__PURE__*/function (PoolType) {
        PoolType[PoolType["Default"] = 0] = "Default";
        PoolType[PoolType["Slot"] = 1] = "Slot";
        PoolType[PoolType["Thing"] = 2] = "Thing";
        PoolType[PoolType["Box"] = 3] = "Box";
        PoolType[PoolType["VFX"] = 4] = "VFX";
        PoolType[PoolType["StarVFX"] = 5] = "StarVFX";
        return PoolType;
      }({}));

      _export("PoolMember", PoolMember = (_dec = property({
        type: Enum(PoolType)
      }), ccclass(_class = (_class2 = class PoolMember extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "type", _descriptor, this);
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "type", [_dec], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return PoolType.Default;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=0ffbd2fedba2fc1a26d5a3bcd708ec66d1dcc8be.js.map