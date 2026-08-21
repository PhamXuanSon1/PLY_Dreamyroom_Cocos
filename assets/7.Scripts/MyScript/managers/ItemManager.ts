/**
 * ItemManager — port từ Assets/_GAME/Script/Manager/ItemManager.cs (Unity)
 *
 * BỎ so với bản Unity:
 *   - optimizeForLuna / objectsToDisableForLuna / animatorsToDisableForLuna
 *   - ProgressTrackingManager (chỉ phục vụ AppLovin)
 *   - khối #if UNITY_EDITOR (AlignBarItemsInEditor)
 *
 * KHÁC bản Unity:
 *   - Bỏ Update() poll Input; InputManager gọi onAnyPointerDown().
 *   - SortingGroup không tồn tại trong Cocos nên bỏ đoạn tắt SortingGroup.
 */

import { _decorator, Component, Node, Color, Camera, Vec3 } from 'cc';
import { ItemController } from '../item/ItemController';
import { ItemGraphic } from '../item/ItemGraphic';
import { HolderSlot } from '../utils/HolderSlot';
import { SeatHandler } from '../utils/SeatHandler';
import { TweenUtil } from '../core/TweenUtil';
import { WorldScrollManager } from './WorldScrollManager';
import { UIManager } from './UIManager';
import { BoxManager } from './BoxManager';

const { ccclass, property } = _decorator;

@ccclass('ItemManager')
export class ItemManager extends Component {

    static instance: ItemManager | null = null;

    // ---------------- Elements ----------------
    @property({ tooltip: 'Lấy item từ cuối danh sách (từ dưới lên).' })
    spawnFromLast = false;

    @property({ type: [Node], tooltip: 'Danh sách item sẽ rớt ra từ hộp.' })
    itemList: Node[] = [];

    @property({ type: [Node], tooltip: 'Thứ tự hiển thị bóng. Để trống = dùng itemList.' })
    shadowList: Node[] = [];

    @property({ type: [Node], tooltip: 'Các vị trí chờ (Holder).' })
    holderItemList: Node[] = [];

    private currentItemIndex = 0;

    // ---------------- Pop / Drag ----------------
    @property({ tooltip: 'Cho phép phóng to item khi lấy ra khỏi hộp.' })
    enablePopScale = true;

    @property({ tooltip: 'Lượng scale khi lấy ra khỏi hộp.' })
    popScaleAmount = 1.2;

    @property({ tooltip: 'Cho phép phóng to item khi đang kéo.' })
    enableDragScale = true;

    @property({ tooltip: 'Lượng scale khi đang kéo.' })
    dragScaleAmount = 1.1;

    // ---------------- First click ----------------
    @property({ type: [Node], tooltip: 'Object BẬT khi click lần đầu.' })
    objsToEnableOnFirstClick: Node[] = [];

    @property({ type: [Node], tooltip: 'Object TẮT khi click lần đầu.' })
    objsToDisableOnFirstClick: Node[] = [];

    private isFirstClicked = false;

    // ---------------- Status ----------------
    lastInteractedItem: ItemController | null = null;

    @property({ type: Node, tooltip: 'Object bật lên khi ghép xong item đầu tiên.' })
    objToEnableAfterFirstItem: Node | null = null;

    @property({ type: [Node], tooltip: 'Pháo hoa khi hoàn thành màn.' })
    WinConfetti: Node[] = [];

    // ---------------- Hint ----------------
    private idleTimer = 0;

    @property({ tooltip: 'Bao lâu không thao tác thì hiện hint (giây).' })
    idleTimeToHint = 5;

    @property({ tooltip: 'Số item tối đa được gợi ý. -1 = vô hạn.' })
    maxHintItems = 3;

    private hasShownHint = false;

    @property({ type: Node, tooltip: 'Bàn tay chỉ dẫn.' })
    handHint: Node | null = null;

    @property({ type: Node, tooltip: 'Bàn tay hướng dẫn ở đầu game.' })
    handIntro: Node | null = null;

    isDragging = false;
    arrivedItemCount = 0;
    showedFirstDragHint = false;

    @property({ tooltip: 'Số item mỗi đợt hiện bóng.' })
    shadowBatchSize = 4;

    currentBatchItems: ItemController[] = [];

    private currentHolder: Node | null = null;

    // ---------------- Target graphic ----------------
    @property({ tooltip: 'Màu bóng ở vị trí đích.' })
    targetShadowColor: Color = new Color(51, 51, 51, 255);

    @property({ tooltip: 'Màu đích khi phục hồi.' })
    targetNormalColor: Color = new Color(255, 255, 255, 255);

    @property({ type: Camera, tooltip: 'Camera dùng để kiểm tra item có nằm trong khung hình.' })
    mainCamera: Camera | null = null;

    private hintTweenRunning = false;

    // ======================================================== lifecycle
    onLoad() {
        ItemManager.instance = this;
        ItemGraphic.targetShadowColor = this.targetShadowColor.clone();
        ItemGraphic.targetNormalColor = this.targetNormalColor.clone();
        this.resetItemIndex();
        this.ensureHolders();
    }

    resetItemIndex(): void {
        if (this.spawnFromLast) {
            this.currentItemIndex = this.itemList.length - 1;
        } else {
            this.currentItemIndex = 0;
        }
    }

    ensureHolders(): void {
        if (!this.holderItemList || this.holderItemList.length === 0 || this.holderItemList.some(h => !h || !h.isValid)) {
            const slots = this.node.scene?.getComponentsInChildren(HolderSlot) ?? [];
            if (slots.length > 0) {
                this.holderItemList = slots.map(s => s.node);
            }
        }
    }

    @property({ tooltip: 'Chỉ hiện bóng (Shadow) khi item được sinh ra từ Hộp (Click Box -> ra Item -> hiện bóng)' })
    showShadowOnSpawnOnly = true;

    start() {
        this.ensureHolders();
        if (this.handIntro) this.handIntro.active = false;

        if (this.showShadowOnSpawnOnly) {
            this.initTargetShadows();
        } else {
            this.updateVisibleShadows();
        }

        // Unity: DOVirtual.DelayedCall(0.1f, ...)
        this.scheduleOnce(() => {
            const scroll = WorldScrollManager.instance;
            if (scroll && this.itemList.length > 0) {
                scroll.setupItems(this.itemList);
                this.updateVisibleShadows();
                this.idleTimer = this.idleTimeToHint;   // bật hint ngay sau khi xếp xong
            }
        }, 0.1);
    }

    /** Ẩn tất cả bóng đích của các item chưa được sinh ra */
    initTargetShadows(): void {
        for (const node of this.itemList) {
            if (!node || !node.isValid) continue;
            const item = node.getComponent(ItemController);
            if (item && item.targetPoint && !item.isPlaced) {
                item.targetPoint.active = false;
            }
        }
    }

    onDestroy() {
        if (ItemManager.instance === this) ItemManager.instance = null;
    }

    /** InputManager gọi mỗi lần chạm — thay phần poll Input trong Update bên Unity. */
    onAnyPointerDown(): void {
        this.enableFirstClickObjects();
        this.resetIdleTimer();
        this.hideHint();
    }

    update(dt: number) {
        // Cuộn thanh bar cũng tính là đang thao tác
        if (WorldScrollManager.instance?.isScrolling()) {
            this.resetIdleTimer();
            this.hideHint();
        }

        if (this.isDragging) return;

        this.idleTimer += dt;

        if (this.idleTimer >= this.idleTimeToHint && !this.hasShownHint) {
            if (this.maxHintItems === -1 || this.arrivedItemCount < this.maxHintItems) {
                this.showHint();
                this.hasShownHint = true;
            }
        }

        // Hết item -> báo cho BoxManager
        const isListEmpty = this.spawnFromLast
            ? (this.currentItemIndex < 0)
            : (this.currentItemIndex >= this.itemList.length);
        if (isListEmpty) BoxManager.instance?.handleEmptyItems();
    }

    // ======================================================== shadow batch
    /** Unity: UpdateVisibleShadows */
    updateVisibleShadows(): void {
        if (!this.itemList || this.itemList.length === 0) return;

        const shadowSrc = (this.shadowList && this.shadowList.length > 0)
            ? this.shadowList : this.itemList;

        // 1. Dọn item đã ghép khỏi đợt hiện tại
        for (let i = this.currentBatchItems.length - 1; i >= 0; i--) {
            const it = this.currentBatchItems[i];
            if (!it || !it.isValid || it.isPlaced) this.currentBatchItems.splice(i, 1);
        }

        // 2. Đợt hiện tại xong hết -> nạp đợt tiếp theo
        const batchLimit = this.shadowBatchSize > 0 ? this.shadowBatchSize : 4;
        if (this.currentBatchItems.length === 0) {
            for (const node of shadowSrc) {
                if (!node || !node.isValid) continue;
                const item = node.getComponent(ItemController);
                if (item && !item.isPlaced && this.currentBatchItems.indexOf(item) < 0) {
                    this.currentBatchItems.push(item);
                    if (this.currentBatchItems.length >= batchLimit) break;
                }
            }
        }

        // 3. Bật bóng cho đợt hiện tại, tắt đích của item chưa tới lượt
        for (const node of shadowSrc) {
            if (!node || !node.isValid) continue;
            const item = node.getComponent(ItemController);
            if (!item || !item.targetPoint) continue;
            if (item.isPlaced) continue;

            if (this.currentBatchItems.indexOf(item) >= 0) {
                item.targetPoint.active = true;
                item.itemGraphic?.handleTargetSprites(item.targetPoint, true);
            } else {
                item.targetPoint.active = false;
            }
        }
    }

    // ======================================================== first click
    /** Unity: EnableFirstClickObjects */
    enableFirstClickObjects(): void {
        if (this.isFirstClicked) return;
        this.isFirstClicked = true;
        for (const o of this.objsToEnableOnFirstClick) if (o?.isValid) o.active = true;
        for (const o of this.objsToDisableOnFirstClick) if (o?.isValid) o.active = false;
    }

    // ======================================================== item / holder
    /** Unity: GetCurrentItem */
    getCurrentItem(): Node | null {
        if (this.spawnFromLast) {
            if (this.currentItemIndex >= 0 && this.currentItemIndex < this.itemList.length) {
                const item = this.itemList[this.currentItemIndex];
                this.currentItemIndex--;
                return item;
            }
        } else {
            if (this.currentItemIndex >= 0 && this.currentItemIndex < this.itemList.length) {
                const item = this.itemList[this.currentItemIndex];
                this.currentItemIndex++;
                return item;
            }
        }
        return null;
    }

    /** Unity: GetCurrentHolder — holder trống đầu tiên. */
    getCurrentHolder(): Node | null {
        this.ensureHolders();
        for (const h of this.holderItemList) {
            if (!h || !h.isValid) continue;
            const slot = h.getComponent(HolderSlot);
            if (slot && slot.isEmpty) {
                this.currentHolder = h;
                return h;
            }
        }
        return null;
    }

    hasAvailableHolder(): boolean {
        this.ensureHolders();
        for (const h of this.holderItemList) {
            if (!h || !h.isValid) continue;
            const slot = h.getComponent(HolderSlot);
            if (slot && slot.isEmpty) return true;
        }
        return false;
    }

    getCurrentHolderInUse(): Node | null {
        return this.currentHolder;
    }

    /** Unity: GetFirstItemInHolder */
    getFirstItemInHolder(): ItemController | null {
        for (const h of this.holderItemList) {
            const slot = h?.getComponent(HolderSlot);
            if (slot && !slot.isEmpty && slot.itemInSlot) {
                const ic = slot.itemInSlot.getComponent(ItemController);
                if (ic && ic.targetPoint) return ic;
            }
        }
        return null;
    }

    setLastItem(item: ItemController | null): void {
        this.lastInteractedItem = item;
    }

    getLastItem(): ItemController | null {
        return this.lastInteractedItem;
    }

    /** Unity: ItemArrivedAtTarget */
    itemArrivedAtTarget(): void {
        this.arrivedItemCount++;

        const ui = UIManager.instance;
        if (ui) {
            ui.tuSo++;
            ui.updateText();
        }

        if (this.arrivedItemCount === 1 && this.objToEnableAfterFirstItem) {
            this.objToEnableAfterFirstItem.active = true;
        }

        this.updateVisibleShadows();
    }

    isAllHolderEmpty(): boolean {
        return (WorldScrollManager.instance?.getActiveItemsCount() ?? 0) === 0;
    }

    // ======================================================== hint
    resetIdleTimer(): void {
        this.idleTimer = 0;
        this.hasShownHint = false;
    }

    private hideHint(): void {
        if (this.handHint && this.handHint.activeInHierarchy) {
            TweenUtil.killAll(this.handHint);
            this.handHint.active = false;
            this.hintTweenRunning = false;
        }
    }

    /** Unity: ShowHint */
    showHint(): void {
        let item = this.getLastItem();

        if (!item || !item.isValid || !this.canUseItemHint(item) || !this.isItemOnScreen(item.node)) {
            item = this.getValidHintItem();
            if (item) this.setLastItem(item);
        }

        if (!item) { this.hideHint(); return; }

        const ui = UIManager.instance;
        if (item.targetPoint && (!ui || ui.tuSo < ui.mauSo)) {
            this.runHintTween(item);
        }
    }

    /** Unity: ShowFirstDragHint */
    showFirstDragHint(item: ItemController | null): void {
        if (this.showedFirstDragHint) return;
        if (!item || !item.targetPoint) return;
        this.showedFirstDragHint = true;
        this.runHintTween(item);
    }

    /**
     * Bàn tay chạy từ item tới đích, lặp vô hạn.
     * Unity dùng DOTween.To(...).SetLoops(-1).SetTarget(handHint).
     */
    private runHintTween(item: ItemController): void {
        const hand = this.handHint;
        if (!hand) return;

        TweenUtil.killAll(hand);
        hand.setWorldPosition(item.node.worldPosition.clone());
        hand.active = true;
        this.hintTweenRunning = true;

        const from = new Vec3();
        const to = new Vec3();
        const cur = new Vec3();

        TweenUtil.valueTo(2, (t) => {
            if (!hand.isValid || !item.isValid || !item.targetPoint) return;
            item.node.getWorldPosition(from);
            item.targetPoint.getWorldPosition(to);
            Vec3.lerp(cur, from, to, t);
            hand.setWorldPosition(cur);
        }, 'sineInOut', true);
    }

    /** Unity: CanUseItemHint */
    private canUseItemHint(item: ItemController | null): boolean {
        if (!item || !item.isValid) return false;
        if (!item.targetPoint) return false;
        const seat = item.getComponent(SeatHandler);
        return seat ? seat.canPlace() : true;
    }

    /** Unity: IsItemOnScreen — viewport -0.05 .. 1.05 */
    private isItemOnScreen(node: Node): boolean {
        if (!node || !node.isValid) return false;
        const cam = this.mainCamera;
        if (!cam) return true;   // không có camera thì đừng loại item

        const half = cam.orthoHeight;
        const halfW = half * (cam.camera ? cam.camera.aspect : 1);
        const c = cam.node.worldPosition;
        const p = node.worldPosition;

        const marginX = halfW * 2 * 0.05;
        const marginY = half * 2 * 0.05;

        return p.x >= c.x - halfW - marginX && p.x <= c.x + halfW + marginX
            && p.y >= c.y - half - marginY && p.y <= c.y + half + marginY;
    }

    /** Unity: GetValidHintItem */
    private getValidHintItem(): ItemController | null {
        const items = WorldScrollManager.instance?.getActiveItems() ?? [];
        for (const it of items) {
            if (this.canUseItemHint(it) && this.isItemOnScreen(it.node)) return it;
        }
        return null;
    }
}
