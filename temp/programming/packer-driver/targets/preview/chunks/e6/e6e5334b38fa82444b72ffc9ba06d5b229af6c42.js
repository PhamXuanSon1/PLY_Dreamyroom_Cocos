System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, AudioClip, AudioSource, input, Input, CCFloat, _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _class3, _crd, ccclass, property, FxType, SoundManager;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  /** Đổi tên FxType (chuỗi trong JSON / Inspector) sang enum. */
  function parseFxType(name) {
    if (!name) return null;
    var v = FxType[name];
    return typeof v === 'number' ? v : null;
  }

  _export("parseFxType", parseFxType);

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Node = _cc.Node;
      AudioClip = _cc.AudioClip;
      AudioSource = _cc.AudioSource;
      input = _cc.input;
      Input = _cc.Input;
      CCFloat = _cc.CCFloat;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "2cad3suCz9JrrZV4VDRWH8w", "SoundManager", undefined);
      /**
       * SoundManager — port từ Assets/_GAME/Script/ScriptTemp/Ply_SoundManager.cs (Unity)
       *
       * Khác bản Unity:
       *   - Bản Unity tạo `new GameObject()` cho mỗi FX, không parent và không destroy
       *     -> rác tích luỹ. Ở đây dùng pool AudioSource cố định dưới 1 node.
       *   - Gộp 28 field SoundData rời thành mảng clips[] đánh theo index của FxType.
       *   - Thêm bước mở khoá audio ở lần chạm đầu (browser chặn autoplay, thiếu là
       *     mất sạch tiếng trên iOS Safari).
       */


      __checkObsolete__(['_decorator', 'Component', 'Node', 'AudioClip', 'AudioSource', 'input', 'Input', 'CCFloat']);

      ({
        ccclass,
        property
      } = _decorator);
      /** Giữ nguyên thứ tự và index như enum bên Unity. */

      _export("FxType", FxType = /*#__PURE__*/function (FxType) {
        FxType[FxType["ClickBox"] = 0] = "ClickBox";
        FxType[FxType["PickItem"] = 1] = "PickItem";
        FxType[FxType["HeavyWood"] = 2] = "HeavyWood";
        FxType[FxType["SmallWood"] = 3] = "SmallWood";
        FxType[FxType["Cloth"] = 4] = "Cloth";
        FxType[FxType["dropMetal"] = 5] = "dropMetal";
        FxType[FxType["Glass"] = 6] = "Glass";
        FxType[FxType["dropOnFloor"] = 7] = "dropOnFloor";
        FxType[FxType["cat1"] = 8] = "cat1";
        FxType[FxType["cat2"] = 9] = "cat2";
        FxType[FxType["cat3"] = 10] = "cat3";
        FxType[FxType["water"] = 11] = "water";
        FxType[FxType["burnOn"] = 12] = "burnOn";
        FxType[FxType["bookOpen"] = 13] = "bookOpen";
        FxType[FxType["CapyDrop"] = 14] = "CapyDrop";
        FxType[FxType["Grass"] = 15] = "Grass";
        FxType[FxType["Chair"] = 16] = "Chair";
        FxType[FxType["CoinBag"] = 17] = "CoinBag";
        FxType[FxType["GoldChest"] = 18] = "GoldChest";
        FxType[FxType["WoodenFish"] = 19] = "WoodenFish";
        FxType[FxType["Window"] = 20] = "Window";
        FxType[FxType["WoodenDoor"] = 21] = "WoodenDoor";
        FxType[FxType["Skeleton"] = 22] = "Skeleton";
        FxType[FxType["WoodenChair"] = 23] = "WoodenChair";
        FxType[FxType["ComCop"] = 24] = "ComCop";
        FxType[FxType["Rem"] = 25] = "Rem";
        FxType[FxType["ClothesDrop"] = 26] = "ClothesDrop";
        FxType[FxType["Decor"] = 27] = "Decor";
        return FxType;
      }({}));

      _export("SoundManager", SoundManager = (_dec = ccclass('DreamySoundManager'), _dec2 = property({
        type: [AudioClip],
        tooltip: 'Clip theo ĐÚNG thứ tự FxType: 0 ClickBox, 1 PickItem, 2 HeavyWood, ...'
      }), _dec3 = property({
        type: [CCFloat],
        tooltip: 'Volume từng clip, cùng thứ tự. Thiếu thì mặc định 1.'
      }), _dec4 = property({
        type: AudioClip,
        tooltip: 'Nhạc nền (nếu có).'
      }), _dec5 = property({
        tooltip: 'Số AudioSource dùng chung cho hiệu ứng.'
      }), _dec(_class = (_class2 = (_class3 = class SoundManager extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "clips", _descriptor, this);

          // Cocos đòi CCFloat/CCInteger cho mảng số, dùng Number sẽ bị cảnh báo.
          _initializerDefineProperty(this, "volumes", _descriptor2, this);

          _initializerDefineProperty(this, "bgm", _descriptor3, this);

          _initializerDefineProperty(this, "sourceCount", _descriptor4, this);

          this.sources = [];
          this.loopSources = new Map();
          this.bgmSource = null;
          this.nextSource = 0;
          this.muted = false;
          this.unlocked = false;
        }

        onLoad() {
          SoundManager.instance = this;

          for (var i = 0; i < this.sourceCount; i++) {
            var n = new Node("FX_" + i);
            n.layer = this.node.layer;
            n.setParent(this.node);
            this.sources.push(n.addComponent(AudioSource));
          }

          if (this.bgm) {
            var _n = new Node('BGM');

            _n.layer = this.node.layer;

            _n.setParent(this.node);

            this.bgmSource = _n.addComponent(AudioSource);
            this.bgmSource.clip = this.bgm;
            this.bgmSource.loop = true;
          } // Browser chặn autoplay tới lần tương tác đầu tiên.


          input.once(Input.EventType.TOUCH_START, this.unlock, this);
        }

        onDestroy() {
          if (SoundManager.instance === this) SoundManager.instance = null;
        }

        unlock() {
          if (this.unlocked) return;
          this.unlocked = true;
          if (this.bgmSource && !this.muted) this.bgmSource.play();
        }

        volumeOf(type) {
          var v = this.volumes[type];
          return typeof v === 'number' && v > 0 ? Math.min(1, v) : 1;
        }
        /** Unity: PlayFx */


        playFx(type) {
          if (this.muted || type === null || type === undefined) return;
          var t = typeof type === 'string' ? parseFxType(type) : type;
          if (t === null) return;
          var clip = this.clips[t];
          if (!clip) return;
          var src = this.sources[this.nextSource];
          this.nextSource = (this.nextSource + 1) % Math.max(1, this.sources.length);
          if (!src) return;
          src.playOneShot(clip, this.volumeOf(t));
        }
        /** Unity: PlayClip */


        playClip(clip, volume) {
          if (volume === void 0) {
            volume = 1;
          }

          if (this.muted || !clip) return;
          var src = this.sources[this.nextSource];
          this.nextSource = (this.nextSource + 1) % Math.max(1, this.sources.length);
          src == null ? void 0 : src.playOneShot(clip, volume);
        }
        /** Unity: PlayLoopFx */


        playLoopFx(type, volume) {
          if (volume === void 0) {
            volume = 1;
          }

          if (this.muted) return;
          var clip = this.clips[type];
          if (!clip) return;
          var src = this.loopSources.get(type);

          if (!src) {
            var n = new Node("LoopFX_" + FxType[type]);
            n.layer = this.node.layer;
            n.setParent(this.node);
            src = n.addComponent(AudioSource);
            src.loop = true;
            src.playOnAwake = false;
            this.loopSources.set(type, src);
          }

          src.clip = clip;
          src.volume = this.volumeOf(type) * volume;
          if (!src.playing) src.play();
        }
        /** Unity: StopLoopFx */


        stopLoopFx(type) {
          var src = this.loopSources.get(type);
          if (src && src.playing) src.stop();
        }
        /** Unity: Mute */


        mute() {
          var _this$bgmSource;

          this.muted = true;
          (_this$bgmSource = this.bgmSource) == null ? void 0 : _this$bgmSource.stop();

          for (var s of this.sources) s.stop();

          this.loopSources.forEach(s => s.stop());
        }

        unmute() {
          var _this$bgmSource2;

          this.muted = false;
          if (this.unlocked) (_this$bgmSource2 = this.bgmSource) == null ? void 0 : _this$bgmSource2.play();
        }

      }, _class3.instance = null, _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "clips", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "volumes", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "bgm", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "sourceCount", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 8;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=e6e5334b38fa82444b72ffc9ba06d5b229af6c42.js.map