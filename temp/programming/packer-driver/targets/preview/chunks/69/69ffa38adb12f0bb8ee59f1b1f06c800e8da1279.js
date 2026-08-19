System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Material, Mesh, resources, _dec, _class, _class2, _crd, ccclass, property, AssetsManagerCustom, MeshInfos, MaterialInfos;

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

  function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Material = _cc.Material;
      Mesh = _cc.Mesh;
      resources = _cc.resources;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "3a3a1QhZDxB8IB30MnjfdHd", "AssetsManagerCustom", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Material', 'Mesh', 'Node', 'resources']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("AssetsManagerCustom", AssetsManagerCustom = (_dec = ccclass("AssetsManager"), _dec(_class = (_class2 = class AssetsManagerCustom extends Component {
        constructor() {
          super(...arguments);
          this.assetInfos = new Map();
        }

        static get ins() {
          if (!this.instance) {
            this.instance = new AssetsManagerCustom();
          }

          return this.instance;
        }

        loadAssetsAsync(path, type) {
          return _asyncToGenerator(function* () {
            return new Promise((resolve, reject) => {
              resources.loadDir(path, type, (err, assets) => {
                if (err) {
                  reject(err);
                  return;
                }

                resolve(assets);
              });
            });
          })();
        }

        loadModelsAndMaterials() {
          var _this = this;

          return _asyncToGenerator(function* () {
            try {
              // Tải toàn bộ tài nguyên trong thư mục Models
              var meshes = yield _this.loadAssetsAsync("8.Models", Mesh);
              meshes.forEach(asset => {
                var _MeshInfos$find;

                var path = (_MeshInfos$find = MeshInfos.find(info => asset._uuid === info.uuid)) == null ? void 0 : _MeshInfos$find.path;

                _this.assetInfos.set(path, asset);
              });
              var materials = yield _this.loadAssetsAsync("8.Models", Material);
              materials.forEach(asset => {
                var _MaterialInfos$find;

                var path = (_MaterialInfos$find = MaterialInfos.find(info => asset._uuid === info.uuid)) == null ? void 0 : _MaterialInfos$find.path;

                _this.assetInfos.set(path, asset);
              });
            } catch (err) {
              console.error("Failed to load assets:", err);
            }
          })();
        }

        onLoad() {
          var _this2 = this;

          return _asyncToGenerator(function* () {
            AssetsManagerCustom.instance = _this2; // const mesh = resources.getDirWithPath("8.Models", Mesh).map((asset) => {
            //   return {
            //     path: asset.path,
            //     uuid: asset.uuid,
            //   };
            // });
            // console.log(JSON.stringify(mesh));
            // const mat = resources.getDirWithPath("8.Models", Material).map((asset) => {
            //   return {
            //     path: asset.path,
            //     uuid: asset.uuid,
            //   };
            // });
            // console.log(JSON.stringify(mat));

            yield _this2.loadModelsAndMaterials();
          })();
        }

        start() {}

        update(deltaTime) {}

      }, _class2.instance = null, _class2)) || _class));

      _export("MeshInfos", MeshInfos = [// {
        //   path: "8.Models/Models/Zipper/Mesh_1",
        //   uuid: "a31ea442-5c73-4de6-9873-55c0436f9177@c2cb8",
        // },
        // {
        //   path: "8.Models/Models/Zipper/Mesh_2",
        //   uuid: "a31ea442-5c73-4de6-9873-55c0436f9177@2fb5d",
        // },
        // {
        //   path: "8.Models/Models/Zipper/Mesh_0",
        //   uuid: "a31ea442-5c73-4de6-9873-55c0436f9177@ef8a8",
        // },
      ]);

      MaterialInfos = [// {
        //   path: "8.Models/Mats/Bag/Bag",
        //   uuid: "939b09d1-f57f-4fbb-8626-22ec8b64a95e",
        // },
        // {
        //   path: "8.Models/Mats/Handle/Handle",
        //   uuid: "d40a9527-3e43-4667-aa8d-cf50d70c7592",
        // },
        // {
        //   path: "8.Models/Mats/Tail/Tail-001",
        //   uuid: "50007675-404e-4c67-b0ee-26d6e9211eca",
        // },
        // {
        //   path: "8.Models/Mats/Tail/Tail",
        //   uuid: "64a2efed-5ecb-4545-8b9b-bb51114a49b6",
        // },
        // {
        //   path: "8.Models/Mats/Tooth/Tooth-001",
        //   uuid: "839accda-e64c-4514-ad27-0dbd4152d542",
        // },
        // {
        //   path: "8.Models/Mats/Tooth/Tooth",
        //   uuid: "dd7a0e68-e913-44e5-b91d-9b24629d319d",
        // },
        // {
        //   path: "8.Models/Mats/Bag/Bag-001",
        //   uuid: "cf85cbed-d482-4a1f-bcf7-fc30bf23ae73",
        // },
        // {
        //   path: "8.Models/Mats/Bag/Bag-002",
        //   uuid: "7b330212-a75f-4e5f-adb4-b0c745db526d",
        // },
        // {
        //   path: "8.Models/Mats/Handle/Handle-001",
        //   uuid: "ce1358ec-ecca-4ec3-9b61-fb7107baf8bb",
        // },
        // {
        //   path: "8.Models/Mats/Handle/Handle-002",
        //   uuid: "1ba2770d-f4b0-4ed3-b827-1c9a3243cc04",
        // },
      ];

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=69ffa38adb12f0bb8ee59f1b1f06c800e8da1279.js.map