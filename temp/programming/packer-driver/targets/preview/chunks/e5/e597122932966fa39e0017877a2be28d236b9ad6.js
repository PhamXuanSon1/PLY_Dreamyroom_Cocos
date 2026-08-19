System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Animation, color, instantiate, Layers, Node, sp, Sprite, tween, UIRenderer, UITransform, v3, PoolMember, room, Ulis, ui, ipm, NodeOrder, _dec, _class, _class2, _descriptor, _descriptor2, _crd, ccclass, property, executeInEditMode, Thing;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfPoolMember(extras) {
    _reporterNs.report("PoolMember", "../Pool/PoolMember", _context.meta, extras);
  }

  function _reportPossibleCrUseOfroom(extras) {
    _reporterNs.report("room", "./Room", _context.meta, extras);
  }

  function _reportPossibleCrUseOfUlis(extras) {
    _reporterNs.report("Ulis", "../Misc/Ulis", _context.meta, extras);
  }

  function _reportPossibleCrUseOfui(extras) {
    _reporterNs.report("ui", "../Manager/UI", _context.meta, extras);
  }

  function _reportPossibleCrUseOfipm(extras) {
    _reporterNs.report("ipm", "../Manager/InputManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSlot(extras) {
    _reporterNs.report("Slot", "./Slot", _context.meta, extras);
  }

  function _reportPossibleCrUseOfNodeOrder(extras) {
    _reporterNs.report("NodeOrder", "./MatchAsset/NodeOrder", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Animation = _cc.Animation;
      color = _cc.color;
      instantiate = _cc.instantiate;
      Layers = _cc.Layers;
      Node = _cc.Node;
      sp = _cc.sp;
      Sprite = _cc.Sprite;
      tween = _cc.tween;
      UIRenderer = _cc.UIRenderer;
      UITransform = _cc.UITransform;
      v3 = _cc.v3;
    }, function (_unresolved_2) {
      PoolMember = _unresolved_2.PoolMember;
    }, function (_unresolved_3) {
      room = _unresolved_3.room;
    }, function (_unresolved_4) {
      Ulis = _unresolved_4.default;
    }, function (_unresolved_5) {
      ui = _unresolved_5.ui;
    }, function (_unresolved_6) {
      ipm = _unresolved_6.ipm;
    }, function (_unresolved_7) {
      NodeOrder = _unresolved_7.NodeOrder;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "01972BPCNFGULg90ly3xXi0", "Thing", undefined);

      __checkObsolete__(['_decorator', 'Animation', 'color', 'Component', 'EventTouch', 'instantiate', 'Layers', 'Material', 'Node', 'Size', 'sp', 'Sprite', 'SpriteFrame', 'Tween', 'tween', 'UIRenderer', 'UITransform', 'v3', 'Vec3']);

      ({
        ccclass,
        property,
        executeInEditMode
      } = _decorator);

      _export("Thing", Thing = (_dec = ccclass('Thing'), _dec(_class = (_class2 = class Thing extends (_crd && PoolMember === void 0 ? (_reportPossibleCrUseOfPoolMember({
        error: Error()
      }), PoolMember) : PoolMember) {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "firstIndex", _descriptor, this);

          this._inited = false;

          _initializerDefineProperty(this, "thingType", _descriptor2, this);

          this.sprite = null;
          this.frame = null;
          this.bg = null;
          this.material = null;
          this.hightlighted = false;
          this.sizeTween = null;
          this.comps = [];
          this.sizes = [];
          this.box = null;
          this.slot = null;
        }

        make() {
          var _ins$getComponent, _this$node$children$, _this$node$children$2, _this$node$getCompone2, _ins2$getComponent2, _this$node$children$3, _this$node$children$4;

          try {
            if (this.node.children[0].getComponent(Sprite)) {
              this.node.children[0].name = "SpBg" + this.node.name;
              this.node.children[1].name = "SpRender" + this.node.name;
              this.node.children[0].active = true;
              this.node.children[0].getComponent(UIRenderer).color = color(255, 255, 255, 255);
              this.node.children[1].active = true;
            } else {
              this.node.children[0].name = "SpineBg" + this.node.name;
              this.node.children[0].active = true;
              this.node.children[0].getComponent(UIRenderer).color = color(255, 255, 255, 255);

              if (!this.node.children[1]) {
                var _ins = instantiate(this.node.children[0]);

                _ins.parent = this.node;
              }

              this.node.children[1].name = "SpineRender" + this.node.name;
              this.node.children[1].active = true;

              if (!this.node.children[2]) {
                var _ins2$getComponent, _this$node$getCompone;

                var _ins2 = instantiate(this.node);

                _ins2.parent = this.node;

                _ins2.destroyAllChildren();

                _ins2.position = v3(0, 0, 0);
                (_ins2$getComponent = _ins2.getComponent(Thing)) == null ? void 0 : _ins2$getComponent.destroy();
                (_this$node$getCompone = this.node.getComponent(Sprite)) == null ? void 0 : _this$node$getCompone.destroy();
              }

              this.node.children[2].active = false;
            }
          } catch (error) {}

          if (this.node.children.length > 0) {
            this.node.children.forEach(c => {
              var _c$getComponent, _c$getComponent2, _c$getComponent3;

              (_c$getComponent = c.getComponent(Thing)) == null ? void 0 : _c$getComponent.destroy();
              (_c$getComponent2 = c.getComponent(Animation)) == null ? void 0 : _c$getComponent2.destroy();
              (_c$getComponent3 = c.getComponent(_crd && NodeOrder === void 0 ? (_reportPossibleCrUseOfNodeOrder({
                error: Error()
              }), NodeOrder) : NodeOrder)) == null ? void 0 : _c$getComponent3.destroy();
            });
            return;
          }

          var ins = instantiate(this.node);
          ins.parent = this.node;
          ins.position = v3(0, 0, 0);
          (_ins$getComponent = ins.getComponent(Thing)) == null ? void 0 : _ins$getComponent.destroy();
          (_this$node$children$ = this.node.children[0].getComponent(Animation)) == null ? void 0 : _this$node$children$.destroy();
          (_this$node$children$2 = this.node.children[0].getComponent(_crd && NodeOrder === void 0 ? (_reportPossibleCrUseOfNodeOrder({
            error: Error()
          }), NodeOrder) : NodeOrder)) == null ? void 0 : _this$node$children$2.destroy();
          (_this$node$getCompone2 = this.node.getComponent(Sprite)) == null ? void 0 : _this$node$getCompone2.destroy();
          var ins2 = instantiate(this.node.children[0]);
          ins2.parent = this.node;
          ins2.position = v3(0, 0, 0);
          (_ins2$getComponent2 = ins2.getComponent(Thing)) == null ? void 0 : _ins2$getComponent2.destroy();
          (_this$node$children$3 = this.node.children[1].getComponent(Animation)) == null ? void 0 : _this$node$children$3.destroy();
          (_this$node$children$4 = this.node.children[1].getComponent(_crd && NodeOrder === void 0 ? (_reportPossibleCrUseOfNodeOrder({
            error: Error()
          }), NodeOrder) : NodeOrder)) == null ? void 0 : _this$node$children$4.destroy();
          this.node.children[0].name = "SpBg" + this.node.name;
          this.node.children[1].name = "SpRender" + this.node.name;
          var uit = this.node.children[0].getComponent(UITransform);
          uit.width *= 1.1;
          uit.height *= 1.1;
        }

        set inited(value) {
          this._inited = false;
          this.make();
        }

        get inited() {
          return this._inited;
        }

        init() {
          var _this$getComponentInC;

          this.comps = this.getComponentsInChildren(UITransform).filter(c => c.node !== this.node);
          this.sizes = this.comps.map(c => c.node.scale.clone());
          this.bg = this.node.getComponentsInChildren(UIRenderer)[0];
          this.bg.color = color(255, 255, 255, 0);
          this.sprite = this.node.getComponentsInChildren(UIRenderer)[1];
          this.sprite.color = color(255, 255, 255, 255);
          this.bg.node.active = true;
          this.sprite.node.active = true;
          this.onTouch();
          this.material = this.sprite.material;
          this.frame = (_this$getComponentInC = this.getComponentInChildren(Sprite)) == null ? void 0 : _this$getComponentInC.spriteFrame;
        }

        flicker() {
          this.onHightlight();
          this.scaleSize();
        }

        onHightlight() {
          var _this$sizeTween;

          this.bg.color = color(255, 255, 255, 255);
          (_this$sizeTween = this.sizeTween) == null ? void 0 : _this$sizeTween.stop(); // this.material.setProperty("useOutline", 1);
          // this.material.setProperty("alpha", 1);
          // this.material.setProperty("useOutline", 1, 1);
          // this.material.setProperty("alpha", 1, 1);
          // if(this.spine) {
          //     this.spine.customMaterial = this.material;
          // } else {
          //     this.sprite.material = this.material;
          // }

          this.hightlighted = true;
        }

        offAnim() {
          this.getComponentsInChildren(sp.Skeleton).forEach(s => {
            // s.setAnimation(0, "Idle", false) 
            s.timeScale = 0;
          });
        }

        offHightlight() {
          var _this$sizeTween2;

          // this.bg.color = color(255, 255, 255, 0);
          (_this$sizeTween2 = this.sizeTween) == null ? void 0 : _this$sizeTween2.stop(); // this.material.setProperty("useOutline", 0);
          // this.material.setProperty("useOutline", 0, 1);
          // if(this.spine) {
          //     this.spine.customMaterial = this.material;
          // } else {
          //     this.sprite.material = this.material;
          // }

          this.comps.forEach((c, i) => {
            c.node.scale = this.sizes[i];
          });
          this.hightlighted = false;
        }

        offFlicker() {
          var _this$sizeTween3;

          this.bg.color = color(255, 255, 255, 0);
          (_this$sizeTween3 = this.sizeTween) == null ? void 0 : _this$sizeTween3.stop();
          this.comps.forEach((c, i) => {
            c.node.scale = this.sizes[i];
          });
          this.hightlighted = false;
        }

        scaleSize(loop) {
          var _this$sizeTween4;

          if (loop === void 0) {
            loop = true;
          }

          var t = this;
          var mul = loop ? 1 : 0.5;
          (_this$sizeTween4 = this.sizeTween) == null ? void 0 : _this$sizeTween4.stop();
          this.sizeTween = tween({}).to(0.5 * mul, {}, {
            onUpdate(target, ratio) {
              t.comps.forEach((c, i) => {
                var s = t.sizes[i].clone();
                s.x *= 1 + 0.1 * ratio;
                s.y *= 1 + 0.1 * ratio;
                c.node.scale = s;
              });
            }

          }).to(0.5 * mul, {}, {
            onUpdate(target, ratio) {
              t.comps.forEach((c, i) => {
                var s = t.sizes[i].clone();
                s.x *= 1.1 - 0.1 * ratio;
                s.y *= 1.1 - 0.1 * ratio;
                c.node.scale = s;
              });
            }

          }).call(() => {
            if (loop) this.scaleSize();
          }).start();
        }

        offTouch() {
          this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
          this.node.off(Node.EventType.TOUCH_MOVE, this.none, this);
          this.node.off(Node.EventType.TOUCH_END, this.none, this);
          this.node.off(Node.EventType.TOUCH_CANCEL, this.none, this);
        }

        onTouch() {
          this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
          this.node.on(Node.EventType.TOUCH_MOVE, this.none, this);
          this.node.on(Node.EventType.TOUCH_END, this.none, this);
          this.node.on(Node.EventType.TOUCH_CANCEL, this.none, this);
        }

        none() {}

        off() {
          this.offTouch();
          this.sprite.enabled = true;
        }

        onDespawn() {
          this.node.destroy();
        }

        onTouchStart(event) {
          if (this.firstIndex == -1) {
            (_crd && ipm === void 0 ? (_reportPossibleCrUseOfipm({
              error: Error()
            }), ipm) : ipm).fisrtTap();
          }

          var pos = event.getLocation();
          var wpos = (_crd && ui === void 0 ? (_reportPossibleCrUseOfui({
            error: Error()
          }), ui) : ui).uiCam.screenToWorld(v3(pos.x, pos.y, 0));
          (_crd && room === void 0 ? (_reportPossibleCrUseOfroom({
            error: Error()
          }), room) : room).checkBox(this, wpos); // let rs = ui.checkNodeInsideScreen(this.node, 100);
          // console.log(rs);
        }

        setUpLayer() {
          var l = Layers.nameToLayer("Particle");
          (_crd && Ulis === void 0 ? (_reportPossibleCrUseOfUlis({
            error: Error()
          }), Ulis) : Ulis).allNode(this.node, node => node.layer = Math.pow(2, l));
        }

        setDownLayer() {
          var l = Layers.nameToLayer("UI_2D");
          (_crd && Ulis === void 0 ? (_reportPossibleCrUseOfUlis({
            error: Error()
          }), Ulis) : Ulis).allNode(this.node, node => node.layer = Math.pow(2, l));
        }

        update(deltaTime) {}

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "firstIndex", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return -1;
        }
      }), _applyDecoratedDescriptor(_class2.prototype, "inited", [property], Object.getOwnPropertyDescriptor(_class2.prototype, "inited"), _class2.prototype), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "thingType", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return -1;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=e597122932966fa39e0017877a2be28d236b9ad6.js.map