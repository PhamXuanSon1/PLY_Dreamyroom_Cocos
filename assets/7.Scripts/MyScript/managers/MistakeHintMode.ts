/**
 * MistakeHintMode — mode chơi tự do, tay chỉ chỉ hiện khi click mãi 1 item. Tick bật component = bật mode, bỏ tick = game chạy logic cũ.
 *
 *   1. Hint theo số lần click: tắt tay gợi ý tự hiện theo giờ (Idle / Stuck của ItemManager).
 *      Click (hoặc kéo rồi thả) cùng 1 item `clickLimit` lần mà chưa ghép được -> hiện tay chỉ đích
 *      của item đó. Click item khác -> đếm lại. Ghép đúng 1 item -> đếm lại, tắt tay.
 *      Hand Intro / hint dắt tay lần đầu (showFirstDragHint) vẫn chạy như cũ. *
 *   2. Ánh sáng cửa sổ: WindowLight (onlyInMistakeHintMode) tự tắt khi mode không bật.
 *
 *   3. Đồ nhỏ tự hiện (đồ trong tủ, quân cờ...): node đích của đồ nhỏ (…Place) là con của đích đồ đựng,
 *      ghép đồ đựng xong thì đích + con tự bật (ItemController.moveToTarget). MistakeHintMode cho các
 *      đích con đó nảy ra lần lượt thay vì hiện cùng lúc.
 */

import { _decorator, Component, Enum, Node } from 'cc';
import { ItemManager } from './ItemManager';
import { ItemController } from '../item/ItemController';
import { TweenUtil } from '../core/TweenUtil';
import { FxType, Ply_SoundManager } from '../ScriptTemplate/Ply_SoundManager';

const { ccclass, property } = _decorator;

@ccclass('MistakeHintMode')
export class MistakeHintMode extends Component {

    private static current: MistakeHintMode | null = null;

    /** Mode đang bật (component bật + node active). */
    static get active(): MistakeHintMode | null {
        const p = MistakeHintMode.current;
        return p && p.isValid && p.enabledInHierarchy ? p : null;
    }

    /** Tìm MistakeHintMode đang bật trong scene, dùng được cả TRƯỚC khi MistakeHintMode.onLoad chạy (WindowLight.start). */
    static findOn(scene: Node | null): MistakeHintMode | null {
        if (!scene) return null;
        for (const p of scene.getComponentsInChildren(MistakeHintMode)) {
            if (p.enabled && MistakeHintMode.isActiveChain(p.node)) return p;
        }
        return null;
    }

    private static isActiveChain(n: Node | null): boolean {
        for (; n; n = n.parent) if (!n.active) return false;
        return true;
    }

    // ---------------- Hint khi click ----------------
    @property({ tooltip: 'Click liên tiếp N lần vào CÙNG 1 item (mà chưa ghép được) thì hiện tay chỉ đích của item đó. Click item khác -> đếm lại.', min: 1 })
    clickLimit = 2;

    @property({ tooltip: 'Chờ N giây sau khi thả tay mới hiện tay (cho item thả hụt kịp bay về chỗ).', min: 0 })
    hintDelay = 0.3;

    // ---------------- Đồ nhỏ tự hiện ----------------
    @property({ group: { name: 'Đồ nhỏ tự hiện', id: 'reveal' }, tooltip: 'Âm thanh ghép của đồ đựng phát XONG, chờ thêm N giây thì đồ nhỏ đầu tiên nảy ra.', min: 0 })
    revealDelay = 0.15;

    @property({ group: { name: 'Đồ nhỏ tự hiện', id: 'reveal' }, tooltip: 'N giây giữa 2 đồ nhỏ liên tiếp.', min: 0 })
    revealInterval = 0.08;

    @property({ group: { name: 'Đồ nhỏ tự hiện', id: 'reveal' }, tooltip: 'Thời gian nảy ra của mỗi đồ nhỏ (giây).', min: 0.01 })
    revealDuration = 0.3;

    @property({ group: { name: 'Đồ nhỏ tự hiện', id: 'reveal' }, tooltip: 'Bật âm thanh lúc đồ nhỏ nảy ra.' })
    revealSound = true;

    @property({ group: { name: 'Đồ nhỏ tự hiện', id: 'reveal' }, type: Enum(FxType), tooltip: 'Âm thanh phát lúc đồ nhỏ nảy ra (clip gán trong Ply_SoundManager).', visible(this: MistakeHintMode) { return this.revealSound; } })
    revealFx: FxType = FxType.Decor;

    @property({ group: { name: 'Đồ nhỏ tự hiện', id: 'reveal' }, tooltip: 'TRUE: mỗi đồ nhỏ phát 1 lần. FALSE: chỉ phát 1 lần lúc đồ nhỏ đầu tiên nảy ra.', visible(this: MistakeHintMode) { return this.revealSound; } })
    revealSoundEach = false;

    private clickCount = 0;
    private hintItem: ItemController | null = null;
    private itemManager: ItemManager | null = null;

    // ======================================================== lifecycle
    onLoad() {
        MistakeHintMode.current = this;
    }

    start() {
        this.itemManager = ItemManager.instance;
        this.itemManager?.node.on(ItemManager.EVENT_ITEM_ARRIVED, this.onItemArrived, this);
    }

    onDestroy() {
        if (MistakeHintMode.current === this) MistakeHintMode.current = null;
        if (this.itemManager?.isValid) this.itemManager.node.off(ItemManager.EVENT_ITEM_ARRIVED, this.onItemArrived, this);
    }

    // ======================================================== hint khi click
    /** ItemController gọi lúc nhấn vào item: cùng item -> +1, item khác -> đếm lại từ 1. */
    onItemPressed(item: ItemController): void {
        if (item !== this.hintItem) {
            this.hintItem = item;
            this.clickCount = 0;
            this.unschedule(this.showClickHint);
        }
        this.clickCount++;
    }

    /** ItemController gọi khi thả item mà không ghép được: đủ clickLimit lần click thì hiện tay. */
    onItemReleased(item: ItemController): void {
        if (item !== this.hintItem || this.clickCount < this.clickLimit) return;
        this.unschedule(this.showClickHint);
        this.scheduleOnce(this.showClickHint, this.hintDelay);
    }

    private showClickHint(): void {
        const im = ItemManager.instance;
        if (!im || im.isDragging) return;
        im.showMistakeHint(this.hintItem);
    }

    private onItemArrived(item?: ItemController): void {
        // Ghép đúng -> đếm lại từ đầu (ItemManager.onItemCompleted đã tắt tay)
        this.clickCount = 0;
        this.hintItem = null;
        this.unschedule(this.showClickHint);

        if (item?.targetPoint) this.revealSmallItems(item, item.targetPoint);
    }

    // ======================================================== đồ nhỏ tự hiện
    /**
     * Đích con (…Place) của đích vừa ghép: vừa được bật cùng đích -> thu về 0 ngay,
     * chờ âm thanh ghép của đồ đựng phát xong + revealDelay rồi nảy ra lần lượt.
     */
    private revealSmallItems(item: ItemController, target: Node): void {
        const smalls = target.children.filter((c) => c.active && /Place$/.test(c.name));
        if (smalls.length === 0) return;
        const scales = smalls.map((c) => {
            const scale = c.scale.clone();
            TweenUtil.killAll(c);
            c.setScale(0, 0, scale.z);
            return scale;
        });
        item.whenLandSoundDone(() => {
            if (!this.isValid) return;
            smalls.forEach((c, i) => {
                const scale = scales[i];
                this.scheduleOnce(() => {
                    if (this.revealSound && (i === 0 || this.revealSoundEach)) Ply_SoundManager.Ins?.playFx(this.revealFx);
                    if (c.isValid) TweenUtil.scaleTo(c, scale, this.revealDuration, 'backOut', () => { if (c.isValid) c.setScale(scale); });
                }, this.revealDelay + i * this.revealInterval);
            });
        });
    }
}
