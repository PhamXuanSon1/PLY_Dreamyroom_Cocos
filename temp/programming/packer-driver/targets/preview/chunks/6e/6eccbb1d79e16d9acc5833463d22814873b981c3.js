System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, Component, Node, Prefab, _decorator, PoolAmount, _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _crd, ccclass, property, executeInEditMode, PoolControl;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfPoolMember(extras) {
    _reporterNs.report("PoolMember", "./PoolMember", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPoolAmount(extras) {
    _reporterNs.report("PoolAmount", "./PoolManager", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      Component = _cc.Component;
      Node = _cc.Node;
      Prefab = _cc.Prefab;
      _decorator = _cc._decorator;
    }, function (_unresolved_2) {
      PoolAmount = _unresolved_2.PoolAmount;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "01ff5hBpgBGHZ1h7eo0jkSv", "PoolControl", undefined); // Learn TypeScript:
      //  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
      // Learn Attribute:
      //  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
      // Learn life-cycle callbacks:
      //  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html


      __checkObsolete__(['Component', 'Node', 'Prefab', 'Quat', 'Vec3', '_decorator', 'instantiate', 'log', 'v3']);

      ({
        ccclass,
        property,
        executeInEditMode
      } = _decorator);

      _export("default", PoolControl = (_dec = ccclass('PoolControl'), _dec2 = executeInEditMode(true), _dec3 = property(Node), _dec4 = property([Prefab]), _dec(_class = _dec2(_class = (_class2 = class PoolControl extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "root", _descriptor, this);

          _initializerDefineProperty(this, "prefabs", _descriptor2, this);

          this.poolAmounts = [];
        }

        preLoad() {
          this.prefabs.forEach((prefab, index) => {
            var poolAmount = new (_crd && PoolAmount === void 0 ? (_reportPossibleCrUseOfPoolAmount({
              error: Error()
            }), PoolAmount) : PoolAmount)();
            poolAmount.root = this.root;
            poolAmount.prefab = prefab;
            poolAmount.amount = 0;
            this.poolAmounts.push(poolAmount);
          });
        } // LIFE-CYCLE CALLBACKS:


        onLoad() {
          this.preLoad();
        }

        start() {} // update (dt) {}


      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "root", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "prefabs", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      })), _class2)) || _class) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=6eccbb1d79e16d9acc5833463d22814873b981c3.js.map