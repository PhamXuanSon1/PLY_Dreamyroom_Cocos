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

import { _decorator, Component, Node, AudioClip, AudioSource, input, Input, CCFloat } from 'cc';

const { ccclass, property } = _decorator;

/** Giữ nguyên thứ tự và index như enum bên Unity. */
export enum FxType {
    ClickBox = 0, PickItem = 1, HeavyWood = 2, SmallWood = 3, Cloth = 4,
    dropMetal = 5, Glass = 6, dropOnFloor = 7, cat1 = 8, cat2 = 9, cat3 = 10,
    water = 11, burnOn = 12, bookOpen = 13, CapyDrop = 14, Grass = 15,
    Chair = 16, CoinBag = 17, GoldChest = 18, WoodenFish = 19, Window = 20,
    WoodenDoor = 21, Skeleton = 22, WoodenChair = 23, ComCop = 24, Rem = 25,
    ClothesDrop = 26, Decor = 27,
}

/** Đổi tên FxType (chuỗi trong JSON / Inspector) sang enum. */
export function parseFxType(name: string): FxType | null {
    if (!name) return null;
    const v = (FxType as unknown as Record<string, unknown>)[name];
    return typeof v === 'number' ? v as FxType : null;
}

@ccclass('DreamySoundManager')
export class SoundManager extends Component {

    static instance: SoundManager | null = null;

    @property({
        type: [AudioClip],
        tooltip: 'Clip theo ĐÚNG thứ tự FxType: 0 ClickBox, 1 PickItem, 2 HeavyWood, ...',
    })
    clips: (AudioClip | null)[] = [];

    // Cocos đòi CCFloat/CCInteger cho mảng số, dùng Number sẽ bị cảnh báo.
    @property({ type: [CCFloat], tooltip: 'Volume từng clip, cùng thứ tự. Thiếu thì mặc định 1.' })
    volumes: number[] = [];

    @property({ type: AudioClip, tooltip: 'Nhạc nền (nếu có).' })
    bgm: AudioClip | null = null;

    @property({ tooltip: 'Số AudioSource dùng chung cho hiệu ứng.' })
    sourceCount = 8;

    private sources: AudioSource[] = [];
    private loopSources = new Map<FxType, AudioSource>();
    private bgmSource: AudioSource | null = null;
    private nextSource = 0;
    private muted = false;
    private unlocked = false;

    onLoad() {
        SoundManager.instance = this;

        for (let i = 0; i < this.sourceCount; i++) {
            const n = new Node(`FX_${i}`);
            n.layer = this.node.layer;
            n.setParent(this.node);
            this.sources.push(n.addComponent(AudioSource));
        }

        if (this.bgm) {
            const n = new Node('BGM');
            n.layer = this.node.layer;
            n.setParent(this.node);
            this.bgmSource = n.addComponent(AudioSource);
            this.bgmSource.clip = this.bgm;
            this.bgmSource.loop = true;
        }

        // Browser chặn autoplay tới lần tương tác đầu tiên.
        input.once(Input.EventType.TOUCH_START, this.unlock, this);
    }

    onDestroy() {
        if (SoundManager.instance === this) SoundManager.instance = null;
    }

    private unlock(): void {
        if (this.unlocked) return;
        this.unlocked = true;
        if (this.bgmSource && !this.muted) this.bgmSource.play();
    }

    private volumeOf(type: FxType): number {
        const v = this.volumes[type as number];
        return (typeof v === 'number' && v > 0) ? Math.min(1, v) : 1;
    }

    /** Unity: PlayFx */
    playFx(type: FxType | string | null): void {
        if (this.muted || type === null || type === undefined) return;
        const t = (typeof type === 'string') ? parseFxType(type) : type;
        if (t === null) return;

        const clip = this.clips[t as number];
        if (!clip) return;

        const src = this.sources[this.nextSource];
        this.nextSource = (this.nextSource + 1) % Math.max(1, this.sources.length);
        if (!src) return;
        src.playOneShot(clip, this.volumeOf(t));
    }

    /** Unity: PlayClip */
    playClip(clip: AudioClip | null, volume = 1): void {
        if (this.muted || !clip) return;
        const src = this.sources[this.nextSource];
        this.nextSource = (this.nextSource + 1) % Math.max(1, this.sources.length);
        src?.playOneShot(clip, volume);
    }

    /** Unity: PlayLoopFx */
    playLoopFx(type: FxType, volume = 1): void {
        if (this.muted) return;
        const clip = this.clips[type as number];
        if (!clip) return;

        let src = this.loopSources.get(type);
        if (!src) {
            const n = new Node(`LoopFX_${FxType[type]}`);
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
    stopLoopFx(type: FxType): void {
        const src = this.loopSources.get(type);
        if (src && src.playing) src.stop();
    }

    /** Unity: Mute */
    mute(): void {
        this.muted = true;
        this.bgmSource?.stop();
        for (const s of this.sources) s.stop();
        this.loopSources.forEach((s) => s.stop());
    }

    unmute(): void {
        this.muted = false;
        if (this.unlocked) this.bgmSource?.play();
    }
}
