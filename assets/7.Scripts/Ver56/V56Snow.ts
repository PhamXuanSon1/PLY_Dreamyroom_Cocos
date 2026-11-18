import { _decorator, Component, ParticleSystem2D, view } from 'cc';

const { ccclass, property, requireComponent } = _decorator;

/**
 * Snowfall over the map (ParticleSystem2D on the same node, its look is edited on that component).
 * This only keeps the emitter on screen: it sits just above the visible top edge and spreads over the whole visible width
 * (portrait and landscape), the flakes live long enough to reach the bottom edge, and the screen starts already full of
 * snow (the first seconds are simulated at start).
 */
@ccclass('V56Snow')
@requireComponent(ParticleSystem2D)
export class V56Snow extends Component {
    @property({ min: 0, tooltip: 'Flakes per second for every 1000 px of visible width.' }) public density = 14;
    @property({ min: 0, tooltip: 'Extra room above / beside / below the visible screen (px), so flakes enter and leave off screen.' }) public margin = 80;
    @property({ min: 0, tooltip: 'Seconds of snowfall simulated at start (at least one flake life, so the screen is full).' }) public prewarm = 10;

    private ps: ParticleSystem2D | null = null;
    private w = 0;
    private h = 0;
    private s = 0;

    protected onLoad(): void {
        this.ps = this.getComponent(ParticleSystem2D);
        this.fit(true);
    }

    protected start(): void {
        this.fit(true);
        this.warm();
    }

    /** Simulates the first seconds at once, so the whole screen already has falling snow. */
    private warm(): void {
        const ps = this.ps;
        const sim = ps ? (ps as any)._simulator : null;
        if (!ps || !sim || typeof sim.step !== 'function' || this.prewarm <= 0) return;
        const total = Math.max(this.prewarm, ps.life); // slow snow needs longer to reach the bottom
        const dt = 1 / 15;
        for (let t = 0; t < total; t += dt) sim.step(dt);
    }

    protected lateUpdate(): void {
        this.fit(false);
    }

    /** Emitter along the visible top edge, as wide as the screen; life long enough to fall to the bottom edge. */
    private fit(force: boolean): void {
        const ps = this.ps;
        const parent = this.node.parent;
        if (!ps || !parent) return;
        const vis = view.getVisibleSize();
        const s = Math.abs(parent.worldScale.y) || 1;
        if (!force && vis.width === this.w && vis.height === this.h && s === this.s) return;
        this.w = vis.width;
        this.h = vis.height;
        this.s = s;
        const halfW = vis.width / 2 / s + this.margin;
        const top = vis.height / 2 / s + this.margin;
        // time for the slowest flake to fall from the top to below the bottom edge (speed + the downward pull of gravity)
        const v = Math.max(10, ps.speed - ps.speedVar);
        const g = Math.max(0, -ps.gravity.y);
        const d = top * 2;
        const life = g > 0.001 ? (-v + Math.sqrt(v * v + 2 * g * d)) / g : d / v;
        ps.life = life;
        ps.lifeVar = 0;
        // the wind (gravity x) carries the flakes sideways while they fall: the spawn line reaches upwind by that drift so
        // the bottom corner on the upwind side still gets snow; plus the sideways spread of angleVar on both sides
        const drift = 0.5 * ps.gravity.x * life * life;
        const spread = Math.abs(Math.sin(ps.angleVar * Math.PI / 180)) * (ps.speed + ps.speedVar) * life * 0.5;
        const left = -halfW - Math.max(0, drift) - spread;
        const right = halfW + Math.max(0, -drift) + spread;
        this.node.setPosition((left + right) / 2, top, 0);
        ps.posVar.set((right - left) / 2, 10);
        ps.posVar = ps.posVar;
        ps.emissionRate = this.density * (right - left) / 1000;
        ps.totalParticles = Math.ceil(ps.emissionRate * ps.life) + 10;
        if (!force) { // screen rotated / resized: start over spread on the new screen, already full
            ps.resetSystem();
            this.warm();
        }
    }
}
