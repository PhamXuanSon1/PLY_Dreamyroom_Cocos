System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, _dec, _class, _crd, ccclass, property, Ply_GameUnit;

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "fa720sSAPdPUqE+k8J06O3J", "Ply_GameUnit", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node']);

      ({
        ccclass,
        property
      } = _decorator);
      /**
       * Lop co ban cho cac game unit (doi tuong dung trong pool).
       * Tuong duong voi Ply_GameUnit : MonoBehaviour trong Unity.
       * 
       * Trong Unity, `tf` la transform duoc cache.
       * Trong Cocos, moi Component deu co san `this.node` tuong duong.
       */

      _export("Ply_GameUnit", Ply_GameUnit = (_dec = ccclass('Ply_GameUnit'), _dec(_class = class Ply_GameUnit extends Component {
        /**
         * Tham chieu toi node cua unit nay (tuong duong Transform `tf` trong Unity).
         * Trong Cocos, `this.node` luon co san, nhung ta giu getter nay
         * de tuong thich voi code dung `gameUnit.tf`.
         */
        get tf() {
          return this.node;
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=e62c205ed6c8ff88cfb1f19c80fcafc951c403e3.js.map