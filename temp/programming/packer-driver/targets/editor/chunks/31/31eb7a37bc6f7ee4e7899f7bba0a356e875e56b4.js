System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Camera, Color, Component, Enum, misc, Node, Sprite, tween, v3, view, World, PointerController, SoundType, ipm, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _class4, _class5, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _crd, ccclass, property, BindUIType, BindingUI, ui, UI;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfWorld(extras) {
    _reporterNs.report("World", "./World", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPointerController(extras) {
    _reporterNs.report("PointerController", "./PointerController", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSoundType(extras) {
    _reporterNs.report("SoundType", "./SoundManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfipm(extras) {
    _reporterNs.report("ipm", "./InputManager", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Camera = _cc.Camera;
      Color = _cc.Color;
      Component = _cc.Component;
      Enum = _cc.Enum;
      misc = _cc.misc;
      Node = _cc.Node;
      Sprite = _cc.Sprite;
      tween = _cc.tween;
      v3 = _cc.v3;
      view = _cc.view;
    }, function (_unresolved_2) {
      World = _unresolved_2.World;
    }, function (_unresolved_3) {
      PointerController = _unresolved_3.PointerController;
    }, function (_unresolved_4) {
      SoundType = _unresolved_4.SoundType;
    }, function (_unresolved_5) {
      ipm = _unresolved_5.ipm;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "5e407VzMSRF0pBQPETQzwRw", "UI", undefined);

      __checkObsolete__(['_decorator', 'Animation', 'Camera', 'Color', 'Component', 'Director', 'Enum', 'EventTouch', 'Label', 'misc', 'Node', 'ParticleSystem2D', 'PhysicsSystem', 'size', 'Size', 'Sprite', 'toDegree', 'Tween', 'tween', 'UITransform', 'v2', 'v3', 'Vec2', 'Vec3', 'view', 'Widget']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("BindUIType", BindUIType = /*#__PURE__*/function (BindUIType) {
        BindUIType[BindUIType["Left"] = 0] = "Left";
        BindUIType[BindUIType["Right"] = 1] = "Right";
        BindUIType[BindUIType["Top"] = 2] = "Top";
        BindUIType[BindUIType["Bottom"] = 3] = "Bottom";
        return BindUIType;
      }({}));

      _export("BindingUI", BindingUI = (_dec = ccclass("BindingUI"), _dec2 = property([Node]), _dec3 = property({
        type: Enum(BindUIType)
      }), _dec(_class = (_class2 = class BindingUI {
        constructor() {
          _initializerDefineProperty(this, "binds", _descriptor, this);

          _initializerDefineProperty(this, "type", _descriptor2, this);
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "binds", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "type", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return BindUIType.Left;
        }
      })), _class2)) || _class));

      _export("ui", ui = null);

      _export("UI", UI = (_dec4 = ccclass('UI'), _dec5 = property(Camera), _dec6 = property(Camera), _dec7 = property(Node), _dec8 = property(Node), _dec9 = property(Node), _dec10 = property(BindingUI), _dec11 = property(BindingUI), _dec12 = property(BindingUI), _dec13 = property(BindingUI), _dec14 = property([BindingUI]), _dec15 = property([Node]), _dec16 = property([Node]), _dec17 = property([Node]), _dec18 = property([Node]), _dec19 = property([Node]), _dec20 = property([Node]), _dec21 = property([Node]), _dec22 = property([Node]), _dec4(_class4 = (_class5 = class UI extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "uiCam", _descriptor3, this);

          _initializerDefineProperty(this, "pCam", _descriptor4, this);

          _initializerDefineProperty(this, "hand", _descriptor5, this);

          _initializerDefineProperty(this, "endcard", _descriptor6, this);

          _initializerDefineProperty(this, "winCard", _descriptor7, this);

          this.win = false;
          this.resizeFuncs = [];
          this.onStoreFuncs = [];
          this.first = true;

          _initializerDefineProperty(this, "topNode", _descriptor8, this);

          _initializerDefineProperty(this, "bottomNode", _descriptor9, this);

          _initializerDefineProperty(this, "leftNode", _descriptor10, this);

          _initializerDefineProperty(this, "rightNode", _descriptor11, this);

          _initializerDefineProperty(this, "bindings", _descriptor12, this);

          this.width = 0;
          this.height = 0;
          this.scale = 0;

          _initializerDefineProperty(this, "offButtons", _descriptor13, this);

          _initializerDefineProperty(this, "offEnds", _descriptor14, this);

          _initializerDefineProperty(this, "fisrtOn", _descriptor15, this);

          _initializerDefineProperty(this, "firstOff", _descriptor16, this);

          _initializerDefineProperty(this, "adaptUIs", _descriptor17, this);

          _initializerDefineProperty(this, "gameplays", _descriptor18, this);

          _initializerDefineProperty(this, "portraitNodes", _descriptor19, this);

          _initializerDefineProperty(this, "landscapeNodes", _descriptor20, this);

          this.firstScale = false;
          this.moveDir = 1;
          // @property(Node)
          this.startHand = null;
          // @property(Node)
          this.endHand = null;
          // @property(Node)
          this.current = null;
          this.cTween = null;
          this.hTween = null;
          this.isFirtMove = 0;
          this.delayTime = 0;
        }

        onLoad() {
          _export("ui", ui = this);

          try {
            if (window.redirectStore.toString() == "function redirectStore(){window.open(clickTag)}") {
              this.offButtons.forEach(node => node.active = false);
            }
          } catch (error) {}
        }

        bindingToStore() {
          (_crd && PointerController === void 0 ? (_reportPossibleCrUseOfPointerController({
            error: Error()
          }), PointerController) : PointerController).ins.unBindingEvent();
          (_crd && ipm === void 0 ? (_reportPossibleCrUseOfipm({
            error: Error()
          }), ipm) : ipm).offBinding();
          (_crd && PointerController === void 0 ? (_reportPossibleCrUseOfPointerController({
            error: Error()
          }), PointerController) : PointerController).ins.onStore();
        }

        openStore(...args) {
          console.log('openStore');
          (_crd && World === void 0 ? (_reportPossibleCrUseOfWorld({
            error: Error()
          }), World) : World).ins.soundmanager.stopAll();
          (_crd && World === void 0 ? (_reportPossibleCrUseOfWorld({
            error: Error()
          }), World) : World).ins.openStore.redirectToStore();
        }

        firstMove() {
          if (this.first) {
            this.first = false;
            this.fisrtOn.forEach(node => node.active = true);
            this.firstOff.forEach(node => node.active = false);
          }
        }

        onLose() {
          if (this.endcard.active || this.winCard.active) return;
          this.offEnds.forEach(button => button.active = false);
          this.offHand();
          this.endcard.active = true;
          this.bindingToStore();
          (_crd && World === void 0 ? (_reportPossibleCrUseOfWorld({
            error: Error()
          }), World) : World).ins.soundmanager.playSound((_crd && SoundType === void 0 ? (_reportPossibleCrUseOfSoundType({
            error: Error()
          }), SoundType) : SoundType).Fail);
        }

        onWin() {
          if (this.endcard.active || this.winCard.active) return;
          this.offEnds.forEach(button => button.active = false);
          this.offHand();
          this.winCard.active = true;
          this.bindingToStore();
          (_crd && World === void 0 ? (_reportPossibleCrUseOfWorld({
            error: Error()
          }), World) : World).ins.soundmanager.playSound((_crd && SoundType === void 0 ? (_reportPossibleCrUseOfSoundType({
            error: Error()
          }), SoundType) : SoundType).Win);
        }

        offHand() {
          this.hand.active = false;
        }

        getEdge(type) {
          switch (type) {
            case BindUIType.Top:
              return this.topNode.binds[0].getWorldPosition().y;

            case BindUIType.Bottom:
              return this.bottomNode.binds[0].getWorldPosition().y;

            case BindUIType.Left:
              return this.leftNode.binds[0].getWorldPosition().x;

            case BindUIType.Right:
              return this.rightNode.binds[0].getWorldPosition().x;
          }
        }

        bind() {
          let pos = this.uiCam.node.position.clone();
          {
            this.topNode.binds[0].position = this.topNode.binds[0].position.clone();
            this.topNode.binds[0].position = v3(this.topNode.binds[0].position.x + pos.x, this.height + pos.y, this.topNode.binds[0].position.z);
            this.bottomNode.binds[0].position = this.bottomNode.binds[0].position.clone();
            this.bottomNode.binds[0].position = v3(this.bottomNode.binds[0].position.x + pos.x, -this.height + pos.y, this.bottomNode.binds[0].position.z);
            this.leftNode.binds[0].position = this.leftNode.binds[0].position.clone();
            this.leftNode.binds[0].position = v3(-this.width + pos.x, this.leftNode.binds[0].position.y + pos.y, this.leftNode.binds[0].position.z);
            this.rightNode.binds[0].position = this.rightNode.binds[0].position.clone();
            this.rightNode.binds[0].position = v3(this.width + pos.x, this.rightNode.binds[0].position.y + pos.y, this.rightNode.binds[0].position.z);
          }
          this.bindings.forEach(bind => {
            bind.binds.forEach(item => {
              item.position = item.position.clone();
              let pos = item.getWorldPosition();

              switch (bind.type) {
                case BindUIType.Top:
                  pos.y = this.getEdge(bind.type);
                  break;

                case BindUIType.Bottom:
                  pos.y = this.getEdge(bind.type);
                  break;

                case BindUIType.Left:
                  pos.x = this.getEdge(bind.type);
                  break;

                case BindUIType.Right:
                  pos.x = this.getEdge(bind.type);
                  break;
              }

              let lpos = item.parent.inverseTransformPoint(v3(), pos);
              item.position = lpos;
            });
          });
        }

        keepTap() {
          if (this.current && this.hand.active) {
            this.handTap(this.current);
          }
        }

        resize(scale = this.scale) {
          this.scale = scale;
          let time = 0;
          this.height = this.uiCam.orthoHeight + 0;
          this.width = 1080 / 2350 * this.height * scale;
          console.log(this.width / this.height, this.width, this.height);
          setTimeout(() => {
            this.keepTap();
          }, time);

          if (this.width / this.height < 1.5) {
            scale = misc.clampf(scale, 0, 1.1);
            this.portraitNodes.forEach(item => {
              item.active = true;
            });
            this.landscapeNodes.forEach(item => {
              item.active = false;
            });
            this.adaptUIs.forEach(item => {
              item.scale = v3(1, 1, 1);
            });
            this.gameplays.forEach(item => {
              item.scale = v3(1, 1, 1).multiplyScalar(scale);
            });
          } else {
            this.portraitNodes.forEach(item => {
              item.active = false;
            });
            this.landscapeNodes.forEach(item => {
              item.active = true;
            });
            this.adaptUIs.forEach(item => {
              item.scale = v3(1, 1, 1).multiplyScalar(2);
            });
            this.gameplays.forEach(item => {
              item.scale = v3(1, 1, 1).multiplyScalar(1.1);
            });
          }

          this.bind();
        }

        handTap(node) {
          if (!node) return;
          this.current = node;
          this.hand.worldPosition = node.getWorldPosition();
          this.hand.active = true;
        }

        moveHand() {
          if (!this.startHand || !this.endHand) return;
          let dt = this.delayTime;

          if (this.isFirtMove > 0) {
            this.isFirtMove--;
            dt = 0;
          }

          this.hTween = tween({
            t: 0
          }).delay(dt).call(() => {
            this.handTap(this.startHand);
            const hand = this.hand;
            let child = this.hand.children[0].getComponentInChildren(Sprite);
            child.color = new Color(255, 255, 255, 255); // child.node.scale = v3(1, 1, 1).multiplyScalar(2);

            let pos = this.endHand.getWorldPosition();
            let delta = this.hand.worldPosition.clone().subtract(pos);

            if (this.moveDir == 0) {
              let p = v3(pos.x, this.hand.worldPosition.y, this.hand.worldPosition.z);
              let time = delta.length() * 0.5;
              this.hTween = tween(this.hand).delay(0.2).to(time, {
                worldPosition: p
              }, {
                easing: 'smooth'
              }).call(() => {
                p = v3(this.hand.worldPosition.x, this.hand.worldPosition.y, pos.z);
                let time = delta.length() * 0.5;
                this.hTween = tween(this.hand).to(time, {
                  worldPosition: p
                }, {
                  easing: 'smooth'
                }).call(() => {
                  this.cTween = tween(child).delay(0.2).to(0.2, {
                    color: new Color(255, 255, 255, 0)
                  }, {
                    easing: 'smooth'
                  }).call(() => {
                    this.moveHand();
                  }).start();
                }).start();
              }).start();
            } else if (this.moveDir == 1) {
              let p = v3(pos.x, pos.y, pos.z);
              let time = delta.length() / 1000;
              this.hTween = tween(this.hand).delay(0.2).to(time, {
                worldPosition: p
              }, {
                easing: 'smooth',

                onUpdate(target, ratio) {}

              }).call(() => {
                this.cTween = tween(child).delay(0.2).to(0.2, {}, {
                  easing: 'smooth',

                  onUpdate(target, ratio) {
                    child.color = new Color(255, 255, 255, 255 * (1 - ratio));
                  }

                }).call(() => {
                  this.moveHand();
                }).start();
              }).start();
            }
          }).start();
        }

        start() {}

        update(dt) {
          let size = view.getVisibleSize();
          let scale = size.width / 1080;

          if (scale != this.scale) {
            this.resize(scale);
          }
        }

      }, (_descriptor3 = _applyDecoratedDescriptor(_class5.prototype, "uiCam", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class5.prototype, "pCam", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class5.prototype, "hand", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class5.prototype, "endcard", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class5.prototype, "winCard", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class5.prototype, "topNode", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class5.prototype, "bottomNode", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class5.prototype, "leftNode", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class5.prototype, "rightNode", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class5.prototype, "bindings", [_dec14], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class5.prototype, "offButtons", [_dec15], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class5.prototype, "offEnds", [_dec16], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class5.prototype, "fisrtOn", [_dec17], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor16 = _applyDecoratedDescriptor(_class5.prototype, "firstOff", [_dec18], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor17 = _applyDecoratedDescriptor(_class5.prototype, "adaptUIs", [_dec19], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor18 = _applyDecoratedDescriptor(_class5.prototype, "gameplays", [_dec20], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor19 = _applyDecoratedDescriptor(_class5.prototype, "portraitNodes", [_dec21], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor20 = _applyDecoratedDescriptor(_class5.prototype, "landscapeNodes", [_dec22], {
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
//# sourceMappingURL=31eb7a37bc6f7ee4e7899f7bba0a356e875e56b4.js.map