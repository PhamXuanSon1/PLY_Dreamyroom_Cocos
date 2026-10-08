/**
 * WinCard — màn hình "LEVEL COMPLETED" (panel đen + ribbon + icon có tia sáng xoay + nút Download).
 *
 * UIManager.EndUICanvas trỏ vào node này: thắng thì UIManager bật node lên -> onEnable chạy hiệu ứng vào.
 * Chạm bất kỳ đâu (kể cả nút) -> Store: UIManager đã lo (isGameEnded + hitTest), ở đây chỉ lo hình ảnh.
 */

import { _decorator, Component, Node, Vec3, tween, Tween, UIOpacity } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('WinCard')
export class WinCard extends Component {

    @property({ type: Node, tooltip: 'Panel đen phủ toàn màn hình (cần UIOpacity).' })
    dim: Node | null = null;

    @property({ tooltip: 'Độ đậm của panel đen (0-255).', min: 0, max: 255 })
    dimOpacity = 190;

    @property({ type: Node, tooltip: 'Ribbon "LEVEL COMPLETED".' })
    ribbon: Node | null = null;

    @property({ type: Node, tooltip: 'Tia sáng xoay sau icon.' })
    shine: Node | null = null;

    @property({ tooltip: 'Tốc độ xoay tia sáng (độ/giây).' })
    shineSpeed = 25;

    @property({ type: Node, tooltip: 'Icon / logo game.' })
    icon: Node | null = null;

    @property({ type: Node, tooltip: 'Nút Download.' })
    button: Node | null = null;

    private baseScale = new Map<Node, Vec3>();

    onLoad() {
        for (const n of [this.ribbon, this.shine, this.icon, this.button]) {
            if (n) this.baseScale.set(n, n.scale.clone());
        }
    }

    onEnable() {
        this.playIntro();
    }

    onDisable() {
        for (const n of [this.dim, this.ribbon, this.shine, this.icon, this.button]) {
            if (n) Tween.stopAllByTarget(n);
        }
        const op = this.dim?.getComponent(UIOpacity);
        if (op) Tween.stopAllByTarget(op);
    }

    update(dt: number) {
        if (this.shine && this.shine.activeInHierarchy) {
            const e = this.shine.eulerAngles;
            this.shine.setRotationFromEuler(e.x, e.y, (e.z - this.shineSpeed * dt) % 360);
        }
    }

    private playIntro(): void {
        // 1. panel đen mờ dần lên
        const op = this.dim?.getComponent(UIOpacity);
        if (op) {
            op.opacity = 0;
            tween(op).to(0.3, { opacity: this.dimOpacity }).start();
        }

        // 2. ribbon rơi xuống, 3. icon + tia sáng bung ra, 4. nút bật ra rồi nhịp đập
        this.popIn(this.ribbon, 0.15, 0.4);
        this.popIn(this.shine, 0.3, 0.5);
        this.popIn(this.icon, 0.3, 0.45);
        this.popIn(this.button, 0.6, 0.35, () => this.pulse(this.button));
    }

    private popIn(n: Node | null, delay: number, duration: number, done?: () => void): void {
        if (!n) return;
        const base = this.baseScale.get(n) ?? Vec3.ONE;
        Tween.stopAllByTarget(n);
        n.setScale(0, 0, 1);
        tween(n)
            .delay(delay)
            .to(duration, { scale: base.clone() }, { easing: 'backOut' })
            .call(() => done?.())
            .start();
    }

    private pulse(n: Node | null): void {
        if (!n) return;
        const base = this.baseScale.get(n) ?? Vec3.ONE;
        const big = new Vec3(base.x * 1.08, base.y * 1.08, base.z);
        tween(n)
            .repeatForever(
                tween(n)
                    .to(0.45, { scale: big }, { easing: 'sineInOut' })
                    .to(0.45, { scale: base.clone() }, { easing: 'sineInOut' }),
            )
            .start();
    }
}
