/** BlinkEffect — Quản lý hiệu ứng sao lấp lánh khi đặt đúng vị trí */

import { _decorator, Node, ParticleSystem2D, UITransform, Vec2, Vec3 } from 'cc';
import { Ply_GameUnit } from '../ScriptTemplate/Ply_GameUnit';
import { Ply_Pool, PoolType as PlyPoolType } from '../ScriptTemplate/Ply_Pool';
import { ObjectPool, PoolType as DreamyPoolType } from '../core/ObjectPool';

const { ccclass, property } = _decorator;

/** Thông số gốc của prefab — chụp 1 lần để fit nhiều lần (object pool) không bị cộng dồn. */
interface PsBase {
    posVar: Vec2;
    emissionRate: number;
    totalParticles: number;
    startSize: number;
    startSizeVar: number;
    endSize: number;
    endSizeVar: number;
}

@ccclass('BlinkEffect')
export class BlinkEffect extends Ply_GameUnit {

    @property({ tooltip: 'Hệ số co/giãn cỡ hạt theo cỡ item: chặn dưới.' })
    minSizeScale = 0.5;

    @property({ tooltip: 'Hệ số co/giãn cỡ hạt theo cỡ item: chặn trên.' })
    maxSizeScale = 1.6;

    @property({ tooltip: 'Số hạt phát mỗi giây: tối thiểu (item nhỏ).' })
    minEmissionRate = 3;

    @property({ tooltip: 'Số hạt phát mỗi giây: tối đa (item rất to).' })
    maxEmissionRate = 25;

    private base = new Map<ParticleSystem2D, PsBase>();

    /**
     * Fit vùng phát sao vào khung `w × h` (đơn vị local của node cha FX), tâm tại `center`.
     * - posVar = nửa khung (chia scale của FX) -> sao rải đúng trong khung item.
     * - Cỡ sao giãn theo căn diện tích, mật độ (emissionRate) giữ như prefab gốc.
     */
    fitToSize(w: number, h: number, center: Vec3 = Vec3.ZERO): void {
        this.node.setPosition(center);
        if (w <= 0 || h <= 0) return;

        const s = this.node.scale;
        const sx = Math.abs(s.x) || 1, sy = Math.abs(s.y) || 1;

        for (const ps of this.node.getComponentsInChildren(ParticleSystem2D)) {
            let b = this.base.get(ps);
            if (!b) {
                b = {
                    posVar: ps.posVar.clone(),
                    emissionRate: ps.emissionRate,
                    totalParticles: ps.totalParticles,
                    startSize: ps.startSize,
                    startSizeVar: ps.startSizeVar,
                    endSize: ps.endSize,
                    endSizeVar: ps.endSizeVar,
                };
                this.base.set(ps, b);
            }

            // Khung gốc của prefab (theo đơn vị cha) = 2 × posVar × scale
            const baseW = Math.max(1, b.posVar.x * 2 * sx);
            const baseH = Math.max(1, b.posVar.y * 2 * sy);
            const areaRatio = (w * h) / (baseW * baseH);

            ps.posVar = new Vec2(w / 2 / sx, h / 2 / sy);

            const k = Math.min(this.maxSizeScale, Math.max(this.minSizeScale, Math.sqrt(areaRatio)));
            ps.startSize = b.startSize * k;
            ps.startSizeVar = b.startSizeVar * k;
            ps.endSize = b.endSize * k;
            ps.endSizeVar = b.endSizeVar * k;

            // Sao to hơn thì cần ít hạt hơn để giữ cùng độ phủ -> chia thêm k²
            const rate = b.emissionRate * areaRatio / (k * k);
            ps.emissionRate = Math.min(this.maxEmissionRate, Math.max(this.minEmissionRate, rate));
            ps.totalParticles = Math.max(b.totalParticles, Math.ceil(ps.emissionRate * ps.life * 2));
        }
    }

    /** Fit theo UITransform của `target` (FX phải đang là con của target). */
    fitToNode(target: Node): void {
        const ut = target.getComponent(UITransform)
            ?? target.getChildByName('Image')?.getComponent(UITransform);
        if (!ut) { this.node.setPosition(Vec3.ZERO); return; }
        const { width: w, height: h } = ut.contentSize;
        const a = ut.anchorPoint;
        this.fitToSize(w, h, new Vec3((0.5 - a.x) * w, (0.5 - a.y) * h, 0));
    }

    deSpawnByTime(delay = 2): void {
        this.unscheduleAllCallbacks();
        this.scheduleOnce(() => {
            if (Ply_Pool.Ins) {
                Ply_Pool.Ins.despawn(PlyPoolType.CorrectEffect, this);
            } else if (ObjectPool.instance) {
                ObjectPool.instance.despawn(DreamyPoolType.BlinkFX, this.node);
            } else {
                this.node.active = false;
            }
        }, delay);
    }
}
