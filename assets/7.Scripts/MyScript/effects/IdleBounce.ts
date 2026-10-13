/**
 * IdleBounce — hiệu ứng "sống" cho icon tĩnh trên thanh tiến trình (icon bí ngô),
 * thay cho animation idle của spine con ma cũ:
 *   - idle: lơ lửng lên xuống + lắc lư nhẹ, 2 nhịp lệch chu kỳ nhau cho tự nhiên.
 *   - punch(): nảy phồng lên 1 cái — BallFollowFill gọi mỗi khi tiến độ tăng.
 *
 * Chỉ animate node con `visual` (chứa Sprite). Node gốc để BallFollowFill
 * tự do dời worldPosition, hai bên không đánh nhau.
 */

import { _decorator, Component, Node, Tween, tween, Vec3 } from 'cc';

const { ccclass, property, menu } = _decorator;

@ccclass('IdleBounce')
@menu('Effects/IdleBounce')
export class IdleBounce extends Component {

    @property({ type: Node, tooltip: 'Node con chứa hình để animate. Trống = con đầu tiên.' })
    visual: Node | null = null;

    @property({ tooltip: 'Biên độ lơ lửng lên xuống (pixel, đơn vị local).' })
    floatAmplitude = 8;

    @property({ tooltip: 'Chu kỳ lơ lửng (giây).' })
    floatPeriod = 1.8;

    @property({ tooltip: 'Góc lắc lư tối đa (độ).' })
    swayAngle = 5;

    @property({ tooltip: 'Chu kỳ lắc lư (giây). Lệch với floatPeriod cho đỡ máy móc.' })
    swayPeriod = 2.6;

    @property({ tooltip: 'Độ phồng khi punch (0.2 = to thêm 20%).' })
    punchAmount = 0.2;

    private t = 0;
    private baseScale = new Vec3(1, 1, 1);
    private basePos = new Vec3();

    private get target(): Node | null {
        return this.visual ?? this.node.children[0] ?? null;
    }

    onLoad(): void {
        const v = this.target;
        if (!v) return;
        this.baseScale.set(v.scale);
        this.basePos.set(v.position);
    }

    update(dt: number): void {
        const v = this.target;
        if (!v) return;
        this.t += dt;
        const TAU = Math.PI * 2;
        const y = Math.sin(this.t * TAU / this.floatPeriod) * this.floatAmplitude;
        v.setPosition(this.basePos.x, this.basePos.y + y, this.basePos.z);
        v.angle = Math.sin(this.t * TAU / this.swayPeriod) * this.swayAngle;
    }

    /** Nảy phồng lên 1 cái (gọi khi tiến độ tăng). */
    punch(): void {
        const v = this.target;
        if (!v) return;
        const b = this.baseScale;
        const k = 1 + this.punchAmount;
        Tween.stopAllByTarget(v);
        v.setScale(b);
        tween(v)
            .to(0.1, { scale: new Vec3(b.x * k, b.y * k, b.z) }, { easing: 'quadOut' })
            .to(0.35, { scale: b.clone() }, { easing: 'backOut' })
            .start();
    }

    onDisable(): void {
        const v = this.target;
        if (!v) return;
        Tween.stopAllByTarget(v);
        v.setScale(this.baseScale);
        v.setPosition(this.basePos);
        v.angle = 0;
    }
}
