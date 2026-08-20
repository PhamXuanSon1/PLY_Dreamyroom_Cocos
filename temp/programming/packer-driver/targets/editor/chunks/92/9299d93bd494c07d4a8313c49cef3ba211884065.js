System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, ComponentCache, _crd;

  _export("ComponentCache", void 0);

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "3c7a2CTA+JDBrJ9UvzZ320C", "ComponentCache", undefined);

      /**
       * Tien ich cache component.
       * Chuyen doi tu static generic ComponentCache<T> cua Unity.
       * 
       * Trong Unity, lop nay cache cac component qua Transform de tranh goi GetComponent nhieu lan.
       * Trong Cocos Creator, getComponent() cung kha ton chi phi, nen viec cache van rat co ich.
       * 
       * Cach dung:
       *   const cache = new ComponentCache<MyComponent>(MyComponent);
       *   const comp = cache.get(someNode);
       *   cache.clearCache();
       * 
       * Luu y: Vi TypeScript khong ho tro static generic giong C#,
       * lop nay duoc cai dat duoi dang mot class generic co the khoi tao (instance) cho moi loai component.
       */
      __checkObsolete__(['Component', 'Node']);

      _export("ComponentCache", ComponentCache = class ComponentCache {
        constructor(componentType) {
          this.cache = new Map();
          this.componentType = void 0;
          this.componentType = componentType;
        }
        /**
         * Lay component tu cache, hoac tim va luu vao cache neu chua co.
         * @param node - Node can lay component
         * @returns Component duoc cache, hoac null neu khong tim thay
         */


        get(node) {
          var _this$cache$get;

          if (!this.cache.has(node)) {
            const component = node.getComponent(this.componentType);
            this.cache.set(node, component);
          }

          return (_this$cache$get = this.cache.get(node)) != null ? _this$cache$get : null;
        }
        /**
         * Xoa toan bo du lieu trong cache.
         */


        clearCache() {
          this.cache.clear();
        }

      });

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=9299d93bd494c07d4a8313c49cef3ba211884065.js.map