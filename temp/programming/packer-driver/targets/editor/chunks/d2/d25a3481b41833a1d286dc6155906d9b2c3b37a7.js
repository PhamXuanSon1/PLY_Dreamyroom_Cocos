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

          const n = ((_TweenUtil$running$ge3 = TweenUtil.running.get(node)) != null ? _TweenUtil$running$ge3 : 1) - 1;
          if (n <= 0) TweenUtil.running.delete(node);else TweenUtil.running.set(node, n);
        }
        /** Thay transform.DOKill() */


        static killAll(node) {
          Tween.stopAllByTarget(node);
          TweenUtil.running.delete(node);
        } // ---------------------------------------------------------------- move


        static moveTo(node, worldPos, duration, easing = 'quadOut', onComplete) {
          TweenUtil.mark(node);
          tween(node).to(duration, {
            worldPosition: worldPos.clone()
          }, {
            easing: easing
          }).call(() => {
            TweenUtil.unmark(node);
            onComplete == null || onComplete();
          }).start();
        }
        /**
         * Thay DOJump(pos, power, numJumps, duration).
         * Cocos không có sẵn nên tự dựng: X/Y nội suy tuyến tính, cộng thêm parabol theo Y.
         */


        static jumpTo(node, worldPos, height, jumps, duration, easing = 'backOut', onComplete) {
          const from = node.worldPosition.clone();
          const to = worldPos.clone();
          const state = {
            t: 0
          };
          TweenUtil.mark(node);
          tween(state).to(duration, {
            t: 1
          }, {
            easing: easing,
            onUpdate: () => {
              if (!node.isValid) return;
              const t = state.t;
              const x = from.x + (to.x - from.x) * t;
              const y = from.y + (to.y - from.y) * t; // parabol 4h·t·(1-t) cho mỗi nhịp nhảy

              const n = Math.max(1, jumps);
              const local = t * n % 1;
              const arc = 4 * height * local * (1 - local);
              node.setWorldPosition(x, y + arc, from.z);
            }
          }).call(() => {
            TweenUtil.unmark(node);
            if (node.isValid) node.setWorldPosition(to);
            onComplete == null || onComplete();
          }).start();
        } // ---------------------------------------------------------------- scale / rotate


        static scaleTo(node, scale, duration, easing = 'quadOut', onComplete) {
          TweenUtil.mark(node);
          tween(node).to(duration, {
            scale: scale.clone()
          }, {
            easing: easing
          }).call(() => {
            TweenUtil.unmark(node);
            onComplete == null || onComplete();
          }).start();
        }

        static rotateTo(node, euler, duration, easing = 'quadOut', onComplete) {
          TweenUtil.mark(node);
          tween(node).to(duration, {
            eulerAngles: euler.clone()
          }, {
            easing: easing
          }).call(() => {
            TweenUtil.unmark(node);
            onComplete == null || onComplete();
          }).start();
        } // ---------------------------------------------------------------- giá trị / thời gian

        /** Thay DOTween.To(getter, setter, end, dur) — nội suy 0..1 rồi tự xử lý trong onUpdate. */


        static valueTo(duration, onUpdate, easing = 'linear', loop = false, onComplete) {
          const state = {
            t: 0
          };
          let tw = tween(state).to(duration, {
            t: 1
          }, {
            easing: easing,
            onUpdate: () => onUpdate(state.t)
          });

          if (loop) {
            tw = tween(state).repeatForever(tween(state).set({
              t: 0
            }).to(duration, {
              t: 1
            }, {
              easing: easing,
              onUpdate: () => onUpdate(state.t)
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
//# sourceMappingURL=d25a3481b41833a1d286dc6155906d9b2c3b37a7.js.map