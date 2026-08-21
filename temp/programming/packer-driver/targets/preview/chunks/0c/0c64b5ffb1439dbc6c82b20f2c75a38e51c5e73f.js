System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Prefab, instantiate, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _descriptor3, _dec4, _dec5, _dec6, _class4, _class5, _descriptor4, _descriptor5, _class6, _crd, ccclass, property, PoolType, PoolAmount, ObjectPool;

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
      Node = _cc.Node;
      Prefab = _cc.Prefab;
      instantiate = _cc.instantiate;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "e19a4ZjF7JAjId2XezFzgra", "ObjectPool", undefined);
      /**
       * ObjectPool — port từ Ply_Pool.cs (Unity)
       *
       * ⚠ MỖI FILE .ts CHỈ ĐƯỢC CÓ ĐÚNG 1 CLASS KẾ THỪA Component.
       *   Vi phạm -> "Each script can have at most one Component" -> module vỡ ->
       *   TOÀN BỘ bundle script mất đăng ký -> mọi component trong scene thành
       *   "missing or invalid". Lỗi rất khó lần vì thông báo nằm ở script này
       *   nhưng hậu quả hiện ra ở mọi script khác.
       *
       * Ply_GameUnit.cs KHÔNG port: nó chỉ là base class giữ `tf`, mà pool ở đây
       * làm việc trực tiếp với Node còn BlinkEffect kế thừa thẳng Component.
       */


      __checkObsolete__(['_decorator', 'Component', 'Node', 'Prefab', 'instantiate', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);
      /** Unity: PoolType. Level542 chỉ dùng BlinkFX. */

      _export("PoolType", PoolType = /*#__PURE__*/function (PoolType) {
        PoolType[PoolType["Bullet"] = 0] = "Bullet";
        PoolType[PoolType["Enemy"] = 1] = "Enemy";
        PoolType[PoolType["VFX_Spark"] = 2] = "VFX_Spark";
        PoolType[PoolType["VFX_Explore"] = 3] = "VFX_Explore";
        PoolType[PoolType["Enemy_Bullet"] = 4] = "Enemy_Bullet";
        PoolType[PoolType["Booster"] = 5] = "Booster";
        PoolType[PoolType["CorrectEffect"] = 6] = "CorrectEffect";
        PoolType[PoolType["CorrectText1"] = 7] = "CorrectText1";
        PoolType[PoolType["CorrectText2"] = 8] = "CorrectText2";
        PoolType[PoolType["CorrectText3"] = 9] = "CorrectText3";
        PoolType[PoolType["BlinkFX"] = 10] = "BlinkFX";
        return PoolType;
      }({}));

      _export("PoolAmount", PoolAmount = (_dec = ccclass('DreamyPoolAmount'), _dec2 = property({
        type: Prefab
      }), _dec3 = property({
        tooltip: 'Chỉ số của PoolType (BlinkFX = 10)'
      }), _dec(_class = (_class2 = class PoolAmount {
        constructor() {
          _initializerDefineProperty(this, "prefab", _descriptor, this);

          _initializerDefineProperty(this, "type", _descriptor2, this);

          _initializerDefineProperty(this, "amount", _descriptor3, this);
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "prefab", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "type", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return PoolType.BlinkFX;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "amount", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 5;
        }
      })), _class2)) || _class));
      /** Unity: Ply_Pool */


      _export("ObjectPool", ObjectPool = (_dec4 = ccclass('DreamyObjectPool'), _dec5 = property({
        type: [PoolAmount]
      }), _dec6 = property({
        type: Node,
        tooltip: 'Node chứa object trong pool. Để trống = dùng chính node này.'
      }), _dec4(_class4 = (_class5 = (_class6 = class ObjectPool extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "poolAmounts", _descriptor4, this);

          _initializerDefineProperty(this, "container", _descriptor5, this);

          this.dict = new Map();
          this.prefabOf = new Map();
        }

        onLoad() {
          ObjectPool.instance = this;

          for (var pa of this.poolAmounts) {
            if (!pa.prefab) continue;
            this.prefabOf.set(pa.type, pa.prefab);
            var q = [];

            for (var i = 0; i < pa.amount; i++) {
              var _this$container;

              var n = instantiate(pa.prefab);
              n.active = false;
              n.setParent((_this$container = this.container) != null ? _this$container : this.node);
              q.push(n);
            }

            this.dict.set(pa.type, q);
          }
        }

        onDestroy() {
          if (ObjectPool.instance === this) ObjectPool.instance = null;
        }
        /** Unity: Spawn(poolType, pos, rot) */


        spawn(type, worldPos) {
          var q = this.dict.get(type);
          var n = q && q.length > 0 ? q.pop() : null;

          if (!n) {
            var _this$container2;

            var prefab = this.prefabOf.get(type);
            if (!prefab) return null;
            n = instantiate(prefab);
            n.setParent((_this$container2 = this.container) != null ? _this$container2 : this.node);
          }

          n.layer = this.node.layer; // xem ghi chú UI_2D ở SceneBuilder

          n.setWorldPosition(worldPos);
          n.active = true;
          return n;
        }
        /** Unity: Despawn */


        despawn(type, node) {
          var _this$container3;

          if (!node || !node.isValid) return;
          node.active = false;
          node.setParent((_this$container3 = this.container) != null ? _this$container3 : this.node);
          var q = this.dict.get(type);

          if (!q) {
            q = [];
            this.dict.set(type, q);
          }

          if (q.indexOf(node) < 0) q.push(node);
        }

      }, _class6.instance = null, _class6), (_descriptor4 = _applyDecoratedDescriptor(_class5.prototype, "poolAmounts", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class5.prototype, "container", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class5)) || _class4));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=0c64b5ffb1439dbc6c82b20f2c75a38e51c5e73f.js.map