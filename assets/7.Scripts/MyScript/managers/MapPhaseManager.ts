/**
 * MapPhaseManager — chia map thành nhiều lượt rớt item từ hộp.
 *
 *   Lượt 1: hộp chỉ rớt item của phases[0].items. Rớt hết -> hộp bay đi (boxExitOffset) và tắt.
 *   Ghép xong mọi item lượt 1 -> các món trong phases[0].afterComplete lần lượt hiện từ trên rơi
 *   xuống (cách nhau afterInterval giây) -> phòng chuyển sang khung nhìn lượt mới (moveRoom, nếu bật),
 *   cùng lúc hộp bật lại, bay về chỗ cũ, bật tay chỉ.
 *   Người chơi click hộp như thường -> rớt item lượt 2 ... Lượt cuối hết item -> hộp đóng như cũ.
 *
 * ItemManager.itemList được dựng lại = item mọi lượt nối nhau (thanh tiến độ = tổng, chỉ thắng
 * khi ghép hết). Món afterComplete KHÔNG tính vào tiến độ: chỉ có đích (targetPoint) của nó
 * được hiện ra, node item bị tắt.
 *
 * Trong lúc các món đang rơi: chặn kéo/zoom phòng và tắt tay gợi ý, tới khi hộp về.
 * Chỉ hỗ trợ ItemManager.spawnFromLast = false.
 */

import { _decorator, Component, Node, Vec3, UIOpacity, AudioClip, AudioSource } from 'cc';
import { Ply_SoundManager } from '../ScriptTemplate/Ply_SoundManager';
import { ItemManager } from './ItemManager';
import { BoxManager } from './BoxManager';
import { BaseRoomManager } from './BaseRoomManager';
import { UIManager } from './UIManager';
import { ItemController } from '../item/ItemController';
import { BoxController } from '../box/BoxController';
import { BaseRoom } from '../utils/BaseRoom';
import { FollowNode } from '../pipeline/FollowNode';
import { TweenUtil } from '../core/TweenUtil';
import { DreamyInputManager } from '../core/DreamyInputManager';

const { ccclass, property } = _decorator;

@ccclass('MapPhase')
export class MapPhase {
    @property({ type: Node, tooltip: 'Node cha chứa item của lượt này (vd ItemsMap1). Hộp rớt theo thứ tự trong Hierarchy.' })
    items: Node | null = null;

    @property({ type: [Node], tooltip: 'Các món tự rơi xuống khi ghép xong lượt này. Mỗi phần tử là node cha chứa item (vd ItemAfterCompleteMap1) hoặc chính node item. Để trống nếu không có.' })
    afterComplete: Node[] = [];

    @property({ tooltip: 'Ghép xong lượt này + hộp bay về xong -> chạm bất kỳ đâu (kể cả hộp) là mở Store. Không hiện End Card.' })
    storeAfterComplete = false;

    // ---- khung nhìn phòng khi BẮT ĐẦU lượt này (lượt đầu dùng intro của BaseRoomManager, bỏ qua) ----
    @property({ tooltip: 'Di chuyển / scale phòng (BaseRoom) khi chuyển lượt. Đặt ở lượt sắp bắt đầu hoặc lượt vừa xong đều được (ưu tiên lượt sắp bắt đầu).' })
    moveRoom = false;

    @property({ type: Node, tooltip: 'Phòng bay tới vị trí (world) của node này. Trống = giữ vị trí.', visible(this: MapPhase) { return this.moveRoom; } })
    roomPos: Node | null = null;

    @property({ tooltip: 'Scale phòng = scale ban đầu × hệ số này (1 = như ban đầu).', min: 0.01, visible(this: MapPhase) { return this.moveRoom; } })
    roomScaleMultiplier = 1;

    @property({ type: Node, tooltip: 'Giới hạn kéo phòng mới (trái). Trống = giữ giới hạn cũ.', visible(this: MapPhase) { return this.moveRoom; } })
    leftLimit: Node | null = null;

    @property({ type: Node, tooltip: 'Giới hạn kéo phòng mới (phải). Trống = giữ giới hạn cũ.', visible(this: MapPhase) { return this.moveRoom; } })
    rightLimit: Node | null = null;

    @property({ type: Node, tooltip: 'Giới hạn kéo phòng mới (trên). Trống = giữ giới hạn cũ.', visible(this: MapPhase) { return this.moveRoom; } })
    topLimit: Node | null = null;

    @property({ type: Node, tooltip: 'Giới hạn kéo phòng mới (dưới). Trống = giữ giới hạn cũ.', visible(this: MapPhase) { return this.moveRoom; } })
    bottomLimit: Node | null = null;
}

interface AfterEntry {
    /** null = node trang trí thường (không phải item), tự nó rơi xuống. */
    item: Node | null;
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

    // ---------------- âm thanh ----------------
    @property({ type: AudioClip, tooltip: 'Phát 1 lần khi ghép xong hết item của 1 lượt (vd hết map 1 -> sang map 2). Để trống = không phát.' })
    phaseCompleteSound: AudioClip | null = null;

    @property({ tooltip: 'Âm lượng phaseCompleteSound.', range: [0, 1, 0.05], slide: true })
    phaseCompleteVolume = 1;

    @property({ tooltip: 'Phát phaseCompleteSound sau N giây kể từ lúc ghép xong item cuối của lượt (0 = phát ngay).', min: 0 })
    phaseCompleteSoundDelay = 0;

    // ---------------- hộp ----------------
    @property({ type: Vec3, tooltip: 'Hộp bay đi theo vector này (world, tính từ chỗ đang đứng) khi rớt hết item của lượt.' })
    boxExitOffset = new Vec3(0, -700, 0);

    @property({ tooltip: 'Thời gian hộp bay đi / bay về (giây).', min: 0.01 })
    boxFlyDuration = 0.6;

    @property({ tooltip: 'Easing khi hộp bay đi.' })
    boxExitEasing = 'backIn';

    @property({ tooltip: 'Easing khi hộp bay về.' })
    boxReturnEasing = 'backOut';

    @property({ tooltip: 'Chờ bao lâu (giây) sau khi món cuối rơi xong thì phòng chuyển khung + hộp bay về (cùng lúc).', min: 0 })
    delayBeforeBoxReturn = 0.5;

    // ---------------- phòng ----------------
    @property({ tooltip: 'Thời gian phòng di chuyển / đổi scale sang khung nhìn lượt mới (giây).', min: 0.01 })
    roomMoveDuration = 1;

    @property({ tooltip: 'Easing khi phòng di chuyển sang lượt mới.' })
    roomMoveEasing = 'sineInOut';

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
        // Lượt không có item (items trống / không có ItemController) -> bỏ, nếu không hộp sẽ bay về mà không có gì để rớt
        const empty = this.phases.filter((p) => MapPhaseManager.itemsUnder(p.items).length === 0).length;
        if (empty > 0) {
            console.warn(`[MapPhaseManager] Bỏ ${empty} lượt không có item.`);
            this.phases = this.phases.filter((p) => MapPhaseManager.itemsUnder(p.items).length > 0);
        }
        this.phaseItems = this.phases.map((p) => MapPhaseManager.itemsUnder(p.items));
        this.afterEntries = this.phases.map((p) => MapPhaseManager.afterEntriesOf(p.afterComplete));

        if (!this.enabledPhases || !this.itemManager) return;
        const im = this.itemManager;
        if (im.spawnFromLast) {
            console.warn('[MapPhaseManager] Không hỗ trợ ItemManager.spawnFromLast = true — tắt chia lượt.');
            this.phaseItems = [];
            return;
        }

        im.itemList = ([] as Node[]).concat(...this.phaseItems);
        im.spawnLimit = this.phaseItems[0].length;

        // Món tự rơi: node item tắt hẳn (không kéo được), đích ẩn tới lúc rơi.
        // Node thường (item = null) giữ nguyên trạng thái trong scene, không đụng tới lúc start.
        for (const list of this.afterEntries) {
            for (const e of list) {
                if (!e.item) continue;
                e.item.active = false;
                e.target.active = false;
                FollowNode.setSuppressedFor(e.target, true);
            }
        }

        BoxManager.emptyItemsInterceptor = (box) => this.onSpawnExhausted(box);
        // UIManager.checkEndGame chạy TRƯỚC onItemArrived (cùng lúc ghép item cuối lượt) -> phải chặn từ đây
        UIManager.endGameInterceptor = () => this.transitioning || this.isPhaseDonePendingTransition();
        im.node.on(ItemManager.EVENT_ITEM_ARRIVED, this.onItemArrived, this);

        console.log(`[MapPhaseManager] ${this.phaseItems.length} lượt: ${this.phaseItems.map((l) => l.length).join(' + ')} item`
            + `, món tự rơi: ${this.afterEntries.map((l) => l.length).join(' / ')}`);
    }

    onDestroy() {
        if (MapPhaseManager.instance === this) MapPhaseManager.instance = null;
        if (BoxManager.emptyItemsInterceptor) BoxManager.emptyItemsInterceptor = null;
        if (UIManager.endGameInterceptor) UIManager.endGameInterceptor = null;
        if (this.itemManager?.isValid) this.itemManager.node.off(ItemManager.EVENT_ITEM_ARRIVED, this.onItemArrived, this);
    }

    /** Con trực tiếp có ItemController, theo thứ tự Hierarchy. */
    private static itemsUnder(parent: Node | null): Node[] {
        if (!parent) return [];
        return parent.children.filter((c) => !!c.getComponent(ItemController));
    }

    /**
     * Mỗi node trong afterComplete:
     *   - có ItemController      -> hiện đích (targetPoint) của nó
     *   - chứa item con          -> hiện đích của từng item con (node cha kiểu ItemAfterCompleteMap1)
     *   - node thường (sàn, tường...) -> chính node đó rơi xuống
     */
    private static afterEntriesOf(nodes: Node[] | null): AfterEntry[] {
        if (!nodes) return [];
        const out: AfterEntry[] = [];
        const addItem = (item: Node) => {
            const target = item.getComponent(ItemController)?.targetPoint ?? null;
            if (target) out.push({ item, target });
        };
        for (const n of nodes) {
            if (!n) continue;
            if (n.getComponent(ItemController)) { addItem(n); continue; }
            const items = MapPhaseManager.itemsUnder(n);
            if (items.length > 0) items.forEach(addItem);
            else out.push({ item: null, target: n });
        }
        return out;
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

    /** Lượt hiện tại (không phải lượt cuối) đã ghép hết item -> sắp chuyển lượt. */
    private isPhaseDonePendingTransition(): boolean {
        if (!this.enabledPhases || this.isLastPhase) return false;
        return this.phaseItems[this.phaseIndex].every((n) => !n.isValid || !!n.getComponent(ItemController)?.isPlaced);
    }

    // ======================================================== ghép xong lượt -> món rơi -> hộp về
    private onItemArrived(): void {
        if (this.transitioning || !this.isPhaseDonePendingTransition()) return;

        this.transitioning = true;
        this.setPlayerInputBlocked(true);
        DreamyInputManager.canInput = false;   // cả lúc chờ chuyển lượt: không nhận chạm nào
        if (this.phaseCompleteSoundDelay > 0) this.scheduleOnce(() => this.playPhaseCompleteSound(), this.phaseCompleteSoundDelay);
        else this.playPhaseCompleteSound();
        // món afterComplete rơi xong -> (delayBeforeBoxReturn) -> phòng chuyển sang khung nhìn lượt mới
        // CÙNG LÚC hộp bật lại + bay về; cả hai xong mới mở khoá thao tác
        this.scheduleOnce(() => this.dropAfterItems(this.phaseIndex, () => {
            this.scheduleOnce(() => this.startNextPhase(), this.delayBeforeBoxReturn);
        }), this.delayBeforeAfter);
    }

    private startNextPhase(): void {
        // storeAfterComplete: hộp tới chỗ là chạm đâu cũng ra Store (canInput vẫn tắt từ onItemArrived tới lúc đó)
        const toStore = !!this.phases[this.phaseIndex]?.storeAfterComplete;
        if (toStore) console.log(`[MapPhaseManager] Lượt ${this.phaseIndex + 1} bật storeAfterComplete -> hộp về là chạm đâu cũng mở Store, KHÔNG chơi tiếp lượt sau.`);
        let pending = 2;
        const done = () => {
            if (--pending > 0) return;
            this.boxAway = false;
            this.transitioning = false;
            this.setPlayerInputBlocked(false);
            // Luôn mở lại chạm (onItemArrived đã tắt) — kể cả khi game đã End giữa chừng, nếu không sẽ kẹt không nhận input
            DreamyInputManager.canInput = true;
            // itemsToEndGame có thể đã đủ trong lúc chuyển lượt (bị hoãn) -> xét lại
            if (!toStore) UIManager.instance?.recheckEndGame();
        };
        this.moveRoomTo(this.phaseIndex + 1, done);
        this.returnBox(() => {
            if (toStore) {
                // hộp vừa về: chạm đâu cũng ra Store — không chờ phòng di chuyển xong
                UIManager.instance?.enableStoreOnAnyClick(false);
                DreamyInputManager.canInput = true;
            }
            done();
        });
    }

    /**
     * Đưa phòng sang khung nhìn của lượt `phase`, rồi gọi onDone.
     * Lấy cấu hình moveRoom của lượt `phase`; lượt đó không bật thì dùng của lượt vừa xong
     * (phase - 1) — đặt ở lượt nào cũng chạy.
     */
    private moveRoomTo(phase: number, onDone: () => void): void {
        const next = this.phases[phase], prev = this.phases[phase - 1];
        const p = next && next.moveRoom ? next : prev && prev.moveRoom ? prev : null;
        const brm = BaseRoomManager.instance;
        if (!p || !brm) { onDone(); return; }

        const room = brm.baseRoom?.getComponent(BaseRoom);
        if (room) {
            if (p.leftLimit) room.leftLimitPos = p.leftLimit;
            if (p.rightLimit) room.rightLimitPos = p.rightLimit;
            if (p.topLimit) room.topLimitPos = p.topLimit;
            if (p.bottomLimit) room.bottomLimitPos = p.bottomLimit;
        }
        brm.moveToPhase(p.roomPos, p.roomScaleMultiplier, this.roomMoveDuration, this.roomMoveEasing, onDone);
    }

    private playPhaseCompleteSound(): void {
        if (!this.phaseCompleteSound || Ply_SoundManager.Ins?.isMuted) return;
        const src = this.getComponent(AudioSource) ?? this.addComponent(AudioSource);
        src.playOnAwake = false;
        src.playOneShot(this.phaseCompleteSound, this.phaseCompleteVolume);
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
    private returnBox(onDone: () => void): void {
        const im = this.itemManager;
        this.phaseIndex++;
        if (im) im.spawnLimit += this.phaseItems[this.phaseIndex].length;

        const box = BoxManager.instance?.box?.getComponent(BoxController) ?? null;
        if (box) box.flyBack(this.boxFlyDuration, this.boxReturnEasing, onDone);
        else onDone();
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
