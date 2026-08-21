/**
 * ItemController — Quản lý tương tác, kéo thả và ghép item vào vị trí đích (Target).
 * Sử dụng hệ thống âm thanh từ PLY_SoundManager (sm).
 */

import { _decorator, BoxCollider2D, Collider2D, Component, Enum, EventTouch, Node, UITransform, Vec2, Vec3 } from 'cc';
import { DreamyInputManager, InputPriority, IPointerHandler } from '../core/DreamyInputManager';
import { ItemGraphic } from './ItemGraphic';
import { ItemMovement } from './ItemMovement';
import { OpenItem } from './OpenItem';
import { ItemManager } from '../managers/ItemManager';
import { WorldScrollManager } from '../managers/WorldScrollManager';
import { SeatHandler } from '../utils/SeatHandler';
import { HolderSlot } from '../utils/HolderSlot';
import { TurnOnSpine } from '../utils/TurnOnSpine';
import { ChangeLight } from '../utils/ChangeLight';
import { ObjectPool, PoolType } from '../core/ObjectPool';
import { BlinkEffect } from '../effects/BlinkEffect';
import { sm, SoundType } from '../../Manager/SoundManager';
import { SoundManager as DreamySoundManager } from '../core/SoundManager';

const { ccclass, property } = _decorator;

/** Danh sách các loại âm thanh chất liệu tuỳ chọn khi ghép đúng */
export enum MaterialType {
    None = 0,
    ClickBox = 1,
    PickItem = 2,
    HeavyWood = 3,
    SmallWood = 4,
    Cloth = 5,
    DropMetal = 6,
    Glass = 7,
    DropOnFloor = 8,
    Cat1 = 9,
    Cat2 = 10,
    Cat3 = 11,
    Water = 12,
    BurnOn = 13,
    BookOpen = 14,
    CapyDrop = 15,
    Grass = 16,
    Chair = 17,
    CoinBag = 18,
    GoldChest = 19,
    WoodenFish = 20,
    Window = 21,
    WoodenDoor = 22,
    Skeleton = 23,
    WoodenChair = 24,
    ComCop = 25,
    Rem = 26,
    ClothesDrop = 27,
    Decor = 28,
}
Enum(MaterialType);

@ccclass('ItemController')
export class ItemController extends Component implements IPointerHandler {

    // ---- Vị trí đích ----
    @property({ type: Node, tooltip: 'Vị trí đích mà item cần được kéo vào để ghép.' })
    targetPoint: Node | null = null;

    // ---- Tham số kéo thả & Snap ----
    @property({ tooltip: 'Khoảng cách tối thiểu để item tự hút vào đích (pixel).' })
    snapDistance = 200;

    @property({ tooltip: 'Thời gian bay vào vị trí đích (giây).' })
    moveDuration = 0.2;

    @property({
        type: Enum(MaterialType),
        tooltip: 'Âm thanh chất liệu tuỳ chọn khi ghép đúng (None = không phát/tuỳ chọn).'
    })
    materialType: MaterialType = MaterialType.None;

    /** Đã ghép thành công vào đích hay chưa */
    isPlaced = false;


    itemGraphic: ItemGraphic = null!;
    itemMovement: ItemMovement = null!;
    currentHolderSlot: HolderSlot | null = null;

    readonly inputPriority = InputPriority.Item;

    private dragging = false;
    private moving = false;
    private itemCollider: Collider2D | null = null;

    // ======================================================== Lifecycle
    onLoad() {
        this.itemGraphic = this.getComponent(ItemGraphic) ?? this.addComponent(ItemGraphic);
        this.itemMovement = this.getComponent(ItemMovement) ?? this.addComponent(ItemMovement);
        this.setupCollider();
    }

    onEnable() {
        if (!this.itemGraphic) this.itemGraphic = this.getComponent(ItemGraphic) ?? this.addComponent(ItemGraphic);
        if (!this.itemMovement) this.itemMovement = this.getComponent(ItemMovement) ?? this.addComponent(ItemMovement);
        DreamyInputManager.register(this);
    }

    onDisable() {
        DreamyInputManager.unregister(this);
    }

    /** Đồng bộ collider để Item luôn dùng Collider 2D (Box/Polygon/Circle) cho thao tác kéo-thả. */
    private setupCollider(): void {
        this.itemCollider = this.getComponent(Collider2D) ?? this.addComponent(BoxCollider2D);
    }

    // ======================================================== Input & HitTest
    hitTest(worldPos: Vec3): boolean {
        if (this.isPlaced || this.moving || !this.node.activeInHierarchy) return false;
        return DreamyInputManager.hitTestCollider(this.node, worldPos);
    }

    /** Bắt đầu nhấc item lên (Pick) */
    onPointerDown(_worldPos: Vec3, _ev: EventTouch): boolean {
        if (this.isPlaced || this.moving) return false;

        // 1. Phát âm thanh Pick từ PLY_SoundManager
        if (sm) {
            sm.playSound(SoundType.Pick);
        } else {
            DreamySoundManager.instance?.playFx('PickItem');
        }

        // 2. Animation & đưa lên lớp kéo trên cùng
        this.itemMovement.startDragAnimation();
        this.dragging = true;
        this.itemGraphic.bringToFront();

        // 3. Thông báo cho ItemManager
        const im = ItemManager.instance;
        if (im) {
            im.isDragging = true;
            im.setLastItem(this);
            im.resetIdleTimer();
            if (im.handHint) im.handHint.active = false;
        }

        this.currentHolderSlot?.stopBobbingAnimation();
        WorldScrollManager.instance?.itemPickedUp(this);

        return true;
    }

    /** Di chuyển theo ngón tay / chuột */
    onPointerMove(worldPos: Vec3, _ev: EventTouch): void {
        if (!this.dragging) return;
        this.itemMovement.moveToPosition(worldPos);
    }

    /** Thả tay (Pointer Up) */
    onPointerUp(_worldPos: Vec3, _ev: EventTouch): void {
        if (!this.dragging) return;
        this.dragging = false;
        this.itemMovement.stopDragAnimation();

        const im = ItemManager.instance;
        if (im) {
            im.isDragging = false;
            im.resetIdleTimer();
        }

        this.checkSnap();
    }

    /** Huỷ thao tác giữa chừng */
    onPointerCancel(): void {
        if (!this.dragging) return;
        this.dragging = false;
        this.itemMovement.stopDragAnimation();
        if (ItemManager.instance) ItemManager.instance.isDragging = false;
        this.snapFailed();
    }

    // ======================================================== Snap Logic
    /** Kiểm tra xem item có đủ gần đích để ghép không */
    private checkSnap(): void {
        if (!this.targetPoint || !this.targetPoint.isValid) {
            this.snapFailed();
            return;
        }

        const distance = Vec3.distance(this.node.worldPosition, this.targetPoint.worldPosition);

        if (distance <= this.snapDistance) {
            // Kiểm tra điều kiện phụ (SeatHandler nếu có)
            const seat = this.getComponent(SeatHandler);
            if (seat && !seat.canPlace()) {
                console.log('[ItemController] Phải đặt item khác trước!');
                this.snapFailed();
                return;
            }
            this.moveToTarget();
        } else {
            this.snapFailed();
        }
    }

    /** Thả trượt: Bay về vị trí ban đầu + phát âm thanh LandFail */
    private snapFailed(): void {
        if (sm) {
            sm.playSound(SoundType.LandFail);
        }

        this.itemMovement.snapFailedAnimation();

        if (this.currentHolderSlot) {
            this.currentHolderSlot.startBobbingAnimation();
            this.itemGraphic.restoreOriginalLayers();
        } else if (WorldScrollManager.instance) {
            WorldScrollManager.instance.itemReturned(this);
        } else {
            this.itemGraphic.restoreOriginalLayers();
        }
    }

    /** Ghép đúng: Bay vào Target + bật Target + phát âm thanh Done/LandRight */
    private moveToTarget(): void {
        const target = this.targetPoint!;
        this.moving = true;

        WorldScrollManager.instance?.itemPlaced(this);

        this.itemMovement.moveToTarget(target, this.moveDuration, () => {
            // 1. Kích hoạt Target và tất cả các node con của Target
            target.active = true;
            for (const child of target.children) {
                child.active = true;
            }

            this.isPlaced = true;

            // 2. Kích hoạt spine hoặc trigger phụ
            this.getComponent(TurnOnSpine)?.activateSpine();
            this.getComponent(OpenItem)?.onItemPlaced();

            // 3. Phát âm thanh Done / LandRight từ PLY_SoundManager
            if (sm) {
                sm.playSound(SoundType.Done);
            }
            if (this.materialType !== MaterialType.None) {
                const soundName = MaterialType[this.materialType];
                DreamySoundManager.instance?.playFx(soundName);
            }


            // 4. Giải phóng slot nếu nằm trong thanh bar
            if (this.currentHolderSlot) {
                this.currentHolderSlot.clearSlot();
                this.currentHolderSlot = null;
            }

            this.itemGraphic.restoreOriginalLayers();
            this.itemGraphic.matchItemSortingOrderToTarget(target);
            this.node.setWorldRotation(target.worldRotation);
            this.itemGraphic.restoreTargetSprites();

            this.moving = false;
            DreamyInputManager.unregister(this);

            // 5. Ẩn item đi (hình ảnh ở Target đã hiện lên thay thế)
            this.node.active = false;

            // 6. Hiệu ứng Blink / Star FX
            this.spawnBlinkEffect(target);

            // 7. Báo cho ItemManager tiến độ
            ItemManager.instance?.itemArrivedAtTarget();
            ItemManager.instance?.setLastItem(null);

            ChangeLight.notifyItemPlaced();
        });
    }

    /** Spawn hiệu ứng lấp lánh khi đặt đúng */
    private spawnBlinkEffect(target: Node): void {
        const pool = ObjectPool.instance;
        if (!pool) return;

        const fx = pool.spawn(PoolType.BlinkFX, target.worldPosition);
        if (!fx) return;

        fx.setParent(target, true);
        fx.active = true;
        fx.getComponent(BlinkEffect)?.deSpawnByTime(2);
    }
}
