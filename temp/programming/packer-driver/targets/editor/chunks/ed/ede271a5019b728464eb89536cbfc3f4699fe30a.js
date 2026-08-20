System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, _dec, _class, _class2, _crd, ccclass, Ply_Singleton;

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

      _cclegacy._RF.push({}, "8ae2c9j39dPMrrHi8/eFyEN", "Ply_Singleton", undefined);

      __checkObsolete__(['_decorator', 'Component']);

      ({
        ccclass
      } = _decorator);
      /**
       * Lop Singleton co ban cho cac component trong Cocos Creator.
       * Ke thua lop nay de tao cac singleton manager.
       * 
       * Cach dung: class MyManager extends Ply_Singleton { ... }
       * Truy cap qua: MyManager.Ins
       * 
       * Luu y: TypeScript khong ho tro generic static member giong C#,
       * nen moi subclass can tu gan Ins trong onLoad cua chinh me.
       */

      _export("Ply_Singleton", Ply_Singleton = (_dec = ccclass('Ply_Singleton'), _dec(_class = (_class2 = class Ply_Singleton extends Component {
        /**
         * Ghi de phuong thuc nay trong subclass va goi super.onLoad().
         * Cac subclass nen tu gan gian tri cho bien static Ins cua minh.
         */
        onLoad() {
          const className = this.constructor.name;

          if (Ply_Singleton._instances.has(className)) {
            this.node.destroy();
            return;
          }

          Ply_Singleton._instances.set(className, this);
        }

        onDestroy() {
          const className = this.constructor.name;

          if (Ply_Singleton._instances.get(className) === this) {
            Ply_Singleton._instances.delete(className);
          }
        }

      }, _class2._instances = new Map(), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=ede271a5019b728464eb89536cbfc3f4699fe30a.js.map