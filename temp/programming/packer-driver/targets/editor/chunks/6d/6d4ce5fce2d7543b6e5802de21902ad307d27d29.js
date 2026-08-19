System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, PlayableSDK, _crd, ALEvent;

  _export("PlayableSDK", void 0);

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "96ddfRJzVpOIadxPcS59bil", "PlayableSDK", undefined);

      /**
       * PlayableSDK — wrapper tracking analytics events.
       */
      _export("ALEvent", ALEvent = /*#__PURE__*/function (ALEvent) {
        ALEvent["LOADING"] = "LOADING";
        ALEvent["LOADED"] = "LOADED";
        ALEvent["DISPLAYED"] = "DISPLAYED";
        ALEvent["CHALLENGE_STARTED"] = "CHALLENGE_STARTED";
        ALEvent["CHALLENGE_PASS_25"] = "CHALLENGE_PASS_25";
        ALEvent["CHALLENGE_PASS_50"] = "CHALLENGE_PASS_50";
        ALEvent["CHALLENGE_PASS_75"] = "CHALLENGE_PASS_75";
        ALEvent["CHALLENGE_SOLVED"] = "CHALLENGE_SOLVED";
        ALEvent["CHALLENGE_FAILED"] = "CHALLENGE_FAILED";
        ALEvent["CHALLENGE_RETRY"] = "CHALLENGE_RETRY";
        ALEvent["ENDCARD_SHOWN"] = "ENDCARD_SHOWN";
        ALEvent["CTA_CLICKED"] = "CTA_CLICKED";
        return ALEvent;
      }({}));

      _export("PlayableSDK", PlayableSDK = class PlayableSDK {
        static track(event) {
          try {
            const analytics = window.ALPlayableAnalytics;

            if (analytics && typeof analytics.trackEvent === 'function') {
              analytics.trackEvent(event);
            }
          } catch (e) {
            console.warn('[PlayableSDK] track error:', e);
          }
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=6d4ce5fce2d7543b6e5802de21902ad307d27d29.js.map