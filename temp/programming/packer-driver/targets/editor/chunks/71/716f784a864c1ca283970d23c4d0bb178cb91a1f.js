System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, AudioClip, AudioSource, Node, Enum, CCFloat, CCInteger, Ply_Singleton, _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _class4, _class5, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _dec16, _dec17, _dec18, _class7, _class8, _descriptor14, _descriptor15, _class9, _crd, ccclass, property, FxType, SoundData, FxAudio, Ply_SoundManager;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfPly_Singleton(extras) {
    _reporterNs.report("Ply_Singleton", "./Ply_Singleton", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      AudioClip = _cc.AudioClip;
      AudioSource = _cc.AudioSource;
      Node = _cc.Node;
      Enum = _cc.Enum;
      CCFloat = _cc.CCFloat;
      CCInteger = _cc.CCInteger;
    }, function (_unresolved_2) {
      Ply_Singleton = _unresolved_2.Ply_Singleton;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "784b8FXN1dNC6eIJmogeNZE", "Ply_SoundManager", undefined);

      __checkObsolete__(['_decorator', 'AudioClip', 'AudioSource', 'Node', 'Enum', 'CCFloat', 'CCInteger']);

      ({
        ccclass,
        property
      } = _decorator);
      /**
       * Enum cac loai hieu ung am thanh (FX).
       */

      _export("FxType", FxType = /*#__PURE__*/function (FxType) {
        FxType[FxType["Click"] = 0] = "Click";
        FxType[FxType["Happy"] = 1] = "Happy";
        FxType[FxType["Wrong"] = 2] = "Wrong";
        FxType[FxType["Spray"] = 3] = "Spray";
        FxType[FxType["Brush"] = 4] = "Brush";
        FxType[FxType["Correct"] = 5] = "Correct";
        FxType[FxType["Pop"] = 6] = "Pop";
        FxType[FxType["Comb"] = 7] = "Comb";
        FxType[FxType["Scissors"] = 8] = "Scissors";
        FxType[FxType["Curling"] = 9] = "Curling";
        return FxType;
      }({}));

      Enum(FxType);
      /**
       * Cau hinh du lieu am thanh.
       * Tuong duong voi class SoundData trong Unity gom AudioClip, volume va repeatCount.
       */

      SoundData = (_dec = ccclass('SoundData'), _dec2 = property(AudioClip), _dec3 = property({
        type: CCFloat,
        range: [0, 1],
        slide: true
      }), _dec4 = property(CCInteger), _dec(_class = (_class2 = class SoundData {
        constructor() {
          _initializerDefineProperty(this, "clip", _descriptor, this);

          _initializerDefineProperty(this, "volume", _descriptor2, this);

          _initializerDefineProperty(this, "repeatCount", _descriptor3, this);
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "clip", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "volume", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "repeatCount", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1;
        }
      })), _class2)) || _class);
      /**
       * Cau hinh FX Audio - chua tat ca du lieu am thanh hieu ung.
       * Moi truong tuong ung voi mot gia tri trong enum FxType.
       */

      FxAudio = (_dec5 = ccclass('FxAudio'), _dec6 = property(SoundData), _dec7 = property(SoundData), _dec8 = property(SoundData), _dec9 = property(SoundData), _dec10 = property(SoundData), _dec11 = property(SoundData), _dec12 = property(SoundData), _dec13 = property(SoundData), _dec14 = property(SoundData), _dec15 = property(SoundData), _dec5(_class4 = (_class5 = class FxAudio {
        constructor() {
          _initializerDefineProperty(this, "clickBox", _descriptor4, this);

          _initializerDefineProperty(this, "happy", _descriptor5, this);

          _initializerDefineProperty(this, "wrong", _descriptor6, this);

          _initializerDefineProperty(this, "spray", _descriptor7, this);

          _initializerDefineProperty(this, "brush", _descriptor8, this);

          _initializerDefineProperty(this, "correct", _descriptor9, this);

          _initializerDefineProperty(this, "pop", _descriptor10, this);

          _initializerDefineProperty(this, "comb", _descriptor11, this);

          _initializerDefineProperty(this, "scissors", _descriptor12, this);

          _initializerDefineProperty(this, "curling", _descriptor13, this);
        }

      }, (_descriptor4 = _applyDecoratedDescriptor(_class5.prototype, "clickBox", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return new SoundData();
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class5.prototype, "happy", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return new SoundData();
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class5.prototype, "wrong", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return new SoundData();
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class5.prototype, "spray", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return new SoundData();
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class5.prototype, "brush", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return new SoundData();
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class5.prototype, "correct", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return new SoundData();
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class5.prototype, "pop", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return new SoundData();
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class5.prototype, "comb", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return new SoundData();
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class5.prototype, "scissors", [_dec14], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return new SoundData();
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class5.prototype, "curling", [_dec15], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return new SoundData();
        }
      })), _class5)) || _class4);
      /**
       * Quan ly am thanh duoc chuyen tu Unity Ply_SoundManager.
       * 
       * Cac diem khac biet chinh so voi Unity:
       * - Dung AudioSource component cua Cocos thay vi Unity AudioSource
       * - Dung schedule va callback kiem tra hang cho thay vi Coroutine
       * - Nhac nen (BGM) dung component AudioSource rieng gan qua Inspector
       * - Am thanh FX phat qua AudioSource.playOneShot() hoac play()
       */

      _export("Ply_SoundManager", Ply_SoundManager = (_dec16 = ccclass('Ply_SoundManager'), _dec17 = property(FxAudio), _dec18 = property(AudioSource), _dec16(_class7 = (_class8 = (_class9 = class Ply_SoundManager extends (_crd && Ply_Singleton === void 0 ? (_reportPossibleCrUseOfPly_Singleton({
        error: Error()
      }), Ply_Singleton) : Ply_Singleton) {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "fxAudio", _descriptor14, this);

          _initializerDefineProperty(this, "bgm1", _descriptor15, this);

          this.fxSources = new Array(10).fill(null);
          this.queuedCount = new Array(10).fill(0);
          this.queueTimers = new Array(10).fill(null);
          this.isMute = false;
        }

        onLoad() {
          super.onLoad();
          Ply_SoundManager.Ins = this;
        }
        /**
         * Phat am thanh hieu ung ngay lap tuc.
         * Neu dang phat, no se phat lai tu dau.
         */


        playFx(fxType) {
          if (this.isMute) return;
          const data = this.getSoundData(fxType);
          if (!data || !data.clip) return;
          const index = fxType;

          if (!this.fxSources[index]) {
            this.fxSources[index] = this.createAudioSource(`SoundFX_${FxType[fxType]}`);
          }

          const source = this.fxSources[index];
          source.clip = data.clip;
          source.volume = data.volume;
          source.play(); // Phat lap de tang am luong (giong xu ly trong Unity)

          for (let i = 1; i < data.repeatCount; i++) {
            source.playOneShot(data.clip, data.volume);
          }
        }
        /**
         * Phat am thanh hieu ung theo hang cho.
         * Neu dang phat, dua toi da 1 lan vao hang cho.
         * Neu ang ranh, phat ngay va bat dau kiem tra hang cho.
         */


        playFxQueued(fxType) {
          if (this.isMute) return;
          const data = this.getSoundData(fxType);
          if (!data || !data.clip) return;
          const index = fxType;

          if (!this.fxSources[index]) {
            this.fxSources[index] = this.createAudioSource(`SoundFX_Queued_${FxType[fxType]}`);
          }

          const source = this.fxSources[index];
          source.clip = data.clip;
          source.volume = data.volume;

          if (source.playing) {
            // Neu đang phat, chi cho vao hang cho toi da 1 lan
            this.queuedCount[index] = 1;
          } else {
            // Neu ranh thi phat luon
            source.play(); // Bat dau qua trinh kiem tra hang cho

            this.startQueueCheck(index);
          }
        }
        /**
         * Kiem tra hang cho dinh ky va phat am thanh tiep theo.
         * Thay the cho CheckQueueRoutine dung Coroutine trong Unity.
         */


        startQueueCheck(index) {
          if (this.queueTimers[index] !== null) {
            this.unschedule(this.checkQueueCallback.bind(this, index));
          }

          const callback = () => {
            const source = this.fxSources[index];

            if (!source) {
              this.unschedule(callback);
              this.queueTimers[index] = null;
              return;
            }

            if (!source.playing) {
              if (this.queuedCount[index] > 0) {
                this.queuedCount[index] = 0;
                source.play();
              } else {
                this.unschedule(callback);
                this.queueTimers[index] = null;
              }
            }
          };

          this.schedule(callback, 0.016);
        }

        checkQueueCallback(index) {// Callback giu tham chieu
        }
        /**
         * Phat am thanh hieu ung lặp lai (loop).
         */


        playLoopFx(fxType) {
          if (this.isMute) return;
          const data = this.getSoundData(fxType);
          if (!data || !data.clip) return;
          const index = fxType;

          if (!this.fxSources[index]) {
            this.fxSources[index] = this.createAudioSource(`SoundFX_Loop_${FxType[fxType]}`);
          }

          const source = this.fxSources[index];
          source.clip = data.clip;
          source.volume = data.volume;
          source.loop = true;
          source.play();
        }
        /**
         * Dung mot am thanh hieu ung cu the.
         */


        stopFx(fxType) {
          const index = fxType;

          if (index >= 0 && index < this.fxSources.length && this.fxSources[index]) {
            this.fxSources[index].stop();
          }
        }
        /**
         * Phat nhac nen.
         */


        playBGM1() {
          if (this.isMute) return;

          if (this.bgm1 && !this.bgm1.playing) {
            this.bgm1.play();
          }
        }
        /**
         * Phat nhac nen (alias cho playBGM1).
         */


        playBGM2() {
          this.playBGM1();
        }
        /**
         * Lay SoundData tuong ung voi FxType.
         */


        getSoundData(type) {
          switch (type) {
            case FxType.Click:
              return this.fxAudio.clickBox;

            case FxType.Happy:
              return this.fxAudio.happy;

            case FxType.Wrong:
              return this.fxAudio.wrong;

            case FxType.Spray:
              return this.fxAudio.spray;

            case FxType.Brush:
              return this.fxAudio.brush;

            case FxType.Correct:
              return this.fxAudio.correct;

            case FxType.Pop:
              return this.fxAudio.pop;

            case FxType.Comb:
              return this.fxAudio.comb;

            case FxType.Scissors:
              return this.fxAudio.scissors;

            case FxType.Curling:
              return this.fxAudio.curling;

            default:
              return null;
          }
        }
        /**
         * Tat tieng chi rieng cac am thanh FX.
         */


        muteFx() {
          this.isMute = true;

          for (let i = 0; i < this.fxSources.length; i++) {
            if (this.fxSources[i]) {
              this.fxSources[i].stop();
            }
          }
        }
        /**
         * Tat toan bo am thanh (BGM + FX).
         */


        mute() {
          this.isMute = true;
          if (this.bgm1) this.bgm1.stop();

          for (let i = 0; i < this.fxSources.length; i++) {
            if (this.fxSources[i]) {
              this.fxSources[i].stop();
            }
          }
        }
        /**
         * Bat lai am thanh.
         */


        unmute() {
          this.isMute = false;
        }
        /**
         * Tao mot AudioSource component moi tren node con.
         */


        createAudioSource(name) {
          const audioNode = new Node(name);
          audioNode.setParent(this.node);
          return audioNode.addComponent(AudioSource);
        }

        onDestroy() {
          super.onDestroy();

          if (Ply_SoundManager.Ins === this) {
            Ply_SoundManager.Ins = null;
          }
        }

      }, _class9.Ins = null, _class9), (_descriptor14 = _applyDecoratedDescriptor(_class8.prototype, "fxAudio", [_dec17], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return new FxAudio();
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class8.prototype, "bgm1", [_dec18], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class8)) || _class7));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=716f784a864c1ca283970d23c4d0bb178cb91a1f.js.map