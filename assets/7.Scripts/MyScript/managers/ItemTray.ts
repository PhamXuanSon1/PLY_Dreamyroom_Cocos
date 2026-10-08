/**
 * ItemTray — khay 5 ô vuông ở dưới màn hình, thay cho Box (hộp quà).
 *
 * Luồng:
 *   - Vào game: lấy lần lượt item từ ItemManager.itemList đặt vào từng ô, thu nhỏ vừa khít ô.
 *     Item có SeatHandler mà requiredItems chưa ghép xong thì BỎ QUA (giữ chỗ trong hàng chờ),
 *     lấy item kế tiếp; ghép xong item bắt buộc thì nó mới được vào ô.
 *   - Cầm item lên: phóng về đúng kích thước trong phòng (khớp bóng ở đích).
 *   - Thả hụt: bay về lại ô của nó.
 *   - Ghép đúng: lấp mọi ô trống bằng item hợp lệ tiếp theo trong itemList.
 *
 * Ô = node con có HolderSlot (kéo thả/đổi vị trí tự do trong Hierarchy).
 * Khi node này active thì Box không còn dùng nữa (tắt node Box trong scene).
 */

import { _decorator, Component, Node, Vec3, UITransform } from 'cc';
import { HolderSlot } from '../utils/HolderSlot';
import { SeatHandler } from '../utils/SeatHandler';
import { ItemController } from '../item/ItemController';
import { ItemManager } from './ItemManager';
import { UIManager } from './UIManager';
import { BaseRoomManager } from './BaseRoomManager';
import { TweenUtil } from '../core/TweenUtil';

const { ccclass, property } = _decorator;

/** Trạng thái của item lúc còn nằm trong phòng (trước khi vào khay). */
interface RoomInfo {
    parent: Node;
    localScale: Vec3;
    euler: Vec3;
    /** Kích thước "gốc" (scale = 1) theo world, để tính scale vừa ô. */
    naturalW: number;
    naturalH: number;
}

@ccclass('ItemTray')
export class ItemTray extends Component {

    static instance: ItemTray | null = null;

    @property({ tooltip: 'Tỉ lệ phần ô mà item được chiếm (0.9 = chừa viền 5% mỗi bên).', min: 0.1, max: 1 })
    fillRatio = 0.9;

    @property({ tooltip: 'Item nhỏ được phóng to tối đa bao nhiêu lần so với kích thước trong phòng để lấp ô.', min: 1 })
    maxEnlarge = 3;

    @property({ tooltip: 'Vào game: chờ bao nhiêu giây rồi mới bắt đầu đổ item vào khay.', min: 0 })
    startDelay = 0.3;

    @property({ tooltip: 'Khoảng cách thời gian giữa các ô khi đổ item lúc vào game (giây).', min: 0 })
    fillStagger = 0.08;

    @property({ tooltip: 'Ghép xong 1 item: chờ bao nhiêu giây rồi lấp item mới vào ô vừa trống.', min: 0 })
    refillDelay = 0.3;

    @property({ tooltip: 'Thời gian item bay về ô khi thả hụt (giây).', min: 0 })
    returnDuration = 0.3;

    @property({ type: Node, tooltip: 'Thanh tiến độ (Slider) bật lên khi vào game. Để trống nếu không dùng.' })
    slider: Node | null = null;

    private slots: HolderSlot[] = [];
    /** Item chưa vào khay, theo thứ tự itemList (đã đảo nếu spawnFromLast). null = chưa dựng. */
    private queue: Node[] | null = null;
    private roomInfo = new Map<ItemController, RoomInfo>();
    private autoEndStarted = false;

    // ======================================================== lifecycle
    onLoad() {
        ItemTray.instance = this;
        this.slots = this.node.getComponentsInChildren(HolderSlot);
    }

    onDestroy() {
        if (ItemTray.instance === this) ItemTray.instance = null;
    }

    start() {
        // Vào game: mọi item chưa vào khay đều scale 0 (ẩn), chỉ item được đưa vào ô mới hiện ra
        this.hideWaitingItems();

        const im = ItemManager.instance;
        if (im) {
            // Hint / isAllHolderEmpty / getFirstItemInHolder đọc holderItemList -> trỏ về các ô khay
            im.holderItemList = this.slots.map((s) => s.node);
            if (im.handIntro) im.handIntro.active = false;
        }
        if (this.slider) this.slider.active = true;

        // Không có Box nên không có "click Box lần đầu": bật luôn pan/zoom phòng + logic đi kèm
        BaseRoomManager.instance?.playIntroAnimation(() => {
            if (ItemManager.instance) ItemManager.instance.finishedTutorial = true;
        });
        im?.onBoxFirstClicked();

        // ItemManager.start() phải chạy trước (đặt currentItemIndex) -> chờ sang frame sau
        this.scheduleOnce(() => this.fillAll(), Math.max(this.startDelay, 0.01));
    }

    /**
     * Chụp kích thước trong phòng của mọi item rồi đặt scale 0. Phải chụp TRƯỚC khi về 0,
     * vì fitScale/onItemPicked tính từ scale + bounds lúc item còn nằm trong phòng.
     */
    private hideWaitingItems(): void {
        const items = this.node.scene?.getComponentsInChildren(ItemController) ?? [];
        for (const item of items) {
            if (item.isPlaced || item.currentHolderSlot) continue;
            this.captureRoomInfo(item);
            TweenUtil.killAll(item.node);
            item.node.setScale(0, 0, 0);
        }
    }

    // ======================================================== đổ item vào ô
    private fillAll(): void {
        let first: ItemController | null = null;
        this.slots.forEach((slot, i) => {
            if (!slot.isEmpty) return;
            const item = this.fillSlot(slot, i * this.fillStagger);
            if (!first) first = item;
        });
        this.warnIfStuck();
        const firstItem = first as ItemController | null;
        if (firstItem) {
            this.scheduleOnce(() => ItemManager.instance?.showFirstDragHint(firstItem),
                this.slots.length * this.fillStagger + 0.4);
        }
    }

    /** Lấy item hợp lệ kế tiếp bỏ vào `slot`. Trả về null nếu không có item nào vào được. */
    private fillSlot(slot: HolderSlot, delay = 0): ItemController | null {
        const im = ItemManager.instance;
        if (!im || !slot.isEmpty) return null;

        const node = this.takeNext();
        if (!node) return null;
        const item = node.getComponent(ItemController);
        if (!item) return null;

        this.captureRoomInfo(item);

        slot.itemInSlot = node;
        slot.isEmpty = false;
        item.currentHolderSlot = slot;

        TweenUtil.killAll(node);
        node.active = true;
        node.setParent(slot.node, false);
        node.setPosition(Vec3.ZERO);
        node.eulerAngles = this.roomInfo.get(item)!.euler;
        node.setScale(0, 0, 0);

        const fit = this.fitScale(item, slot);
        if (delay > 0) TweenUtil.delayedCall(this, delay, () => TweenUtil.scaleTo(node, fit, 0.35, 'backOut'));
        else TweenUtil.scaleTo(node, fit, 0.35, 'backOut');

        if (im.isStoreTriggerItem(node)) UIManager.instance?.enableStoreOnAnyClick();
        return item;
    }

    /** Chụp trạng thái item trong phòng — chỉ chụp lần đầu (lúc item còn nằm dưới Items). */
    private captureRoomInfo(item: ItemController): void {
        if (this.roomInfo.has(item)) return;
        const node = item.node;
        const parent = node.parent!;
        const box = item.itemGraphic?.getCombinedBounds();
        const ws = node.worldScale;
        const sx = Math.abs(ws.x) || 1;
        const sy = Math.abs(ws.y) || 1;
        this.roomInfo.set(item, {
            parent,
            localScale: node.scale.clone(),
            euler: node.eulerAngles.clone(),
            naturalW: box ? box.width / sx : 100,
            naturalH: box ? box.height / sy : 100,
        });
    }

    /** Scale (local, dưới node ô) để item vừa khít ô (theo cả chiều rộng lẫn chiều cao của ô). */
    private fitScale(item: ItemController, slot: HolderSlot): Vec3 {
        const info = this.roomInfo.get(item)!;
        const ut = slot.getComponent(UITransform);
        const slotWS = Math.abs(slot.node.worldScale.x) || 1;
        const innerW = (ut ? ut.width : 180) * this.fillRatio * slotWS;
        const innerH = (ut ? ut.height : 180) * this.fillRatio * slotWS;

        let world = Math.min(innerW / Math.max(info.naturalW, 1), innerH / Math.max(info.naturalH, 1));
        const roomWorld = Math.abs(this.roomWorldScale(info).x);
        world = Math.min(world, roomWorld * this.maxEnlarge);

        const k = world / slotWS;
        const s = info.localScale;
        return new Vec3(Math.sign(s.x || 1) * k, Math.sign(s.y || 1) * k, 1);
    }

    /** World scale của item nếu nằm trong phòng ở mức zoom hiện tại. */
    private roomWorldScale(info: RoomInfo): Vec3 {
        const p = info.parent.isValid ? info.parent.worldScale : Vec3.ONE;
        return new Vec3(info.localScale.x * Math.abs(p.x), info.localScale.y * Math.abs(p.y), 1);
    }

    // ======================================================== hook từ ItemController
    /**
     * Item trong khay vừa được cầm lên: NGAY LẬP TỨC (1 frame) đổi về đúng kích thước thật
     * trong phòng (= scale ở target). Trả về true nếu item thuộc khay.
     */
    onItemPicked(item: ItemController): boolean {
        const info = this.roomInfo.get(item);
        if (!info) return false;

        if (!this.autoEndStarted) {
            // Box cũ bắt đầu đồng hồ auto-end từ lần click Box đầu tiên -> giờ là lần cầm item đầu tiên
            this.autoEndStarted = true;
            UIManager.instance?.startAutoEndTimer();
        }

        const parentWS = item.node.parent ? Math.abs(item.node.parent.worldScale.x) || 1 : 1;
        const w = this.roomWorldScale(info);
        const dragScale = new Vec3(w.x / parentWS, w.y / parentWS, 1);
        TweenUtil.killAll(item.node);              // dừng tween pop-in / bay về ô đang chạy dở
        item.node.setScale(dragScale);
        const mv = item.itemMovement;
        if (mv) {
            mv.originalScale = dragScale.clone();
            mv.originalRotation = info.euler.clone();
        }
        return true;
    }

    /** Thả hụt: bay về ô. Trả về false nếu item không thuộc khay (để ItemController xử lý như cũ). */
    returnItem(item: ItemController): boolean {
        const slot = item.currentHolderSlot;
        const info = this.roomInfo.get(item);
        if (!slot || !info || this.slots.indexOf(slot) < 0) return false;

        const node = item.node;
        TweenUtil.killAll(node);

        // Bay về vẫn nằm ở lớp kéo (trên cùng) -> bay ngang qua ô khác không bị nền ô che.
        // Tới nơi mới gán lại làm con của ô.
        const fit = this.fitScale(item, slot);
        const parentWS = node.parent ? Math.abs(node.parent.worldScale.x) || 1 : 1;
        const k = (Math.abs(slot.node.worldScale.x) || 1) / parentWS;
        const flyScale = new Vec3(fit.x * k, fit.y * k, fit.z);

        TweenUtil.moveTo(node, slot.node.worldPosition, this.returnDuration, 'quadOut', () => {
            if (!node.isValid || item.currentHolderSlot !== slot) return;
            item.itemGraphic?.restoreOriginalLayers();   // savedParent = ô (lưu lúc bringToFront)
            if (node.parent !== slot.node) node.setParent(slot.node, true);
            node.setPosition(Vec3.ZERO);
            node.setScale(fit);
            node.eulerAngles = info.euler;
        });
        TweenUtil.scaleTo(node, flyScale, this.returnDuration, 'quadOut');
        TweenUtil.rotateTo(node, info.euler, this.returnDuration, 'quadOut');
        return true;
    }

    /**
     * Item ghép xong và đã rời ô -> lấp item mới. Lấp MỌI ô trống chứ không chỉ ô vừa trống:
     * item vừa ghép có thể là requiredItem của item đang bị chặn, ô nào trước đó bỏ trống
     * vì hết item hợp lệ thì giờ có thể lấp được.
     */
    onSlotFreed(slot: HolderSlot): void {
        if (this.slots.indexOf(slot) < 0) return;
        TweenUtil.delayedCall(this, this.refillDelay, () => this.fillEmptySlots());
    }

    private fillEmptySlots(): void {
        let i = 0;
        for (const s of this.slots) {
            if (s.isValid && s.isEmpty) this.fillSlot(s, (i++) * this.fillStagger);
        }
        this.warnIfStuck();
    }

    // ======================================================== hàng chờ
    private buildQueue(): Node[] {
        const im = ItemManager.instance;
        const list = (im?.itemList ?? []).filter((n) => {
            const item = n && n.isValid ? n.getComponent(ItemController) : null;
            return !!item && !item.isPlaced;
        });
        if (im?.spawnFromLast) list.reverse();
        return list;
    }

    /** Item được vào ô khi không có SeatHandler, hoặc mọi requiredItems đã ghép xong. */
    private static canEnter(node: Node): boolean {
        const seat = node.getComponent(SeatHandler);
        return !seat || seat.canPlace();
    }

    /** Rút item hợp lệ đầu tiên khỏi hàng chờ; item bị chặn giữ nguyên vị trí để lần sau xét lại. */
    private takeNext(): Node | null {
        if (!this.queue) this.queue = this.buildQueue();
        const i = this.queue.findIndex((n) => n.isValid && ItemTray.canEnter(n));
        if (i < 0) return null;
        return this.queue.splice(i, 1)[0];
    }

    /** Khay rỗng hoàn toàn mà hàng chờ toàn item bị chặn -> báo để sửa dữ liệu (requiredItem không có trong itemList?). */
    private warnIfStuck(): void {
        if (!this.queue || this.queue.length === 0) return;
        if (this.slots.some((s) => !s.isEmpty)) return;
        console.warn('[ItemTray] Khay trống nhưng mọi item còn lại đều bị SeatHandler chặn: '
            + this.queue.map((n) => n.name).join(', ')
            + ' — kiểm tra requiredItems có nằm trong ItemManager.itemList không.');
    }
}
