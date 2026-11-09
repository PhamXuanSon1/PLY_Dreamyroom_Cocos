/**
 * WindowLight — ánh sáng lấp lánh chiếu từ cửa sổ vào phòng.
 *
 *   - Dải nắng xiên (beamFrame) từ cửa sổ, sáng/mờ nhẹ theo nhịp (nhiều dải thì lệch pha nhau).
 *   - Hạt lấp lánh (sparkleFrame) bay lượn trong dải sáng (phần dưới cửa sổ), to nhỏ + xoay + nhấp nháy,
 *     vẽ đè lên đồ đạc (sparkleSortingOrder) như bụi lấp lánh trong nắng.
 *   - Kính phát sáng (glassGlowFrame): hình chỉ gồm các ô kính, cắt từ chính hình cửa sổ, đặt trùng
 *     lên node cửa sổ (glassGlowTarget) -> sáng đúng khít ô kính, song cửa không sáng.
 *
 * Vùng sáng = UITransform của node này. Anchor = chỗ ánh sáng bắt đầu (nên để 0.5, 1 = mép trên giữa),
 * tia sáng chiếu xuống theo trục -y của node -> xoay node (Rotation) để đổi hướng chiếu.
 * Mọi node con được tạo lúc chạy game, thứ tự vẽ theo Sorting2D (sortingOrder): đặt cao hơn cửa sổ,
 * thấp hơn rèm và đồ đạc -> rèm che được nắng, nắng in lên tường / sàn phía sau đồ đạc.
 *
 * onlyInMistakeHintMode: chỉ hiện khi bật MistakeHintMode. waitForItem: ghép xong item cửa sổ mới sáng lên.
 *
 * Trong editor (editorPreview): dựng bản xem trước đứng yên (không lưu vào scene, ẩn khỏi Hierarchy),
 * chỉnh thông số trên Inspector là Scene vẽ lại ngay.
 */

import { _decorator, CCObject, Color, Component, Node, randomRange, randomRangeInt, Sorting2D, Sprite, SpriteFrame, Tween, tween, UIOpacity, UITransform, Vec2, Vec3 } from 'cc';
import { EDITOR } from 'cc/env';
import { MistakeHintMode } from '../managers/MistakeHintMode';
import { ItemManager } from '../managers/ItemManager';
import { ItemController } from '../item/ItemController';

const { ccclass, property, requireComponent, executeInEditMode } = _decorator;

interface Beam {
    node: Node;
    sprite: Sprite;
    width: number;
    height: number;
    color: Color;
    /** Góc xoay của tia (độ, quanh điểm đầu tia) — chế độ quạt. */
    angle: number;
    /** Object tween độ sáng (để dừng lúc huỷ). */
    state: { a: number };
}

@ccclass('WindowLight')
@requireComponent(UITransform)
@executeInEditMode
export class WindowLight extends Component {

    @property({ type: SpriteFrame, tooltip: 'Hình dải sáng (rộng gần đều, mép mềm, mờ dần về cuối). Mặc định: 3.Sprites/Chung/fx_window_beam.' })
    beamFrame: SpriteFrame | null = null;

    @property({ type: SpriteFrame, tooltip: 'Hình hạt lấp lánh. Mặc định: 3.Sprites/Chung/fx_sparkle_star.' })
    sparkleFrame: SpriteFrame | null = null;

    @property({ tooltip: 'Xem trước trong editor: chỉnh Inspector là thấy ngay trong Scene (bản xem trước không lưu vào scene).' })
    editorPreview = true;

    @property({ tooltip: 'Chỉ hiện khi bật MistakeHintMode.', formerlySerializedAs: 'onlyInPlayerMode' })
    onlyInMistakeHintMode = true;

    @property({ type: Node, tooltip: 'Item cửa sổ: ghép xong item này ánh sáng mới hiện. Trống = hiện ngay từ đầu.' })
    waitForItem: Node | null = null;

    @property({ tooltip: 'Thời gian ánh sáng hiện dần lên (giây).', min: 0 })
    fadeInDuration = 1.2;

    @property({ type: [Node], tooltip: 'Node đặt sẵn trong scene (vd sprite luồng sáng cuaso_light2): ẩn lúc đầu, hiện dần cùng ánh sáng (sau khi ghép Wait For Item). Không bật MistakeHintMode thì tắt hẳn.' })
    fadeNodes: Node[] = [];

    @property({ tooltip: 'Sorting Order của Sorting2D. Cao hơn cửa sổ, thấp hơn rèm / đồ đạc để rèm che được nắng (phòng dùng khoảng -32768..-1000).' })
    sortingOrder = -9500;

    // ---------------- kính phát sáng ----------------
    @property({ type: SpriteFrame, group: { name: 'Kính phát sáng', id: 'glass' }, tooltip: 'Hình chỉ gồm các ô kính của cửa sổ (cùng kích thước hình cửa sổ). Vd: 3.Sprites/Chung/fx_window_glass_glow.' })
    glassGlowFrame: SpriteFrame | null = null;

    @property({ type: Node, group: { name: 'Kính phát sáng', id: 'glass' }, tooltip: 'Node đích cửa sổ (…Place): kính phát sáng đặt trùng vị trí / kích thước node này.' })
    glassGlowTarget: Node | null = null;

    @property({ group: { name: 'Kính phát sáng', id: 'glass' }, tooltip: 'Màu kính phát sáng (alpha = độ sáng tối đa).' })
    glassGlowColor = new Color(255, 244, 205, 170);

    // ---------------- tia sáng ----------------
    @property({ group: { name: 'Tia sáng', id: 'beam' }, tooltip: 'Hiện hình dải sáng. Tắt = chỉ còn kính phát sáng + hạt lấp lánh (hạt vẫn bay trong vùng dải sáng).' })
    showBeam = true;

    @property({ group: { name: 'Tia sáng', id: 'beam' }, tooltip: 'Số tia sáng.', min: 0 })
    beamCount = 1;

    @property({ group: { name: 'Tia sáng', id: 'beam' }, tooltip: 'Tia toả hình quạt: mọi tia cùng xuất phát ở anchor, xoè đều trong góc N độ (giữa = hướng của node). 0 = các tia song song.', min: 0, max: 180 })
    beamFanSpread = 0;

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
    sparkleCount = 16;

    @property({ group: { name: 'Hạt lấp lánh', id: 'sparkle' }, tooltip: 'Sorting Order của hạt. Mặc định cao hơn đồ đạc (hạt bay trước sofa, bàn...).' })
    sparkleSortingOrder = -999;

    @property({ group: { name: 'Hạt lấp lánh', id: 'sparkle' }, tooltip: 'Hạt xuất hiện trong đoạn x..y dọc dải sáng (0 = đầu dải ở cửa sổ, 1 = cuối dải). Mặc định bỏ đoạn trùng cửa sổ để rèm không bị hạt đè.' })
    sparkleRange = new Vec2(0.35, 0.95);

    @property({ group: { name: 'Hạt lấp lánh', id: 'sparkle' }, tooltip: 'Hạt rải rộng = N × bề rộng dải sáng.', min: 0.1 })
    sparkleSpread = 1.6;

    @property({ group: { name: 'Hạt lấp lánh', id: 'sparkle' }, tooltip: 'Hạt lượn sang ngang tối đa bao nhiêu px trong 1 lần bay.', min: 0 })
    sparkleSway = 45;

    @property({ group: { name: 'Hạt lấp lánh', id: 'sparkle' }, tooltip: 'Màu hạt.' })
    sparkleColor = new Color(255, 245, 200, 255);

    @property({ group: { name: 'Hạt lấp lánh', id: 'sparkle' }, tooltip: 'Kích thước hạt (px), ngẫu nhiên x..y.' })
    sparkleSize = new Vec2(22, 48);

    @property({ group: { name: 'Hạt lấp lánh', id: 'sparkle' }, tooltip: 'Thời gian 1 lần bay + nhấp nháy (giây), ngẫu nhiên x..y.' })
    sparkleLife = new Vec2(2.2, 3.8);

    @property({ group: { name: 'Hạt lấp lánh', id: 'sparkle' }, tooltip: 'Hạt bay xuôi theo dải sáng bao nhiêu px trong 1 lần bay.' })
    sparkleDrift = 110;

    private root: Node | null = null;
    private rootOpacity: UIOpacity | null = null;
    private glow: Beam | null = null;
    private glowOpacity: UIOpacity | null = null;
    private beams: Beam[] = [];
    private sparkles: Node[] = [];
    private shown = false;
    private itemManager: ItemManager | null = null;
    /** Editor: chữ ký thông số của bản xem trước đang dựng — đổi thì dựng lại. */
    private previewKey = '';

    // ======================================================== lifecycle
    start() {
        if (EDITOR) return;   // editor: bản xem trước do update() lo
        if (this.onlyInMistakeHintMode && !MistakeHintMode.findOn(this.node.scene)) {
            for (const n of this.fadeNodes) if (n?.isValid) n.active = false;
            this.node.active = false;
            return;
        }
        for (const n of this.fadeNodes) {
            if (!n?.isValid) continue;
            (n.getComponent(UIOpacity) ?? n.addComponent(UIOpacity)).opacity = 0;
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
        if (EDITOR) this.clearPreview();
    }

    onEnable() {
        if (EDITOR) this.previewKey = '';   // dựng lại ở update() kế tiếp
    }

    onDisable() {
        if (EDITOR) this.clearPreview();
    }

    // ======================================================== xem trước trong editor
    update() {
        if (!EDITOR) return;
        const key = this.editorPreview ? this.previewSignature() : 'off';
        if (key === this.previewKey) return;
        this.previewKey = key;
        this.clearPreview();
        if (this.editorPreview) this.buildPreview();
    }

    private previewSignature(): string {
        const ut = this.getComponent(UITransform)!;
        const g = this.glassGlowTarget;
        const c = (k: Color) => `${k.r},${k.g},${k.b},${k.a}`;
        return [
            ut.width, ut.height, ut.anchorX, ut.anchorY, this.node.layer,
            this.beamFrame?.uuid, this.sparkleFrame?.uuid, this.glassGlowFrame?.uuid,
            g?.uuid, g?.position.x, g?.position.y, g?.scale.x, this.sortingOrder,
            this.showBeam, this.beamCount, this.beamFanSpread, c(this.beamColor), this.beamWidthRatio.x, this.beamWidthRatio.y,
            c(this.glassGlowColor), this.sparkleCount, this.sparkleSortingOrder, this.sparkleRange.x, this.sparkleRange.y,
            this.sparkleSpread, this.sparkleSway, c(this.sparkleColor), this.sparkleSize.x, this.sparkleSize.y, this.sparkleDrift,
        ].join('|');
    }

    /** Dựng như lúc chạy game nhưng đứng yên, hiện rõ; node không lưu vào scene, ẩn khỏi Hierarchy. */
    private buildPreview(): void {
        this.build();
        const flags = CCObject.Flags.DontSave | CCObject.Flags.HideInHierarchy;
        if (this.root) { this.root._objFlags |= flags; this.rootOpacity!.opacity = 255; }
        if (this.glow) { this.glow.node._objFlags |= flags; this.glowOpacity!.opacity = 255; }
        for (const s of this.sparkles) {
            this.twinkle(s, 0);              // đặt vị trí / kích thước ngẫu nhiên như lúc chạy
            Tween.stopAllByTarget(s);
            s.setScale(1, 1, 1);
        }
    }

    private clearPreview(): void {
        this.stopAll();
        if (this.root?.isValid) this.root.destroy();
        if (this.glow?.node.isValid) this.glow.node.destroy();
        this.root = null; this.rootOpacity = null; this.glow = null; this.glowOpacity = null;
        this.beams = []; this.sparkles = [];
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
            let angle = 0;
            if (this.beamFanSpread > 0 && n > 1) {
                // quạt: cùng điểm đầu, xoè từ -spread/2 tới +spread/2
                angle = -this.beamFanSpread / 2 + this.beamFanSpread * i / (n - 1);
                node.setPosition(0, top, 0);
                node.angle = angle;
            } else {
                const cx = left + W * (i + 0.5) / n + randomRange(-0.08, 0.08) * W;
                node.setPosition(Math.min(Math.max(cx, left + w / 2), left + W - w / 2), top, 0);
            }
            const sprite = this.makeSprite(node, this.beamFrame, this.beamColor);
            sprite.enabled = this.showBeam;
            this.beams.push({ node, sprite, width: w, height: h, color: this.beamColor.clone(), angle, state: { a: this.beamColor.a } });
        }

        this.buildGlassGlow();

        for (let i = 0; i < Math.max(0, this.sparkleCount); i++) {
            const node = this.makeNode(`Sparkle${i}`, root);
            this.makeSprite(node, this.sparkleFrame, this.sparkleColor);
            const so = Sorting2D ? node.getComponent(Sorting2D) : null;
            if (so) so.sortingOrder = this.sparkleSortingOrder;
            node.setScale(0, 0, 1);
            this.sparkles.push(node);
        }
    }

    /** Kính phát sáng: anh em của node cửa sổ, cùng vị trí / góc / scale / kích thước. */
    private buildGlassGlow(): void {
        const t = this.glassGlowTarget;
        if (!this.glassGlowFrame || !t || !t.isValid || !t.parent) return;
        const node = this.makeNode(`${t.name}_GlassGlow`, t.parent);
        node.setPosition(t.position);
        node.setRotation(t.rotation);
        node.setScale(t.scale);
        const tt = t.getComponent(UITransform);
        const gt = node.getComponent(UITransform)!;
        if (tt) { gt.setContentSize(tt.contentSize); gt.setAnchorPoint(tt.anchorPoint); }
        this.glowOpacity = node.addComponent(UIOpacity);
        this.glowOpacity.opacity = 0;
        const sprite = this.makeSprite(node, this.glassGlowFrame, this.glassGlowColor);
        this.glow = { node, sprite, width: gt.width, height: gt.height, color: this.glassGlowColor.clone(), angle: 0, state: { a: this.glassGlowColor.a } };
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
        for (const n of this.fadeNodes) {
            const o = n?.isValid ? n.getComponent(UIOpacity) : null;
            if (o) tween(o).to(this.fadeInDuration, { opacity: 255 }, { easing: 'sineOut' }).start();
        }
        if (this.glow && this.glowOpacity) {
            tween(this.glowOpacity).to(this.fadeInDuration, { opacity: 255 }, { easing: 'sineOut' }).start();
            this.pulseBeam(this.glow, 0);
        }

        if (this.showBeam) this.beams.forEach((b, i) => this.pulseBeam(b, (i / Math.max(1, this.beams.length)) * this.beamPulseTime));
        this.sparkles.forEach((s) => this.twinkle(s, randomRange(0, this.sparkleLife.y)));
    }

    /** Tia sáng sáng/mờ dần lặp mãi, lệch pha theo delay. */
    private pulseBeam(b: Beam, delay: number): void {
        const maxA = b.color.a;
        const minA = maxA * this.beamMinRatio;
        const c = b.color.clone();
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

    /**
     * 1 lần bay: hiện ở chỗ ngẫu nhiên trong dải sáng, bay xuôi theo dải + lượn sang ngang (2 chặng),
     * vừa bay vừa phóng to, xoay, nhấp nháy rồi tắt; xong lặp lại ở chỗ khác.
     */
    private twinkle(n: Node, delay: number): void {
        if (!n.isValid || this.beams.length === 0) return;

        const b = this.beams[randomRangeInt(0, this.beams.length)];
        const lo = Math.min(this.sparkleRange.x, this.sparkleRange.y), hi = Math.max(this.sparkleRange.x, this.sparkleRange.y);
        const t = randomRange(lo, hi);                                     // dọc theo dải sáng (0 = sát cửa sổ)
        const widthAt = b.width * (0.8 + 0.2 * t) * this.sparkleSpread;   // dải hơi loe (khớp hình fx_window_beam)
        // điểm trên tia: đi xuôi tia t*height, lệch ngang theo bề rộng (tính cả góc xoay của tia)
        const rad = b.angle * Math.PI / 180;
        const dir = new Vec3(Math.sin(rad), -Math.cos(rad), 0);      // hướng xuôi tia
        const side = new Vec3(Math.cos(rad), Math.sin(rad), 0);      // hướng ngang tia
        const along = t * b.height, off = randomRange(-0.5, 0.5) * widthAt;
        const x = b.node.position.x + dir.x * along + side.x * off;
        const y = b.node.position.y + dir.y * along + side.y * off;
        const size = randomRange(this.sparkleSize.x, this.sparkleSize.y);
        const life = randomRange(this.sparkleLife.x, this.sparkleLife.y);
        const peak = randomRange(0.75, 1.15);

        n.getComponent(UITransform)!.setContentSize(size, size);
        n.setPosition(x, y, 0);
        n.setScale(0, 0, 1);
        n.angle = randomRange(0, 45);

        // 2 chặng lượn: sang 1 bên rồi vòng về phía ngược lại, luôn trôi xuôi theo dải
        const sway = randomRange(0.4, 1) * this.sparkleSway * (Math.random() < 0.5 ? -1 : 1);
        const d = this.sparkleDrift;
        const mid = new Vec3(x + side.x * sway + dir.x * d * 0.5, y + side.y * sway + dir.y * d * 0.5, 0);
        const end = new Vec3(x - side.x * sway * 0.4 + dir.x * d, y - side.y * sway * 0.4 + dir.y * d, 0);
        const big = new Vec3(peak, peak, 1), small = new Vec3(peak * 0.55, peak * 0.55, 1);

        tween(n)
            .delay(delay)
            .parallel(
                tween(n)
                    .to(life * 0.5, { position: mid }, { easing: 'sineInOut' })
                    .to(life * 0.5, { position: end }, { easing: 'sineInOut' }),
                tween(n).by(life, { angle: randomRange(60, 140) * (Math.random() < 0.5 ? -1 : 1) }),
                tween(n)                                                    // hiện -> nhấp nháy 2 nhịp -> tắt
                    .to(life * 0.2, { scale: big }, { easing: 'backOut' })
                    .to(life * 0.15, { scale: small }, { easing: 'sineInOut' })
                    .to(life * 0.15, { scale: big }, { easing: 'sineInOut' })
                    .to(life * 0.2, { scale: small }, { easing: 'sineInOut' })
                    .to(life * 0.3, { scale: new Vec3(0, 0, 1) }, { easing: 'sineIn' }),
            )
            .call(() => this.twinkle(n, randomRange(0, 0.6)))
            .start();
    }

    private stopAll(): void {
        if (this.rootOpacity) Tween.stopAllByTarget(this.rootOpacity);
        if (this.glowOpacity) Tween.stopAllByTarget(this.glowOpacity);
        if (this.glow) Tween.stopAllByTarget(this.glow.state);
        for (const b of this.beams) Tween.stopAllByTarget(b.state);
        for (const s of this.sparkles) if (s.isValid) Tween.stopAllByTarget(s);
    }
}
