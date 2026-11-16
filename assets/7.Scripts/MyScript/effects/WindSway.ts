/**
 * WindSway — hoa / cây rung rinh theo gió.
 *
 *   - Nghiêng qua lại quanh điểm gốc (pivot, mặc định mép dưới giữa = gốc cây) nên gốc đứng yên, ngọn lắc.
 *   - 2 nhịp sóng chồng nhau (gió đều + gió giật ngắn) cho đỡ máy móc; mỗi node lệch pha / chu kỳ ngẫu nhiên.
 *   - Co giãn nhẹ theo chiều dọc (nén khi nghiêng, giãn khi thẳng) như lá bị gió ép.
 *
 * Không đổi anchor của node (node có thể là đích của item): xoay/co giãn quanh pivot bằng cách bù vị trí mỗi frame.
 * Chỉ chạy lúc game chạy; trong editor node đứng yên ở trạng thái gốc.
 */

import { _decorator, Component, randomRange, UITransform, Vec2, Vec3 } from 'cc';

const { ccclass, property, menu } = _decorator;

@ccclass('WindSway')
@menu('Effects/WindSway')
export class WindSway extends Component {

    @property({ tooltip: 'Góc nghiêng tối đa (độ).', min: 0 })
    maxAngle = 2.5;

    @property({ tooltip: 'Chu kỳ 1 lần lắc qua lại (giây). Mỗi node lệch ngẫu nhiên ±Random Ratio.', min: 0.1 })
    period = 2.8;

    @property({ tooltip: 'Gió giật: biên độ nhịp phụ (ngắn hơn) so với nhịp chính (0 = chỉ lắc đều).', range: [0, 1, 0.05], slide: true })
    gust = 0.3;

    @property({ tooltip: 'Co giãn dọc tối đa (0.02 = 2%). 0 = không co giãn.', range: [0, 0.2, 0.005], slide: true })
    squash = 0.015;

    @property({ type: Vec2, tooltip: 'Điểm gốc đứng yên, theo tỉ lệ khung UITransform (0,0 = góc dưới trái; 0.5,0 = mép dưới giữa).' })
    pivot = new Vec2(0.5, 0);

    @property({ tooltip: 'Lệch chu kỳ ngẫu nhiên giữa các node (0.2 = ±20%).', range: [0, 0.5, 0.05], slide: true })
    randomRatio = 0.2;

    private t = 0;
    private phase = 0;
    private gustPhase = 0;
    private periodReal = 2.8;
    private basePos = new Vec3();
    private baseScale = new Vec3(1, 1, 1);
    private baseAngle = 0;
    /** Vector từ gốc toạ độ node tới pivot (local, chưa nhân scale). */
    private pivotLocal = new Vec2();

    onLoad(): void {
        this.basePos.set(this.node.position);
        this.baseScale.set(this.node.scale);
        this.baseAngle = this.node.angle;
        const ut = this.getComponent(UITransform);
        if (ut) {
            this.pivotLocal.set((this.pivot.x - ut.anchorX) * ut.width, (this.pivot.y - ut.anchorY) * ut.height);
        }
        this.phase = randomRange(0, Math.PI * 2);
        this.gustPhase = randomRange(0, Math.PI * 2);
        this.periodReal = this.period * randomRange(1 - this.randomRatio, 1 + this.randomRatio);
    }

    onDisable(): void {
        // trả về đúng trạng thái gốc
        this.node.setPosition(this.basePos);
        this.node.setScale(this.baseScale);
        this.node.angle = this.baseAngle;
    }

    update(dt: number): void {
        this.t += dt;
        const TAU = Math.PI * 2;
        const w = TAU / this.periodReal;
        const main = Math.sin(this.t * w + this.phase);
        const gust = Math.sin(this.t * w * 2.3 + this.gustPhase) * Math.max(0, Math.sin(this.t * w * 0.37 + this.phase));
        const k = (main + gust * this.gust) / (1 + this.gust);   // -1..1
        const angle = k * this.maxAngle;

        // nghiêng nhiều -> nén dọc, giãn ngang chút xíu
        const sq = this.squash * Math.abs(k);
        const sx = this.baseScale.x * (1 + sq * 0.5);
        const sy = this.baseScale.y * (1 - sq);

        // giữ pivot đứng yên: pos = base + R(a0)·(pivot*scale0) - R(a)·(pivot*scale)
        const p0 = this.rotate(this.pivotLocal.x * this.baseScale.x, this.pivotLocal.y * this.baseScale.y, this.baseAngle);
        const a = this.baseAngle + angle;
        const p1 = this.rotate(this.pivotLocal.x * sx, this.pivotLocal.y * sy, a);

        this.node.setPosition(this.basePos.x + p0.x - p1.x, this.basePos.y + p0.y - p1.y, this.basePos.z);
        this.node.setScale(sx, sy, this.baseScale.z);
        this.node.angle = a;
    }

    private rotate(x: number, y: number, deg: number): Vec2 {
        const r = deg * Math.PI / 180;
        const c = Math.cos(r), s = Math.sin(r);
        return new Vec2(x * c - y * s, x * s + y * c);
    }
}
