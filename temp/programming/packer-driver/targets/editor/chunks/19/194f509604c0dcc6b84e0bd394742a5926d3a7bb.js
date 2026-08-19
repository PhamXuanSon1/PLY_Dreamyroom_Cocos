System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Prefab, instantiate, Quat, CCInteger, Enum, Ply_Singleton, Ply_GameUnit, _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _dec5, _dec6, _class4, _class5, _descriptor4, _class6, _crd, ccclass, property, PoolType, PoolAmount, Ply_Pool;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfPly_Singleton(extras) {
    _reporterNs.report("Ply_Singleton", "./Ply_Singleton", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPly_GameUnit(extras) {
    _reporterNs.report("Ply_GameUnit", "./Ply_GameUnit", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Prefab = _cc.Prefab;
      instantiate = _cc.instantiate;
      Quat = _cc.Quat;
      CCInteger = _cc.CCInteger;
      Enum = _cc.Enum;
    }, function (_unresolved_2) {
      Ply_Singleton = _unresolved_2.Ply_Singleton;
    }, function (_unresolved_3) {
      Ply_GameUnit = _unresolved_3.Ply_GameUnit;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "0659aw80IRHMpXj8Wy72eyh", "Ply_Pool", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Prefab', 'instantiate', 'Vec3', 'Quat', 'CCInteger', 'Enum']);

      ({
        ccclass,
        property
      } = _decorator);
      /**
       * Enum cac loai Pool - them cac loai khac neu can.
       */

      _export("PoolType", PoolType = /*#__PURE__*/function (PoolType) {
        PoolType[PoolType["Heart"] = 0] = "Heart";
        PoolType[PoolType["CorrectEffect"] = 1] = "CorrectEffect";
        PoolType[PoolType["BreakHeart"] = 2] = "BreakHeart";
        return PoolType;
      }({})); // Dang ky enum de hien thi tren inspector cua Cocos Creator


      Enum(PoolType);
      /**
       * Quan ly Object Pool duoc chuyen tu Unity Ply_Pool.
       * 
       * Diem khac biệt so voi Unity:
       * - Dung Prefab thay vi tham chieu gameUnit truc tiep de khoi tao
       * - Dung node.active thay vi gameObject.SetActive()
       * - Dung instantiate() tu 'cc' thay vi UnityEngine.Object.Instantiate()
       * - Dat vi tri/goi quay qua node.setPosition() va node.setRotation()
       */

      PoolAmount = (_dec = ccclass('Ply_PoolAmount'), _dec2 = property({
        type: PoolType
      }), _dec3 = property(CCInteger), _dec4 = property(Prefab), _dec(_class = (_class2 = class PoolAmount {
        constructor() {
          _initializerDefineProperty(this, "type", _descriptor, this);

          _initializerDefineProperty(this, "amount", _descriptor2, this);

          _initializerDefineProperty(this, "prefab", _descriptor3, this);
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "type", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return PoolType.Heart;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "amount", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "prefab", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class);

      _export("Ply_Pool", Ply_Pool = (_dec5 = ccclass('Ply_Pool'), _dec6 = property([PoolAmount]), _dec5(_class4 = (_class5 = (_class6 = class Ply_Pool extends (_crd && Ply_Singleton === void 0 ? (_reportPossibleCrUseOfPly_Singleton({
        error: Error()
      }), Ply_Singleton) : Ply_Singleton) {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "poolAmounts", _descriptor4, this);

          this.dict = new Map();
        }

        // onLoad() la ham duoc goi khi component duoc khoi tao, truoc khi bat dau scene
        onLoad() {
          super.onLoad();
          Ply_Pool.Ins = this;
          this.onInit();
        } // Ham khoi tao pool, tao cac game unit va luu vao dict


        onInit() {
          for (let i = 0; i < this.poolAmounts.length; i++) {
            const poolAmount = this.poolAmounts[i]; // Neu chua co danh sach cho loai pool nay, tao mot danh sach moi

            if (!this.dict.has(poolAmount.type)) {
              this.dict.set(poolAmount.type, []);
            } // Khoi tao cac game unit va them vao danh sach


            for (let j = 0; j < poolAmount.amount; j++) {
              if (!poolAmount.prefab) continue;
              const unitNode = instantiate(poolAmount.prefab);
              unitNode.active = false;
              unitNode.setParent(this.node);
              const gameUnit = unitNode.getComponent(_crd && Ply_GameUnit === void 0 ? (_reportPossibleCrUseOfPly_GameUnit({
                error: Error()
              }), Ply_GameUnit) : Ply_GameUnit);

              if (gameUnit) {
                this.dict.get(poolAmount.type).push(gameUnit);
              }
            }
          }
        }
        /**
         * Lay mot game unit ra tu pool (spawn).
         * @param poolType - Loai doi tuong can spawn
         * @param pos - Vi tri the gioi
         * @param rot - Goc quay (Quat), mac dinh la identity
         * @returns Ply_GameUnit duoc spawn
         */


        spawn(poolType, pos, rot = new Quat()) {
          const queue = this.dict.get(poolType); // Lay danh sach game unit tu pool

          let gameUnit = null; // Khai bao bien gameUnit de luu ket qua
          // Neu co game unit trong pool, lay mot cai ra va xoa khoi danh sach

          if (queue && queue.length > 0) {
            gameUnit = queue.shift(); // queue.shift() lay phan tu dau tien va xoa khoi danh sach
          } else {
            // Neu khong co san trong pool, khoi tao mot cai moi
            const prefab = this.getPrefab(poolType);
            if (!prefab) return null; // Khoi tao mot node moi tu prefab va lay component Ply_GameUnit

            const unitNode = instantiate(prefab);
            unitNode.setParent(this.node);
            gameUnit = unitNode.getComponent(_crd && Ply_GameUnit === void 0 ? (_reportPossibleCrUseOfPly_GameUnit({
              error: Error()
            }), Ply_GameUnit) : Ply_GameUnit);
          }

          if (gameUnit) {
            gameUnit.node.setPosition(pos);
            gameUnit.node.setRotation(rot);
            gameUnit.node.active = true;
          }

          return gameUnit;
        }
        /**
         * Tra game unit ve lai pool (despawn).
         * @param poolType - Loai doi tuong
         * @param gameUnit - Game unit can thu hoi
         */


        despawn(poolType, gameUnit) {
          gameUnit.node.active = false; // Tra node ve lai Pool node de lan spawn tiep theo setPosition() hoat dong dung
          // (tranh truong hop node van la con cua parent cu, dan den toa do local bi sai)

          if (gameUnit.node.parent !== this.node) {
            gameUnit.node.setParent(this.node, false);
          }

          if (!this.dict.has(poolType)) {
            this.dict.set(poolType, []);
          }

          this.dict.get(poolType).push(gameUnit);
        }
        /**
         * Lay prefab tuong ung voi loai pool.
         */


        getPrefab(poolType) {
          for (let i = 0; i < this.poolAmounts.length; i++) {
            if (this.poolAmounts[i].type === poolType) {
              return this.poolAmounts[i].prefab;
            }
          }

          return null;
        }

        onDestroy() {
          super.onDestroy();

          if (Ply_Pool.Ins === this) {
            Ply_Pool.Ins = null;
          }
        }

      }, _class6.Ins = null, _class6), (_descriptor4 = _applyDecoratedDescriptor(_class5.prototype, "poolAmounts", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      })), _class5)) || _class4));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=194f509604c0dcc6b84e0bd394742a5926d3a7bb.js.map