System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, H5Playable, _crd, playableHelper;

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "0f9c24Uc7hDZbAYryi/m90r", "h5-helper", undefined);

      H5Playable = class H5Playable {
        redirect() {
          //@ts-ignore
          if (typeof redirectStore !== "undefined") redirectStore();
        }
        /**
         * Game start method for Mintegral channel.
         */


        gameStart() {
          //@ts-ignore
          if (typeof onGameReady !== "undefined") onGameReady(); //@ts-ignore

          if (typeof startGame !== "undefined") startGame();
        }
        /**
         * Game end method when game is over, adapt for Mintegral channel.
         */


        gameEnd() {
          //@ts-ignore
          if (typeof onGameEnd !== "undefined") onGameEnd();
        }
        /**
         * Set store url for redirect store action when user tap on CTA button.
         * Needed channel: Unity, Google
         * @param iosUrl: string
         * @param androidUrl: string
         */


        setStoreUrl(iosUrl, androidUrl) {
          //@ts-ignore
          if (typeof setStoreUrl !== "undefined") setStoreUrl(iosUrl, androidUrl);
        }

      };
      playableHelper = new H5Playable();

      _export("default", playableHelper);

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=7329df92a8029c8f3e41ec959c48c1e6f578e6c1.js.map