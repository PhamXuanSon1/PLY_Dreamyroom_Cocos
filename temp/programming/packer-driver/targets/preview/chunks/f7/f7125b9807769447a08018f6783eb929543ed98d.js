System.register(["__unresolved_0", "cc", "cc/env", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, EDITOR, ItemController, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _crd, ccclass, property, executeInEditMode, menu, Ed, AutoAssignByNameTool;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfItemController(extras) {
    _reporterNs.report("ItemController", "../item/ItemController", _context.meta, extras);
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
      Node = _cc.Node;
    }, function (_ccEnv) {
      EDITOR = _ccEnv.EDITOR;
    }, function (_unresolved_2) {
      ItemController = _unresolved_2.ItemController;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "17a73j+g4hBDL4wRP8h9ptn", "AutoAssignByNameTool", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node']);

      ({
        ccclass,
        property,
        executeInEditMode,
        menu
      } = _decorator);
      Ed = globalThis.Editor;

      _export("AutoAssignByNameTool", AutoAssignByNameTool = (_dec = ccclass('AutoAssignByNameTool'), _dec2 = executeInEditMode(true), _dec3 = menu('Pipeline/AutoAssignByNameTool'), _dec4 = property({
        type: Node,
        tooltip: 'Node cha chứa danh sách Items (vd: ITEMS/Dynamic).'
      }), _dec5 = property({
        type: Node,
        tooltip: 'Node cha chứa các Target Points (vd: TargetPosOfItem).'
      }), _dec6 = property({
        tooltip: 'Tiền tố tên target (nếu có, vd: "target_")'
      }), _dec7 = property({
        tooltip: 'Hậu tố tên target (nếu có, vd: "Place", "_target")'
      }), _dec8 = property({
        tooltip: 'Tìm kiếm đệ quy cả các node con bên trong targetParent'
      }), _dec9 = property({
        tooltip: 'Tick để tự động gán Target Point cho tất cả Item theo tên'
      }), _dec10 = property({
        tooltip: 'Tick để kiểm tra các Item chưa được gán Target Point'
      }), _dec11 = property({
        tooltip: 'Tick để kiểm tra các Item bị trùng tên'
      }), _dec(_class = _dec2(_class = _dec3(_class = (_class2 = class AutoAssignByNameTool extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "itemParent", _descriptor, this);

          _initializerDefineProperty(this, "targetParent", _descriptor2, this);

          _initializerDefineProperty(this, "prefix", _descriptor3, this);

          _initializerDefineProperty(this, "suffix", _descriptor4, this);

          _initializerDefineProperty(this, "recursive", _descriptor5, this);
        }

        // ---- Nút bấm trong Inspector (tick checkbox để thực thi) ----
        get autoAssign() {
          return false;
        }

        set autoAssign(v) {
          if (v) this.assignTarget();
        }

        get checkMissingTarget() {
          return false;
        }

        set checkMissingTarget(v) {
          if (v) this.doCheckMissingTarget();
        }

        get checkDuplicateName() {
          return false;
        }

        set checkDuplicateName(v) {
          if (v) this.doCheckDuplicateNames();
        } // ======================================================== Methods

        /** Tự động gán targetPoint cho các ItemController */


        assignTarget() {
          if (!this.itemParent || !this.targetParent) {
            console.error('[AutoAssignTool] Thiếu Item Parent hoặc Target Parent!');
            return;
          } // Tạo map danh sách Target theo tên


          var targetDict = new Map();

          var collectTargets = parent => {
            for (var child of parent.children) {
              if (!targetDict.has(child.name)) {
                targetDict.set(child.name, child);
              }

              if (this.recursive && child.children.length > 0) {
                collectTargets(child);
              }
            }
          };

          collectTargets(this.targetParent);
          var assignedCount = 0;
          var notFoundCount = 0;

          var processItems = parent => {
            for (var item of parent.children) {
              var itemController = item.getComponent(_crd && ItemController === void 0 ? (_reportPossibleCrUseOfItemController({
                error: Error()
              }), ItemController) : ItemController);

              if (itemController) {
                var targetName = "" + this.prefix + item.name + this.suffix;
                var target = targetDict.get(targetName);

                if (target) {
                  itemController.targetPoint = target;
                  assignedCount++;
                  console.log("[AutoAssignTool] Assign: \"" + item.name + "\" -> \"" + target.name + "\"");
                } else {
                  notFoundCount++;
                  console.warn("[AutoAssignTool] Kh\xF4ng t\xECm th\u1EA5y target cho item: \"" + item.name + "\" (Target Name mong mu\u1ED1n: \"" + targetName + "\")");
                }
              }

              if (this.recursive && item.children.length > 0) {
                processItems(item);
              }
            }
          };

          processItems(this.itemParent);
          console.log("[AutoAssignTool] DONE! \u0110\xE3 g\xE1n th\xE0nh c\xF4ng " + assignedCount + " items." + (notFoundCount > 0 ? " (" + notFoundCount + " items kh\xF4ng t\xECm th\u1EA5y target)" : ''));

          if (EDITOR) {
            try {
              var _Ed$Message;

              Ed == null || (_Ed$Message = Ed.Message) == null || _Ed$Message.send('scene', 'snapshot');
              console.log('[AutoAssignTool] Nhấn Ctrl+S để lưu scene.');
            } catch (e) {
              /* Snapshot editor */
            }
          }
        }
        /** Kiểm tra xem item nào chưa có targetPoint */


        doCheckMissingTarget() {
          if (!this.itemParent) {
            console.error('[AutoAssignTool] Thiếu Item Parent!');
            return;
          }

          var missingCount = 0;
          var totalCount = 0;

          var checkItems = parent => {
            for (var item of parent.children) {
              var itemController = item.getComponent(_crd && ItemController === void 0 ? (_reportPossibleCrUseOfItemController({
                error: Error()
              }), ItemController) : ItemController);

              if (itemController) {
                totalCount++;

                if (!itemController.targetPoint) {
                  missingCount++;
                  console.warn("[AutoAssignTool] Item ch\u01B0a c\xF3 targetPoint: \"" + item.name + "\"");
                }
              }

              if (this.recursive && item.children.length > 0) {
                checkItems(item);
              }
            }
          };

          checkItems(this.itemParent);

          if (missingCount === 0) {
            console.log("[AutoAssignTool] T\u1EA5t c\u1EA3 " + totalCount + " items \u0111\u1EC1u \u0110\xC3 C\xD3 targetPoint!");
          } else {
            console.warn("[AutoAssignTool] C\xF3 " + missingCount + "/" + totalCount + " item CH\u01AFA C\xD3 targetPoint!");
          }
        }
        /** Kiểm tra xem có item nào bị trùng tên không */


        doCheckDuplicateNames() {
          if (!this.itemParent) {
            console.error('[AutoAssignTool] Thiếu Item Parent!');
            return;
          }

          var nameDict = new Map();

          var collectNames = parent => {
            for (var item of parent.children) {
              var itemController = item.getComponent(_crd && ItemController === void 0 ? (_reportPossibleCrUseOfItemController({
                error: Error()
              }), ItemController) : ItemController);

              if (itemController) {
                var _nameDict$get;

                var list = (_nameDict$get = nameDict.get(item.name)) != null ? _nameDict$get : [];
                list.push(item);
                nameDict.set(item.name, list);
              }

              if (this.recursive && item.children.length > 0) {
                collectNames(item);
              }
            }
          };

          collectNames(this.itemParent);
          var duplicateCount = 0;

          for (var [name, list] of nameDict.entries()) {
            if (list.length > 1) {
              duplicateCount++;
              console.warn("[AutoAssignTool] Tr\xF9ng t\xEAn item: \"" + name + "\" (S\u1ED1 l\u01B0\u1EE3ng: " + list.length + ")");
            }
          }

          if (duplicateCount === 0) {
            console.log('[AutoAssignTool] Không có item nào bị trùng tên!');
          } else {
            console.warn("[AutoAssignTool] C\xF3 " + duplicateCount + " t\xEAn item b\u1ECB tr\xF9ng nhau!");
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "itemParent", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "targetParent", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "prefix", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return '';
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "suffix", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return '';
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "recursive", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _applyDecoratedDescriptor(_class2.prototype, "autoAssign", [_dec9], Object.getOwnPropertyDescriptor(_class2.prototype, "autoAssign"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "checkMissingTarget", [_dec10], Object.getOwnPropertyDescriptor(_class2.prototype, "checkMissingTarget"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "checkDuplicateName", [_dec11], Object.getOwnPropertyDescriptor(_class2.prototype, "checkDuplicateName"), _class2.prototype)), _class2)) || _class) || _class) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=f7125b9807769447a08018f6783eb929543ed98d.js.map