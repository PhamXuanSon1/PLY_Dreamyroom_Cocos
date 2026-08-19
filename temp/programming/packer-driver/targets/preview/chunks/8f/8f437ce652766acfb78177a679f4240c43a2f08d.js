System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Input, input, ui, sm, _dec, _class, _class2, _crd, ccclass, property, ipm, InputManager;

  function _reportPossibleCrUseOfui(extras) {
    _reporterNs.report("ui", "./UI", _context.meta, extras);
  }

  function _reportPossibleCrUseOfsm(extras) {
    _reporterNs.report("sm", "./SoundManager", _context.meta, extras);
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
      Input = _cc.Input;
      input = _cc.input;
    }, function (_unresolved_2) {
      ui = _unresolved_2.ui;
    }, function (_unresolved_3) {
      sm = _unresolved_3.sm;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "9af7cuQ4ftO/YNfz4JJfyYl", "InputManager", undefined);

      __checkObsolete__(['_decorator', 'Component', 'EventTouch', 'Input', 'input', 'misc', 'Node', 'v2', 'Vec2']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("ipm", ipm = null);

      _export("InputManager", InputManager = (_dec = ccclass('InputManager'), _dec(_class = (_class2 = class InputManager extends Component {
        constructor() {
          super(...arguments);
          this.startPos = null;
          this.dir = null;
          this.isFirtMove = true;
        }

        onLoad() {
          InputManager.instance = this;

          _export("ipm", ipm = this);
        }

        bindingStart(event) {}

        bindingMove(event) {}

        bindingEnd(event) {}

        bindingUpdate() {}

        fisrtTap() {
          if (this.isFirtMove) {
            this.isFirtMove = false;
            (_crd && sm === void 0 ? (_reportPossibleCrUseOfsm({
              error: Error()
            }), sm) : sm).playBgMusic();
            (_crd && ui === void 0 ? (_reportPossibleCrUseOfui({
              error: Error()
            }), ui) : ui).firstMove();
          }
        }

        onTouchStart(event) {
          this.fisrtTap();
          this.bindingStart(event);
        }

        onTouchMove(event) {
          this.bindingMove(event);
        }

        onTouchEnd(event) {
          this.bindingEnd(event);
        }

        binding() {
          input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
          input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
          input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
          input.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        }

        offBinding() {
          input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
          input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
          input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
          input.off(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        }

        start() {
          this.binding();
        }

        update(deltaTime) {
          this.bindingUpdate();
        }

      }, _class2.instance = null, _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=8f437ce652766acfb78177a679f4240c43a2f08d.js.map