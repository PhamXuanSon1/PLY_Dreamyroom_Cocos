System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, UI, SoundManager, MainCamera, GameController, PoolManager, PoolMember, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _class3, _crd, ccclass, property, executeInEditMode, World;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfUI(extras) {
    _reporterNs.report("UI", "./UI", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSoundManager(extras) {
    _reporterNs.report("SoundManager", "./SoundManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfMainCamera(extras) {
    _reporterNs.report("MainCamera", "./MainCamera", _context.meta, extras);
  }

  function _reportPossibleCrUseOfGameController(extras) {
    _reporterNs.report("GameController", "../Tool/GameController", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPoolManager(extras) {
    _reporterNs.report("PoolManager", "../Pool/PoolManager", _context.meta, extras);
  }

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
      Component = _cc.Component;
    }, function (_unresolved_2) {
      UI = _unresolved_2.UI;
    }, function (_unresolved_3) {
      SoundManager = _unresolved_3.default;
    }, function (_unresolved_4) {
      MainCamera = _unresolved_4.MainCamera;
    }, function (_unresolved_5) {
      GameController = _unresolved_5.GameController;
    }, function (_unresolved_6) {
      PoolManager = _unresolved_6.PoolManager;
    }, function (_unresolved_7) {
      PoolMember = _unresolved_7.PoolMember;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "8bb25fqdWRFxp6C5ausXKkp", "World", undefined);

      __checkObsolete__(['_decorator', 'Component', 'game', 'Node', 'PhysicsSystem', 'Pool']);

      ({
        ccclass,
        property,
        executeInEditMode
      } = _decorator);

      _export("World", World = (_dec = ccclass('World'), _dec2 = executeInEditMode(true), _dec3 = property(_crd && UI === void 0 ? (_reportPossibleCrUseOfUI({
        error: Error()
      }), UI) : UI), _dec4 = property(_crd && GameController === void 0 ? (_reportPossibleCrUseOfGameController({
        error: Error()
      }), GameController) : GameController), _dec5 = property(_crd && PoolManager === void 0 ? (_reportPossibleCrUseOfPoolManager({
        error: Error()
      }), PoolManager) : PoolManager), _dec6 = property(_crd && MainCamera === void 0 ? (_reportPossibleCrUseOfMainCamera({
        error: Error()
      }), MainCamera) : MainCamera), _dec7 = property(_crd && SoundManager === void 0 ? (_reportPossibleCrUseOfSoundManager({
        error: Error()
      }), SoundManager) : SoundManager), _dec(_class = _dec2(_class = (_class2 = (_class3 = class World extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "ui", _descriptor, this);

          _initializerDefineProperty(this, "openStore", _descriptor2, this);

          _initializerDefineProperty(this, "poolManager", _descriptor3, this);

          _initializerDefineProperty(this, "camera", _descriptor4, this);

          _initializerDefineProperty(this, "soundmanager", _descriptor5, this);
        }

        static get ins() {
          if (!this.instance) {
            this.instance = new World();
          }

          return this.instance;
        }

        despawn(node) {
          this.poolManager.despawn(node.getComponent(_crd && PoolMember === void 0 ? (_reportPossibleCrUseOfPoolMember({
            error: Error()
          }), PoolMember) : PoolMember));
        }

        onLoad() {
          World.instance = this;
        }

        start() {// PhysicsSystem.instance.maxSubSteps = 1;
          // game.frameRate = 60;
        }

        update(deltaTime) {}

      }, _class3.instance = null, _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "ui", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "openStore", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "poolManager", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "camera", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "soundmanager", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=61c926d1494e110a5fca7d2805189b094f836e2d.js.map