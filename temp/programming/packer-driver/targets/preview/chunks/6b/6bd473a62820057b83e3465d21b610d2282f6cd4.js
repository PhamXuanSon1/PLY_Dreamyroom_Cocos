System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, Director, director, AppLovinAnalytics, _crd;

  _export("AppLovinAnalytics", void 0);

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      Director = _cc.Director;
      director = _cc.director;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "c25f69FRK5NSLtUiSFQHz8k", "AppLovinAnalytics", undefined); // export enum EventName {
      //     LOADING,
      //     LOADED,
      //     DISPLAYED,
      //     CHALLENGE_STARTED,
      //     CHALLENGE_PASS_25,
      //     CHALLENGE_PASS_50,
      //     CHALLENGE_PASS_75,
      //     CHALLENGE_SOLVED,
      //     CHALLENGE_FAILED,
      //     CHALLENGE_RETRY,
      //     ENDCARD_SHOWN,
      //     CTA_CLICKED
      // }


      __checkObsolete__(['Director', 'director', 'DirectorEvent']);

      _export("AppLovinAnalytics", AppLovinAnalytics = class AppLovinAnalytics {
        static track(event) {
          var analytics = window.ALPlayableAnalytics;

          if (analytics) {
            analytics.trackEvent(event);
          }
        }

        static startLoading() {
          this.track("LOADING");
        }

        static loaded() {
          this.track("LOADED");
        }

        static displayed() {
          this.track("DISPLAYED");
        }

        static challengeStarted() {
          this.track("CHALLENGE_STARTED");
        }

        static challenge25() {
          this.track("CHALLENGE_PASS_25");
        }

        static challenge50() {
          this.track("CHALLENGE_PASS_50");
        }

        static challenge75() {
          this.track("CHALLENGE_PASS_75");
        }

        static challengeSolved() {
          this.track("CHALLENGE_SOLVED");
        }

        static challengeFailed() {
          this.track("CHALLENGE_FAILED");
        }

        static challengeRetry() {
          this.track("CHALLENGE_RETRY");
        }

        static endcardShown() {
          this.track("ENDCARD_SHOWN");
        }

        static ctaClicked() {
          this.track("CTA_CLICKED");
        }

      }); // Check start loading


      AppLovinAnalytics.startLoading();
      director.once(Director.EVENT_BEFORE_SCENE_LAUNCH, () => {
        AppLovinAnalytics.loaded();
      });
      director.on(Director.EVENT_AFTER_SCENE_LAUNCH, () => {
        AppLovinAnalytics.displayed();
      }); // Tutorial: use these methods inside game logic
      // use method: AppLovinAnalytics.startLoading(); when game start loading
      // use method: AppLovinAnalytics.loaded(); when game loaded
      // use method: AppLovinAnalytics.displayed(); when game displayed
      // use method: AppLovinAnalytics.challengeStarted(); when game start challenge
      // use method: AppLovinAnalytics.challenge25(); when challenge pass 25%
      // use method: AppLovinAnalytics.challenge50(); when challenge pass 50%
      // use method: AppLovinAnalytics.challenge75(); when challenge pass 75%
      // use method: AppLovinAnalytics.challengeSolved(); when challenge solved
      // use method: AppLovinAnalytics.challengeFailed(); when challenge failed
      // use method: AppLovinAnalytics.challengeRetry(); when challenge retry
      // use method: AppLovinAnalytics.endcardShown(); when endcard shown
      // use method: AppLovinAnalytics.ctaClicked(); when cta clicked

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=6bd473a62820057b83e3465d21b610d2282f6cd4.js.map