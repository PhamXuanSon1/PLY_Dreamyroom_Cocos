/**
 * ItemManager — port từ Assets/_GAME/Script/Manager/ItemManager.cs (Unity)
 *
 * BỎ so với bản Unity:
 *   - Toàn bộ khối Luna (optimizeForLuna / objectsToDisableForLuna /
 *     animatorsToDisableForLuna) — project này không build Luna.
 *
 * GLUE riêng cho Cocos (Unity không có, nhưng bắt buộc phải có ở đây):
 *   - ItemGraphic.targetShadowColor/targetNormalColor là static -> phải bơm màu
 *     từ ItemManager xuống lúc onLoad.
 *   - ensureHolders(): SceneBuilder dựng scene từ JSON nên holderItemList có thể
 *     rỗng/null, phải tự dò HolderSlot trong scene.
 *   - WorldScrollManager.setupItems(): bên Unity item nằm sẵn đúng vị trí trong
 *     scene, bên Cocos thanh bar do WorldScrollManager xếp. Không ai khác gọi
 *     hàm này nên phải gọi ở đây.
 *   - onAnyPointerDown(): thay cho việc poll Input trong Update bên Unity.
 *   - Bỏ layerTop: Cocos render theo thứ tự cây, item được đẩy lên trên bằng
 *     ItemGraphic.bringToFront() (reparent sang DragLayer do DreamyInputManager
 *     gán), không có sorting order như Unity.
 *   - Tween của hint phải giữ tham chiếu để stop() — TweenUtil.valueTo chạy trên
 *     object trung gian, killAll(handHint) không chạm tới được (Unity dùng
 *     SetTarget(handHint) + DOKill()).
 */

import { _decorator, Component, Node, Color, Vec3, Tween } from 'cc';
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
    @property({ tooltip: 'Lấy item từ cuối danh sách (từ dưới lên trên).' })
    spawnFromLast = false;

    @property({ type: [Node], tooltip: 'Danh sách các item sẽ rớt ra từ trong hộp.' })
    itemList: Node[] = [];

    @property({ type: [Node], tooltip: 'Danh sách các vị trí chờ (Holder) để chứa item trước khi ghép.' })
    holderItemList: Node[] = [];

    private currentItemIndex = 0;

    // ---------------- Item Pop Settings ----------------
    @property({ tooltip: 'Có cho phép tăng scale của item khi lấy ra từ hộp không?' })
    enablePopScale = true;

    @property({ tooltip: 'Lượng scale tăng lên khi lấy ra khỏi hộp (mặc định 1.2).' })
    popScaleAmount = 1.2;

    // ---------------- Item Drag Settings ----------------
    @property({ tooltip: 'Có cho phép tăng scale của item khi đang kéo không?' })
    enableDragScale = true;

    @property({ tooltip: 'Lượng scale của item khi đang kéo (mặc định 1.1).' })
    dragScaleAmount = 1.1;

    // ---------------- First Click Settings ----------------
    @property({ type: [Node], tooltip: 'Các object sẽ được bật lên khi người chơi click lần đầu tiên.' })
    objsToEnableOnFirstClick: Node[] = [];

    private isFirstClicked = false;

    // ---------------- Status ----------------
    /** Item cuối cùng mà người chơi vừa cầm/tương tác. */
    lastInteractedItem: ItemController | null = null;

    @property({ type: [Node], tooltip: 'Hiệu ứng pháo hoa bắn ra khi hoàn thành màn chơi.' })
    WinConfetti: Node[] = [];

    @property({ tooltip: 'Cờ báo hiệu người chơi đã hoàn thành bước hướng dẫn (Tutorial).' })
    finishedTutorial = false;

    // ---------------- Hint Settings ----------------
    private idleTimer = 0;

    @property({ tooltip: 'Thời gian chờ (giây) không thao tác sẽ hiện Hint gợi ý.' })
    idleTimeToHint = 5;

    private hasShownHint = false;

    @property({ type: Node, tooltip: 'Object bàn tay chỉ dẫn Hint khi người chơi rảnh rỗi quá lâu.' })
    handHint: Node | null = null;

    /** Trạng thái người chơi đang kéo thả một item. */
    isDragging = false;

    /** Số lượng item đã được ghép đúng vào vị trí đích. */
    arrivedItemCount = 0;

    @property({ tooltip: 'Số lượng item đầu tiên sẽ hiển thị bóng (shadow) tại vị trí đích khi kéo.' })
    shadowItemCount = 3;

    private currentHolder: Node | null = null;

    // ---------------- Target Graphic Settings ----------------
    @property({ tooltip: 'Màu của bóng/shadow hiển thị tại vị trí đích khi kéo thả.' })
    targetShadowColor: Color = new Color(51, 51, 51, 255);

    @property({ tooltip: 'Màu của đích khi phục hồi (màu bình thường).' })
    targetNormalColor: Color = new Color(255, 255, 255, 255);

    // ---------------- UI & Tutorial ----------------
    @property({ type: Node, tooltip: 'Bàn tay hướng dẫn xuất hiện ở đầu game.' })
    handIntro: Node | null = null;

    /** Cờ báo hiệu đã hiển thị hint kéo thả item lần đầu chưa. */
    showedFirstDragHint = false;

    /** Tween bàn tay hint đang chạy (thay cho .SetTarget(handHint) bên DOTween). */
    private hintTween: Tween<object> | null = null;

    // ======================================================== Unity: Awake
    onLoad() {
        ItemManager.instance = this;

        // glue Cocos: ItemGraphic đọc 2 màu này qua static
        ItemGraphic.targetShadowColor = this.targetShadowColor.clone();
        ItemGraphic.targetNormalColor = this.targetNormalColor.clone();

        this.ensureHolders();
    }

    // ======================================================== Unity: Start
    start() {
        this.ensureHolders();

        if (this.itemList.length > 0) {
            // Bắt đầu với item cuối cùng hoặc item đầu tiên trong danh sách
            this.currentItemIndex = this.spawnFromLast ? this.itemList.length - 1 : 0;
        }

        // glue Cocos: bóng ở đích chỉ hiện lúc người chơi ĐANG KÉO item
        // (ItemController.showTargetShadow), nên tắt hết bóng lúc mở màn.
        this.initTargetShadows();

        // glue Cocos: xếp item vào thanh bar (Unity không có WorldScrollManager)
        this.scheduleOnce(() => {
            const scroll = WorldScrollManager.instance;
            if (scroll && this.itemList.length > 0) scroll.setupItems(this.itemList);
        }, 0.1);
    }

    onDestroy() {
        if (ItemManager.instance === this) ItemManager.instance = null;
    }

    /** glue Cocos: ẩn bóng đích của mọi item chưa được sinh ra từ hộp. */
    initTargetShadows(): void {
        for (const node of this.itemList) {
            if (!node || !node.isValid) continue;
            const item = node.getComponent(ItemController);
            if (item && item.targetPoint && !item.isPlaced) item.targetPoint.active = false;
        }
    }

    /** glue Cocos: SceneBuilder có thể để holderItemList rỗng -> tự dò trong scene. */
    ensureHolders(): void {
        if (!this.holderItemList || this.holderItemList.length === 0
            || this.holderItemList.some(h => !h || !h.isValid)) {
            const slots = this.node.scene?.getComponentsInChildren(HolderSlot) ?? [];
            if (slots.length > 0) this.holderItemList = slots.map(s => s.node);
        }
    }

    /** glue Cocos: InputManager gọi mỗi lần chạm — thay phần poll Input bên Unity. */
    onAnyPointerDown(): void {
        this.enableFirstClickObjects();
        this.resetIdleTimer();
        this.hideHint();
    }

    // ======================================================== Unity: EnableFirstClickObjects
    enableFirstClickObjects(): void {
        if (this.isFirstClicked) return;
        this.isFirstClicked = true;
        for (const obj of this.objsToEnableOnFirstClick) {
            if (obj?.isValid) obj.active = true;
        }
    }

    // ======================================================== Unity: Update
    update(dt: number) {
        if (this.isDragging) return;

        this.idleTimer += dt;

        if (this.idleTimer >= this.idleTimeToHint && !this.hasShownHint) {
            this.showHint();
            this.hasShownHint = true;
        }

        // Đổi state của box nếu list = 0
        const isListEmpty = this.spawnFromLast
            ? (this.currentItemIndex < 0)
            : (this.currentItemIndex >= this.itemList.length);
        if (isListEmpty) BoxManager.instance?.handleEmptyItems();
    }

    // ======================================================== item / holder
    /** Unity: GetCurrentItem — lấy item ở vị trí currentItemIndex trong itemList. */
    getCurrentItem(): Node | null {
        if (this.currentItemIndex >= 0 && this.currentItemIndex < this.itemList.length) {
            const indexToReturn = this.currentItemIndex;

            // cập nhật index cho lần lấy tiếp theo
            if (this.spawnFromLast) this.currentItemIndex--;
            else this.currentItemIndex++;

            return this.itemList[indexToReturn];
        }
        return null;
    }

    /** Unity: GetCurrentHolder — holder trống đầu tiên trong holderItemList. */
    getCurrentHolder(): Node | null {
        this.ensureHolders();
        for (const holderNode of this.holderItemList) {
            if (!holderNode || !holderNode.isValid) continue;
            const slot = holderNode.getComponent(HolderSlot);
            if (slot && slot.isEmpty) {
                this.currentHolder = holderNode;
                return this.currentHolder;
            }
        }
        return null;
    }

    /** Unity: HasAvailableHolder */
    hasAvailableHolder(): boolean {
        this.ensureHolders();
        for (const holderNode of this.holderItemList) {
            if (!holderNode || !holderNode.isValid) continue;
            const slot = holderNode.getComponent(HolderSlot);
            if (slot && slot.isEmpty) return true;
        }
        return false;
    }

    /** Unity: GetCurrentHolderInUse */
    getCurrentHolderInUse(): Node | null {
        return this.currentHolder;
    }

    /** Unity: GetFirstItemInHolder — item đầu tiên đang nằm trong holder. */
    getFirstItemInHolder(): ItemController | null {
        for (const holderNode of this.holderItemList) {
            const slot = holderNode?.getComponent(HolderSlot);
            if (slot && !slot.isEmpty && slot.itemInSlot) {
                const item = slot.itemInSlot.getComponent(ItemController);
                if (item && item.targetPoint) return item;
            }
        }
        return null;
    }

    /** Unity: IsAllHolderEmpty */
    isAllHolderEmpty(): boolean {
        for (const holderNode of this.holderItemList) {
            const slot = holderNode?.getComponent(HolderSlot);
            if (slot && !slot.isEmpty) return false;
        }
        return true;
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

        console.log(`[ItemManager] arrivedItemCount = ${this.arrivedItemCount}`);
    }

    // ======================================================== hint
    /** Unity: ResetIdleTimer */
    resetIdleTimer(): void {
        this.idleTimer = 0;
        this.hasShownHint = false;
    }

    /** Unity: ShowHint */
    showHint(): void {
        let item = this.getLastItem();

        // item hiện tại không hợp lệ -> tìm item khác
        if (!this.canUseItemHint(item)) {
            item = this.getValidHintItem();
            if (item) this.setLastItem(item);
        }

        // không còn item nào hợp lệ
        if (!item) {
            if (this.handIntro) this.handIntro.active = true;
            this.hideHint();
            return;
        }

        // tắt handIntro nếu có item hợp lệ
        if (this.handIntro) this.handIntro.active = false;

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
     * Unity: DOTween.To(...).SetEase(InOutSine).SetLoops(-1, Restart).SetTarget(handHint)
     */
    private runHintTween(item: ItemController): void {
        const hand = this.handHint;
        if (!hand) return;

        this.killHintTween();
        hand.setWorldPosition(item.node.worldPosition.clone());
        hand.active = true;

        const from = new Vec3();
        const to = new Vec3();
        const cur = new Vec3();

        this.hintTween = TweenUtil.valueTo(2, (t) => {
            if (!hand.isValid || !item.isValid || !item.targetPoint) return;
            item.node.getWorldPosition(from);
            item.targetPoint.getWorldPosition(to);
            Vec3.lerp(cur, from, to, t);
            hand.setWorldPosition(cur);
        }, 'sineInOut', true);
    }

    /** Unity: handHint.DOKill() + SetActive(false) */
    private hideHint(): void {
        this.killHintTween();
        if (this.handHint) this.handHint.active = false;
    }

    private killHintTween(): void {
        if (this.hintTween) {
            this.hintTween.stop();
            this.hintTween = null;
        }
        if (this.handHint) TweenUtil.killAll(this.handHint);
    }

    /** Unity: CanUseItemHint */
    private canUseItemHint(item: ItemController | null): boolean {
        if (!item || !item.isValid) return false;
        if (!item.targetPoint) return false;

        const seat = item.getComponent(SeatHandler);

        // không có seat handler -> dùng được luôn; có thì phải pass điều kiện
        return seat ? seat.canPlace() : true;
    }

    /** Unity: GetValidHintItem — duyệt các holder đang giữ item. */
    private getValidHintItem(): ItemController | null {
        for (const holderNode of this.holderItemList) {
            const slot = holderNode?.getComponent(HolderSlot);
            if (!slot) continue;
            if (slot.isEmpty) continue;
            if (!slot.itemInSlot) continue;

            const item = slot.itemInSlot.getComponent(ItemController);
            if (this.canUseItemHint(item)) return item;
        }
        return null;
    }
}
