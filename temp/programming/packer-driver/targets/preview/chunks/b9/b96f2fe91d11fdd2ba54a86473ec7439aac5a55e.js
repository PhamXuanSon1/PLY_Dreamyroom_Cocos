System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, AudioSource, Component, Game, _decorator, game, _class, _crd, ccclass, property, SoundType, sm, SoundManager;

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      AudioSource = _cc.AudioSource;
      Component = _cc.Component;
      Game = _cc.Game;
      _decorator = _cc._decorator;
      game = _cc.game;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "3b26efoaDdDF4aNvUCK8slO", "SoundManager", undefined); // Learn TypeScript:
      //  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
      // Learn Attribute:
      //  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
      // Learn life-cycle callbacks:
      //  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html


      __checkObsolete__(['AudioSource', 'Component', 'Game', '_decorator', 'game']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("SoundType", SoundType = /*#__PURE__*/function (SoundType) {
        SoundType[SoundType["BGM"] = 0] = "BGM";
        SoundType[SoundType["Pick"] = 1] = "Pick";
        SoundType[SoundType["Done"] = 2] = "Done";
        SoundType[SoundType["Fail"] = 3] = "Fail";
        SoundType[SoundType["Win"] = 4] = "Win";
        SoundType[SoundType["Alert"] = 5] = "Alert";
        SoundType[SoundType["LandRight"] = 6] = "LandRight";
        SoundType[SoundType["LandFail"] = 7] = "LandFail";
        SoundType[SoundType["Hen"] = 8] = "Hen";
        SoundType[SoundType["Hen2"] = 9] = "Hen2";
        return SoundType;
      }({}));

      _export("sm", sm = null);

      _export("default", SoundManager = ccclass(_class = class SoundManager extends Component {
        constructor() {
          super(...arguments);
          // @property(AudioSource)
          this.audiosource = [];
          this.volumes = [];
          // @property(AudioClip)
          // audios: AudioClip[] = [];
          this.mute = false;
          this.fail = false;
          this.playBG = false;
        }

        onLoad() {
          _export("sm", sm = this);
        }

        playSound(type, loop, call) {
          if (loop === void 0) {
            loop = false;
          }

          if (call === void 0) {
            call = () => {};
          }

          if (this.fail) return;

          if (this.audiosource[type]) {
            if (this.audiosource[type].playing) {}

            this.audiosource[type].play();
            this.audiosource[type].loop = loop;
            setTimeout(() => {
              call();
            }, this.audiosource[type].duration * 1000);
          }

          return this.audiosource[type];
        }

        pauseSound(type) {
          if (this.audiosource[type]) {
            this.audiosource[type].pause();
          }
        }

        isPlaying(type) {
          return this.audiosource[type].playing;
        }

        playSounds(types, loop, step, call) {
          if (loop === void 0) {
            loop = false;
          }

          if (step === void 0) {
            step = 0;
          }

          if (call === void 0) {
            call = () => {};
          }

          this.playNext(types, 0, loop, step, call);
        }

        playNext(types, index, loop, step, call) {
          if (loop === void 0) {
            loop = false;
          }

          if (step === void 0) {
            step = 0;
          }

          if (call === void 0) {
            call = () => {};
          }

          if (index >= types.length) return;
          var beLoop = false;

          if (index == types.length - 1) {
            beLoop = loop;
            call();
          }

          var audio = this.playSound(types[index], beLoop);
          if (!audio) return;
          setTimeout(() => {
            this.playNext(types, index + 1, loop, step, call);
          }, (audio.duration + step) * 1000 * 0.5);
        }

        stopAll() {
          this.fail = true;

          for (var i = 0; i < this.audiosource.length; i++) {
            this.audiosource[i].stop();
          }
        }

        stopSound(type) {
          this.audiosource[type].stop();
        }

        checkAudio() {
          if (window.volume !== undefined) {
            if (window.volume >= 10) {
              this.unMuteAll();
            } else {
              this.muteAll();
            }
          }
        }

        playBgMusic() {
          if (this.playBG) return;
          this.playBG = true;
          setTimeout(() => {
            this.playSound(SoundType.BGM, false, () => {
              this.playSound(SoundType.BGM, true);
            });
          }, 100);
        }

        start() {
          // this.playBgMusic();
          this.audiosource = this.node.getComponentsInChildren(AudioSource);
          this.volumes = this.audiosource.map(a => a.volume);
          this.eventSound();
          this.schedule(this.checkAudio, 1);
          this.checkAudio();
        }

        eventSound() {
          game.on(Game.EVENT_HIDE, () => {
            this.muteAll();
          });
          game.on(Game.EVENT_SHOW, () => {
            this.unMuteAll();
          });
          window.addEventListener("audioChanged", e => {
            if (e.detail.mute) {
              this.muteAll();
            } else {
              this.unMuteAll();
            }
          });
          document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
              this.muteAll();
            } else {
              this.unMuteAll();
            }
          });
          document.addEventListener("pause", () => {
            // Thiết bị bị khóa màn hình
            console.log("Màn hình đã bị khóa");
            this.muteAll();
          });
          document.addEventListener("play", () => {
            // Thiết bị mở màn hình trở lại
            console.log("Màn hình đã được mở lại");
            this.unMuteAll();
          });
        }

        muteAll() {
          console.log("muteAll");

          try {
            for (var i = 0; i < this.audiosource.length; i++) {
              this.audiosource[i].volume = 0;
            }
          } catch (error) {}
        }

        unMuteAll() {
          console.log("unMuteAll");

          try {
            for (var i = 0; i < this.audiosource.length; i++) {
              this.audiosource[i].volume = this.volumes[i];
            }
          } catch (error) {}
        }

        update(dt) {}

      }) || _class);

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=b96f2fe91d11fdd2ba54a86473ec7439aac5a55e.js.map