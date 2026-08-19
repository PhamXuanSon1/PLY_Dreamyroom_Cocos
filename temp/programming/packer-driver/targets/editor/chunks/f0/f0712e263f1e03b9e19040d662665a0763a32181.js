System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, Node, Sprite, SpriteFrame, UITransform, Vec2, Vec3, _decorator, misc, rect, resources, v2, v3, pc, ui, _dec, _class, _descriptor, _class3, _crd, ccclass, property, Ulis, cEasing, Zoom;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfpc(extras) {
    _reporterNs.report("pc", "../Manager/PointerController", _context.meta, extras);
  }

  function _reportPossibleCrUseOfui(extras) {
    _reporterNs.report("ui", "../Manager/UI", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      Node = _cc.Node;
      Sprite = _cc.Sprite;
      SpriteFrame = _cc.SpriteFrame;
      UITransform = _cc.UITransform;
      Vec2 = _cc.Vec2;
      Vec3 = _cc.Vec3;
      _decorator = _cc._decorator;
      misc = _cc.misc;
      rect = _cc.rect;
      resources = _cc.resources;
      v2 = _cc.v2;
      v3 = _cc.v3;
    }, function (_unresolved_2) {
      pc = _unresolved_2.pc;
    }, function (_unresolved_3) {
      ui = _unresolved_3.ui;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "5e9caFwzoRBv76WtzKYnUCq", "Ulis", undefined); // Learn TypeScript:
      //  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
      // Learn Attribute:
      //  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
      // Learn life-cycle callbacks:
      //  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html


      __checkObsolete__(['EventTouch', 'Node', 'Rect', 'Sprite', 'SpriteFrame', 'TweenEasing', 'UITransform', 'Vec2', 'Vec3', '_decorator', 'misc', 'rect', 'resources', 'v2', 'v3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("default", Ulis = ccclass(_class3 = class Ulis {
        static v2tov3(v2) {
          return v3(v2.x, v2.y, 0);
        }

        static v3tov2(v3) {
          return v2(v3.x, v3.y);
        }

        static sign(x) {
          return x > 0 ? 1 : x < 0 ? -1 : 0;
        }

        static positiveAngle(angle) {
          angle = angle % 360;
          return angle < 0 ? angle + 360 : angle;
        }

        static allNode(node, callback = () => {}) {
          callback(node);
          node.children.forEach(child => {
            this.allNode(child, callback);
          });
        }

        static eulerAngleOfAPoint(point) {
          let y = Math.atan2(point.x, point.z);
          let x = -Math.atan2(point.y, Math.sqrt(point.x * point.x + point.z * point.z));
          let z = Math.atan2(point.y, point.x);
          z = 0; // WorldControll.ins.ui.log(x*180/Math.PI + "")

          return v3(x, y, z).multiplyScalar(180 / Math.PI);
        }

        static lastChildOf(node, index = 99, last = 0) {
          if (index == 0) {
            return {
              end: node,
              last: last
            };
          } else {
            if (node.children.length == 0) return {
              end: node,
              last: last
            };
            last += 1;
            return this.lastChildOf(node.children[0], index - 1, last);
          }
        }

        static getPlatform() {
          var userAgent = navigator.userAgent || navigator.vendor;

          if (/android|Android/i.test(userAgent)) {
            return "android";
          } // iOS detection from: http://stackoverflow.com/a/9039885/177710


          if (/iPad|iPhone|iPod|Macintosh/.test(userAgent)) {
            return "ios";
          }

          return "android";
        }

        static changeSprite(name, node) {
          resources.load(name, SpriteFrame, (err, spriteFrame) => {
            node.getComponent(Sprite).spriteFrame = spriteFrame;
          });
        }

        static getSpriteFrames(name, callback) {
          resources.loadDir(name, SpriteFrame, function (err, assets) {
            callback(assets);
          });
        }

        static globalPosition(node) {
          var name = node.name;
          var pos = v3(node.position.x, node.position.y, node.position.z);
          const parenrNames = [];

          while (node.parent != null) {
            // parenrNames.push({name: node.parent.name, pos: pos})
            if (node.parent.name == "PlayScene") break;
            pos = pos.add(node.parent.position);
            node = node.parent;
          } // parenrNames.push({name: node.parent.name, pos: pos})        
          // console.log(name, parenrNames);


          return pos;
        }

        static localPosition(node, pos) {
          while (node.parent != null) {
            if (node.parent.name == "PlayScene") break;
            pos = pos.subtract(node.parent.position);
            node = node.parent;
          }

          return pos;
        }

        static localPosition2(node, des) {
          var pos = this.globalPosition(des);

          while (node.parent != null) {
            if (node.parent.name == "PlayScene") break;
            pos = pos.subtract(node.parent.position);
            node = node.parent;
          }

          return pos;
        }

        static iRand(min, max) {
          return Math.floor(Math.random() * (max - min + 0.9)) + min;
        }

        static addToParent(node, parent) {
          let des = node.getWorldPosition();
          let rot = node.getWorldRotation();
          let scale = node.getWorldScale();
          node.parent = parent;
          node.setWorldPosition(des);
          node.setWorldRotation(rot);
          node.setWorldScale(scale);
        }

        static shuffleArray(array, indices = []) {
          // Lấy độ dài của mảng
          const n = array.length; // Thực hiện xáo trộn theo thuật toán Fisher-Yates

          for (let i = n - 1; i > 0; i--) {
            // Chọn một chỉ số ngẫu nhiên từ 0 đến i
            let j = 0;

            if (indices.length == 0) {
              j = Math.floor(Math.random() * (i + 1));
            } else {
              j = indices.shift() || 0;
            } // Hoán đổi phần tử tại vị trí i với phần tử tại vị trí j


            [array[i], array[j]] = [array[j], array[i]];
          } // console.log(JSON.stringify(ind));


          return array;
        }

        static lerpParabola(A, B, t, height, peak) {
          const linear = new Vec3();
          Vec3.lerp(linear, A, B, t); // Parabola: 0 tại t=0, t=1; đạt max tại peak

          let curve = t * (1 - t) / (peak * (1 - peak)); // tránh vượt quá do sai số
          // curve = Math.max(0, Math.min(1, curve));

          const offset = new Vec3(0, curve * height, 0);
          return linear.add(offset);
        }
        /**
         * @en Test rect and rect
         * @zh 测试矩形与矩形是否相交
         */


        static rectRect(a, b, delta = 0) {
          // jshint camelcase:false
          const a_min_x = a.x;
          const a_min_y = a.y;
          const a_max_x = a.x + a.width;
          const a_max_y = a.y + a.height;
          const b_min_x = b.x;
          const b_min_y = b.y;
          const b_max_x = b.x + b.width;
          const b_max_y = b.y + b.height;
          return a_min_x < b_max_x - delta && a_max_x - delta > b_min_x && a_min_y < b_max_y - delta && a_max_y - delta > b_min_y || b_min_x < a_max_x - delta && b_max_x - delta > a_min_x && b_min_y < a_max_y - delta && b_max_y - delta > a_min_y;
        }

        static getBox(b) {
          let ut1 = b.getComponent(UITransform);
          let scale1 = b.getWorldScale();
          let w1 = ut1.width * scale1.x;
          let h1 = ut1.height * scale1.y;
          let wpos1 = b.getWorldPosition();
          let box = rect(wpos1.x - w1 / 2, wpos1.y - h1 / 2, w1, h1);
          return box;
        }

        static simplifyPath(path) {
          if (path.length <= 2) return path;
          const result = [];
          result.push(path[0]);

          for (let i = 1; i < path.length - 1; i++) {
            const prev = path[i - 1];
            const curr = path[i];
            const next = path[i + 1];
            const v1 = new Vec2(curr.x - prev.x, curr.y - prev.y);
            const v2 = new Vec2(next.x - curr.x, next.y - curr.y); // cross 2D

            const cross = v1.x * v2.y - v1.y * v2.x; // cùng hướng => bỏ điểm giữa

            if (Math.abs(cross) < 0.0001) {
              continue;
            }

            result.push(curr);
          }

          result.push(path[path.length - 1]);
          return result;
        }

        static simplifyPathWRange(path, minDistance) {
          if (path.length <= 2) return [...path];
          const result = [];
          result.push(path[0]);
          let i = 1;

          while (i < path.length - 1) {
            const prev = result[result.length - 1];
            const curr = path[i];

            if (Vec3.distance(prev, curr) < minDistance) {
              // Bỏ điểm hiện tại
              i++;
              continue;
            }

            result.push(curr);
            i++;
          } // luôn giữ điểm cuối


          result.push(path[path.length - 1]);
          return result;
        }

        static getWpos(lpos, node) {
          let matrix = node.parent.getWorldMatrix();
          return Vec3.transformMat4(v3(), lpos, matrix);
        }

      }) || _class3);

      _export("cEasing", cEasing = (type, param = 2) => {
        switch (type) {
          case 'linear':
            return k => k;

          case 'smooth':
            return k => k * k * (3 - 2 * k);

          case 'fade':
            return k => k * k * k * (k * (k * 6 - 15) + 10);

          case 'constant':
            return k => k >= 1 ? 1 : 0;

          case 'quadIn':
            return k => Math.pow(k, 2);

          case 'quadOut':
            return k => 1 - Math.pow(1 - k, 2);

          case 'quadInOut':
            return k => k < 0.5 ? 2 * Math.pow(k, 2) : 1 - 2 * Math.pow(1 - k, 2);

          case 'quadOutIn':
            return k => k < 0.5 ? 1 - 2 * Math.pow(1 - 2 * k, 2) : 2 * Math.pow(2 * k - 1, 2);

          case 'cubicIn':
            return k => Math.pow(k, 3);

          case 'cubicOut':
            return k => 1 - Math.pow(1 - k, 3);

          case 'cubicInOut':
            return k => k < 0.5 ? 4 * Math.pow(k, 3) : 1 - 4 * Math.pow(1 - k, 3);

          case 'cubicOutIn':
            return k => k < 0.5 ? 1 - 4 * Math.pow(1 - 2 * k, 3) : 4 * Math.pow(2 * k - 1, 3);

          case 'quartIn':
            return k => Math.pow(k, 4);

          case 'quartOut':
            return k => 1 - Math.pow(1 - k, 4);

          case 'quartInOut':
            return k => k < 0.5 ? 8 * Math.pow(k, 4) : 1 - 8 * Math.pow(1 - k, 4);

          case 'quartOutIn':
            return k => k < 0.5 ? 1 - 8 * Math.pow(1 - 2 * k, 4) : 8 * Math.pow(2 * k - 1, 4);

          case 'quintIn':
            return k => Math.pow(k, 5);

          case 'quintOut':
            return k => 1 - Math.pow(1 - k, 5);

          case 'quintInOut':
            return k => k < 0.5 ? 16 * Math.pow(k, 5) : 1 - 16 * Math.pow(1 - k, 5);

          case 'quintOutIn':
            return k => k < 0.5 ? 1 - 16 * Math.pow(1 - 2 * k, 5) : 16 * Math.pow(2 * k - 1, 5);

          case 'sineIn':
            return k => 1 - Math.cos(k * Math.PI / 2);

          case 'sineOut':
            return k => Math.sin(k * Math.PI / 2);

          case 'sineInOut':
            return k => -(Math.cos(Math.PI * k) - 1) / 2;

          case 'sineOutIn':
            return k => k < 0.5 ? Math.sin(Math.PI * k) / 2 : 1 - Math.sin(Math.PI * (k - 0.5)) / 2;

          case 'expoIn':
            return k => k === 0 ? 0 : Math.pow(2, 10 * (k - 1));

          case 'expoOut':
            return k => k === 1 ? 1 : 1 - Math.pow(2, -10 * k);

          case 'expoInOut':
            return k => k === 0 ? 0 : k === 1 ? 1 : k < 0.5 ? Math.pow(2, 20 * k - 10) / 2 : (2 - Math.pow(2, -20 * k + 10)) / 2;

          case 'expoOutIn':
            return k => k < 0.5 ? (1 - Math.pow(2, -20 * k)) / 2 : (Math.pow(2, 20 * k - 10) + 1) / 2;

          case 'circIn':
            return k => 1 - Math.sqrt(1 - Math.pow(k, 2));

          case 'circOut':
            return k => Math.sqrt(1 - Math.pow(k - 1, 2));

          case 'circInOut':
            return k => k < 0.5 ? (1 - Math.sqrt(1 - 4 * Math.pow(k, 2))) / 2 : (Math.sqrt(1 - 4 * Math.pow(k - 1, 2)) + 1) / 2;

          case 'circOutIn':
            return k => k < 0.5 ? Math.sqrt(1 - Math.pow(2 * k - 1, 2)) / 2 : (2 - Math.sqrt(1 - Math.pow(2 * k - 1, 2))) / 2;

          case 'elasticIn':
            return k => {
              const p = param / 10; // period

              const a = 1; // amplitude

              return k === 0 ? 0 : k === 1 ? 1 : -a * Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1 - p / 4) * (2 * Math.PI) / p);
            };

          case 'elasticOut':
            return k => {
              const p = param / 10;
              const a = 1;
              return k === 0 ? 0 : k === 1 ? 1 : a * Math.pow(2, -10 * k) * Math.sin((k - p / 4) * (2 * Math.PI) / p) + 1;
            };

          case 'elasticInOut':
            return k => {
              const p = param / 10;
              const a = 1;
              if (k === 0) return 0;
              if (k === 1) return 1;
              if (k < 0.5) return -0.5 * a * Math.pow(2, 20 * k - 10) * Math.sin((20 * k - 11.125) * (2 * Math.PI) / p);
              return 0.5 * a * Math.pow(2, -20 * k + 10) * Math.sin((20 * k - 11.125) * (2 * Math.PI) / p) + 1;
            };

          case 'elasticOutIn':
            return k => k < 0.5 ? cEasing('elasticOut')(2 * k) / 2 : cEasing('elasticIn')(2 * k - 1) / 2 + 0.5;

          case 'backIn':
            return k => k * k * ((param + 1) * k - param);

          case 'backOut':
            return k => {
              const s = param;
              return 1 + (k - 1) * (k - 1) * ((s + 1) * (k - 1) + s);
            };

          case 'backInOut':
            return k => {
              const s = param;
              if (k < 0.5) return 2 * k * k * ((s + 1) * 2 * k - s);
              return 1 + 2 * (k - 1) * (k - 1) * ((s + 1) * (k - 1) + s);
            };

          case 'backOutIn':
            return k => k < 0.5 ? cEasing('backOut')(2 * k) / 2 : cEasing('backIn')(2 * k - 1) / 2 + 0.5;

          case 'bounceIn':
            return k => {
              const bounceFactor = Math.max(0.00001, param);
              return 1 - cEasing('bounceOut', bounceFactor)(1 - k);
            };

          case 'bounceOut':
            return k => {
              if (k <= 0) return 0;
              if (k >= 1) return 1;
              const bounceFactor = Math.max(1, Math.round(param));
              let adjustedK = k * bounceFactor;
              if (adjustedK >= 1) return 1;
              if (adjustedK < 1 / 2.75) return 7.5625 * adjustedK * adjustedK;
              if (adjustedK < 2 / 2.75) return 7.5625 * (adjustedK -= 1.5 / 2.75) * adjustedK + 0.75;
              if (adjustedK < 2.5 / 2.75) return 7.5625 * (adjustedK -= 2.25 / 2.75) * adjustedK + 0.9375;
              return 7.5625 * (adjustedK -= 2.625 / 2.75) * adjustedK + 0.984375;
            };

          case 'bounceInOut':
            return k => k < 0.5 ? cEasing('bounceIn')(2 * k) / 2 : cEasing('bounceOut')(2 * k - 1) / 2 + 0.5;

          case 'bounceOutIn':
            return k => k < 0.5 ? cEasing('bounceOut')(2 * k) / 2 : cEasing('bounceIn')(2 * k - 1) / 2 + 0.5;

          default:
            return k => k;
        }
      });

      _export("Zoom", Zoom = (_dec = property(Node), (_class = class Zoom {
        constructor() {
          this.startPos = null;
          this.s1 = null;
          this.s2 = null;
          this.location = null;

          _initializerDefineProperty(this, "thingNode", _descriptor, this);

          this.maxScale = 3;
          this.maxMoveX = 1000;
          this.maxMoveY = 1000;
        }

        binding() {
          if (!(_crd && pc === void 0 ? (_reportPossibleCrUseOfpc({
            error: Error()
          }), pc) : pc)) return;
          (_crd && pc === void 0 ? (_reportPossibleCrUseOfpc({
            error: Error()
          }), pc) : pc).bindingStart = this.onTouchStart.bind(this);
          (_crd && pc === void 0 ? (_reportPossibleCrUseOfpc({
            error: Error()
          }), pc) : pc).bindingMove = this.onTouchMove.bind(this);
          (_crd && pc === void 0 ? (_reportPossibleCrUseOfpc({
            error: Error()
          }), pc) : pc).bindingEnd = this.onTouchEnd.bind(this);
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

          this.startPos = v3(this.location.x, this.location.y, 0);
        }

        zoomBy(delta) {
          let scale = this.thingNode.scale.x;
          scale += delta;
          scale = misc.clampf(scale, 0.5, this.maxScale);
          this.thingNode.scale = v3(scale, scale, scale);
          (_crd && ui === void 0 ? (_reportPossibleCrUseOfui({
            error: Error()
          }), ui) : ui).keepTap();
        }

        onTouchMove(event) {
          if (!event) return;
          let touches = event.getTouches();

          if (this.s1 && this.s2 && touches.length >= 2) {
            let e1 = touches[0].getUILocation();
            let e2 = touches[1].getUILocation();
            let sDis = this.s2.clone().subtract(this.s1).length();
            let eDis = e2.clone().subtract(e1).length();
            let scale = eDis - sDis;
            this.s1 = e1.clone();
            this.s2 = e2.clone();
            console.log(scale);
            this.zoomBy(scale / 2000);
            return;
          }

          if (!this.startPos) return;
          let delta = event.getUIDelta();
          this.thingNode.worldPosition = this.thingNode.getWorldPosition().add3f(delta.x, delta.y, 0);
          let tp = this.thingNode.position.clone();
          let maxX = this.thingNode.scale.x * this.maxMoveX;
          let maxY = this.thingNode.scale.y * this.maxMoveY;
          tp.x = misc.clampf(tp.x, -maxX, maxX);
          tp.y = misc.clampf(tp.y, -maxY, maxY);
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
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class.prototype, "thingNode", [_dec], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class)));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=f0712e263f1e03b9e19040d662665a0763a32181.js.map