System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, CCInteger, Component, Node, Prefab, Quat, _decorator, instantiate, v3, PoolMember, PoolControl, Pool, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _descriptor3, _dec4, _dec5, _class4, _class5, _descriptor4, _crd, ccclass, property, executeInEditMode, PoolAmount, pm, PoolManager;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfPoolMember(extras) {
    _reporterNs.report("PoolMember", "./PoolMember", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPoolType(extras) {
    _reporterNs.report("PoolType", "./PoolMember", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPoolControl(extras) {
    _reporterNs.report("PoolControl", "./PoolControl", _context.meta, extras);
  }

  _export("Pool", void 0);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      CCInteger = _cc.CCInteger;
      Component = _cc.Component;
      Node = _cc.Node;
      Prefab = _cc.Prefab;
      Quat = _cc.Quat;
      _decorator = _cc._decorator;
      instantiate = _cc.instantiate;
      v3 = _cc.v3;
    }, function (_unresolved_2) {
      PoolMember = _unresolved_2.PoolMember;
    }, function (_unresolved_3) {
      PoolControl = _unresolved_3.default;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "73724iDUEBH0qW1LsAQjVX4", "PoolManager", undefined); // Learn TypeScript:
      //  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
      // Learn Attribute:
      //  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
      // Learn life-cycle callbacks:
      //  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html


      // import { PoolAmount } from "./PoolAmount";
      __checkObsolete__(['CCInteger', 'Component', 'Node', 'Prefab', 'Quat', 'Vec3', '_decorator', 'instantiate', 'log', 'v3']);

      ({
        ccclass,
        property,
        executeInEditMode
      } = _decorator);

      _export("Pool", Pool = class Pool {
        constructor(root, prefab, amount) {
          this.list = [];
          this.prefab = null;
          this.root = null;
          this.prefab = prefab;
          this.root = root;

          for (var i = 0; i < amount; i++) {
            var clone = instantiate(prefab).getComponent(_crd && PoolMember === void 0 ? (_reportPossibleCrUseOfPoolMember({
              error: Error()
            }), PoolMember) : PoolMember);
            clone.node.parent = root;
            clone.node.active = false;
            this.list.push(clone);
          }
        }

        spawn(position, rotation) {
          var clone = null;

          if (this.list.length == 0) {
            clone = instantiate(this.prefab).getComponent(_crd && PoolMember === void 0 ? (_reportPossibleCrUseOfPoolMember({
              error: Error()
            }), PoolMember) : PoolMember);
            clone.node.parent = this.root;
          } else {
            clone = this.list.pop();
          }

          clone.node.position = position;
          clone.node.rotation = rotation;
          clone.node.active = true;
          return clone;
        }

        despawn(clone) {
          clone.node.parent = this.root;
          clone.node.active = false;
          clone.node.position = v3(0, 0, 0);
          this.list.push(clone);
        }

      });

      _export("PoolAmount", PoolAmount = (_dec = property(Node), _dec2 = property(Prefab), _dec3 = property(CCInteger), ccclass(_class = (_class2 = class PoolAmount {
        constructor() {
          _initializerDefineProperty(this, "root", _descriptor, this);

          _initializerDefineProperty(this, "prefab", _descriptor2, this);

          _initializerDefineProperty(this, "amount", _descriptor3, this);
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "root", [_dec], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "prefab", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "amount", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      })), _class2)) || _class));

      _export("pm", pm = null);

      _export("PoolManager", PoolManager = (_dec4 = executeInEditMode(true), _dec5 = property(_crd && PoolControl === void 0 ? (_reportPossibleCrUseOfPoolControl({
        error: Error()
      }), PoolControl) : PoolControl), ccclass(_class4 = _dec4(_class4 = (_class5 = class PoolManager extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "poolControll", _descriptor4, this);

          this.link = new Map();
        }

        preLoad(poolAmounts) {
          for (var i = 0; i < poolAmounts.length; i++) {
            var poolAmount = poolAmounts[i];
            var pool = new Pool(poolAmount.root, poolAmount.prefab, poolAmount.amount);
            var type = instantiate(poolAmount.prefab).getComponent(_crd && PoolMember === void 0 ? (_reportPossibleCrUseOfPoolMember({
              error: Error()
            }), PoolMember) : PoolMember).type;

            if (!this.link.has(type)) {
              this.link.set(type, pool);
            } // console.log(this.link.get(type));

          }
        }

        spawn(type, position, rotation) {
          if (position === void 0) {
            position = v3();
          }

          if (rotation === void 0) {
            rotation = Quat.fromEuler(new Quat(), 0, 0, 0);
          }

          var pool = this.link.get(type);
          return pool.spawn(position, rotation);
        }

        spawnType(type, position, rotation) {
          if (position === void 0) {
            position = v3();
          }

          if (rotation === void 0) {
            rotation = Quat.fromEuler(new Quat(), 0, 0, 0);
          }

          var pool = this.link.get(type); // console.log('pool', pool, type);    

          return pool.spawn(position, rotation);
        }

        despawn(clone) {
          var pool = this.link.get(clone.type);
          pool.despawn(clone);
        }

        onLoad() {
          _export("pm", pm = this);

          this.preLoad(this.poolControll.poolAmounts);
        }

      }, (_descriptor4 = _applyDecoratedDescriptor(_class5.prototype, "poolControll", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class5)) || _class4) || _class4));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=2edfd1a8569d7e1ebf5dee1570205e7e261d4d86.js.map