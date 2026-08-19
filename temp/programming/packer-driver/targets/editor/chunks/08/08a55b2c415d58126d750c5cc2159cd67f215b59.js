System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Animation, Label, Layers, Size, sp, Sprite, tween, UITransform, v2, v3, Vec3, PoolMember, PoolType, Thing, Ulis, room, ui, sm, SoundType, World, _dec, _dec2, _class, _class2, _descriptor, _descriptor2, _crd, ccclass, property, Slot;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfPoolMember(extras) {
    _reporterNs.report("PoolMember", "../Pool/PoolMember", _context.meta, extras);
  }

  function _reportPossibleCrUseOfPoolType(extras) {
    _reporterNs.report("PoolType", "../Pool/PoolMember", _context.meta, extras);
  }

  function _reportPossibleCrUseOfThing(extras) {
    _reporterNs.report("Thing", "./Thing", _context.meta, extras);
  }

  function _reportPossibleCrUseOfUlis(extras) {
    _reporterNs.report("Ulis", "../Misc/Ulis", _context.meta, extras);
  }

  function _reportPossibleCrUseOfroom(extras) {
    _reporterNs.report("room", "./Room", _context.meta, extras);
  }

  function _reportPossibleCrUseOfui(extras) {
    _reporterNs.report("ui", "../Manager/UI", _context.meta, extras);
  }

  function _reportPossibleCrUseOfsm(extras) {
    _reporterNs.report("sm", "../Manager/SoundManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSoundType(extras) {
    _reporterNs.report("SoundType", "../Manager/SoundManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfWorld(extras) {
    _reporterNs.report("World", "../Manager/World", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCloud(extras) {
    _reporterNs.report("Cloud", "../Misc/Cloud", _context.meta, extras);
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
      Label = _cc.Label;
      Layers = _cc.Layers;
      Size = _cc.Size;
      sp = _cc.sp;
      Sprite = _cc.Sprite;
      tween = _cc.tween;
      UITransform = _cc.UITransform;
      v2 = _cc.v2;
      v3 = _cc.v3;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      PoolMember = _unresolved_2.PoolMember;
      PoolType = _unresolved_2.PoolType;
    }, function (_unresolved_3) {
      Thing = _unresolved_3.Thing;
    }, function (_unresolved_4) {
      Ulis = _unresolved_4.default;
    }, function (_unresolved_5) {
      room = _unresolved_5.room;
    }, function (_unresolved_6) {
      ui = _unresolved_6.ui;
    }, function (_unresolved_7) {
      sm = _unresolved_7.sm;
      SoundType = _unresolved_7.SoundType;
    }, function (_unresolved_8) {
      World = _unresolved_8.World;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "3e24b0cOw5Nx6ywWl5qnyNh", "Slot", undefined);

      __checkObsolete__(['_decorator', 'Animation', 'Component', 'Label', 'Layers', 'Material', 'math', 'Node', 'Size', 'sp', 'Sprite', 'Tween', 'tween', 'UITransform', 'v2', 'v3', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("Slot", Slot = (_dec = ccclass('Slot'), _dec2 = property(_crd && Thing === void 0 ? (_reportPossibleCrUseOfThing({
        error: Error()
      }), Thing) : Thing), _dec(_class = (_class2 = class Slot extends (_crd && PoolMember === void 0 ? (_reportPossibleCrUseOfPoolMember({
        error: Error()
      }), PoolMember) : PoolMember) {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "thingType", _descriptor, this);

          this.thingys = [];
          this.outlines = [];
          this.frame = null;

          _initializerDefineProperty(this, "thing", _descriptor2, this);

          this.label = null;
          this.moveTween = null;
          this.amount = 0;
          this.maxAmount = 0;
          this.scaleTween = null;
          this.moving = false;
          this.materials = [];
          this.anim = null;
          this.hightlighted = false;
          this.things = [];
          this.ticks = [];
          this.added = 0;
          this.index = 0;
          this.movingNodes = [];
        }

        start() {}

        init() {
          let sps = this.node.getComponentsInChildren(Sprite);
          this.frame = sps[0];
          this.outlines = [sps[1], sps[2], sps[3]];
          this.thingys = [sps[4], sps[5], sps[6]]; // this.material = this.frame.material;
          // this.anim = this.node.getComponentInChildren(Animation);
        }

        initSlot() {
          let sps = this.node.getComponentsInChildren(Sprite);
          this.frame = sps[0];
          this.outlines = [sps[1], sps[2], sps[3]];
          this.thingys = [sps[4], sps[5], sps[6]];
          this.materials = this.thingys.map(thingy => thingy.material); // this.material = this.frame.material;

          this.anim = this.node.getComponent(Animation);
          this.ticks = [sps[7].node, sps[8].node, sps[9].node];
          this.ticks.forEach(tick => {
            tick.active = false;
          });
        }

        swapIndex(slot) {
          slot.setBoxThing(this.thing, true);
          this.onDespawnThing();
        }

        moveToPos(pos, pos2) {
          var _this$moveTween;

          const lpos = this.node.position.clone();
          const t = this;
          let time = pos.clone().subtract(lpos).length() / 3000;
          (_this$moveTween = this.moveTween) == null ? void 0 : _this$moveTween.stop();
          this.moveTween = tween({}).to(time, {}, {
            onUpdate(target, ratio) {
              if ((_crd && ui === void 0 ? (_reportPossibleCrUseOfui({
                error: Error()
              }), ui) : ui).width < (_crd && ui === void 0 ? (_reportPossibleCrUseOfui({
                error: Error()
              }), ui) : ui).height) {
                t.node.position = Vec3.lerp(v3(), lpos, pos, ratio);
              } else {
                t.node.position = Vec3.lerp(v3(), lpos, pos2, ratio);
              }
            }

          }).start();
        }

        setLabel(amount) {
          this.label = this.node.getComponentInChildren(Label);
          this.amount = amount;
          this.maxAmount = amount; // this.label.node.active = false;

          this.label.string = "x" + amount;
        }

        decreaseLabel() {
          this.amount -= 1;
          this.label.string = "x" + this.amount;
        }

        setThingFrame(thing) {
          this.thingType = thing.thingType;
          this.thing = thing;
          let size = thing.getComponent(UITransform).contentSize.clone();
          let thingScale = thing.node.worldScale.clone();
          let t = v2(size.width * thingScale.x, size.height * thingScale.y);
          let frameSize = this.thingys[0].getComponent(UITransform).contentSize.clone();
          frameSize = new Size(45, 45);
          let thingyScale = this.thingys[0].node.worldScale.clone();
          let ty = v2(frameSize.width * thingyScale.x, frameSize.height * thingyScale.y);
          let mul = 0.9;
          let ratio2 = v2(t.x / ty.x, t.y / ty.y);
          let ratio = 1 / Math.max(ratio2.x, ratio2.y) * mul;
          let thingySize = v2(t.x / thingyScale.x * ratio, t.y / thingyScale.y * ratio);
          this.thingys.forEach((thingy, i) => {
            thingy.node.getComponent(UITransform).contentSize.set(thingySize.x, thingySize.y);
            thingy.spriteFrame = thing.frame; // thingy.node.position = v3(0, 8, 0);

            this.outlines[i].node.getComponent(UITransform).contentSize.set(thingySize.x * 1.1, thingySize.y * 1.1);
            this.outlines[i].spriteFrame = thing.frame;
          });
        }

        setSlotThing(thing, linear = false, callback = null) {
          if ((_crd && room === void 0 ? (_reportPossibleCrUseOfroom({
            error: Error()
          }), room) : room).lose) return;
          this.moving = true;

          if (!thing) {
            console.log("no thing");
          }

          let sk = thing.node.parent.parent.getComponent(sp.Skeleton);
          console.log(thing.node.parent.parent.name);

          if (sk) {
            sk.setAnimation(0, "3-takeitem-done", true);
          }

          this.movingNodes.push(thing.node); // this.offHightlight();

          let star = (_crd && World === void 0 ? (_reportPossibleCrUseOfWorld({
            error: Error()
          }), World) : World).ins.poolManager.spawnType((_crd && PoolType === void 0 ? (_reportPossibleCrUseOfPoolType({
            error: Error()
          }), PoolType) : PoolType).StarVFX);
          star.node.parent = (_crd && room === void 0 ? (_reportPossibleCrUseOfroom({
            error: Error()
          }), room) : room).vfxNode;
          star.node.position = v3(0, 0, 0);
          star.init();
          star.target = thing.node;
          thing.box = this;
          (_crd && Ulis === void 0 ? (_reportPossibleCrUseOfUlis({
            error: Error()
          }), Ulis) : Ulis).addToParent(thing.node, this.node);
          thing.setUpLayer();
          this.thingType = thing.thingType;
          this.thing = thing;
          let size = thing.getComponent(UITransform).contentSize.clone();
          let thingScale = thing.node.worldScale.clone();
          let t = v2(size.width * thingScale.x, size.height * thingScale.y);
          let frameSize = this.thingys[0].getComponent(UITransform).contentSize.clone(); // frameSize = new Size(40, 50);

          let thingyScale = this.thingys[0].node.worldScale.clone();
          let ty = v2(frameSize.width * thingyScale.x, frameSize.height * thingyScale.y);
          let mul = 1;
          let ratio2 = v2(t.x / ty.x, t.y / ty.y);
          let ratio = 1 / Math.max(ratio2.x, ratio2.y) * mul;
          let scale = thing.node.scale.clone().multiplyScalar(ratio);
          let up = 0;
          let dTime = up / 500;
          dTime = (_crd && ui === void 0 ? (_reportPossibleCrUseOfui({
            error: Error()
          }), ui) : ui).width < (_crd && ui === void 0 ? (_reportPossibleCrUseOfui({
            error: Error()
          }), ui) : ui).height ? dTime : dTime * 0.35;
          let pos = this.node.worldPosition.clone();
          let s = thing.node.worldPosition.clone();
          const src = s.clone().add(v3(0, up, 0));
          let local = thing.node.parent.inverseTransformPoint(v3(), src);
          let dir = pos.clone().subtract(src);
          let time = dir.length() / 3000;
          time = (_crd && ui === void 0 ? (_reportPossibleCrUseOfui({
            error: Error()
          }), ui) : ui).width < (_crd && ui === void 0 ? (_reportPossibleCrUseOfui({
            error: Error()
          }), ui) : ui).height ? time : time * 0.35;
          let temp = v3();
          let des = v3();
          const slot = this.thingys[this.added].node; // const slot = (this.thingys[this.added] || this.thingys[0]).node;

          let tick = this.ticks[this.added];
          let before = this.added + 0;
          this.added += 1;
          let delay = 0.0;
          thing.onHightlight();

          if (linear) {
            let height = 100;
            time = Vec3.distance(s, slot.worldPosition) / 3000;
            time = (_crd && ui === void 0 ? (_reportPossibleCrUseOfui({
              error: Error()
            }), ui) : ui).width < (_crd && ui === void 0 ? (_reportPossibleCrUseOfui({
              error: Error()
            }), ui) : ui).height ? time : time * 0.35;
            tween(thing.node).call(() => {
              thing.offAnim();
            }).to(time, {
              scale: scale,
              eulerAngles: v3()
            }, {
              easing: 'smooth',

              onUpdate(target, ratio) {
                des = slot.worldPosition.clone();
                temp = (_crd && Ulis === void 0 ? (_reportPossibleCrUseOfUlis({
                  error: Error()
                }), Ulis) : Ulis).lerpParabola(s, des, ratio, height, 0.5);
                thing.node.worldPosition = temp;
              }

            }).call(() => {
              setTimeout(() => {
                star.target = null;
              }, 200);
              thing.node.worldPosition = slot.worldPosition.clone();
              thing.node.layer = Math.pow(2, Layers.nameToLayer("UI_2D"));
              this.moving = false; // room.checkLose();

              tick.active = true;
              thing.node.destroy();

              if (before == this.added - 1 && this.added == this.amount) {
                (_crd && room === void 0 ? (_reportPossibleCrUseOfroom({
                  error: Error()
                }), room) : room).onFull(this);
              }
            }).start();
          } else {
            if (thing.firstIndex >= 0) {
              this.moving = false;
              tick.active = true;
              thing.node.destroy();

              if (before == this.added - 1 && this.added == this.amount) {
                (_crd && room === void 0 ? (_reportPossibleCrUseOfroom({
                  error: Error()
                }), room) : room).onFull(this);
              }
            } else {
              let height = 300;
              let t = this;
              tween(thing.node).to(dTime, {
                position: local
              }, {
                easing: 'smooth'
              }).delay(delay).call(() => {
                thing.offAnim();
              }).to(time, {
                scale: scale,
                eulerAngles: v3()
              }, {
                easing: 'smooth',

                onUpdate(target, ratio) {
                  t.moving = true;
                  des = slot.worldPosition.clone();
                  temp = (_crd && Ulis === void 0 ? (_reportPossibleCrUseOfUlis({
                    error: Error()
                  }), Ulis) : Ulis).lerpParabola(src, des, ratio, height, 0.5);
                  thing.node.worldPosition = temp;
                }

              }).call(() => {
                (_crd && sm === void 0 ? (_reportPossibleCrUseOfsm({
                  error: Error()
                }), sm) : sm).playSound((_crd && SoundType === void 0 ? (_reportPossibleCrUseOfSoundType({
                  error: Error()
                }), SoundType) : SoundType).LandRight);
                setTimeout(() => {
                  star.target = null;
                }, 200); // thing.node.worldPosition = slot.worldPosition.clone();
                // thing.node.layer = Math.pow(2, Layers.nameToLayer("UI_2D"));

                this.moving = false; // room.checkLose();

                tick.active = true;
                callback && callback();
                thing.node.destroy(); // this.decreaseLabel();

                if (before == this.added - 1 && this.added == this.amount) {
                  (_crd && room === void 0 ? (_reportPossibleCrUseOfroom({
                    error: Error()
                  }), room) : room).onFull(this);
                }
              }).start();
            }
          }
        }

        setBoxThing(thing, linear = false) {
          if ((_crd && room === void 0 ? (_reportPossibleCrUseOfroom({
            error: Error()
          }), room) : room).lose) return;
          this.moving = true;

          if (thing.box) {
            thing.box.onDespawnThing();
          }

          let sk = thing.node.parent.parent.getComponent(sp.Skeleton);
          console.log(thing.node.parent.parent.name);

          if (sk) {
            sk.setAnimation(0, "3-takeitem-done", true);
          }

          thing.box = this;
          (_crd && Ulis === void 0 ? (_reportPossibleCrUseOfUlis({
            error: Error()
          }), Ulis) : Ulis).addToParent(thing.node, this.node);
          thing.setUpLayer();
          this.thingType = thing.thingType;
          this.thing = thing;
          let size = thing.getComponent(UITransform).contentSize.clone();
          let thingScale = thing.node.worldScale.clone();
          let t = v2(size.width * thingScale.x, size.height * thingScale.y);
          let frameSize = this.frame.getComponent(UITransform).contentSize.clone();
          let thingyScale = this.frame.node.worldScale.clone();
          let ty = v2(frameSize.width * thingyScale.x, frameSize.height * thingyScale.y);
          let mul = 0.9;
          let ratio2 = v2(t.x / ty.x, t.y / ty.y);
          let ratio = 1 / Math.max(ratio2.x, ratio2.y) * mul;
          let scale = thing.node.scale.clone().multiplyScalar(ratio);

          if (linear) {
            var _this$moveTween2;

            let pos = this.node.worldPosition.clone();
            const src = thing.node.worldPosition.clone();
            let dir = src.clone().subtract(pos.clone());
            let time = dir.length() / 3000;
            time = (_crd && ui === void 0 ? (_reportPossibleCrUseOfui({
              error: Error()
            }), ui) : ui).width < (_crd && ui === void 0 ? (_reportPossibleCrUseOfui({
              error: Error()
            }), ui) : ui).height ? time : time * 0.35;
            let temp = v3();
            let des = v3();
            const slot = this;
            let delay = 0.2;
            let height = 0;
            (_this$moveTween2 = this.moveTween) == null ? void 0 : _this$moveTween2.stop();
            this.moveTween = tween(thing.node).delay(delay).to(time, {
              scale: scale
            }, {
              easing: 'smooth',

              onUpdate(target, ratio) {
                des = slot.node.worldPosition.clone();
                temp = (_crd && Ulis === void 0 ? (_reportPossibleCrUseOfUlis({
                  error: Error()
                }), Ulis) : Ulis).lerpParabola(src, des, ratio, height, 0.5);
                thing.node.worldPosition = temp;
              }

            }).call(() => {
              thing.node.layer = Math.pow(2, Layers.nameToLayer("UI_2D"));
              this.moving = false;
              thing.node.worldPosition = slot.node.worldPosition.clone(); // room.checkTrippleBox(this);

              this.node.scale = v3(1, 1, 1);
              thing.node.position = v3(0, 0, 0);
              (_crd && room === void 0 ? (_reportPossibleCrUseOfroom({
                error: Error()
              }), room) : room).rearrangeBoxes((_crd && room === void 0 ? (_reportPossibleCrUseOfroom({
                error: Error()
              }), room) : room).boxes); // room.checkLose();
            }).start();
          } else {
            var _this$moveTween3;

            let up = 0;
            let dTime = up / 500;
            dTime = (_crd && ui === void 0 ? (_reportPossibleCrUseOfui({
              error: Error()
            }), ui) : ui).width < (_crd && ui === void 0 ? (_reportPossibleCrUseOfui({
              error: Error()
            }), ui) : ui).height ? dTime : dTime * 0.35;
            let pos = this.node.worldPosition.clone();
            let s = thing.node.worldPosition.clone();
            const src = s.clone().add(v3(0, up, 0));
            let local = thing.node.parent.inverseTransformPoint(v3(), src);
            let dir = pos.clone().subtract(src);
            let time = dir.length() / 3000;
            time = (_crd && ui === void 0 ? (_reportPossibleCrUseOfui({
              error: Error()
            }), ui) : ui).width < (_crd && ui === void 0 ? (_reportPossibleCrUseOfui({
              error: Error()
            }), ui) : ui).height ? time : time * 0.35;
            let temp = v3();
            let des = v3();
            const slot = this;
            let height = 300;
            let delay = 0.0;
            thing.onHightlight();
            (_this$moveTween3 = this.moveTween) == null ? void 0 : _this$moveTween3.stop();

            if (thing.firstIndex >= 0) {
              thing.offAnim();
              thing.node.worldPosition = slot.node.worldPosition.clone();
              thing.node.layer = Math.pow(2, Layers.nameToLayer("UI_2D"));
              thing.node.scale = scale;
              thing.node.eulerAngles = v3();
              this.moving = false;
              this.onMoved();
            } else {
              this.moveTween = tween(thing.node).to(dTime, {
                position: local
              }, {
                easing: 'smooth'
              }).delay(delay).call(() => {
                thing.offAnim();
              }).to(time, {
                scale: scale,
                eulerAngles: v3()
              }, {
                easing: 'smooth',

                onUpdate(target, ratio) {
                  des = slot.node.worldPosition.clone();
                  temp = (_crd && Ulis === void 0 ? (_reportPossibleCrUseOfUlis({
                    error: Error()
                  }), Ulis) : Ulis).lerpParabola(src, des, ratio, height, 0.5);
                  thing.node.worldPosition = temp;
                }

              }).call(() => {
                (_crd && sm === void 0 ? (_reportPossibleCrUseOfsm({
                  error: Error()
                }), sm) : sm).playSound((_crd && SoundType === void 0 ? (_reportPossibleCrUseOfSoundType({
                  error: Error()
                }), SoundType) : SoundType).LandFail);
                thing.node.worldPosition = slot.node.worldPosition.clone();
                thing.node.layer = Math.pow(2, Layers.nameToLayer("UI_2D"));
                thing.scaleSize(false);
                this.moving = false;
                this.onMoved();
                (_crd && room === void 0 ? (_reportPossibleCrUseOfroom({
                  error: Error()
                }), room) : room).moved();
              }).start();
            }
          }
        }

        onSlot(thing) {
          this.decreaseLabel();
          this.added++;
          thing.flicker();
          thing.slot = this;
          thing.setUpLayer();
          this.things.push(thing);

          if (this.things.length == 3) {
            let movingNode = this.things.map(t => t.node);
            this.things.forEach(t => {
              t.offHightlight();
              t.offAnim();
              this.setSlotThing(t, false, () => {
                movingNode = movingNode.filter(n => n != t.node);

                if (movingNode.length == 0) {
                  this.onThingMoved();
                }
              });
            });
            this.things = [];
          }
        }

        onThingMoved() {
          console.log("moved");

          if (!this.moving && this.amount == 0) {
            (_crd && room === void 0 ? (_reportPossibleCrUseOfroom({
              error: Error()
            }), room) : room).onFull(this);
          } else {
            (_crd && sm === void 0 ? (_reportPossibleCrUseOfsm({
              error: Error()
            }), sm) : sm).playSound((_crd && SoundType === void 0 ? (_reportPossibleCrUseOfSoundType({
              error: Error()
            }), SoundType) : SoundType).Done);
          }
        }

        onMoved() {}

        onDespawnThing() {
          if (this.thing) {
            this.thing.box = null;
          }

          this.thingType = -1;
          this.thing = null;
        }

        onHightlight() {
          this.frame.enabled = true;
          this.anim.stop();
          this.materials.forEach((material, i) => {// material.setProperty("useOutline", 1);
            // material.setProperty("alpha", 1);
            // material.setProperty("useOutline", 1, 1);
            // material.setProperty("alpha", 1, 1);
            // this.thingys[i].material = material;
          });
          this.thingys.forEach((thingy, i) => {
            thingy.node.scale = v3(1, 1, 1).multiplyScalar(1);
            this.outlines[i].node.scale = v3(1, 1, 1).multiplyScalar(1);
          });
          this.hightlighted = true;
        }

        offHightlight() {
          this.frame.enabled = true;
          this.anim.stop();
          this.thingys.forEach((thingy, i) => {
            thingy.node.scale = v3(1, 1, 1).multiplyScalar(1);
            this.outlines[i].node.scale = v3(1, 1, 1).multiplyScalar(1);
          });
          this.materials.forEach((material, i) => {// material.setProperty("useOutline", 0);
            // material.setProperty("useOutline", 0, 1);
            // this.thingys[i].material = material;
          });
          this.hightlighted = false;
        }

        flicker() {
          this.onHightlight();
          this.anim.play();
        }

        update(deltaTime) {}

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "thingType", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return -1;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "thing", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=08a55b2c415d58126d750c5cc2159cd67f215b59.js.map