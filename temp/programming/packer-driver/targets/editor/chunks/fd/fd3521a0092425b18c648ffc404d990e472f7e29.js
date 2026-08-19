System.register(["cc", "cc/env"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, UITransform, Sprite, SpriteFrame, Color, Vec3, JsonAsset, resources, CCClass, js, Size, sp, assetManager, Asset, EDITOR, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _crd, ccclass, property, executeInEditMode, menu, Ed, SceneBuilder;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Node = _cc.Node;
      UITransform = _cc.UITransform;
      Sprite = _cc.Sprite;
      SpriteFrame = _cc.SpriteFrame;
      Color = _cc.Color;
      Vec3 = _cc.Vec3;
      JsonAsset = _cc.JsonAsset;
      resources = _cc.resources;
      CCClass = _cc.CCClass;
      js = _cc.js;
      Size = _cc.Size;
      sp = _cc.sp;
      assetManager = _cc.assetManager;
      Asset = _cc.Asset;
    }, function (_ccEnv) {
      EDITOR = _ccEnv.EDITOR;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "9823cYXdcdBJZFfe34uNCjU", "SceneBuilder", undefined);
      /**
       * SceneBuilder — dựng lại scene Unity trong Cocos Creator từ file JSON
       * do Tools/Cocos Export/Scene Exporter (CocosExportWindow.cs) xuất ra.
       *
       * Copy file này vào  assets/scripts/pipeline/SceneBuilder.ts
       * Xem COCOS_MIGRATION_PLAN.md mục 6 để biết schema và công thức.
       *
       * ─────────────────────────────────────────────────────────────────────────
       * DÙNG TRONG EDITOR (node nằm thật trong Hierarchy, lưu được cùng scene):
       *   1. Gán component này vào 1 node (vd "Root" dưới Canvas)
       *   2. Kéo file JSON vào ô "sceneJson"
       *   3. Tick "Build Now"  -> node hiện ra ngay trong Hierarchy
       *   4. Ctrl+S để lưu scene
       *   Tick "Clear Built" để xoá sạch và dựng lại.
       *
       * DÙNG LÚC RUNTIME (dựng khi Play):
       *   Bật "buildOnStart". Nếu đã bake node vào scene rồi thì TẮT nó đi,
       *   không thì sẽ dựng chồng lên nhau.
       * ─────────────────────────────────────────────────────────────────────────
       */


      __checkObsolete__(['_decorator', 'Component', 'Node', 'UITransform', 'Sprite', 'SpriteFrame', 'Color', 'Vec3', 'JsonAsset', 'resources', 'CCClass', 'js', 'Size', 'sp', 'assetManager', 'Asset']);

      ({
        ccclass,
        property,
        executeInEditMode,
        menu
      } = _decorator);
      /** Editor API chỉ tồn tại trong edit mode; truy cập kiểu này để khỏi vướng typing. */

      Ed = globalThis.Editor; // ---------------------------------------------------------------- types

      // Không có Units runtime: exporter đã quy đổi mọi khoảng cách sang pixel
      // (pos, contentSize, snapDistance...). K chỉ còn dùng lúc dựng, xem buildK.
      // ---------------------------------------------------------------- builder
      _export("SceneBuilder", SceneBuilder = (_dec = ccclass('SceneBuilder'), _dec2 = executeInEditMode(true), _dec3 = menu('Pipeline/SceneBuilder'), _dec4 = property({
        type: JsonAsset,
        tooltip: 'File JSON do CocosExportWindow xuất ra'
      }), _dec5 = property({
        type: Asset,
        tooltip: 'Kéo thả trực tiếp Folder chứa Sprite từ panel Assets vào đây (hoặc gõ ở ô Sprite Dir)'
      }), _dec6 = property({
        tooltip: 'Thư mục chứa sprite nếu không kéo folder (vd: 3.Sprites/Sprites2 hoặc art/PLY29_Level34/sprites)'
      }), _dec7 = property({
        tooltip: 'Sắp xếp siblingIndex theo sortingOrder của Unity'
      }), _dec8 = property({
        tooltip: 'In cảnh báo chi tiết ra console'
      }), _dec9 = property({
        tooltip: 'Tự dựng khi Play. TẮT nếu đã bake node vào scene, không thì dựng chồng.'
      }), _dec10 = property({
        tooltip: 'Tick để dựng node ngay trong Editor. Xong nhớ Ctrl+S lưu scene.'
      }), _dec11 = property({
        tooltip: 'Tick để xoá sạch node đã dựng dưới node này.'
      }), _dec(_class = _dec2(_class = _dec3(_class = (_class2 = class SceneBuilder extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "sceneJson", _descriptor, this);

          _initializerDefineProperty(this, "spriteFolder", _descriptor2, this);

          _initializerDefineProperty(this, "spriteDir", _descriptor3, this);

          _initializerDefineProperty(this, "applySorting", _descriptor4, this);

          _initializerDefineProperty(this, "verbose", _descriptor5, this);

          _initializerDefineProperty(this, "buildOnStart", _descriptor6, this);

          /** path → Node, dùng cho pass 2 và cho code gameplay tra cứu */
          this.nodeMap = new Map();

          /** K của lần build hiện tại — chỉ dùng để tính contentSize từ nativeSize/ppu. */
          this.buildK = 100;
          this.frames = new Map();
          this.orderOf = new Map();
        }

        // ---- nút bấm trong Inspector (checkbox tự nhả ra) ----
        get buildNow() {
          return false;
        }

        set buildNow(v) {
          if (v) void this.build();
        }

        get clearBuilt() {
          return false;
        }

        set clearBuilt(v) {
          if (v) this.clear();
        }

        start() {
          if (!EDITOR && this.buildOnStart) void this.build();
        }

        getCleanSpriteDir() {
          let dir = (this.spriteDir || '').trim().replace(/\\/g, '/');
          dir = dir.replace(/^\/+|\/+$/g, '');
          return dir;
        } // ------------------------------------------------------------ main


        async build() {
          var _data$meta$K, _data$meta, _data$conflicts;

          if (!this.sceneJson) {
            console.error('[SceneBuilder] Chưa gán sceneJson');
            return;
          }

          const data = this.sceneJson.json;
          this.clear();
          this.buildK = (_data$meta$K = (_data$meta = data.meta) == null ? void 0 : _data$meta.K) != null ? _data$meta$K : 100;
          await this.loadSpriteFrames();

          for (const n of data.nodes) this.createNode(n); // pass 1 — cây + sprite


          if (this.applySorting) this.sortSiblings(); // pass 1.5 — siblingIndex

          for (const n of data.nodes) this.attachComponents(n); // pass 2 — component + @node:


          for (const n of data.nodes) {
            // pass 3 — active
            const node = this.nodeMap.get(n.path);
            if (node) node.active = n.active;
          }

          console.log(`[SceneBuilder] Dựng xong "${data.meta.scene}"` + `${data.meta.exportRoot ? ` (nhánh ${data.meta.exportRoot})` : ''}` + `: ${this.nodeMap.size} node, K=${this.buildK}`);

          if ((_data$conflicts = data.conflicts) != null && _data$conflicts.length) {
            console.warn(`[SceneBuilder] ${data.conflicts.length} cặp xung đột sortingOrder — kiểm tra bằng mắt:`);

            for (const c of data.conflicts.slice(0, 20)) {
              console.warn(`   [${c.rangeA}] ${c.a}\n      x [${c.rangeB}] ${c.b}`);
            }
          }

          if (EDITOR) {
            console.log('[SceneBuilder] Đang ở Editor — nhấn Ctrl+S để lưu node vào scene.');

            try {
              var _Ed$Message;

              Ed == null ? void 0 : (_Ed$Message = Ed.Message) == null ? void 0 : _Ed$Message.send('scene', 'snapshot');
            } catch {
              /* để Ctrl+Z được */
            }
          }
        }
        /** Xoá sạch node con đã dựng. */


        clear() {
          for (const c of [...this.node.children]) c.destroy();

          this.node.removeAllChildren();
          this.nodeMap.clear();
          this.orderOf.clear();
        } // ------------------------------------------------------------ nạp SpriteFrame


        loadSpriteFrames() {
          return EDITOR ? this.loadFramesFromAssetDb() : this.loadFramesFromResources();
        }
        /** Runtime: resources bundle. */


        loadFramesFromResources() {
          return new Promise(resolve => {
            let dir = this.getCleanSpriteDir();
            if (dir.startsWith('assets/resources/')) dir = dir.substring('assets/resources/'.length);else if (dir.startsWith('resources/')) dir = dir.substring('resources/'.length);
            resources.loadDir(dir, SpriteFrame, (err, assets) => {
              if (err) {
                console.error('[SceneBuilder] Lỗi load sprite:', err);
                resolve();
                return;
              }

              this.frames.clear();

              for (const sf of assets) this.frames.set(sf.name, sf);

              console.log(`[SceneBuilder] Đã load ${assets.length} SpriteFrame từ resources/${dir}`);
              resolve();
            });
          });
        }
        /**
         * Edit mode: hỏi asset-db của Editor.
         * `resources.loadDir` không đáng tin ở edit mode, nên phải đi đường này.
         */


        async loadFramesFromAssetDb() {
          var _Ed$Message2;

          this.frames.clear();

          if (!(Ed != null && (_Ed$Message2 = Ed.Message) != null && _Ed$Message2.request)) {
            console.error('[SceneBuilder] Không truy cập được Editor API.');
            return;
          }

          let pattern = ''; // 1. Ưu tiên lấy từ spriteFolder nếu có kéo thả vào ô

          if (this.spriteFolder) {
            const uuid = this.spriteFolder._uuid || this.spriteFolder.uuid;

            if (uuid) {
              try {
                const info = await Ed.Message.request('asset-db', 'query-asset-info', {
                  uuid
                });

                if (info && (info.url || info.path)) {
                  const url = info.url || info.path;
                  pattern = `${url}/**/*`;
                }
              } catch (e) {
                console.warn('[SceneBuilder] Lỗi query-asset-info từ spriteFolder:', e);
              }
            }
          } // 2. Nếu không kéo folder, dùng đường dẫn text từ spriteDir


          if (!pattern) {
            let dir = this.getCleanSpriteDir();

            if (dir.startsWith('db://')) {
              pattern = `${dir}/**/*`;
            } else if (dir.startsWith('assets/')) {
              pattern = `db://${dir}/**/*`;
            } else {
              pattern = `db://assets/${dir}/**/*`;
            }
          }

          let infos = [];

          try {
            var _await$Ed$Message$req;

            infos = (_await$Ed$Message$req = await Ed.Message.request('asset-db', 'query-assets', {
              pattern,
              ccType: 'cc.SpriteFrame'
            })) != null ? _await$Ed$Message$req : [];
          } catch (e) {
            console.error('[SceneBuilder] query-assets lỗi:', e);
            return;
          } // Fallback kiểm tra trong db://assets/resources/ nếu query trực tiếp không ra kết quả


          if (infos.length === 0 && !this.spriteFolder) {
            let dir = this.getCleanSpriteDir();

            if (!dir.startsWith('assets/') && !dir.startsWith('resources/')) {
              const fallbackPattern = `db://assets/resources/${dir}/**/*`;

              try {
                var _await$Ed$Message$req2;

                const fallbackInfos = (_await$Ed$Message$req2 = await Ed.Message.request('asset-db', 'query-assets', {
                  pattern: fallbackPattern,
                  ccType: 'cc.SpriteFrame'
                })) != null ? _await$Ed$Message$req2 : [];

                if (fallbackInfos.length > 0) {
                  infos = fallbackInfos;
                  pattern = fallbackPattern;
                }
              } catch (e) {}
            }
          }

          await Promise.all(infos.map(info => new Promise(resolve => {
            var _ref, _info$path;

            const key = SceneBuilder.keyFromAssetPath((_ref = (_info$path = info.path) != null ? _info$path : info.url) != null ? _ref : '');

            if (!key) {
              resolve();
              return;
            }

            assetManager.loadAny({
              uuid: info.uuid
            }, (err, asset) => {
              if (!err && asset) this.frames.set(key, asset);
              resolve();
            });
          })));
          console.log(`[SceneBuilder] Đã load ${this.frames.size} SpriteFrame từ asset-db (${pattern})`);
        }
        /** 'db://assets/resources/art/sprites/pillow_1.png/spriteFrame' → 'pillow_1' */


        static keyFromAssetPath(p) {
          if (!p) return '';
          let s = p;
          if (s.endsWith('/spriteFrame')) s = s.slice(0, -'/spriteFrame'.length);
          s = s.substring(s.lastIndexOf('/') + 1);
          const dot = s.lastIndexOf('.');
          return dot > 0 ? s.substring(0, dot) : s;
        } // ------------------------------------------------------------ pass 1


        createNode(n) {
          const name = n.path.substring(n.path.lastIndexOf('/') + 1);
          const node = new Node(name); // ⚠ BẮT BUỘC: new Node() cho ra layer DEFAULT, mà pipeline UI của Cocos
          //   chỉ vẽ node UI_2D -> sprite dựng bằng code sẽ KHÔNG hiện, dù Scene view
          //   vẫn thấy đủ và camera vẫn ghi nhận draw call.
          //   Kế thừa layer của node gắn SceneBuilder (nằm dưới Canvas -> UI_2D).

          node.layer = this.node.layer;
          const parent = n.parentPath ? this.nodeMap.get(n.parentPath) : this.node;
          node.setParent(parent != null ? parent : this.node);
          node.setPosition(n.pos[0], n.pos[1], n.pos[2]);
          node.setRotationFromEuler(n.rot[0], n.rot[1], n.rot[2]);
          node.setScale(n.scale[0], n.scale[1], n.scale[2]);
          if (n.sprite) this.setupSprite(node, n.sprite);
          if (n.spine) this.setupSpine(node, n.spine);
          this.nodeMap.set(n.path, node);
        }

        setupSprite(node, s) {
          const ut = node.addComponent(UITransform); // ⚠ Hệ số PPU nằm ở contentSize, KHÔNG nằm ở node.scale —
          //   để node con không bị nhân theo hệ số của node cha.

          const f = this.buildK / s.ppu;
          ut.setContentSize(new Size(s.nativeSize[0] * f, s.nativeSize[1] * f));
          ut.setAnchorPoint(s.pivot[0], s.pivot[1]);
          const sprite = node.addComponent(Sprite);
          sprite.sizeMode = Sprite.SizeMode.CUSTOM;
          sprite.trim = false;
          const sf = this.frames.get(s.key);
          if (sf) sprite.spriteFrame = sf;else if (this.verbose) console.warn(`[SceneBuilder] Thiếu SpriteFrame "${s.key}" cho ${node.name}`);
          sprite.color = new Color(s.color[0] * 255, s.color[1] * 255, s.color[2] * 255, s.color[3] * 255);

          if (s.flipX || s.flipY) {
            const sc = node.scale;
            node.setScale(s.flipX ? -sc.x : sc.x, s.flipY ? -sc.y : sc.y, sc.z);
          }

          this.orderOf.set(node, s.sortingOrder);
        }

        setupSpine(node, s) {
          // Spine không mang qua được bằng JSON — chỉ tạo component rỗng,
          // skeletonData phải gán tay trong editor (plan mục 6.6).
          const skel = node.addComponent(sp.Skeleton);
          skel.loop = s.loop;
          if (s.defaultAnim) skel.animation = s.defaultAnim;
          if (this.verbose) console.warn(`[SceneBuilder] ${node.name}: cần gán tay skeletonData "${s.skeletonData}"`);
        } // ------------------------------------------------------------ pass 1.5

        /** Order thấp = render trước = nằm dưới = siblingIndex nhỏ. */


        sortSiblings() {
          const minOrder = node => {
            var _this$orderOf$get;

            let m = (_this$orderOf$get = this.orderOf.get(node)) != null ? _this$orderOf$get : Number.POSITIVE_INFINITY;

            for (const c of node.children) m = Math.min(m, minOrder(c));

            return m;
          };

          const walk = node => {
            const kids = [...node.children];

            if (kids.length > 1) {
              const keyed = kids.map((c, i) => ({
                c,
                o: minOrder(c),
                i
              }));
              keyed.sort((a, b) => a.o - b.o || a.i - b.i); // sort ổn định

              keyed.forEach((e, idx) => e.c.setSiblingIndex(idx));
            }

            for (const c of node.children) walk(c);
          };

          walk(this.node);
        } // ------------------------------------------------------------ pass 2


        attachComponents(n) {
          var _n$components;

          if (!((_n$components = n.components) != null && _n$components.length)) return;
          const node = this.nodeMap.get(n.path);
          if (!node) return;

          for (const cj of n.components) {
            const cls = js.getClassByName(cj.type);

            if (!cls) {
              if (this.verbose) console.warn(`[SceneBuilder] Chưa có class "${cj.type}" — bỏ qua (${n.path})`);
              continue;
            }

            const comp = node.addComponent(cls);
            const attrs = CCClass.Attr.getClassAttrs(cls);

            for (const [key, raw] of Object.entries(cj.fields)) {
              try {
                const declared = attrs[`${key}$_$type`];
                comp[key] = this.convert(raw, declared, comp[key]);
              } catch (e) {
                if (this.verbose) console.warn(`[SceneBuilder] ${cj.type}.${key} gán lỗi:`, e);
              }
            }
          }
        }
        /** Đổi giá trị JSON sang kiểu Cocos, dựa vào kiểu khai báo @property hoặc giá trị mặc định. */


        convert(raw, declared, current) {
          // ⚠ null trong scene Unity thường nghĩa là "gán lúc runtime trong Awake/Start"
          //   (itemGraphic, itemMovement, col, currentHolderSlot...). Ghi đè bằng null
          //   sẽ xoá mất giá trị component vừa tự tính -> giữ nguyên giá trị hiện có.
          if (raw === null || raw === undefined) return current != null ? current : null;

          if (typeof raw === 'string' && raw.startsWith('@node:')) {
            const target = this.nodeMap.get(raw.substring(6));

            if (!target) {
              if (this.verbose) console.warn(`[SceneBuilder] Không tìm thấy node "${raw.substring(6)}"`);
              return null;
            }

            if (declared && declared !== Node && declared.prototype instanceof Component) {
              return target.getComponent(declared);
            }

            return target;
          } // asset / prefab — phải gán tay


          if (typeof raw === 'string' && (raw.startsWith('@asset:') || raw.startsWith('@prefab:'))) {
            return current != null ? current : null;
          }

          if (Array.isArray(raw)) {
            const allNum = raw.every(x => typeof x === 'number');

            if (allNum && declared === Vec3) {
              return new Vec3(raw[0], raw[1], raw[2]);
            }

            if (allNum && declared === Color) {
              const [r, g, b, a] = raw;
              return new Color(r * 255, g * 255, b * 255, (a != null ? a : 1) * 255);
            }

            if (allNum && current instanceof Vec3 && raw.length >= 3) {
              return new Vec3(raw[0], raw[1], raw[2]);
            }

            if (allNum && current instanceof Color) {
              const [r, g, b, a] = raw;
              return new Color(r * 255, g * 255, b * 255, (a != null ? a : 1) * 255);
            }

            return raw.map(x => this.convert(x, declared));
          }

          return raw;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "sceneJson", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "spriteFolder", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "spriteDir", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return '3.Sprites/Sprites2';
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "applySorting", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "verbose", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return true;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "buildOnStart", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      }), _applyDecoratedDescriptor(_class2.prototype, "buildNow", [_dec10], Object.getOwnPropertyDescriptor(_class2.prototype, "buildNow"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "clearBuilt", [_dec11], Object.getOwnPropertyDescriptor(_class2.prototype, "clearBuilt"), _class2.prototype)), _class2)) || _class) || _class) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=fd3521a0092425b18c648ffc404d990e472f7e29.js.map