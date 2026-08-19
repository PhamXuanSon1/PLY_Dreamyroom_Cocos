System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "cc/env"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Animation, Component, misc, Node, tween, v3, Thing, Slot, ipm, ui, cEasing, sm, SoundType, EDITOR, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _crd, ccclass, property, executeInEditMode, room, Items, Loaded, Room;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfThing(extras) {
    _reporterNs.report("Thing", "./Thing", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSlot(extras) {
    _reporterNs.report("Slot", "./Slot", _context.meta, extras);
  }

  function _reportPossibleCrUseOfipm(extras) {
    _reporterNs.report("ipm", "../Manager/InputManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfui(extras) {
    _reporterNs.report("ui", "../Manager/UI", _context.meta, extras);
  }

  function _reportPossibleCrUseOfcEasing(extras) {
    _reporterNs.report("cEasing", "../Misc/Ulis", _context.meta, extras);
  }

  function _reportPossibleCrUseOfsm(extras) {
    _reporterNs.report("sm", "../Manager/SoundManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSoundType(extras) {
    _reporterNs.report("SoundType", "../Manager/SoundManager", _context.meta, extras);
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
      Component = _cc.Component;
      misc = _cc.misc;
      Node = _cc.Node;
      tween = _cc.tween;
      v3 = _cc.v3;
    }, function (_unresolved_2) {
      Thing = _unresolved_2.Thing;
    }, function (_unresolved_3) {
      Slot = _unresolved_3.Slot;
    }, function (_unresolved_4) {
      ipm = _unresolved_4.ipm;
    }, function (_unresolved_5) {
      ui = _unresolved_5.ui;
    }, function (_unresolved_6) {
      cEasing = _unresolved_6.cEasing;
    }, function (_unresolved_7) {
      sm = _unresolved_7.sm;
      SoundType = _unresolved_7.SoundType;
    }, function (_ccEnv) {
      EDITOR = _ccEnv.EDITOR;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "f1a07sgcsxJUrxilnonM1+Q", "Room", undefined);

      __checkObsolete__(['_decorator', 'Animation', 'Component', 'EventTouch', 'instantiate', 'JsonAsset', 'misc', 'Node', 'Sprite', 'Tween', 'tween', 'UITransform', 'v2', 'v3', 'Vec2', 'Vec3']);

      ({
        ccclass,
        property,
        executeInEditMode
      } = _decorator);

      _export("room", room = null);

      _export("Items", Items = [[0, 0, 0], [1, 1, 1], [2, 2, 2], [3, 3, 3], [3, 3, 3], [3, 3, 3], [4, 4, 4], [5, 5, 5], [5, 5, 5], [5, 5, 5], [6, 6, 6], [7, 7, 7], [7, 7, 7], [8, 8, 8], [9, 9, 9], [10, 10, 10], [12, 12, 12], [12, 12, 12], [12, 12, 12]]);

      _export("Loaded", Loaded = {
        loaded: false
      });

      _export("Room", Room = (_dec = ccclass('Room'), _dec2 = executeInEditMode(true), _dec3 = property(Node), _dec4 = property(Node), _dec5 = property(Node), _dec6 = property(Node), _dec7 = property(Node), _dec8 = property(Node), _dec9 = property([Node]), _dec10 = property(Node), _dec11 = property(Node), _dec12 = property(Node), _dec(_class = _dec2(_class = (_class2 = class Room extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "slotNode", _descriptor, this);

          _initializerDefineProperty(this, "thingNode", _descriptor2, this);

          _initializerDefineProperty(this, "boxNode", _descriptor3, this);

          _initializerDefineProperty(this, "vfxNode", _descriptor4, this);

          _initializerDefineProperty(this, "thingAbove", _descriptor5, this);

          _initializerDefineProperty(this, "hideNode", _descriptor6, this);

          this.slotAmount = 2;
          this.boxAmount = 5;
          this.slotDis = 165;
          this.boxDis = 70;
          this.things = [];
          this.slots = [];
          this.boxes = [];
          this.zoomed = false;
          this.map = new Map();

          _initializerDefineProperty(this, "taps", _descriptor7, this);

          this.startPos = null;
          this.s1 = null;
          this.s2 = null;
          this.location = null;
          this.maxScale = 0.8;
          this.maxMoveX = 500;
          this.maxMoveY = 0;
          this.hintTween = null;
          this.fisrtTapCount = 3;
          this.items = [];
          this.tappable = false;
          this.lose = false;
          this.maxPick = 15;
          this.maxBox = 99;

          _initializerDefineProperty(this, "warning", _descriptor8, this);

          _initializerDefineProperty(this, "loseFake", _descriptor9, this);

          this.faked = false;
          this.reseted = false;

          _initializerDefineProperty(this, "next", _descriptor10, this);

          this.clicked = 0;
          this.boxed = 0;
          this.click = false;
        }

        onLoad() {
          _export("room", room = this);
        }

        start() {
          this.init();
        }

        init() {
          this.items = [...Items];
          this.initBoxes();
          this.initSlots();
          this.initThings();
          this.zoom(); // this.onFirst();

          this.schedule(this.onSchedule.bind(this), 1);
        }

        onFirst() {
          if (!EDITOR) {
            this.things.filter(t => t.firstIndex >= 0).sort((t1, t2) => t1.firstIndex - t2.firstIndex).forEach(t => {
              t.onTouchStart(null);
            });
            setTimeout(() => {
              this.tappable = true;
              this.tap(null);
            }, 0);
          }
        }

        onSchedule() {
          // if(this.checkLose()) return;
          let boxes = this.boxes.filter(b => b.thing && !b.moving);
          let things = boxes.map(b => b.thing);
          let arrange = false;
          things.forEach(t => {
            let thingyType = t.thingType;
            let slot = this.slots.find(s => s.thingType == thingyType);

            if (slot && slot.added < slot.amount) {
              arrange = true;
              t.box.onDespawnThing();
              this.checkSlot(t);
              console.log("same");
            }
          });

          if (!arrange) {
            room.checkLose();
          }

          if (this.tappable) {
            let emptyBox = this.boxes.filter(b => b.thingType == -1);

            if (emptyBox.length > 1) {
              this.warning.active = false;
            }
          }
        }

        moved() {
          let moving = this.boxes.find(b => b.moving);
          let movingSlot = this.slots.find(s => s.moving);
          if (moving || movingSlot) return;
          let emptyBox = this.boxes.filter(b => b.thingType == -1);

          if (this.tappable) {
            console.log(emptyBox.length);

            if (emptyBox.length == 1) {
              (_crd && sm === void 0 ? (_reportPossibleCrUseOfsm({
                error: Error()
              }), sm) : sm).playSound((_crd && SoundType === void 0 ? (_reportPossibleCrUseOfSoundType({
                error: Error()
              }), SoundType) : SoundType).Alert);
              emptyBox[0].getComponent(Animation).play();
            } else if (emptyBox.length > 1) {
              this.warning.active = false;
            }

            if (this.faked) {
              if (emptyBox.length > 0) {
                this.reseted = true;
              }
            }
          }
        }

        checkLose() {
          let moving = this.boxes.find(b => b.moving);
          let movingSlot = this.slots.find(s => s.moving);
          if (moving || movingSlot) return;
          let emptyBox = this.boxes.find(b => b.thingType == -1);

          if (!emptyBox) {
            var _this$hintTween;

            (_this$hintTween = this.hintTween) == null ? void 0 : _this$hintTween.stop();
            (_crd && ui === void 0 ? (_reportPossibleCrUseOfui({
              error: Error()
            }), ui) : ui).offHand();
            this.unschedule(this.onSchedule.bind(this)); // if(this.loseFake.active) return;
            // if(!Loaded.loaded) {
            //     this.warning.active = false;   
            //     this.loseFake.active = true;
            //     Loaded.loaded = true;
            //     sm.playSound(SoundType.Fail);   
            //     console.log("fake");
            // } else {
            //     this.things.forEach((t) => {
            //         t.offTouch()
            //     });
            //     ui.onLose();
            //     this.lose = true;
            //     console.log("lose");
            // }

            this.things.forEach(t => {
              t.offTouch();
            });
            (_crd && ui === void 0 ? (_reportPossibleCrUseOfui({
              error: Error()
            }), ui) : ui).onLose();
            this.lose = true;
            console.log("lose");
          }

          return !emptyBox;
        }

        onRevive() {
          room.node.active = false;
          this.loseFake.active = false;

          if (this.next) {
            this.next.active = true;
          }
        }

        tap(thing) {
          if (!this.tappable) return;

          if (thing) {
            let tt = thing.getComponent(_crd && Thing === void 0 ? (_reportPossibleCrUseOfThing({
              error: Error()
            }), Thing) : Thing);
            let s = this.slots.find(s => s.thingType == tt.thingType);

            if (s) {
              s.offHightlight();
            }
          }

          this.taps = this.taps.filter(t => {
            return t != thing;
          });
          let t = this.taps[0];
          console.log(t);

          if (t) {
            var _ref;

            let th = t.getComponent(_crd && Thing === void 0 ? (_reportPossibleCrUseOfThing({
              error: Error()
            }), Thing) : Thing);
            th.flicker();
            let sl = this.slots.find(s => s.thingType == th.thingType);

            if (sl) {
              sl.flicker();
            }

            (_ref = _crd && ui === void 0 ? (_reportPossibleCrUseOfui({
              error: Error()
            }), ui) : ui) == null ? void 0 : _ref.handTap(t);
          } else {
            var _ref2;

            (_ref2 = _crd && ui === void 0 ? (_reportPossibleCrUseOfui({
              error: Error()
            }), ui) : ui) == null ? void 0 : _ref2.offHand();
            this.hint();
          }
        }

        hint() {
          var _this$hintTween2;

          (_this$hintTween2 = this.hintTween) == null ? void 0 : _this$hintTween2.stop();
          this.hintTween = tween({}).delay(5).call(() => {
            if (!(_crd && ui === void 0 ? (_reportPossibleCrUseOfui({
              error: Error()
            }), ui) : ui).hand.active) {
              if (this.taps.length == 0 && this.things.length > 0) {
                let thingFindout = null;
                let sl = [...this.slots];
                sl.sort((a, b) => a.amount - a.added - b.amount + b.added);
                if (sl.length == 0) return;
                let type = sl[0].thingType;
                thingFindout = this.things.find(t => t.thingType == type);

                if (thingFindout) {
                  this.taps = [thingFindout.node];
                  this.tap(null);
                } else {
                  this.hint();
                }
              } else {
                this.hint();
              }
            }
          }).start();
        }

        zoom() {
          this.hideNode.active = false;
          this.node.scale = v3(1, 1, 1); // .multiplyScalar(0.5);
          // ui?.offHand();

          tween(this.node).delay(1).to(1, {
            scale: v3(1, 1, 1)
          }).call(() => {
            (_crd && ui === void 0 ? (_reportPossibleCrUseOfui({
              error: Error()
            }), ui) : ui).resize();
            this.tappable = true;
            this.binding();
            this.zoomed = true;
            this.hideNode.active = true;
            console.log("Done");
            this.tap(null);
          }); // .start();

          this.tappable = true;
          this.binding();
          this.zoomed = true;
          this.hideNode.active = true;
          this.tap(null);
        }

        setSlotThing(slot, shuffle = false) {
          let keys = [];
          let keyMap = [];

          for (let [key, value] of this.map) {
            keyMap.push([key, value]);
          }

          if (shuffle) {
            // keyMap = Ulis.shuffleArray(keyMap);
            // console.log(keyMap);
            keyMap.sort((a, b) => b[1] - a[1]);
          } // for( let [key, value] of this.map) {


          for (let i = 0; i < keyMap.length; i++) {
            let key = keyMap[i][0];
            let value = keyMap[i][1];
            console.log(key, value);

            if (value > 0) {
              let thing = this.things.find(t => t.thingType == key);

              if (!thing) {
                thing = this.boxes.map(b => b.thing).find(t => t && t.thingType == key);
              }

              slot.thingType = key;
              slot.setThingFrame(thing);
              slot.added = 0;
              slot.ticks.forEach(t => t.active = false);
              slot.setLabel(value);
              keys.push(key);
              break;
            }
          }

          keys.forEach(k => {
            this.map.set(k, this.map.get(k) - 3);
          });
          return keys.length > 0;
        }

        setSlotThingFromArray(slot) {
          let array = this.items.shift();

          if (array) {
            let key = array[0];
            let thing = this.things.find(t => t.thingType == key);

            if (!thing) {
              thing = this.boxes.map(b => b.thing).find(t => t && t.thingType == key);
            }

            slot.thingType = key;
            slot.setThingFrame(thing);
            slot.added = 0;
            slot.ticks.forEach(t => t.active = false);
            slot.setLabel(array.length);
          }

          console.log("items length", this.items.length);
          return array != undefined;
        }

        initThings() {
          this.things = this.thingNode.getComponentsInChildren(_crd && Thing === void 0 ? (_reportPossibleCrUseOfThing({
            error: Error()
          }), Thing) : Thing);
          this.things.sort((t1, t2) => t1.thingType - t2.thingType);
          this.things.forEach(thing => {
            thing.init();
            let type = thing.thingType;

            if (this.map.has(type)) {
              this.map.set(type, this.map.get(type) + 1);
            } else {
              this.map.set(type, 1);
            }
          });
          let items = [];

          for (let [key, value] of this.map) {
            let array = new Array(3).fill(key);
            let amount = value / 3;

            for (let i = 0; i < amount; i++) {
              items.push(array);
            } // items.push(new Array(value).fill(key));

          }

          this.slots.forEach(slot => {
            this.setSlotThingFromArray(slot);
          }); // console.log(this.map);

          console.log(items);

          try {
            let t0 = Items[0][0];
            let things = this.things.filter(t => t.thingType == t0);
            this.taps = things.map(t => t.node);
          } catch (error) {} // let sprites = this.thingNode.getComponentsInChildren(Sprite);
          // sprites.forEach((sprite) => {
          //     let sc = sprite.node.scale.clone();
          //     sprite.node.scale = v3(1, 1, 1);
          //     let ui = sprite.getComponent(UITransform);
          //     let size = ui.contentSize.clone();
          //     size.width *= sc.x;
          //     size.height *= sc.y;
          //     ui.contentSize = size;
          // })

        }

        initSlots() {
          this.slots = this.slotNode.getComponentsInChildren(_crd && Slot === void 0 ? (_reportPossibleCrUseOfSlot({
            error: Error()
          }), Slot) : Slot); // this.slots.forEach((slot) => {
          //     slot.node.destroy();
          // })
          // this.slots = [];

          for (let i = 0; i < this.slotAmount; i++) {
            let slot = this.slots[i];
            slot.node.parent = this.slotNode;
            slot.node.position = v3(this.slotDis * (-this.slotAmount / 2 + 0.5 + i));
            slot.initSlot();
            slot.node.name = "slot" + i;
          }
        }

        initBoxes() {
          this.boxes = this.boxNode.getComponentsInChildren(_crd && Slot === void 0 ? (_reportPossibleCrUseOfSlot({
            error: Error()
          }), Slot) : Slot); // this.boxes.forEach((slot) => {
          //     slot.node.destroy();
          // })
          // this.boxes = [];

          for (let i = 0; i < this.boxAmount; i++) {
            let box = this.boxes[i];
            box.node.parent = this.boxNode;
            box.node.position = v3(this.boxDis * (-this.boxAmount / 2 + 0.5 + i));
            box.init();
            box.index = i;
            box.node.name = "box" + i;
          }
        }

        rotateSlots(portrait) {
          return;

          if (portrait) {
            this.slots.forEach((slot, i) => {
              slot.node.eulerAngles = v3();
              slot.node.position = v3(this.slotDis * (-this.slotAmount / 2 + 0.5 + i));
            });
            this.boxes.forEach((slot, i) => {
              slot.node.eulerAngles = v3();
            });
          } else {
            this.slots.forEach((slot, i) => {
              slot.node.eulerAngles = v3(0, 0, 90);
              slot.node.position = v3(this.slotDis * 1.2 * (-this.slotAmount / 2 + 0.5 + i));
            });
            this.boxes.forEach((slot, i) => {
              slot.node.eulerAngles = v3(0, 0, 90);
            });
          }
        }

        getBox(index) {
          return this.boxes.find(b => b.index == index);
        }

        onPickThing(thing) {
          this.things = this.things.filter(t => t != thing);
          this.taps = this.taps.filter(t => t != thing.node);
        }

        onTapThing(thing) {
          thing.off();
          this.onPickThing(thing);

          if (this.fisrtTapCount > 0) {
            this.tap(thing.node);
            this.fisrtTapCount--;

            if (this.fisrtTapCount == 0) {
              (_crd && ui === void 0 ? (_reportPossibleCrUseOfui({
                error: Error()
              }), ui) : ui).offHand();
              let s = this.slots.filter(s => s.hightlighted);
              s.forEach(s => {
                s.offHightlight();
              });
              let things = this.things.filter(t => t.hightlighted);
              things.forEach(t => {
                t.slot == null && t.offFlicker();
              });
              if (this.tappable) this.taps = [];
              this.hint();
            }
          } else {
            (_crd && ui === void 0 ? (_reportPossibleCrUseOfui({
              error: Error()
            }), ui) : ui).offHand(); // let s = this.slots.find(s => s.thingType == thing.thingType);
            // if(s) {
            //     s.offHightlight();
            // }

            let s = this.slots.filter(s => s.hightlighted);
            s.forEach(s => {
              s.offHightlight();
            });
            let things = this.things.filter(t => t.hightlighted);
            things.forEach(t => {
              t.slot == null && t.offFlicker();
            });
            if (this.tappable) this.taps = [];
            this.hint();
          }
        }

        onThing() {
          this.clicked++;
          console.log(this.clicked);

          if (this.clicked >= this.maxPick) {
            this.things.forEach(t => t.offTouch());
            (_crd && ui === void 0 ? (_reportPossibleCrUseOfui({
              error: Error()
            }), ui) : ui).bindingToStore();
          }
        }

        onBox() {
          this.boxed++;
          console.log(this.boxed);

          if (this.boxed >= this.maxBox) {
            this.things.forEach(t => t.offTouch());
            (_crd && ui === void 0 ? (_reportPossibleCrUseOfui({
              error: Error()
            }), ui) : ui).bindingToStore();
          }
        }

        checkBox(thing, wpos) {
          if (!this.zoomed) return;
          let thingyType = thing.thingType;
          let slot = this.slots.find(s => s.thingType == thingyType);

          if (slot && slot.added < slot.maxAmount) {
            this.onThing();
            this.checkSlot(thing);
          } else {
            this.swapBox(thing); // this.checkFail(wpos);
          }
        }

        checkFail(pos) {
          this.onThing(); // sm.playSound(SoundType.Wrong);
          // let x = pm.spawn(PoolType.X);
          // x.node.parent = this.vfxNode;
          // x.node.worldPosition = pos;
          // let s = x.node.children[0];
          // s.scale = v3(0.5, 0.5, 0.5);
          // tween(s)
          // .to(0.2, {scale: v3(1, 1, 1)}, {easing: 'smooth'})
          // .delay(0.5)
          // .call(() => {
          //     pm.despawn(x);
          // })
          // .start();
        }

        checkSlot(thing) {
          let thingyType = thing.thingType;
          let slot = this.slots.find(s => s.thingType == thingyType);

          if (slot && slot.added < slot.maxAmount) {
            this.onTapThing(thing);
            if (this.tappable) (_crd && sm === void 0 ? (_reportPossibleCrUseOfsm({
              error: Error()
            }), sm) : sm).playSound((_crd && SoundType === void 0 ? (_reportPossibleCrUseOfSoundType({
              error: Error()
            }), SoundType) : SoundType).Pick);
            slot.setSlotThing(thing); // slot.onSlot(thing);
          }
        }

        swapBox(thing) {
          let thingyType = thing.thingType;
          let index = this.boxes.findIndex(b => b.thingType < 0);
          console.log(this.boxes.length, index);

          if (index > -1) {
            // this.onThing();
            if (this.tappable) (_crd && sm === void 0 ? (_reportPossibleCrUseOfsm({
              error: Error()
            }), sm) : sm).playSound((_crd && SoundType === void 0 ? (_reportPossibleCrUseOfSoundType({
              error: Error()
            }), SoundType) : SoundType).Pick);
            let box = this.boxes[index];
            this.onTapThing(thing); // box.setBoxThing(thing);

            let thingyBoxes = this.boxes.filter(b => b.thingType == thingyType);
            let length = thingyBoxes.length;
            console.log(length);

            if (length > 0) {
              let si = thingyBoxes[length - 1].index;
              let lastBox = this.getBox(this.boxAmount - 1);
              console.log(si, this.boxAmount - 1);

              if (si < this.boxAmount - 1 && lastBox.thingType < 0) {
                for (let i = this.boxAmount - 1; i > si; i--) {
                  let nexBox = this.getBox(i);

                  if (nexBox.thingType < 0) {
                    continue;
                  } else {
                    nexBox.swapIndex(this.getBox(i + 1));
                  }
                }

                console.log("set thing 1");
                this.getBox(si + 1).setBoxThing(thing);
              } else {
                console.log("set thing 2");
                box.setBoxThing(thing);
              }
            } else {
              console.log("set thing 3");
              box.setBoxThing(thing);
            }
          }
        }

        onFull(slot) {
          this.slots = this.slots.filter(s => s != slot);
          this.onBox();
          let original = slot.node.position.clone();
          let pos = slot.node.position.clone();
          pos.y = 175;
          let nap = slot.node.getChildByName("nap_box");
          nap.active = true;
          nap.position = v3(0, 77.175, 0);
          slot.label.node.active = false;
          tween(nap).to(0.1, {
            position: v3(0, 6.425, 0)
          }, {
            easing: 'smooth'
          }).call(() => {
            slot.ticks.forEach(tick => tick.active = false);
            (_crd && sm === void 0 ? (_reportPossibleCrUseOfsm({
              error: Error()
            }), sm) : sm).playSound((_crd && SoundType === void 0 ? (_reportPossibleCrUseOfSoundType({
              error: Error()
            }), SoundType) : SoundType).Done);
          }).start();
          tween(slot.node).to(0.5, {
            position: pos
          }, {
            easing: (_crd && cEasing === void 0 ? (_reportPossibleCrUseOfcEasing({
              error: Error()
            }), cEasing) : cEasing)("backIn", 3)
          }).call(() => {
            let addNew = this.setSlotThingFromArray(slot);

            if (addNew) {
              nap.active = false;
              slot.label.node.active = true;
            } else {
              slot.frame.node.scale = v3(1, 1, 1).multiplyScalar(1);
              slot.thingys.forEach(thingy => {
                thingy.node.scale = v3(1, 1, 1).multiplyScalar(1);
              });
            }

            tween(slot.node).to(0.2, {
              position: original
            }, {
              easing: 'smooth'
            }).call(() => {
              if (addNew) {
                this.slots.push(slot);
                this.slots.sort((a, b) => a.node.position.x - b.node.position.x);
                let thingType = slot.thingType;
                let sameBoxes = this.boxes.filter(b => !b.moving && b.thing && b.thing.thingType == thingType);
                let things = sameBoxes.map(b => b.thing);
                things = things.filter((t, i) => i < slot.amount - slot.added);
                things.forEach((t, i) => {
                  t.box.onDespawnThing();
                  slot.setSlotThing(t, true);
                });
                let bMove = this.boxes.filter(b => b.moving);
                console.log("Moveing box", bMove.length);

                if (bMove.length > 0) {
                  bMove.forEach(b => {
                    b.onMoved = () => {
                      this.rearrangeBoxes(bMove);

                      b.onMoved = () => {};
                    };
                  });
                } else {
                  this.rearrangeBoxes(bMove);
                }
              } // this.checkLose();              

            }).start();
          }).start();
        }

        rearrangeBoxes(boxes = []) {
          if (this.boxes.length == 0) {
            return;
          }

          if (this.lose) return;
          let moving = this.boxes.filter(b => b.moving);

          if (moving.length > 0) {
            return;
          } else {
            boxes.forEach(b => {
              b.onMoved = () => {};
            });
            let emptyBox = null;

            for (let i = 0; i < this.boxAmount; i++) {
              let box = this.getBox(i);

              if (box.thingType < 0) {
                let nextBox = this.getBox(i + 1);

                if (nextBox && nextBox.thingType >= 0) {
                  emptyBox = box;
                  break;
                }
              }
            }

            if (!emptyBox) return;
            console.log("arrange");
            let things = this.boxes.map(b => b.thing).filter(t => t);
            things.forEach(t => {
              t.box.onDespawnThing();
            });
            things.forEach(t => {
              this.checkSlot(t);
            });
            things = things.filter(t => !t.box);
            things.forEach((t, i) => {
              let box = this.getBox(i);
              box.setBoxThing(t, true);
            });
          }
        }

        onDespawnSlot(slot) {
          let thing = this.things.find(t => t.thingType == slot.thingType);

          if (thing) {
            return;
          }

          this.slots = this.slots.filter(s => s != slot);
          this.slots.forEach((slot, i) => {
            let pos = v3(this.slotDis * (-this.slotAmount / 2 + 0.5 + i));
            let pos2 = v3(this.slotDis * 1.2 * (-this.slotAmount / 2 + 0.5 + i));
            slot.moveToPos(pos, pos2);
          });

          if (this.slots.length == 0) {
            setTimeout(() => {
              (_crd && ui === void 0 ? (_reportPossibleCrUseOfui({
                error: Error()
              }), ui) : ui).onWin();
            }, 500);
          }
        }

        onTouchStart(event) {
          if (!event) return;
          this.location = event.getUILocation();

          if (this.s1 == null) {
            this.s1 = this.location.clone();
          } else if (this.s2 == null) {
            this.s2 = this.location.clone();
          }

          if (this.s1 && this.s2) {
            return;
          }

          this.click = true;
          this.startPos = v3(this.location.x, this.location.y, 0);
        }

        zoomBy(delta) {
          // if(!this.zoomed) 
          return;
          let scale = this.thingNode.scale.x;
          scale += delta;
          scale = misc.clampf(scale, 0.4, this.maxScale);
          this.thingNode.scale = v3(scale, scale, scale);
          (_crd && ui === void 0 ? (_reportPossibleCrUseOfui({
            error: Error()
          }), ui) : ui).keepTap();
        }

        onTouchMove(event) {
          // return;
          if (!event) return;
          let touches = event.getTouches();

          if (touches.length >= 2) {
            this.click = false;
          } else {// let pos = touches[0].getUILocation();
            // let dis = Vec2.distance(pos, this.location);
            // console.log(dis);
            // if(dis > 100) {
            //     this.click = false;
            // }
          }

          this.click = false;

          if (this.s1 && this.s2 && touches.length >= 2) {
            let e1 = touches[0].getUILocation();
            let e2 = touches[1].getUILocation();
            let sDis = this.s2.clone().subtract(this.s1).length();
            let eDis = e2.clone().subtract(e1).length();
            let scale = eDis - sDis;
            this.s1 = e1.clone();
            this.s2 = e2.clone();
            console.log(scale);
            this.zoomBy(scale / 3000);
            return;
          }

          if (!this.startPos) return;
          let delta = event.getUIDelta();
          this.thingNode.worldPosition = this.thingNode.getWorldPosition().add3f(delta.x, delta.y, 0);
          let tp = this.thingNode.position.clone();
          let maxX = this.thingNode.scale.x * this.maxMoveX;
          let maxY = this.thingNode.scale.y * this.maxMoveY;
          tp.x = misc.clampf(tp.x, -maxX, maxX);
          tp.y = misc.clampf(tp.y, -maxY - 200, maxY);
          (_crd && ui === void 0 ? (_reportPossibleCrUseOfui({
            error: Error()
          }), ui) : ui).keepTap();
          this.thingNode.position = tp;
        }

        onTouchEnd(event) {
          if (!event) return;
          this.startPos = null;
          let out = event.getUILocation();

          if (this.s1 && this.s2) {
            if (this.s1.equals(out)) {
              this.s1 = this.s2.clone();
            }

            this.startPos = v3(this.s1.x, this.s1.y, 0);
            this.s2 = null;
          } else if (this.s1) {
            this.s1 = null;
          }

          if (this.click) {
            let pos = event.getLocation();
            let wpos = (_crd && ui === void 0 ? (_reportPossibleCrUseOfui({
              error: Error()
            }), ui) : ui).uiCam.screenToWorld(v3(pos.x, pos.y, 0));
            this.checkFail(wpos);
          }
        }

        binding() {
          if (!(_crd && ipm === void 0 ? (_reportPossibleCrUseOfipm({
            error: Error()
          }), ipm) : ipm)) return;
          (_crd && ipm === void 0 ? (_reportPossibleCrUseOfipm({
            error: Error()
          }), ipm) : ipm).bindingStart = this.onTouchStart.bind(this);
          (_crd && ipm === void 0 ? (_reportPossibleCrUseOfipm({
            error: Error()
          }), ipm) : ipm).bindingMove = this.onTouchMove.bind(this);
          (_crd && ipm === void 0 ? (_reportPossibleCrUseOfipm({
            error: Error()
          }), ipm) : ipm).bindingEnd = this.onTouchEnd.bind(this);
        }

        update(deltaTime) {}

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "slotNode", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "thingNode", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "boxNode", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "vfxNode", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "thingAbove", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "hideNode", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "taps", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "warning", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "loseFake", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "next", [_dec12], {
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
//# sourceMappingURL=c7e7412c1932378f6bdfd3e5c062101a947091b2.js.map