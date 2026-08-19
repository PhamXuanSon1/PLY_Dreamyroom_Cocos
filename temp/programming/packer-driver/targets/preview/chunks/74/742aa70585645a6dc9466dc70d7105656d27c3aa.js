System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, Sprite, SpriteFrame, Vec3, _decorator, resources, v2, v3, _class, _crd, ccclass, property, Ulis, cEasing;

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      Sprite = _cc.Sprite;
      SpriteFrame = _cc.SpriteFrame;
      Vec3 = _cc.Vec3;
      _decorator = _cc._decorator;
      resources = _cc.resources;
      v2 = _cc.v2;
      v3 = _cc.v3;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "5e9caFwzoRBv76WtzKYnUCq", "Ulis", undefined); // Learn TypeScript:
      //  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
      // Learn Attribute:
      //  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
      // Learn life-cycle callbacks:
      //  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html


      __checkObsolete__(['Node', 'Sprite', 'SpriteFrame', 'TweenEasing', 'Vec2', 'Vec3', '_decorator', 'resources', 'v2', 'v3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("default", Ulis = ccclass(_class = class Ulis {
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

        static allNode(node, callback) {
          if (callback === void 0) {
            callback = () => {};
          }

          callback(node);
          node.children.forEach(child => {
            this.allNode(child, callback);
          });
        }

        static eulerAngleOfAPoint(point) {
          var y = Math.atan2(point.x, point.z);
          var x = -Math.atan2(point.y, Math.sqrt(point.x * point.x + point.z * point.z));
          var z = Math.atan2(point.y, point.x);
          z = 0; // WorldControll.ins.ui.log(x*180/Math.PI + "")

          return v3(x, y, z).multiplyScalar(180 / Math.PI);
        }

        static lastChildOf(node, index, last) {
          if (index === void 0) {
            index = 99;
          }

          if (last === void 0) {
            last = 0;
          }

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
          var parenrNames = [];

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
          var des = node.getWorldPosition();
          var rot = node.getWorldRotation();
          var scale = node.getWorldScale();
          node.parent = parent;
          node.setWorldPosition(des);
          node.setWorldRotation(rot);
          node.setWorldScale(scale);
        }

        static shuffleArray(array, indices) {
          if (indices === void 0) {
            indices = [];
          }

          // Lấy độ dài của mảng
          var n = array.length; // Thực hiện xáo trộn theo thuật toán Fisher-Yates

          for (var i = n - 1; i > 0; i--) {
            // Chọn một chỉ số ngẫu nhiên từ 0 đến i
            var j = 0;

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
          // Lerp thẳng
          var linear = new Vec3();
          Vec3.lerp(linear, A, B, t); // Hệ số đường cong (0 ở đầu/cuối, max ở giữa)

          var curve = 1 - Math.pow((t - peak) / peak, 2); // Hướng lên

          var offset = new Vec3(0, curve * height, 0);
          return linear.add(offset);
        }

      }) || _class);

      _export("cEasing", cEasing = function cEasing(type, param) {
        if (param === void 0) {
          param = 2;
        }

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
              var p = param / 10; // period

              var a = 1; // amplitude

              return k === 0 ? 0 : k === 1 ? 1 : -a * Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1 - p / 4) * (2 * Math.PI) / p);
            };

          case 'elasticOut':
            return k => {
              var p = param / 10;
              var a = 1;
              return k === 0 ? 0 : k === 1 ? 1 : a * Math.pow(2, -10 * k) * Math.sin((k - p / 4) * (2 * Math.PI) / p) + 1;
            };

          case 'elasticInOut':
            return k => {
              var p = param / 10;
              var a = 1;
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
              var s = param;
              return 1 + (k - 1) * (k - 1) * ((s + 1) * (k - 1) + s);
            };

          case 'backInOut':
            return k => {
              var s = param;
              if (k < 0.5) return 2 * k * k * ((s + 1) * 2 * k - s);
              return 1 + 2 * (k - 1) * (k - 1) * ((s + 1) * (k - 1) + s);
            };

          case 'backOutIn':
            return k => k < 0.5 ? cEasing('backOut')(2 * k) / 2 : cEasing('backIn')(2 * k - 1) / 2 + 0.5;

          case 'bounceIn':
            return k => 1 - cEasing('bounceOut')(1 - k);

          case 'bounceOut':
            return k => {
              if (k < 1 / 2.75) return 7.5625 * k * k;
              if (k < 2 / 2.75) return 7.5625 * (k -= 1.5 / 2.75) * k + 0.75;
              if (k < 2.5 / 2.75) return 7.5625 * (k -= 2.25 / 2.75) * k + 0.9375;
              return 7.5625 * (k -= 2.625 / 2.75) * k + 0.984375;
            };

          case 'bounceInOut':
            return k => k < 0.5 ? cEasing('bounceIn')(2 * k) / 2 : cEasing('bounceOut')(2 * k - 1) / 2 + 0.5;

          case 'bounceOutIn':
            return k => k < 0.5 ? cEasing('bounceOut')(2 * k) / 2 : cEasing('bounceIn')(2 * k - 1) / 2 + 0.5;

          default:
            return k => k;
        }
      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=742aa70585645a6dc9466dc70d7105656d27c3aa.js.map