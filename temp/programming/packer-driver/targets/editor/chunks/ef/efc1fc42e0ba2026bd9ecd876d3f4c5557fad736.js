System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, playableHelper, _dec, _class, _crd, ccclass, property, GameController;

  function _reportPossibleCrUseOfplayableHelper(extras) {
    _reporterNs.report("playableHelper", "./h5-helper", _context.meta, extras);
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
    }, function (_unresolved_2) {
      playableHelper = _unresolved_2.default;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "14a54yg4SpJCpSKdU2xV1AD", "GameController", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("GameController", GameController = (_dec = ccclass("GameController"), _dec(_class = class GameController extends Component {
        // <!--https://play.google.com/store/apps/details?id=com.abi.packingdom
        // -->
        // <!--https://apps.apple.com/us/app/packingdom/id6760441822
        // -->
        start() {
          (_crd && playableHelper === void 0 ? (_reportPossibleCrUseOfplayableHelper({
            error: Error()
          }), playableHelper) : playableHelper).gameStart();
          const androidUrl = "https://play.google.com/store/apps/details?id=com.abi.packingdom";
          const iosUrl = "https://apps.apple.com/us/app/packingdom/id6760441822";
          (_crd && playableHelper === void 0 ? (_reportPossibleCrUseOfplayableHelper({
            error: Error()
          }), playableHelper) : playableHelper).setStoreUrl(iosUrl, androidUrl); // this section only needs for Google and Unity channel
        }

        update(deltaTime) {}

        redirectToStore() {
          (_crd && playableHelper === void 0 ? (_reportPossibleCrUseOfplayableHelper({
            error: Error()
          }), playableHelper) : playableHelper).gameEnd();
          (_crd && playableHelper === void 0 ? (_reportPossibleCrUseOfplayableHelper({
            error: Error()
          }), playableHelper) : playableHelper).redirect();
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=efc1fc42e0ba2026bd9ecd876d3f4c5557fad736.js.map