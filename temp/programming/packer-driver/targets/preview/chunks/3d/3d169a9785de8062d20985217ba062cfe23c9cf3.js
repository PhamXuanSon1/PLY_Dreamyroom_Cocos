System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, Yielders, _crd;

  _export("Yielders", void 0);

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "7c1dfrt1cJCuohePr/lOJH4", "Yielders", undefined);

      /**
       * Tien ich Yielders - ho tro cho/cho doi trong Cocos Creator.
       * 
       * Chuyen doi tu class Yielders static cua Unity (dung de cache doi tuong WaitForSeconds).
       * 
       * Trong Unity, Yielders cache WaitForSeconds/WaitForEndOfFrame/WaitForFixedUpdate
       * de tranh cap phat bo nho (GC) trong coroutines.
       * 
       * Trong Cocos Creator khong co coroutine voi yield. Thay vao do, ta cung cap
       * cac tien ich cho doi dua tren Promise va cac ham ho tro schedule.
       * 
       * Cach dung:
       *   await Yielders.wait(1.5);           // Cho 1.5 giay
       *   await Yielders.waitFrame();         // Cho den frame tiep theo
       *   await Yielders.waitFrames(5);       // Cho 5 frame
       *   
       *   // Hoac dung voi schedule cua Component:
       *   this.scheduleOnce(() => { ... }, Yielders.getSeconds(1.5));
       */
      _export("Yielders", Yielders = class Yielders {
        /**
         * Tra ve mot Promise hoan thanh sau so giay truyen vao.
         * Tuong duong voi `yield return new WaitForSeconds(seconds)` trong Unity.
         * @param seconds - Thoi gian cho (giay)
         */
        static wait(seconds) {
          return new Promise(resolve => {
            setTimeout(() => resolve(), seconds * 1000);
          });
        }
        /**
         * Tra ve mot Promise hoan thanh vao frame tiep theo.
         * Tuong duong voi `yield return null` hoac `yield return new WaitForEndOfFrame()` trong Unity.
         */


        static waitFrame() {
          return new Promise(resolve => {
            requestAnimationFrame(() => resolve());
          });
        }
        /**
         * Tra ve mot Promise hoan thanh sau mot so frame nhat dinh.
         * @param frameCount - So frame can cho
         */


        static waitFrames(frameCount) {
          return new Promise(resolve => {
            var count = 0;

            var step = () => {
              count++;

              if (count >= frameCount) {
                resolve();
              } else {
                requestAnimationFrame(step);
              }
            };

            requestAnimationFrame(step);
          });
        }
        /**
         * Lay gia tri giay (ham giu nguyen de tuong thich API).
         * Trong Unity, ham nay tra ve doi tuong WaitForSeconds duoc cache.
         * Trong Cocos, chi can dung truc tiep so giay voi schedule/scheduleOnce.
         * @param seconds - Thoi gian tinh bang giay
         * @returns Chinh gia tri giay do
         */


        static getSeconds(seconds) {
          return seconds;
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=3d169a9785de8062d20985217ba062cfe23c9cf3.js.map