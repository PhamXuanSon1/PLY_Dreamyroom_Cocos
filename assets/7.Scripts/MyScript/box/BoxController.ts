/**
 * BoxController — port từ Assets/_GAME/Script/Box/BoxController.cs (Unity)
 *
 * KHÁC bản Unity:
 *   - Không poll Input + Physics.Raycast; đăng ký IPointerHandler ở mức Box.
 *   - DOJump -> TweenUtil.jumpTo.
 *   - SaveLayersAndSetTo20 -> ItemGraphic.bringToFront (lớp kéo).
 *   - Bỏ SetLayerRecursively (dead code bên Unity, không nơi nào gọi).
 */

import { _decorator, BoxCollider2D, Component, EventTouch, Node, randomRange, UITransform, Vec2, Vec3 } from 'cc';
import { DreamyInputManager, InputPriority, IPointerHandler } from '../core/DreamyInputManager';
import { BoxGraphic } from './BoxGraphic';
import { ItemManager } from '../managers/ItemManager';
import { UIManager } from '../managers/UIManager';
import { BaseRoomManager } from '../managers/BaseRoomManager';
import { ItemController } from '../item/ItemController';
import { ItemMovement } from '../item/ItemMovement';
import { HolderSlot } from '../utils/HolderSlot';
import { HandOfBox } from '../utils/HandOfBox';
import { Ply_SoundManager, FxType } from '../ScriptTemplate/Ply_SoundManager';
import { TweenUtil } from '../core/TweenUtil';

const { ccclass, property } = _decorator;

@ccclass('BoxController')
export class BoxController extends Component implements IPointerHandler {

    @property({ type: Node, tooltip: 'Vị trí hộp di chuyển tới sau intro.' })
    MoveAfterIntroPosOfBox: Node | null = null;

    @property({ tooltip: 'Thời gian di chuyển hộp tới vị trí MoveAfterIntroPosOfBox (giây).' })
    moveAfterIntroDuration = 1.2;

    @property({ type: Node, tooltip: 'Bàn tay/chữ hướng dẫn click vào hộp.' })
    handText: Node | null = null;

    @property({ type: HandOfBox, tooltip: 'Script di chuyển bàn tay theo hộp lúc intro.' })
    handOfBox: HandOfBox | null = null;

    @property({ type: Node, tooltip: 'Thanh trượt UI hiện khi bắt đầu tương tác.' })
    slider: Node | null = null;

    @property({ tooltip: 'Đã xong lượt click tutorial mở hộp đầu tiên chưa.' })
    finishedTutorial = false;

    // ========================================== THÔNG SỐ NHẢY ITEM (DOJUMP)
    @property({ tooltip: 'Độ cao cực đại của đường bay Parabol (pixel).' })
    jumpHeight = 150;

    @property({ tooltip: 'Thời gian item bay từ hộp tới Holder (giây).' })
    jumpDuration = 1.0;

    @property({ tooltip: 'Số nhịp nảy khi bay (mặc định 1 nhịp).' })
    jumpCount = 1;

    @property({ tooltip: 'Kiểu gia tốc nảy (easing), vd: backOut, quadOut, sineOut.' })
    jumpEasing = 'backOut';

    // ========================================== SPAWN TẤT CẢ ITEM RA VÙNG
    @property({ tooltip: 'Click đầu tiên: spawn TẤT CẢ item bay ra vùng Spawn Area (thay vì từng item vào holder), sau đó hộp bay đi và ẩn.' })
    spawnAllOnFirstClick = false;

    @property({ type: Node, tooltip: 'Node có BoxCollider2D xác định vùng item rơi xuống (random trong vùng collider).' })
    spawnArea: Node | null = null;

    @property({ tooltip: 'Khoảng cách thời gian giữa 2 item bay ra (giây). 0 = bắn TẤT CẢ đồng loạt cùng lúc.' })
    spawnInterval = 0;

    @property({ tooltip: 'Bật: item sau chỉ bắn khi item trước ĐÃ ĐÁP XUỐNG vùng (+ Spawn Interval). Tắt: chỉ cách nhau Spawn Interval.' })
    waitPreviousLanded = false;

    @property({ type: Node, tooltip: 'Vị trí hộp bay tới rồi ẩn (bỏ trống = thu nhỏ tại chỗ).' })
    boxExitPos: Node | null = null;

    @property({ tooltip: 'Thời gian hộp bay đi (giây).' })
    boxExitDuration = 0.8;

    @property({ tooltip: 'Chờ thêm sau khi item cuối bay ra rồi hộp mới bay đi (giây).' })
    boxExitDelay = 0.3;

    private isClicked = false;
    private isClosing = false;
    private boxGraphic: BoxGraphic | null = null;

    readonly inputPriority = InputPriority.Box;

    // ======================================================== lifecycle
    onLoad() {
        this.boxGraphic = this.getComponent(BoxGraphic);
        this.boxGraphic?.playReady();
    }

    start() {
        // Mode spawn tất cả: item nằm trong hộp cho tới khi click, nên ẩn hết lúc mở màn
        if (this.spawnAllOnFirstClick) {
            for (const node of ItemManager.instance?.itemList ?? []) {
                if (node?.isValid) node.active = false;
            }
        }
    }

    onEnable() {
        DreamyInputManager.register(this);
        this.node.on(Node.EventType.TOUCH_START, this.onDirectTouch, this);
    }

    onDisable() {
        DreamyInputManager.unregister(this);
        this.node.off(Node.EventType.TOUCH_START, this.onDirectTouch, this);
    }

    private onDirectTouch(): void {
        this.onClick();
    }

    // ======================================================== input
    hitTest(worldPos: Vec3): boolean {
        if (UIManager.instance?.isGameEnded) return false;
        if (this.isClicked || this.isClosing) return false;
        if (DreamyInputManager.hitTestCollider(this.node, worldPos)) return true;
        const ut = this.getComponent(UITransform);
        if (ut && ut.getBoundingBoxToWorld().contains(new Vec2(worldPos.x, worldPos.y))) {
            return true;
        }
        return false;
    }

    onPointerDown(_worldPos: Vec3, _ev: EventTouch): boolean {
        if (UIManager.instance?.isGameEnded) return false;
        if (this.isClicked || this.isClosing) return false;
        this.onClick();
        return true;
    }

    // ======================================================== logic
    /** Unity: OnClick */
    private onClick(): void {
        if (UIManager.instance?.isGameEnded) {
            UIManager.instance.gotoStore();
            return;
        }
        if (this.isClicked || this.isClosing) return;

        Ply_SoundManager.Ins?.playFx(FxType.ClickBox);

        const im = ItemManager.instance;
        if (im) {
            if (im.handIntro) im.handIntro.active = false;
            im.enableFirstClickObjects();
        }

        if (this.handText) {
            this.handText.active = false;
        }

        if (this.handOfBox) {
            this.handOfBox.moveAfterIntro(this.moveAfterIntroDuration);
            this.handOfBox.node.active = false;
        }

        this.isClicked = true;

        if (this.slider) this.slider.active = true;

        // ---- CLICK ĐẦU TIÊN ----
        if (!this.finishedTutorial) {
            this.boxGraphic?.playFirstOpen();

            if (this.spawnAllOnFirstClick) {
                // khoá click tiếp theo + chặn BoxManager.closeAndHide (hộp tự bay đi sau khi spawn xong)
                this.isClosing = true;
                TweenUtil.delayedCall(this, 1, () => this.spawnAllItems());
            } else {
                TweenUtil.delayedCall(this, 1, () => this.spawnItem());
            }

            if (this.MoveAfterIntroPosOfBox) {
                TweenUtil.moveTo(this.node, this.MoveAfterIntroPosOfBox.worldPosition, this.moveAfterIntroDuration, 'linear');
            }

            const finish = () => {
                this.finishedTutorial = true;
                // Unity giữ cờ này trên ItemManager — đồng bộ để script khác đọc được
                if (ItemManager.instance) ItemManager.instance.finishedTutorial = true;
                this.isClicked = false;
            };

            if (BaseRoomManager.instance) BaseRoomManager.instance.playIntroAnimation(finish);
            else finish();

            return;
        }

        // ---- NHỮNG CLICK SAU ----
        this.boxGraphic?.playItemDispense();
        this.spawnItem();
        this.isClicked = false;
    }

    /** Unity: SpawnItem */
    private spawnItem(): void {
        const im = ItemManager.instance;
        if (!im) return;

        if (!im.hasAvailableHolder()) {
            console.warn('[BoxController] Hết holder trống!');
            return;
        }

        const currentItem = im.getCurrentItem();
        if (!currentItem) {
            console.warn('[BoxController] Hết item rồi!');
            return;
        }

        currentItem.setWorldPosition(this.node.worldPosition.clone());
        currentItem.active = true;

        const itemScript = currentItem.getComponent(ItemController);

        // ⚠ Chốt scale gốc TRƯỚC khi setScale(0), nếu không ItemMovement.start()
        //   sẽ chụp nhầm [0,0,0] và item bị scale về 0 ngay khi click.
        currentItem.getComponent(ItemMovement)?.captureOriginal();

        // Đặt scale ban đầu bằng 0 khi vừa sinh ra tại hộp
        currentItem.setScale(0, 0, 0);

        // Tween scale phóng to dần từ 0 lên 1 (hoặc target scale) trong quá trình bay
        const targetScale = im.enablePopScale ? im.popScaleAmount : 1;
        TweenUtil.scaleTo(currentItem, new Vec3(targetScale, targetScale, targetScale), 0.4, 'backOut');

        currentItem.setRotationFromEuler(0, 0, randomRange(-90, 90));

        const holder = im.getCurrentHolder();
        if (!holder) return;

        const holderSlot = holder.getComponent(HolderSlot);
        if (holderSlot) {
            holderSlot.isEmpty = false;
            if (itemScript) itemScript.currentHolderSlot = holderSlot;
        }

        // Unity: DOJump(holder.position, 1.5f, 1, 1f).SetEase(Ease.OutBack)
        TweenUtil.jumpTo(
            currentItem,
            holder.worldPosition,
            this.jumpHeight,
            this.jumpCount,
            this.jumpDuration,
            this.jumpEasing,
            () => {
                if (!holderSlot) return;
                holderSlot.setItem(currentItem);
                if (itemScript) im.showFirstDragHint(itemScript);
            },
        );
    }

    // ======================================================== spawn tất cả ra vùng
    /** Lấy hết item còn lại trong ItemManager, bắn lần lượt ra Spawn Area rồi cho hộp bay đi. */
    private spawnAllItems(): void {
        const im = ItemManager.instance;
        if (!im) return;

        const items: Node[] = [];
        for (let n = im.getCurrentItem(); n; n = im.getCurrentItem()) items.push(n);

        if (items.length === 0) {
            console.warn('[BoxController] Không có item nào để spawn!');
            this.exitBox();
            return;
        }

        this.boxGraphic?.playItemDispense();

        // Không có giãn cách -> bắn đồng loạt tất cả trong cùng 1 frame
        if (this.spawnInterval <= 0 && !this.waitPreviousLanded) {
            for (const node of items) this.launchItemToArea(node);
            TweenUtil.delayedCall(this, this.jumpDuration + this.boxExitDelay, () => this.onAllItemsLanded());
            return;
        }

        this.launchSequence(items, 0);
    }

    /** Mọi item đã đáp xuống: hiện hint vào item trên cùng rồi hộp bay đi. */
    private onAllItemsLanded(): void {
        const im = ItemManager.instance;
        if (im) im.showFirstDragHint(im.getTopmostAvailableItem());
        this.exitBox();
    }

    /** Bắn tuần tự item[index] -> chờ -> item[index+1] ... -> hết thì hộp bay đi. */
    private launchSequence(items: Node[], index: number): void {
        if (index >= items.length) {
            // item cuối đã bắn; chờ nó đáp xuống rồi hiện hint (vào item trên cùng) và hộp bay đi
            const wait = (this.waitPreviousLanded ? 0 : this.jumpDuration) + this.boxExitDelay;
            TweenUtil.delayedCall(this, wait, () => this.onAllItemsLanded());
            return;
        }

        const next = () => TweenUtil.delayedCall(this, this.spawnInterval, () => this.launchSequence(items, index + 1));

        this.launchItemToArea(items[index], this.waitPreviousLanded ? next : undefined);
        if (!this.waitPreviousLanded) next();
    }

    /** Một item bay từ hộp tới điểm random trong Spawn Area (không dùng holder). */
    private launchItemToArea(node: Node, onLanded?: () => void): void {
        if (!node?.isValid) { onLanded?.(); return; }
        const im = ItemManager.instance;

        node.setWorldPosition(this.node.worldPosition.clone());
        node.active = true;

        // Chốt scale gốc TRƯỚC khi setScale(0) — xem ghi chú ở spawnItem()
        node.getComponent(ItemMovement)?.captureOriginal();
        node.setScale(0, 0, 0);

        const targetScale = im?.enablePopScale ? im.popScaleAmount : 1;
        TweenUtil.scaleTo(node, new Vec3(targetScale, targetScale, targetScale), 0.4, 'backOut');
        node.setRotationFromEuler(0, 0, randomRange(-90, 90));

        const dest = this.randomPointInSpawnArea(node.worldPosition.z);
        const itemScript = node.getComponent(ItemController);

        TweenUtil.jumpTo(
            node, dest, this.jumpHeight, this.jumpCount, this.jumpDuration, this.jumpEasing,
            () => {
                // Không có holder -> item tự nhấp nhô tại chỗ (thay HolderSlot.startBobbingAnimation)
                itemScript?.startIdleBobbing();
                onLanded?.();
            },
        );
    }

    /** Điểm random trong worldAABB của BoxCollider2D trên Spawn Area. */
    private randomPointInSpawnArea(z: number): Vec3 {
        const area = this.spawnArea;
        const col = area?.getComponent(BoxCollider2D);
        if (col) {
            const r = col.worldAABB;
            return new Vec3(randomRange(r.xMin, r.xMax), randomRange(r.yMin, r.yMax), z);
        }
        if (area) {
            console.warn('[BoxController] Spawn Area thiếu BoxCollider2D, dùng tâm node.');
            return new Vec3(area.worldPosition.x, area.worldPosition.y, z);
        }
        console.warn('[BoxController] Chưa gán Spawn Area!');
        return this.node.worldPosition.clone();
    }

    /** Hộp bay tới Box Exit Pos (hoặc thu nhỏ tại chỗ) rồi inactive. */
    private exitBox(): void {
        this.boxGraphic?.playClosing();
        TweenUtil.killAll(this.node);

        const hide = () => { this.node.active = false; };
        if (this.boxExitPos) {
            TweenUtil.moveTo(this.node, this.boxExitPos.worldPosition.clone(), this.boxExitDuration, 'quadIn', hide);
        } else {
            TweenUtil.scaleTo(this.node, Vec3.ZERO, this.boxExitDuration, 'sineInOut', hide);
        }
    }

    /** Khóa tương tác, chạy hiệu ứng đóng và ẩn Box sau thời gian giữ nguyên gameplay cũ. */
    closeAndHide(delay = 2): void {
        if (this.isClosing) return;
        this.isClosing = true;
        this.isClicked = true;
        this.boxGraphic?.playClosing();
        this.scheduleOnce(() => this.goToEndPos(), delay);
    }

    /** Hiệu ứng kết thúc trên node Box; chỉ BoxController được quyền ẩn node này. */
    private goToEndPos(): void {
        TweenUtil.scaleTo(this.node, Vec3.ZERO, 0.5, 'sineInOut', () => {
            this.node.active = false;
        });
    }
}
