System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Vec3, BaseRoom, _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _class3, _crd, ccclass, property, BaseRoomManager;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfBaseRoom(extras) {
    _reporterNs.report("BaseRoom", "../utils/BaseRoom", _context.meta, extras);
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
      Node = _cc.Node;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      BaseRoom = _unresolved_2.BaseRoom;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "d98616b1gpGBY4PxCQ2tR5M", "BaseRoomManager", undefined);
      /**
       * BaseRoomManager — port từ Assets/_GAME/Script/Manager/BaseRoomManager.cs (Unity)
       *
       * playIntroAnimation() bên Unity đã rỗng (chỉ gọi callback) vì hộp bị loại bỏ
       * khỏi luồng intro — giữ nguyên để BoxController không phải đổi.
       */


      __checkObsolete__(['_decorator', 'Component', 'Node', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("BaseRoomManager", BaseRoomManager = (_dec = ccclass('BaseRoomManager'), _dec2 = property({
        type: Node,
        tooltip: 'Node căn phòng chính.'
      }), _dec3 = property({
        type: Node,
        tooltip: 'Vị trí phòng lúc mới vào game (hiệu ứng intro).'
      }), _dec4 = property({
        type: Node,
        tooltip: 'Vị trí phòng sau khi intro xong.'
      }), _dec5 = property({
        tooltip: 'Tỉ lệ thu nhỏ ban đầu của phòng.'
      }), _dec(_class = (_class2 = (_class3 = class BaseRoomManager extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "BaseRoom", _descriptor, this);

          _initializerDefineProperty(this, "baseRoomStartPos", _descriptor2, this);

          _initializerDefineProperty(this, "baseRoomEndPos", _descriptor3, this);

          _initializerDefineProperty(this, "startScaleMultiplier", _descriptor4, this);

          this.baseRoomOriginalScale = new Vec3(1, 1, 1);
        }

        onLoad() {
          BaseRoomManager.instance = this;

          if (this.BaseRoom) {
            this.baseRoomOriginalScale = this.BaseRoom.scale.clone();
            var room = this.BaseRoom.getComponent(_crd && BaseRoom === void 0 ? (_reportPossibleCrUseOfBaseRoom({
              error: Error()
            }), BaseRoom) : BaseRoom);

            if (room) {
              room.initializeOriginalScale(this.baseRoomOriginalScale);
              room.enableInteraction();
            }
          }
        }

        onDestroy() {
          if (BaseRoomManager.instance === this) BaseRoomManager.instance = null;
        }
        /** Unity: PlayIntroAnimation — hiện chỉ gọi callback. */


        playIntroAnimation(onComplete) {
          onComplete == null ? void 0 : onComplete();
        }

      }, _class3.instance = null, _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "BaseRoom", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "baseRoomStartPos", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "baseRoomEndPos", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "startScaleMultiplier", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.3;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=f29fecaef8340ea80f7fd0bcb85fe57c3c782a75.js.map