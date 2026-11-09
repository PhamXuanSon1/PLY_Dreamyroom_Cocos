/**
 * WindowLight — ánh sáng lấp lánh chiếu từ cửa sổ vào phòng.
 *
 *   - Dải nắng xiên (beamFrame) từ cửa sổ, sáng/mờ nhẹ theo nhịp (nhiều dải thì lệch pha nhau).
 *   - Hạt lấp lánh (sparkleFrame) hiện ngẫu nhiên trong các tia, nhấp nháy, trôi chậm xuống.
 *
 * Vùng sáng = UITransform của node này. Anchor = chỗ ánh sáng bắt đầu (nên để 0.5, 1 = mép trên giữa),
 * tia sáng chiếu xuống theo trục -y của node -> xoay node (Rotation) để đổi hướng chiếu.
 * Mọi node con được tạo lúc chạy game, vẽ đè lên phòng nhờ Sorting2D (sortingOrder).
 *
 * onlyInPlayerMode: chỉ hiện khi bật PlayerMode. waitForItem: ghép xong item cửa sổ mới sáng lên.
 */

import { _decorator, Color, Component, Node, randomRange, randomRangeInt, Sorting2D, Sprite, SpriteFrame, Tween, tween, UIOpacity, UITransform, Vec2, Vec3 } from 'cc';
import { PlayerMode } from '../managers/PlayerMode';
import { ItemManager } from '../managers/ItemManager';
import { ItemController } from '../item/ItemController';

const { ccclass, property, requireComponent } = _decorator;

interface Beam {
    node: Node;
    sprite: Sprite;
    width: number;
    height: number;
    /** Object tween độ sáng (để dừng lúc huỷ). */
    state: { a: number };
}

@ccclass('WindowLight')
@requireComponent(UITransform)
export class WindowLight extends Component {

    @property({ type: SpriteFrame, tooltip: 'Hình dải sáng (rộng gần đều, mép mềm, mờ dần về cuối). Mặc định: 3.Sprites/Chung/fx_window_beam.' })
    beamFrame: SpriteFrame | null = null;

    @property({ type: SpriteFrame, tooltip: 'Hình hạt lấp lánh. Mặc định: 3.Sprites/Chung/fx_sparkle_star.' })
    sparkleFrame: SpriteFrame | null = null;

    @property({ tooltip: 'Chỉ hiện khi bật PlayerMode.' })
    onlyInPlayerMode = true;

    @property({ type: Node, tooltip: 'Item cửa sổ: ghép xong item này ánh sáng mới hiện. Trống = hiện ngay từ đầu.' })
    waitForItem: Node | null = null;

    @property({ tooltip: 'Thời gian ánh sáng hiện dần lên (giây).', min: 0 })
    fadeInDuration = 1.2;

    @property({ tooltip: 'Sorting Order của Sorting2D: cao hơn đồ trong phòng (phòng dùng khoảng -32768..-1000).' })
    sortingOrder = -999;

    // ---------------- tia sáng ----------------
    @property({ group: { name: 'Tia sáng', id: 'beam' }, tooltip: 'Số tia sáng.', min: 0 })
    beamCount = 1;

    @property({ group: { name: 'Tia sáng', id: 'beam' }, tooltip: 'Màu tia sáng (alpha = độ sáng tối đa).' })
    beamColor = new Color(255, 226, 140, 140);

    @property({ group: { name: 'Tia sáng', id: 'beam' }, tooltip: 'Lúc mờ nhất còn bao nhiêu phần độ sáng (0..1).', range: [0, 1, 0.05], slide: true })
    beamMinRatio = 0.7;

    @property({ group: { name: 'Tia sáng', id: 'beam' }, tooltip: 'Thời gian 1 nhịp sáng -> mờ -> sáng (giây).', min: 0.1 })
    beamPulseTime = 4;

    @property({ group: { name: 'Tia sáng', id: 'beam' }, tooltip: 'Bề rộng mỗi tia = (x..y) × bề rộng vùng sáng.' })
    beamWidthRatio = new Vec2(1, 1);

    // ---------------- hạt lấp lánh ----------------
    @property({ group: { name: 'Hạt lấp lánh', id: 'sparkle' }, tooltip: 'Số hạt cùng lúc.', min: 0 })
    sparkleCount = 8;

    @property({ group: { name: 'Hạt lấp lánh', id: 'sparkle' }, tooltip: 'Màu hạt.' })
    sparkleColor = new Color(255, 245, 200, 255);

    @property({ group: { name: 'Hạt lấp lánh', id: 'sparkle' }, tooltip: 'Kích thước hạt (px), ngẫu nhiên x..y.' })
    sparkleSize = new Vec2(10, 24);

    @property({ group: { name: 'Hạt lấp lánh', id: 'sparkle' }, tooltip: 'Thời gian 1 lần nhấp nháy (giây), ngẫu nhiên x..y.' })
    sparkleLife = new Vec2(1.2, 2.4);

    @property({ group: { name: 'Hạt lấp lánh', id: 'sparkle' }, tooltip: 'Hạt trôi xuống bao nhiêu px trong 1 lần nhấp nháy.' })
    sparkleDrift = 30;

    private root: Node | null = null;
    private rootOpacity: UIOpacity | null = null;
    private beams: Beam[] = [];
    private sparkles: Node[] = [];
    private shown = false;
    private itemManager: ItemManager | null = null;

    // ======================================================== lifecycle
    start() {
        if (this.onlyInPlayerMode && !PlayerMode.findOn(this.node.scene)) {
            this.node.active = false;
            return;
        }

        this.build();

        const waitItem = this.waitForItem?.getComponent(ItemController) ?? null;
        if (waitItem && !waitItem.isPlaced) {
            this.itemManager = ItemManager.instance;
            this.itemManager?.node.on(ItemManager.EVENT_ITEM_ARRIVED, this.onItemArrived, this);
        } else {
            this.show();
        }
    }

    onDestroy() {
        if (this.itemManager?.isValid) this.itemManager.node.off(ItemManager.EVENT_ITEM_ARRIVED, this.onItemArrived, this);
        this.stopAll();
    }

    private onItemArrived(item?: ItemController): void {
        if (!item || item.node !== this.waitForItem) return;
        this.itemManager?.node.off(ItemManager.EVENT_ITEM_ARRIVED, this.onItemArrived, this);
        this.show();
    }

    // ======================================================== dựng node
    private build(): void {
        const ut = this.getComponent(UITransform)!;
        const W = ut.width, H = ut.height;
        // Mép trên vùng sáng và mép trái (toạ độ local, tính theo anchor)
        const top = H * (1 - ut.anchorY);
        const left = -W * ut.anchorX;

        const root = this.makeNode('WindowLightFX', this.node);
        this.rootOpacity = root.addComponent(UIOpacity);
        this.rootOpacity.opacity = 0;
        this.root = root;

        const n = Math.max(0, this.beamCount);
        for (let i = 0; i < n; i++) {
            const w = W * randomRange(this.beamWidthRatio.x, this.beamWidthRatio.y);
            const h = n > 1 ? H * randomRange(0.85, 1) : H;
            const node = this.makeNode(`Beam${i}`, root);
            const bt = node.getComponent(UITransform)!;
            bt.setAnchorPoint(0.5, 1);
            bt.setContentSize(w, h);
            const cx = left + W * (i + 0.5) / n + randomRange(-0.08, 0.08) * W;
            node.setPosition(Math.min(Math.max(cx, left + w / 2), left + W - w / 2), top, 0);
            const sprite = this.makeSprite(node, this.beamFrame, this.beamColor);
            this.beams.push({ node, sprite, width: w, height: h, state: { a: this.beamColor.a } });
        }

        for (let i = 0; i < Math.max(0, this.sparkleCount); i++) {
            const node = this.makeNode(`Sparkle${i}`, root);
            this.makeSprite(node, this.sparkleFrame, this.sparkleColor);
            node.setScale(0, 0, 1);
            this.sparkles.push(node);
        }
    }

    private makeNode(name: string, parent: Node): Node {
        const n = new Node(name);
        n.layer = this.node.layer;
        n.addComponent(UITransform);
        parent.addChild(n);
        return n;
    }

    private makeSprite(node: Node, frame: SpriteFrame | null, color: Color): Sprite {
        const s = node.addComponent(Sprite);
        s.sizeMode = Sprite.SizeMode.CUSTOM;
        s.spriteFrame = frame;
        s.color = color.clone();
        if (Sorting2D) node.addComponent(Sorting2D).sortingOrder = this.sortingOrder;
        return s;
    }

    // ======================================================== chạy hiệu ứng
    private show(): void {
        if (this.shown || !this.root) return;
        this.shown = true;

        const op = this.rootOpacity!;
        tween(op).to(this.fadeInDuration, { opacity: 255 }, { easing: 'sineOut' }).start();

        this.beams.forEach((b, i) => this.pulseBeam(b, (i / Math.max(1, this.beams.length)) * this.beamPulseTime));
        this.sparkles.forEach((s) => this.twinkle(s, randomRange(0, this.sparkleLife.y)));
    }

    /** Tia sáng sáng/mờ dần lặp mãi, lệch pha theo delay. */
    private pulseBeam(b: Beam, delay: number): void {
        const maxA = this.beamColor.a;
        const minA = maxA * this.beamMinRatio;
        const c = this.beamColor.clone();
        const state = b.state;
        state.a = maxA;
        const apply = () => { if (b.sprite.isValid) { c.a = state.a; b.sprite.color = c; } };
        const half = this.beamPulseTime / 2;
        tween(state)
            .delay(delay)
            .then(tween(state).repeatForever(
                tween(state)
                    .to(half, { a: minA }, { easing: 'sineInOut', onUpdate: apply })
                    .to(half, { a: maxA }, { easing: 'sineInOut', onUpdate: apply }),
            ))
            .start();
    }

    /** 1 lần nhấp nháy: hiện ở chỗ ngẫu nhiên trong 1 tia, phóng to + xoay rồi tắt, trôi xuống; xong lặp lại chỗ khác. */
    private twinkle(n: Node, delay: number): void {
        if (!n.isValid || this.beams.length === 0) return;

        const b = this.beams[randomRangeInt(0, this.beams.length)];
        const t = randomRange(0.08, 0.7);                      // dọc theo dải sáng (0 = sát cửa sổ)
        const widthAt = b.width * (0.8 + 0.2 * t) * 0.75;      // dải gần như đều, hơi loe (khớp hình fx_window_beam)
        const x = b.node.position.x + randomRange(-0.5, 0.5) * widthAt;
        const y = b.node.position.y - t * b.height;
        const size = randomRange(this.sparkleSize.x, this.sparkleSize.y);
        const life = randomRange(this.sparkleLife.x, this.sparkleLife.y);

        n.getComponent(UITransform)!.setContentSize(size, size);
        n.setPosition(x, y, 0);
        n.setScale(0, 0, 1);
        n.angle = randomRange(0, 45);
        const end = new Vec3(x + randomRange(-0.2, 0.2) * this.sparkleDrift, y - this.sparkleDrift, 0);

        tween(n)
            .delay(delay)
            .parallel(
                tween(n).to(life, { position: end }),
                tween(n).by(life, { angle: 90 }),
                tween(n)
                    .to(life * 0.45, { scale: new Vec3(1, 1, 1) }, { easing: 'sineOut' })
                    .to(life * 0.55, { scale: new Vec3(0, 0, 1) }, { easing: 'sineIn' }),
            )
            .call(() => this.twinkle(n, randomRange(0, 0.8)))
            .start();
    }

    private stopAll(): void {
        if (this.rootOpacity) Tween.stopAllByTarget(this.rootOpacity);
        for (const b of this.beams) Tween.stopAllByTarget(b.state);
        for (const s of this.sparkles) if (s.isValid) Tween.stopAllByTarget(s);
    }
}
