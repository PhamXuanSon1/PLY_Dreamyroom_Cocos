System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Sprite, Color, Vec3, UITransform, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _class3, _crd, ccclass, property, DRAG_LAYER_NAME, ItemGraphic;

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
      Sprite = _cc.Sprite;
      Color = _cc.Color;
      Vec3 = _cc.Vec3;
      UITransform = _cc.UITransform;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "d5580Bajw9EH5Wj396ypuVn", "ItemGraphic", undefined);
      /**
       * ItemGraphic — port từ Assets/_GAME/Script/Item/ItemGraphic.cs (Unity)
       *
       * Bản Unity dài 321 dòng, phần lớn là mô phỏng sortingOrder
       * (SaveLayersAndSetTo20 / RestoreOriginalLayers / MatchItemSortingOrderToTarget /
       *  GetTargetSortingOrderFromSaved / GetSortingOrderRecursive).
       *
       * Cocos render theo thứ tự cây nên toàn bộ phần đó được thay bằng "lớp kéo":
       * khi nhấc item thì chuyển tạm nó sang node DragLayer nằm cuối cây; thả ra
       * thì trả về đúng (parent, siblingIndex) cũ.
       *
       * ⚠ DragLayer phải nằm CÙNG CHUỖI SCALE với item, nếu không item sẽ đổi kích thước
       *   lúc nhấc lên. Với Level542: Scale(0.45) > Items(1.4) > DefaultItem(1) > item.
       *   Nên DragLayer đặt dưới "Items" — cùng cấp với DefaultItem/DynamicItem (đều scale 1).
       *
       * Xem COCOS_MIGRATION_PLAN.md mục 5.1.
       */


      __checkObsolete__(['_decorator', 'Component', 'Node', 'Sprite', 'Color', 'Vec3', 'UITransform', 'Rect']);

      ({
        ccclass,
        property
      } = _decorator);
      DRAG_LAYER_NAME = '__DragLayer__';

      _export("ItemGraphic", ItemGraphic = (_dec = ccclass('ItemGraphic'), _dec2 = property({
        type: Vec3,
        tooltip: 'Scale của item khi nằm trong danh sách ở dưới cùng.'
      }), _dec3 = property({
        type: Vec3,
        tooltip: 'Rotation của item khi nằm trong danh sách ở dưới cùng.'
      }), _dec(_class = (_class2 = (_class3 = class ItemGraphic extends Component {
        constructor(...args) {
          super(...args);

          // ---- field khớp tên với bản Unity để SceneBuilder gán được từ JSON ----
          _initializerDefineProperty(this, "listScale", _descriptor, this);

          _initializerDefineProperty(this, "listRotation", _descriptor2, this);

          // ---- trạng thái lớp kéo ----
          this.savedParent = null;
          this.savedIndex = -1;
          // ---- trạng thái shadow ở targetPoint ----
          this.hiddenTargetSprites = [];
        }

        // ======================================================== lớp kéo

        /** Unity: SaveLayersAndSetTo20 — đẩy item lên trên cùng khi đang cầm. */
        bringToFront() {
          if (this.savedParent) return; // đã ở trên cùng rồi

          const layer = this.resolveDragLayer();
          if (!layer) return;
          this.savedParent = this.node.parent;
          this.savedIndex = this.node.getSiblingIndex();
          this.node.setParent(layer, true); // giữ nguyên world transform
        }
        /** Unity: RestoreOriginalLayers — trả item về đúng chỗ cũ trong cây. */


        restoreOriginalLayers() {
          if (!this.savedParent || !this.savedParent.isValid) {
            this.savedParent = null;
            this.savedIndex = -1;
            return;
          }

          this.node.setParent(this.savedParent, true);
          this.node.setSiblingIndex(this.savedIndex);
          this.savedParent = null;
          this.savedIndex = -1;
        }
        /** Có đang được nhấc lên lớp kéo không. */


        get isLifted() {
          return this.savedParent !== null;
        }

        resolveDragLayer() {
          var _this$node$parent$par, _this$node$parent;

          const root = ItemGraphic.dragLayerRoot && ItemGraphic.dragLayerRoot.isValid ? ItemGraphic.dragLayerRoot : (_this$node$parent$par = (_this$node$parent = this.node.parent) == null ? void 0 : _this$node$parent.parent) != null ? _this$node$parent$par : null;
          if (!root) return null;
          let layer = root.getChildByName(DRAG_LAYER_NAME);

          if (!layer) {
            layer = new Node(DRAG_LAYER_NAME);
            layer.layer = root.layer; // phải là UI_2D, xem ghi chú ở SceneBuilder

            layer.addComponent(UITransform);
            layer.setParent(root);
          }

          layer.setSiblingIndex(root.children.length - 1); // luôn ở cuối = trên cùng

          return layer;
        }
        /**
         * Unity: MatchItemSortingOrderToTarget — gán order của item bằng order của đích.
         * Cocos: đặt item ngay sau targetPoint trong cây.
         * (Bên Unity item bị tắt ngay sau đó nên phần này gần như không đổi hình ảnh.)
         */


        matchItemSortingOrderToTarget(targetPoint) {
          if (!targetPoint || !targetPoint.parent) return;
          this.node.setParent(targetPoint.parent, true);
          this.node.setSiblingIndex(targetPoint.getSiblingIndex() + 1);
          this.savedParent = null;
          this.savedIndex = -1;
        } // ======================================================== shadow ở đích

        /**
         * Unity: HandleTargetSprites — bật shadow (đổi màu tối) hoặc ẩn hẳn sprite ở đích.
         */


        handleTargetSprites(targetPoint, isShadowEnabled = true) {
          if (!targetPoint) return;
          this.hiddenTargetSprites.length = 0;
          const sprites = targetPoint.getComponentsInChildren(Sprite);

          for (const sr of sprites) {
            this.hiddenTargetSprites.push(sr);

            if (isShadowEnabled) {
              sr.color = ItemGraphic.targetShadowColor.clone();
            } else {
              sr.enabled = false;
            }
          }
        }
        /** Unity: RestoreTargetSprites — trả sprite ở đích về màu bình thường. */


        restoreTargetSprites() {
          for (const sr of this.hiddenTargetSprites) {
            if (!sr || !sr.isValid) continue;
            sr.enabled = true;
            sr.color = ItemGraphic.targetNormalColor.clone();
          }

          this.hiddenTargetSprites.length = 0;
        } // ======================================================== bounds

        /**
         * Unity: GetCombinedBounds — gộp bounds của mọi renderer trong item.
         * Cocos: gộp bounding box (world) của mọi UITransform.
         */


        getCombinedBounds() {
          const uts = this.node.getComponentsInChildren(UITransform);
          if (uts.length === 0) return null;
          let box = null;

          for (const ut of uts) {
            const b = ut.getBoundingBoxToWorld();
            if (b.width <= 0 && b.height <= 0) continue;
            box = box ? box.union(box, b) : b.clone();
          }

          return box;
        }

      }, _class3.targetShadowColor = new Color(51, 51, 51, 255), _class3.targetNormalColor = new Color(255, 255, 255, 255), _class3.dragLayerRoot = null, _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "listScale", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return new Vec3(1, 1, 1);
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "listRotation", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return new Vec3(0, 0, 0);
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=f54ebe61730b62bda1ac4093d345f1267d68cf9c.js.map