System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, instantiate, JsonAsset, Node, sp, Sprite, UITransform, v3, NodeOrder, _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _crd, ccclass, property, MatchSprite;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfNodeOrder(extras) {
    _reporterNs.report("NodeOrder", "./NodeOrder", _context.meta, extras);
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
      instantiate = _cc.instantiate;
      JsonAsset = _cc.JsonAsset;
      Node = _cc.Node;
      sp = _cc.sp;
      Sprite = _cc.Sprite;
      UITransform = _cc.UITransform;
      v3 = _cc.v3;
    }, function (_unresolved_2) {
      NodeOrder = _unresolved_2.NodeOrder;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "3c80cerzv5CZoEGJcIQt1rY", "MatchSprite", undefined);

      __checkObsolete__(['_decorator', 'Component', 'instantiate', 'JsonAsset', 'Node', 'sp', 'Sprite', 'UITransform', 'v3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("MatchSprite", MatchSprite = (_dec = ccclass('MatchSprite'), _dec2 = property(Node), _dec3 = property(JsonAsset), _dec4 = property({
        slide: true,
        range: [0, 1000],
        step: 1
      }), _dec5 = property({
        slide: true,
        range: [0, 1000],
        step: 1
      }), _dec(_class = (_class2 = class MatchSprite extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "thingNode", _descriptor, this);

          _initializerDefineProperty(this, "json", _descriptor2, this);

          _initializerDefineProperty(this, "_mul", _descriptor3, this);

          this._match = false;
        }

        get mul() {
          return this._mul;
        }

        set mul(value) {
          this._mul = value;
          this.matchSprite();
        }

        set match(value) {
          this._match = false;
          this.setScale();
        }

        get match() {
          return this._match;
        }

        setScale() {
          let sprites = this.thingNode.getComponentsInChildren(Sprite);
          sprites.forEach(sprite => {
            let sc = sprite.node.scale.clone();
            let ux = sc.x > 0 ? 1 : -1;
            let uy = sc.y > 0 ? 1 : -1;
            sprite.node.scale = v3(ux, uy, 1);
            let ui = sprite.getComponent(UITransform);
            let size = ui.contentSize.clone();
            size.width *= Math.abs(sc.x);
            size.height *= Math.abs(sc.y);
            ui.contentSize = size;
          });
        }

        start() {}

        setSpine() {
          let spines = this.thingNode.getComponentsInChildren(sp.Skeleton);
          spines.forEach((s, i) => {
            let skins = s.skeletonData.skeletonJson["skins"];
            let index = skins.findIndex(sk => sk.name == s.node.name);
            s._defaultSkinIndex = index;
          });
        }

        matchSpine() {
          const wposType = [{
            x: 0,
            y: 0,
            z: 0,
            order: 0,
            skin: ""
          }, {
            x: 0,
            y: 0,
            z: 0,
            order: 0,
            skin: ""
          }];
          let nodeOrders = [];
          let spines = this.thingNode.getComponentsInChildren(_crd && NodeOrder === void 0 ? (_reportPossibleCrUseOfNodeOrder({
            error: Error()
          }), NodeOrder) : NodeOrder);
          let things = this.json.json;
          let keys = Object.keys(things);

          for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            let thing = things[key];
            let sps = spines.filter(s => s.node.name == key);
            thing.forEach((t, i) => {
              if (!sps[i]) {
                sps[i] = instantiate(sps[i - 1].node).getComponent(_crd && NodeOrder === void 0 ? (_reportPossibleCrUseOfNodeOrder({
                  error: Error()
                }), NodeOrder) : NodeOrder);
                sps[i].node.parent = this.thingNode;
              }

              sps[i].node.position = v3(t.x, t.y, t.z).multiplyScalar(this._mul);
              sps[i].order = t.order;
              sps[i].skin = t.skin;
              nodeOrders.push(sps[i]);
            });
          }

          nodeOrders.sort((a, b) => a.order - b.order);
          nodeOrders.forEach((no, i) => {
            no.node.setSiblingIndex(i);
            no.index = i;
            let t = no.getComponent(sp.Skeleton);
            let skins = t.skeletonData.skeletonJson["skins"];
            let index = skins.findIndex(s => s.name == no.skin);
            t._defaultSkinIndex = index;
          });
        }

        matchSprite() {
          const wposType = [{
            x: 0,
            y: 0,
            z: 0,
            order: 0
          }, {
            x: 0,
            y: 0,
            z: 0,
            order: 0
          }];
          let nodeOrders = [];
          let sprites = this.thingNode.getComponentsInChildren(_crd && NodeOrder === void 0 ? (_reportPossibleCrUseOfNodeOrder({
            error: Error()
          }), NodeOrder) : NodeOrder);
          let things = this.json.json;
          let keys = Object.keys(things);

          for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            let thing = things[key];

            if (thing[0]["isSpine"] == true) {
              key = key.split("_SkeletonData")[0];
            }

            let sps = sprites.filter(s => s.node.name == key);
            thing.forEach((t, i) => {
              if (!sps[i]) {
                // return;
                try {
                  sps[i] = instantiate(sps[i - 1].node).getComponent(_crd && NodeOrder === void 0 ? (_reportPossibleCrUseOfNodeOrder({
                    error: Error()
                  }), NodeOrder) : NodeOrder);
                  sps[i].node.parent = this.thingNode;
                } catch (error) {
                  console.log(key);
                  return;
                }
              }

              sps[i].node.position = v3(t.x, t.y, t.z).multiplyScalar(this._mul);
              sps[i].order = t.order;
              nodeOrders.push(sps[i]);
            });
          }

          nodeOrders.sort((a, b) => a.order - b.order);
          nodeOrders.forEach((no, i) => {
            no.node.setSiblingIndex(i);
            no.index = i;
          });
        }

        buildNodeRecursive(data, parent) {
          // tạo node theo tên
          const node = new Node(data.name);
          node.parent = parent; // ⭐ wpos luôn có, bất kể có sprite hay không

          node.setWorldPosition(v3(data.wpos.x, data.wpos.y, data.wpos.z).multiplyScalar(100)); // nếu có sprite thì add

          if (data.sprite) {
            var _sprites$find;

            const sprite = node.addComponent(Sprite);
            let sprites = this.thingNode.getComponentsInChildren(Sprite);
            sprite.spriteFrame = (_sprites$find = sprites.find(s => s.node.name === data.sprite.spriteName)) == null ? void 0 : _sprites$find.spriteFrame;
          } // duyệt children theo đúng thứ tự trong JSON


          if (data.children && data.children.length > 0) {
            data.children.forEach(child => {
              this.buildNodeRecursive(child, node);
            });
          }
        }

        update(deltaTime) {}

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "thingNode", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "json", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "_mul", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 25;
        }
      }), _applyDecoratedDescriptor(_class2.prototype, "mul", [_dec5], Object.getOwnPropertyDescriptor(_class2.prototype, "mul"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "match", [property], Object.getOwnPropertyDescriptor(_class2.prototype, "match"), _class2.prototype)), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=f13ac66c54e6cf198c46aad76d227be3f138f3a9.js.map