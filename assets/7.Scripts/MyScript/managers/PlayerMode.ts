/**
 * PlayerMode — mode "người chơi tự chơi". Tick bật component = bật mode, bỏ tick = game chạy logic cũ.
 *
 *   1. Hint theo số lần thả sai: tắt tay gợi ý tự hiện theo giờ (Idle / Stuck của ItemManager).
 *      Người chơi kéo rồi thả trượt quá `wrongLimit` lần -> hiện tay chỉ 1 nước đi đúng
 *      (ưu tiên item vừa thả sai). Ghép đúng 1 item -> đếm lại từ 0, tắt tay.
 *      Hand Intro / hint dắt tay lần đầu (showFirstDragHint) vẫn chạy như cũ.
 *
 *   2. Ánh sáng cửa sổ: WindowLight (onlyInPlayerMode) tự tắt khi mode không bật.
 *
 *   3. Đồ nhỏ tự hiện (đồ trong tủ, quân cờ...): node đích của đồ nhỏ (…Place) là con của đích đồ đựng,
 *      ghép đồ đựng xong thì đích + con tự bật (ItemController.moveToTarget). PlayerMode cho các
 *      đích con đó nảy ra lần lượt thay vì hiện cùng lúc.
 */

import { _decorator, Component, Node } from 'cc';
import { ItemManager } from './ItemManager';
import { ItemController } from '../item/ItemController';
import { TweenUtil } from '../core/TweenUtil';

const { ccclass, property } = _decorator;

@ccclass('PlayerMode')
export class PlayerMode extends Component {

    private static current: PlayerMode | null = null;

    /** Mode đang bật (component bật + node active). */
    static get active(): PlayerMode | null {
        const p = PlayerMode.current;
        return p && p.isValid && p.enabledInHierarchy ? p : null;
    }

    /** Tìm PlayerMode đang bật trong scene, dùng được cả TRƯỚC khi PlayerMode.onLoad chạy (WindowLight.start). */
    static findOn(scene: Node | null): PlayerMode | null {
        if (!scene) return null;
        for (const p of scene.getComponentsInChildren(PlayerMode)) {
            if (p.enabled && PlayerMode.isActiveChain(p.node)) return p;
        }
        return null;
    }

    private static isActiveChain(n: Node | null): boolean {
        for (; n; n = n.parent) if (!n.active) return false;
        return true;
    }

    // ---------------- Hint khi thả sai ----------------
    @property({ tooltip: 'Thả sai QUÁ N lần thì hiện tay chỉ nước đi đúng (2 = lần sai thứ 3 mới hiện).', min: 0 })
    wrongLimit = 2;

    @property({ tooltip: 'Chỉ tính là thả sai khi đã kéo item đi xa hơn N px (chạm nhẹ không tính).', min: 0 })
    minDragDistance = 30;

    @property({ tooltip: 'Chờ N giây sau khi thả sai mới hiện tay (cho item thả hụt kịp về chỗ).', min: 0 })
    hintDelay = 0.3;

    // ---------------- Đồ nhỏ tự hiện ----------------
    @property({ group: { name: 'Đồ nhỏ tự hiện', id: 'reveal' }, tooltip: 'Ghép đồ đựng xong, chờ N giây thì đồ nhỏ đầu tiên nảy ra.', min: 0 })
    revealDelay = 0.15;

    @property({ group: { name: 'Đồ nhỏ tự hiện', id: 'reveal' }, tooltip: 'N giây giữa 2 đồ nhỏ liên tiếp.', min: 0 })
    revealInterval = 0.08;

    @property({ group: { name: 'Đồ nhỏ tự hiện', id: 'reveal' }, tooltip: 'Thời gian nảy ra của mỗi đồ nhỏ (giây).', min: 0.01 })
    revealDuration = 0.3;

    private wrongCount = 0;
    private hintItem: ItemController | null = null;
    private itemManager: ItemManager | null = null;

    // ======================================================== lifecycle
    onLoad() {
        PlayerMode.current = this;
    }

    start() {
        this.itemManager = ItemManager.instance;
        this.itemManager?.node.on(ItemManager.EVENT_ITEM_ARRIVED, this.onItemArrived, this);
    }

    onDestroy() {
        if (PlayerMode.current === this) PlayerMode.current = null;
        if (this.itemManager?.isValid) this.itemManager.node.off(ItemManager.EVENT_ITEM_ARRIVED, this.onItemArrived, this);
    }

    // ======================================================== hint khi thả sai
    /** ItemController gọi khi người chơi kéo item (đi xa hơn minDragDistance) rồi thả trượt. */
    onWrongDrop(item: ItemController): void {
        this.wrongCount++;
        console.log(`[PlayerMode] thả sai ${this.wrongCount}/${this.wrongLimit}`);
        if (this.wrongCount <= this.wrongLimit) return;

        this.hintItem = item;
        this.unschedule(this.showWrongHint);
        this.scheduleOnce(this.showWrongHint, this.hintDelay);
    }

    private showWrongHint(): void {
        const im = ItemManager.instance;
        if (!im || im.isDragging) return;
        im.showMistakeHint(this.hintItem);
    }

    private onItemArrived(item?: ItemController): void {
        // Ghép đúng -> đếm lại từ đầu (ItemManager.onItemCompleted đã tắt tay)
        this.wrongCount = 0;
        this.hintItem = null;
        this.unschedule(this.showWrongHint);

        if (item?.targetPoint) this.revealSmallItems(item.targetPoint);
    }

    // ======================================================== đồ nhỏ tự hiện
    /** Đích con (…Place) của đích vừa ghép: vừa được bật cùng đích -> thu về 0 rồi nảy ra lần lượt. */
    private revealSmallItems(target: Node): void {
        const smalls = target.children.filter((c) => c.active && /Place$/.test(c.name));
        smalls.forEach((c, i) => {
            const scale = c.scale.clone();
            TweenUtil.killAll(c);
            c.setScale(0, 0, scale.z);
            this.scheduleOnce(() => {
                if (c.isValid) TweenUtil.scaleTo(c, scale, this.revealDuration, 'backOut', () => { if (c.isValid) c.setScale(scale); });
            }, this.revealDelay + i * this.revealInterval);
        });
    }
}
