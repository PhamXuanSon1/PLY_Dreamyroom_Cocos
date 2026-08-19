System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, tween, Tween, TweenUtil, _crd;

  _export("TweenUtil", void 0);

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      tween = _cc.tween;
      Tween = _cc.Tween;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "8ba734RfRJHp7O7nZEXNY4a", "TweenUtil", undefined);
      /**
       * TweenUtil — thay DOTween.
       *
       * Ba thứ Cocos KHÔNG có sẵn mà bản Unity phụ thuộc:
       *   - DOJump              -> jumpTo()      (quỹ đạo parabol)
       *   - DOTween.IsTweening  -> isTweening()  (WorldScrollManager dùng để bỏ qua
       *                                           item đang animate; thiếu là item giật)
       *   - DOTween.To          -> valueTo()
       *
       * Xem COCOS_MIGRATION_PLAN.md mục 4.6.
       */


      __checkObsolete__(['Node', 'Vec3', 'tween', 'Tween', 'Component']);

      _export("TweenUtil", TweenUtil = class TweenUtil {
        static isTweening(node) {
          var _TweenUtil$running$ge;

          return ((_TweenUtil$running$ge = TweenUtil.running.get(node)) != null ? _TweenUtil$running$ge : 0) > 0;
        }

        static mark(node) {
          var _TweenUtil$running$ge2;

          TweenUtil.running.set(node, ((_TweenUtil$running$ge2 = TweenUtil.running.get(node)) != null ? _TweenUtil$running$ge2 : 0) + 1);
        }

        static unmark(node) {
          var _TweenUtil$running$ge3;

          var n = ((_TweenUtil$running$ge3 = TweenUtil.running.get(node)) != null ? _TweenUtil$running$ge3 : 1) - 1;
          if (n <= 0) TweenUtil.running.delete(node);else TweenUtil.running.set(node, n);
        }
        /** Thay transform.DOKill() */


        static killAll(node) {
          Tween.stopAllByTarget(node);
          TweenUtil.running.delete(node);
        } // ---------------------------------------------------------------- move


        static moveTo(node, worldPos, duration, easing, onComplete) {
          if (easing === void 0) {
            easing = 'quadOut';
          }

          TweenUtil.mark(node);
          tween(node).to(duration, {
            worldPosition: worldPos.clone()
          }, {
            easing: easing
          }).call(() => {
            TweenUtil.unmark(node);
            onComplete == null ? void 0 : onComplete();
          }).start();
        }
        /**
         * Thay DOJump(pos, power, numJumps, duration).
         * Cocos không có sẵn nên tự dựng: X/Y nội suy tuyến tính, cộng thêm parabol theo Y.
         */


        static jumpTo(node, worldPos, height, jumps, duration, easing, onComplete) {
          if (easing === void 0) {
            easing = 'backOut';
          }

          var from = node.worldPosition.clone();
          var to = worldPos.clone();
          var state = {
            t: 0
          };
          TweenUtil.mark(node);
          tween(state).to(duration, {
            t: 1
          }, {
            easing: easing,
            onUpdate: () => {
              if (!node.isValid) return;
              var t = state.t;
              var x = from.x + (to.x - from.x) * t;
              var y = from.y + (to.y - from.y) * t; // parabol 4h·t·(1-t) cho mỗi nhịp nhảy

              var n = Math.max(1, jumps);
              var local = t * n % 1;
              var arc = 4 * height * local * (1 - local);
              node.setWorldPosition(x, y + arc, from.z);
            }
          }).call(() => {
            TweenUtil.unmark(node);
            if (node.isValid) node.setWorldPosition(to);
            onComplete == null ? void 0 : onComplete();
          }).start();
        } // ---------------------------------------------------------------- scale / rotate


        static scaleTo(node, scale, duration, easing, onComplete) {
          if (easing === void 0) {
            easing = 'quadOut';
          }

          TweenUtil.mark(node);
          tween(node).to(duration, {
            scale: scale.clone()
          }, {
            easing: easing
          }).call(() => {
            TweenUtil.unmark(node);
            onComplete == null ? void 0 : onComplete();
          }).start();
        }

        static rotateTo(node, euler, duration, easing, onComplete) {
          if (easing === void 0) {
            easing = 'quadOut';
          }

          TweenUtil.mark(node);
          tween(node).to(duration, {
            eulerAngles: euler.clone()
          }, {
            easing: easing
          }).call(() => {
            TweenUtil.unmark(node);
            onComplete == null ? void 0 : onComplete();
          }).start();
        } // ---------------------------------------------------------------- giá trị / thời gian

        /** Thay DOTween.To(getter, setter, end, dur) — nội suy 0..1 rồi tự xử lý trong onUpdate. */


        static valueTo(duration, _onUpdate, easing, loop, onComplete) {
          if (easing === void 0) {
            easing = 'linear';
          }

          if (loop === void 0) {
            loop = false;
          }

          var state = {
            t: 0
          };
          var tw = tween(state).to(duration, {
            t: 1
          }, {
            easing: easing,
            onUpdate: () => _onUpdate(state.t)
          });

          if (loop) {
            tw = tween(state).repeatForever(tween(state).set({
              t: 0
            }).to(duration, {
              t: 1
            }, {
              easing: easing,
              onUpdate: () => _onUpdate(state.t)
            }));
          } else {
            tw = tw.call(() => onComplete == null ? void 0 : onComplete());
          }

          tw.start();
          return tw;
        }
        /** Thay DOVirtual.DelayedCall */


        static delayedCall(comp, delay, cb) {
          comp.scheduleOnce(cb, delay);
        }

      });

      /** Đếm số tween đang chạy trên từng node. */
      TweenUtil.running = new Map();

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=2bedb5ec720f6798c7819cf9835eb8030e7c1c8b.js.map