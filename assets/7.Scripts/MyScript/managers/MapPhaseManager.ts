/**
 * MapPhaseManager — chia map thành nhiều lượt rớt item từ hộp.
 *
 *   Lượt 1: hộp chỉ rớt item của phases[0].items. Rớt hết -> hộp bay đi (boxExitOffset) và tắt.
 *   Ghép xong mọi item lượt 1 -> các món trong phases[0].afterComplete lần lượt hiện từ trên rơi
 *   xuống (cách nhau afterInterval giây) -> hộp bật lại, bay về chỗ cũ, bật tay chỉ.
 *   Người chơi click hộp như thường -> rớt item lượt 2 ... Lượt cuối hết item -> hộp đóng như cũ.
 *
 * ItemManager.itemList được dựng lại = item mọi lượt nối nhau (thanh tiến độ = tổng, chỉ thắng
 * khi ghép hết). Món afterComplete KHÔNG tính vào tiến độ: chỉ có đích (targetPoint) của nó
 * được hiện ra, node item bị tắt.
 *
 * Trong lúc các món đang rơi: chặn kéo/zoom phòng và tắt tay gợi ý, tới khi hộp về.
 * Chỉ hỗ trợ ItemManager.spawnFromLast = false.
 */

import { _decorator, Component, Node, Vec3, UIOpacity } from 'cc';
import { ItemManager } from './ItemManager';
import { BoxManager } from './BoxManager';
import { ItemController } from '../item/ItemController';
import { BoxController } from '../box/BoxController';
import { BaseRoom } from '../utils/BaseRoom';
import { FollowNode } from '../pipeline/FollowNode';
import { TweenUtil } from '../core/TweenUtil';

const { ccclass, property } = _decorator;

@ccclass('MapPhase')
export class MapPhase {
    @property({ type: Node, tooltip: 'Node cha chứa item của lượt này (vd ItemsMap1). Hộp rớt theo thứ tự trong Hierarchy.' })
    items: Node | null = null;

    @property({ type: Node, tooltip: 'Node cha chứa các món tự rơi xuống khi ghép xong lượt này (vd ItemAfterCompleteMap1). Để trống nếu không có.' })
    afterComplete: Node | null = null;
}

interface AfterEntry {
    item: Node;
    target: Node;
}

@ccclass('MapPhaseManager')
export class MapPhaseManager extends Component {

    static instance: MapPhaseManager | null = null;

    @property({ type: [MapPhase], tooltip: 'Các lượt theo thứ tự. Để trống = tắt, hộp rớt toàn bộ itemList như cũ.' })
    phases: MapPhase[] = [];

    // ---------------- món rơi sau khi xong lượt ----------------
    @property({ tooltip: 'Chờ bao lâu (giây) sau khi ghép xong item cuối của lượt thì bắt đầu rơi.', min: 0 })
    delayBeforeAfter = 0.5;

    @property({ tooltip: 'N giây giữa 2 món rơi liên tiếp.', min: 0 })
    afterInterval = 0.4;

    @property({ tooltip: 'Món bắt đầu rơi từ cao hơn chỗ đặt bao nhiêu (px, world).' })
    fallHeight = 300;

    @property({ tooltip: 'Thời gian rơi + hiện dần của mỗi món (giây).', min: 0.01 })
    fallDuration = 0.6;

    @property({ tooltip: 'Easing khi rơi (tên easing của cc.tween, vd bounceOut, backOut, quadOut).' })
    fallEasing = 'bounceOut';

    // ---------------- hộp ----------------
    @property({ type: Vec3, tooltip: 'Hộp bay đi theo vector này (world, tính từ chỗ đang đứng) khi rớt hết item của lượt.' })
    boxExitOffset = new Vec3(0, -700, 0);

    @property({ tooltip: 'Thời gian hộp bay đi / bay về (giây).', min: 0.01 })
    boxFlyDuration = 0.6;

    @property({ tooltip: 'Easing khi hộp bay đi.' })
    boxExitEasing = 'backIn';

    @property({ tooltip: 'Easing khi hộp bay về.' })
    boxReturnEasing = 'backOut';

    @property({ tooltip: 'Chờ bao lâu (giây) sau khi món cuối rơi xong thì hộp bay về.', min: 0 })
    delayBeforeBoxReturn = 0.5;

    /** Item của từng lượt (đã lọc node có ItemController). */
    private phaseItems: Node[][] = [];
    /** Món tự rơi của từng lượt. */
    private afterEntries: AfterEntry[][] = [];
    private phaseIndex = 0;
    private boxAway = false;
    private transitioning = false;
    private itemManager: ItemManager | null = null;

    get enabledPhases(): boolean {
        return this.phaseItems.length > 1;
    }

    // ======================================================== lifecycle
    onLoad() {
        MapPhaseManager.instance = this;

        // Chạy trước mọi start(): ItemManager / UIManager đọc itemList trong start()
        this.itemManager = this.node.scene?.getComponentsInChildren(ItemManager)[0] ?? null;
        this.phaseItems = this.phases.map((p) => MapPhaseManager.itemsUnder(p.items));
        this.afterEntries = this.phases.map((p) => MapPhaseManager.itemsUnder(p.afterComplete)
            .map((item) => ({ item, target: item.getComponent(ItemController)?.targetPoint ?? null }))
            .filter((e): e is AfterEntry => !!e.target));

        if (!this.enabledPhases || !this.itemManager) return;
        const im = this.itemManager;
        if (im.spawnFromLast) {
            console.warn('[MapPhaseManager] Không hỗ trợ ItemManager.spawnFromLast = true — tắt chia lượt.');
            this.phaseItems = [];
            return;
        }

        im.itemList = ([] as Node[]).concat(...this.phaseItems);
        im.spawnLimit = this.phaseItems[0].length;

        // Món tự rơi: node item tắt hẳn (không kéo được), đích ẩn tới lúc rơi
        for (const list of this.afterEntries) {
            for (const e of list) {
                e.item.active = false;
                e.target.active = false;
                FollowNode.setSuppressedFor(e.target, true);
            }
        }

        BoxManager.emptyItemsInterceptor = (box) => this.onSpawnExhausted(box);
        im.node.on(ItemManager.EVENT_ITEM_ARRIVED, this.onItemArrived, this);

        console.log(`[MapPhaseManager] ${this.phaseItems.length} lượt: ${this.phaseItems.map((l) => l.length).join(' + ')} item`
            + `, món tự rơi: ${this.afterEntries.map((l) => l.length).join(' / ')}`);
    }

    onDestroy() {
        if (MapPhaseManager.instance === this) MapPhaseManager.instance = null;
        if (BoxManager.emptyItemsInterceptor) BoxManager.emptyItemsInterceptor = null;
        if (this.itemManager?.isValid) this.itemManager.node.off(ItemManager.EVENT_ITEM_ARRIVED, this.onItemArrived, this);
    }

    /** Con trực tiếp có ItemController, theo thứ tự Hierarchy. */
    private static itemsUnder(parent: Node | null): Node[] {
        if (!parent) return [];
        return parent.children.filter((c) => !!c.getComponent(ItemController));
    }

    private get isLastPhase(): boolean {
        return this.phaseIndex >= this.phaseItems.length - 1;
    }

    // ======================================================== hết item của lượt -> hộp bay đi
    /** BoxManager gọi khi hộp hết item được phép rớt. true = đã xử lý (không đóng hộp). */
    private onSpawnExhausted(box: BoxController): boolean {
        if (!this.enabledPhases || this.isLastPhase) return false;
        if (!this.boxAway) {
            this.boxAway = true;
            box.flyAway(this.boxExitOffset, this.boxFlyDuration, this.boxExitEasing);
        }
        return true;
    }

    // ======================================================== ghép xong lượt -> món rơi -> hộp về
    private onItemArrived(): void {
        if (!this.enabledPhases || this.transitioning || this.isLastPhase) return;
        const left = this.phaseItems[this.phaseIndex].filter((n) => n.isValid && !n.getComponent(ItemController)?.isPlaced);
        if (left.length > 0) return;

        this.transitioning = true;
        this.setPlayerInputBlocked(true);
        this.scheduleOnce(() => this.dropAfterItems(this.phaseIndex, () => {
            this.scheduleOnce(() => this.returnBox(), this.delayBeforeBoxReturn);
        }), this.delayBeforeAfter);
    }

    /** Lần lượt hiện đích của các món afterComplete: rơi từ trên xuống + hiện dần. */
    private dropAfterItems(phase: number, onDone: () => void): void {
        const list = this.afterEntries[phase] ?? [];
        if (list.length === 0) { onDone(); return; }

        list.forEach((e, i) => {
            this.scheduleOnce(() => {
                const t = e.target;
                if (!t.isValid) return;
                const home = t.worldPosition.clone();
                const op = t.getComponent(UIOpacity) ?? t.addComponent(UIOpacity);
                op.opacity = 0;
                t.active = true;
                for (const c of t.children) c.active = true;
                FollowNode.setSuppressedFor(t, false);
                t.setWorldPosition(home.x, home.y + this.fallHeight, home.z);

                TweenUtil.moveTo(t, home, this.fallDuration, this.fallEasing);
                // hiện dần nhanh hơn một chút so với rơi để lúc chạm đất đã rõ hẳn
                TweenUtil.valueTo(this.fallDuration * 0.6, (k) => { if (op.isValid) op.opacity = 255 * k; }, 'quadOut', false,
                    () => { if (op.isValid) op.opacity = 255; });

                if (i === list.length - 1) this.scheduleOnce(onDone, this.fallDuration);
            }, i * this.afterInterval);
        });
    }

    /** Hộp bật lại, bay về chỗ cũ; mở lượt tiếp theo cho hộp rớt. */
    private returnBox(): void {
        const im = this.itemManager;
        this.phaseIndex++;
        if (im) im.spawnLimit += this.phaseItems[this.phaseIndex].length;

        const box = BoxManager.instance?.box?.getComponent(BoxController) ?? null;
        const finish = () => {
            this.boxAway = false;
            this.transitioning = false;
            this.setPlayerInputBlocked(false);
        };
        if (box) box.flyBack(this.boxFlyDuration, this.boxReturnEasing, finish);
        else finish();
    }

    // ======================================================== chặn thao tác lúc chuyển lượt
    private roomWasInteractive = new Map<BaseRoom, boolean>();

    private setPlayerInputBlocked(blocked: boolean): void {
        this.itemManager?.setHintsBlocked(blocked);
        const rooms = this.node.scene?.getComponentsInChildren(BaseRoom) ?? [];
        for (const room of rooms) {
            if (blocked) {
                this.roomWasInteractive.set(room, room.isInteractionEnabled);
                room.disableInteraction();
            } else if (this.roomWasInteractive.get(room)) {
                room.enableInteraction();
            }
        }
        if (!blocked) this.roomWasInteractive.clear();
    }
}
