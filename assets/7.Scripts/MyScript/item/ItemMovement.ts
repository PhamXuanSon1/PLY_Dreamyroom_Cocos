/**
 * ItemMovement — port từ Assets/_GAME/Script/Item/ItemMovement.cs (Unity)
 *
 * Bảng đổi DOTween -> cc.tween:
 *   DOScale(v, t).SetEase(Ease.OutQuad) -> tween(node).to(t, {scale:v}, {easing:'quadOut'})
 *   DORotate / DOLocalRotate           -> to(t, {eulerAngles:v})
 *   Ease.OutBack                       -> 'backOut'
 *   transform.DOKill()                 -> Tween.stopAllByTarget(node)
 *
 * Xem COCOS_MIGRATION_PLAN.md mục 4.6.
 */

import { _decorator, Component, Node, Vec3, tween, Tween, randomRange } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('ItemMovement')
export class ItemMovement extends Component {

    // ---- cấu hình chung (bên Unity nằm trên ItemManager) ----
    /** Unity: ItemManager.enableDragScale */
    static enableDragScale = true;
    /** Unity: ItemManager.dragScaleAmount = 1.1 */
    static dragScaleAmount = 1.1;

    // ---- field khớp tên bản Unity ----
    // Bên Unity 2 field này gán trong Awake, trong scene chúng là [0,0,0].
    // Nên phải tự tính lại lúc onLoad, đừng tin giá trị từ JSON.
    @property({ type: Vec3, visible: false })
    originalScale: Vec3 = new Vec3(1, 1, 1);

    @property({ type: Vec3, visible: false })
    originalRotation: Vec3 = new Vec3(0, 0, 0);

    private isScaling = false;

    onLoad() {
        this.captureOriginal();
    }

    start() {
        // SceneBuilder gán field ở pass 2, có thể ghi đè bằng [0,0,0] từ JSON.
        // Bắt lại ở start() cho chắc.
        if (this.originalScale.equals(Vec3.ZERO)) this.captureOriginal();
    }

    private captureOriginal(): void {
        this.originalScale = this.node.scale.clone();
        this.originalRotation = this.node.eulerAngles.clone();
    }

    /** Unity: StartDragAnimation */
    startDragAnimation(): void {
        Tween.stopAllByTarget(this.node);
        this.isScaling = true;

        const target = ItemMovement.enableDragScale
            ? new Vec3(
                this.originalScale.x * ItemMovement.dragScaleAmount,
                this.originalScale.y * ItemMovement.dragScaleAmount,
                this.originalScale.z * ItemMovement.dragScaleAmount)
            : this.originalScale.clone();

        tween(this.node).to(0.2, { scale: target }, { easing: 'quadOut' }).start();

        // trả lại rotation gốc
        tween(this.node).to(0.3, { eulerAngles: this.originalRotation.clone() }, { easing: 'quadOut' }).start();
    }

    /** Unity: CancelDragAnimation */
    cancelDragAnimation(targetScale: Vec3, targetRotation: Vec3): void {
        Tween.stopAllByTarget(this.node);
        this.isScaling = false;
        tween(this.node).to(0.2, { scale: targetScale.clone() }, { easing: 'quadOut' }).start();
        tween(this.node).to(0.2, { eulerAngles: targetRotation.clone() }, { easing: 'quadOut' }).start();
    }

    /** Unity: MoveToPosition — bám thẳng theo con trỏ, không nội suy. */
    moveToPosition(worldPos: Vec3): void {
        this.node.setWorldPosition(worldPos);
    }

    /** Unity: StopDragAnimation */
    stopDragAnimation(): void {
        if (ItemMovement.enableDragScale && this.isScaling) {
            tween(this.node)
                .to(0.5, { scale: this.originalScale.clone() }, { easing: 'quadOut' })
                .call(() => { this.isScaling = false; })
                .start();
        } else {
            this.isScaling = false;
        }
    }

    /** Unity: SnapFailedAnimation — xoay lệch ngẫu nhiên khi thả hụt. */
    snapFailedAnimation(): void {
        const randomZ = randomRange(-30, 30);
        tween(this.node)
            .to(0.25, { eulerAngles: new Vec3(0, 0, randomZ) }, { easing: 'backOut' })
            .start();
    }

    /** Unity: MoveToTarget — bay vào vị trí đích rồi gọi callback. */
    moveToTarget(target: Node, duration: number, onComplete?: () => void): void {
        const dest = target.worldPosition.clone();
        tween(this.node)
            .to(duration, { worldPosition: dest }, { easing: 'quadOut' })
            .call(() => onComplete?.())
            .start();
    }
}
