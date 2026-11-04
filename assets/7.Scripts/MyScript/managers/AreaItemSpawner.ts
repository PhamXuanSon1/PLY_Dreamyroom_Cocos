/**
 * AreaItemSpawner — chọn cách nhả item ra cho người chơi (mode). 3 chế độ:
 *
 *   - Box: hộp quà như cũ (BoxController) — click hộp, item nhảy vào Holder. Spawner chỉ giữ danh sách Holder.
 *   - Holder Nodes: item bay vào các node Holder cố định (HolderSlot). Lượt có nhiều item hơn số
 *     Holder -> item dư xếp hàng, Holder nào trống (item vừa ghép xong) thì item kế tiếp vào thế chỗ.
 *   - Spawn Area: item rải ngẫu nhiên trong 1 vùng Collider2D, mỗi item 1 HolderSlot tạo động
 *     (con của node vùng) để dùng lại logic nhấp nhô / thả hụt / hint.
 *   Item lơ lửng luôn được phóng cho bằng kích thước đích trong phòng (ItemGraphic.fitToTarget).
 *   Danh sách Holder nằm ở đây (không ở ItemManager) — hộp quà (BoxController) cũng lấy Holder từ đây.
 *
 *   Holder Nodes / Spawn Area — vào game: tắt hộp + tay chỉ hộp, chạy intro phòng (BaseRoomManager), xong thì nhả item
 *   của lượt hiện tại (ItemManager.spawnLimit).
 *   MapPhaseManager: phòng chuyển khung lượt mới xong -> gọi spawnAvailable() nhả item lượt mới.
 *
 * Vùng spawn: BoxCollider2D / PolygonCollider2D / CircleCollider2D trên node `area`
 * (trống = collider trên chính node này). Hình vùng tính từ thông số collider, không cần physics.
 */

import { _decorator, BoxCollider2D, CircleCollider2D, Collider2D, Component, Enum, Intersection2D, Node, PolygonCollider2D, randomRange, Vec2, Vec3 } from 'cc';
import { ItemManager } from './ItemManager';
import { UIManager } from './UIManager';
import { BaseRoomManager } from './BaseRoomManager';
import { BoxManager } from './BoxManager';
import { ItemController } from '../item/ItemController';
import { ItemMovement } from '../item/ItemMovement';
import { ItemGraphic } from '../item/ItemGraphic';
import { HolderSlot } from '../utils/HolderSlot';
import { BoxController } from '../box/BoxController';
import { TweenUtil } from '../core/TweenUtil';

const { ccclass, property } = _decorator;

/** Giá trị giữ nguyên số cũ (scene đã lưu mode = 0/1), Box thêm sau = 2. */
export enum SpawnMode {
    HolderNodes = 0,
    SpawnArea = 1,
    Box = 2,
}
Enum(SpawnMode);

@ccclass('AreaItemSpawner')
export class AreaItemSpawner extends Component {

    static instance: AreaItemSpawner | null = null;

    /** Spawner tự nhả item (mode khác Box) -> MapPhaseManager bỏ hộp, gọi spawnAvailable(). */
    static get active(): AreaItemSpawner | null {
        const s = AreaItemSpawner.instance;
        return s && s.isValid && s.enabledInHierarchy && s.mode !== SpawnMode.Box ? s : null;
    }

    @property({ type: Enum(SpawnMode), tooltip: 'Box: click hộp quà, item nhảy vào Holder. Holder Nodes: vào map item tự vào các Holder cố định. Spawn Area: vào map item rải ngẫu nhiên trong vùng Collider2D.' })
    mode: SpawnMode = SpawnMode.SpawnArea;

    // ---- Holder (Box / Holder Nodes) ----
    @property({
        type: [Node],
        tooltip: 'Các node Holder (có HolderSlot) theo thứ tự lấp. Trống = tự dò mọi HolderSlot trong scene.',
        visible(this: AreaItemSpawner) { return this.mode !== SpawnMode.SpawnArea; },
    })
    holders: Node[] = [];

    @property({
        type: Node,
        tooltip: 'Item bay từ vị trí node này tới Holder. Trống = bung ra ngay tại Holder.',
        visible(this: AreaItemSpawner) { return this.mode === SpawnMode.HolderNodes; },
    })
    flyFrom: Node | null = null;

    @property({ tooltip: 'Thời gian bay tới Holder (giây).', min: 0.01, visible(this: AreaItemSpawner) { return this.mode === SpawnMode.HolderNodes && !!this.flyFrom; } })
    flyDuration = 0.6;

    // ---- Spawn Area ----
    @property({ type: Collider2D, tooltip: 'Vùng nhả item (Box/Polygon/Circle Collider2D). Trống = collider trên chính node này.', visible(this: AreaItemSpawner) { return this.mode === SpawnMode.SpawnArea; } })
    area: Collider2D | null = null;

    @property({ tooltip: 'Thu vùng vào trong bao nhiêu px (toạ độ local của collider) để item không sát mép. Chỉ áp dụng Box/Circle.', min: 0, visible(this: AreaItemSpawner) { return this.mode === SpawnMode.SpawnArea; } })
    edgePadding = 60;

    @property({ tooltip: 'Số điểm thử cho mỗi item — chọn điểm xa các item khác nhất (càng lớn càng dàn đều).', min: 1, visible(this: AreaItemSpawner) { return this.mode === SpawnMode.SpawnArea; } })
    candidates = 30;

    @property({ tooltip: 'Khoảng nhấp nhô lên xuống của item lơ lửng (px).', visible(this: AreaItemSpawner) { return this.mode === SpawnMode.SpawnArea; } })
    bobbingDistance = 20;

    @property({ tooltip: 'Thời gian 1 chu kỳ nhấp nhô (giây). Mỗi item lệch ngẫu nhiên ±15% để không nhấp nhô cùng nhịp.', min: 0.1, visible(this: AreaItemSpawner) { return this.mode === SpawnMode.SpawnArea; } })
    bobbingDuration = 1.6;

    // ---- chung (Holder Nodes / Spawn Area) ----
    @property({ group: { name: 'Nhả item', id: 'spawnCommon' }, tooltip: 'Vào game: chờ bao nhiêu giây rồi mới chạy intro phòng.', min: 0, visible(this: AreaItemSpawner) { return this.selfSpawn; } })
    startDelay = 0.5;

    @property({ group: { name: 'Nhả item', id: 'spawnCommon' }, tooltip: 'Nhả item sau khi intro phòng chạy xong (tắt = nhả cùng lúc với intro).', visible(this: AreaItemSpawner) { return this.selfSpawn; } })
    spawnAfterIntro = true;

    @property({ group: { name: 'Nhả item', id: 'spawnCommon' }, tooltip: 'Khoảng cách giữa 2 item hiện ra liên tiếp (giây).', min: 0, visible(this: AreaItemSpawner) { return this.selfSpawn; } })
    staggerInterval = 0.08;

    @property({ group: { name: 'Nhả item', id: 'spawnCommon' }, tooltip: 'Thời gian item phóng to từ 0 khi hiện ra (giây).', min: 0.01, visible(this: AreaItemSpawner) { return this.selfSpawn; } })
    popDuration = 0.4;

    @property({ group: { name: 'Nhả item', id: 'spawnCommon' }, tooltip: 'Xoay ngẫu nhiên item trong khoảng ±N độ khi hiện ra (0 = không xoay).', min: 0, visible(this: AreaItemSpawner) { return this.selfSpawn; } })
    randomRotation = 15;

    /** Spawner tự nhả item (không dùng hộp). */
    private get selfSpawn(): boolean {
        return this.mode !== SpawnMode.Box;
    }

    private slots: HolderSlot[] = [];
    /** Holder Nodes: item chờ Holder trống. */
    private queue: Node[] = [];
    private started = false;
    private hintShown = false;

    onLoad() {
        AreaItemSpawner.instance = this;
        if (!this.area) this.area = this.getComponent(Collider2D);
    }

    onDestroy() {
        if (AreaItemSpawner.instance === this) AreaItemSpawner.instance = null;
    }

    start() {
        // Box: hộp tự lo (click hộp lần đầu mới chạy intro + nhả item)
        if (!this.selfSpawn) return;
        // Tắt hộp ngay (start chạy trước frame đầu được vẽ) — không để hộp hiện lên rồi mới tắt
        this.hideBoxUI();
        // chạy sau ItemManager.start() (đã thu scale item về 0 + ẩn đích)
        this.scheduleOnce(() => this.beginGame(), this.startDelay);
    }

    /** Không dùng hộp: tắt hộp + chữ / tay chỉ hộp, bật thanh tiến độ. */
    private hideBoxUI(): void {
        const boxNode = BoxManager.instance?.box ?? this.node.scene?.getComponentInChildren(BoxManager)?.box ?? null;
        const box = boxNode?.getComponent(BoxController) ?? null;
        if (box) {
            if (box.handText) box.handText.active = false;
            if (box.handOfBox) box.handOfBox.node.active = false;
            if (box.slider) box.slider.active = true;
        }
        if (boxNode) boxNode.active = false;
        const im = ItemManager.instance;
        if (im?.handIntro) im.handIntro.active = false;
    }

    // ======================================================== vào game (thay click hộp lần đầu)
    private beginGame(): void {
        if (this.started) return;
        this.started = true;

        const im = ItemManager.instance;
        // phòng khi thứ gì đó bật lại hộp / tay chỉ hộp trong lúc chờ startDelay
        this.hideBoxUI();

        im?.enableFirstClickObjects();
        im?.onBoxFirstClicked();
        // đồng hồ Auto End không chạy từ đây — bắt đầu ở lần chạm đầu tiên (ItemManager.onAnyPointerDown)

        const finish = () => {
            if (im) im.finishedTutorial = true;
            if (this.spawnAfterIntro) this.spawnAvailable();
        };
        if (!this.spawnAfterIntro) this.spawnAvailable();
        if (BaseRoomManager.instance) BaseRoomManager.instance.playIntroAnimation(finish);
        else finish();
    }

    // ======================================================== nhả item
    /** Nhả mọi item ItemManager còn cho phép (tới spawnLimit). onDone chạy khi đợt item này hiện xong. */
    spawnAvailable(onDone?: () => void): void {
        const im = ItemManager.instance;
        if (!im) { onDone?.(); return; }

        const items: Node[] = [];
        for (let n = im.getCurrentItem(); n; n = im.getCurrentItem()) items.push(n);

        if (this.mode === SpawnMode.HolderNodes) {
            this.queue.push(...items);
            const count = this.fillFreeHolders();
            this.scheduleOnce(() => onDone?.(), Math.max(0, count - 1) * this.staggerInterval + this.popDuration);
            return;
        }

        if (items.length === 0) { onDone?.(); return; }

        // điểm của các item đang lơ lửng từ trước (chưa ghép) để item mới tránh ra
        const taken: Vec3[] = this.slots
            .filter((s) => !s.isEmpty && s.itemInSlot?.isValid)
            .map((s) => s.node.worldPosition.clone());

        items.forEach((item, i) => {
            const pos = this.pickPoint(taken);
            taken.push(pos);
            this.scheduleOnce(() => {
                this.spawnInto(item, this.createSlot(pos));
                if (i === items.length - 1) this.scheduleOnce(() => onDone?.(), this.popDuration);
            }, i * this.staggerInterval);
        });
    }

    /** ItemController gọi khi item rời Holder (ghép xong) -> Holder Nodes: item kế tiếp trong hàng vào thế chỗ. */
    onSlotFreed(slot: HolderSlot): void {
        if (this.mode !== SpawnMode.HolderNodes || this.queue.length === 0) return;
        if (!this.getHolderSlots().includes(slot)) return;
        this.fillFreeHolders();
    }

    /** Holder Nodes: lấp item trong hàng vào các Holder đang trống. Trả về số item vừa nhả. */
    private fillFreeHolders(): number {
        let n = 0;
        for (const slot of this.getHolderSlots()) {
            if (this.queue.length === 0) break;
            if (!slot.isEmpty) continue;
            const item = this.queue.shift()!;
            slot.isEmpty = false;   // giữ chỗ ngay, item hiện ra sau stagger
            this.scheduleOnce(() => this.spawnInto(item, slot), n * this.staggerInterval);
            n++;
        }
        return n;
    }

    /** Holder cố định theo thứ tự lấp (không gồm slot tạo động của vùng spawn). */
    getHolderSlots(): HolderSlot[] {
        const out: HolderSlot[] = [];
        if (this.holders.length > 0) {
            for (const n of this.holders) {
                const s = n?.isValid ? n.getComponent(HolderSlot) : null;
                if (s) out.push(s);
            }
        } else {
            for (const s of HolderSlot.all) if (s.isValid && !this.slots.includes(s)) out.push(s);
        }
        return out;
    }

    /** Holder trống đầu tiên (hộp quà dùng hàm này). */
    getFreeHolder(): HolderSlot | null {
        return this.getHolderSlots().find((s) => s.isEmpty && s.enabledInHierarchy) ?? null;
    }

    private spawnInto(item: Node, slot: HolderSlot): void {
        const im = ItemManager.instance;
        const fly = this.mode === SpawnMode.HolderNodes && !!this.flyFrom;
        const holderPos = slot.node.worldPosition.clone();

        item.active = true;
        // ⚠ Chốt scale gốc TRƯỚC khi setScale(0) — xem BoxController.spawnItem
        item.getComponent(ItemMovement)?.captureOriginal();
        item.setWorldPosition(fly ? this.flyFrom!.worldPosition.clone() : holderPos);
        // rời cây phòng ngay (giữ world) để kích thước đo theo Holder, không theo phòng
        item.setParent(slot.node, true);
        item.setScale(0, 0, 0);
        item.setRotationFromEuler(0, 0, this.randomRotation > 0 ? randomRange(-this.randomRotation, this.randomRotation) : 0);

        const itemScript = item.getComponent(ItemController);
        if (itemScript) itemScript.currentHolderSlot = slot;
        slot.isEmpty = false;

        const s = im?.enablePopScale ? im.popScaleAmount : 1;
        // Kích thước item lơ lửng = kích thước đích trong phòng (scale phòng mỗi lượt khác nhau)
        if (itemScript?.targetPoint) item.getComponent(ItemGraphic)?.fitToTarget(itemScript.targetPoint, s);
        TweenUtil.scaleTo(item, new Vec3(s, s, s), this.popDuration, 'backOut');

        const landed = () => {
            slot.setItem(item);
            if (im?.isStoreTriggerItem(item)) {
                UIManager.instance?.enableStoreOnAnyClick();
                return;
            }
            if (!this.hintShown && itemScript) {
                this.hintShown = true;
                im?.showFirstDragHint(itemScript);
            }
        };
        if (fly) TweenUtil.moveTo(item, holderPos, this.flyDuration, 'quadOut', landed);
        else landed();
    }

    /** Spawn Area: mỗi item 1 HolderSlot, con của node vùng spawn (nằm trong Canvas UI để item vẽ được). */
    private createSlot(worldPos: Vec3): HolderSlot {
        const parent = this.area?.node ?? this.node;
        const node = new Node('SpawnSlot');
        node.layer = parent.layer;
        node.setParent(parent);
        node.setWorldPosition(worldPos);
        const slot = node.addComponent(HolderSlot);
        slot.originPosition = node;
        slot.bobbingDistance = this.bobbingDistance;
        slot.bobbingDuration = this.bobbingDuration * randomRange(0.85, 1.15);
        slot.isEmpty = false;
        this.slots.push(slot);
        return slot;
    }

    // ======================================================== chọn điểm trong vùng
    /** Thử `candidates` điểm ngẫu nhiên, lấy điểm xa các điểm đã có nhất. */
    private pickPoint(taken: Vec3[]): Vec3 {
        let best: Vec3 | null = null;
        let bestDist = -1;
        for (let k = 0; k < this.candidates; k++) {
            const p = this.randomPointInArea();
            if (!p) continue;
            let d = Infinity;
            for (const t of taken) d = Math.min(d, Vec3.distance(p, t));
            if (d > bestDist) { bestDist = d; best = p; }
        }
        return best ?? (this.area?.node ?? this.node).worldPosition.clone();
    }

    private randomPointInArea(): Vec3 | null {
        const col = this.area;
        if (!col) return null;
        const off = col.offset;
        const local = new Vec3();

        if (col instanceof BoxCollider2D) {
            const hw = Math.max(0, col.size.width / 2 - this.edgePadding);
            const hh = Math.max(0, col.size.height / 2 - this.edgePadding);
            local.set(off.x + randomRange(-hw, hw), off.y + randomRange(-hh, hh), 0);
        } else if (col instanceof CircleCollider2D) {
            const r = Math.max(0, col.radius - this.edgePadding) * Math.sqrt(Math.random());
            const a = Math.random() * Math.PI * 2;
            local.set(off.x + r * Math.cos(a), off.y + r * Math.sin(a), 0);
        } else if (col instanceof PolygonCollider2D) {
            const pts = col.points;
            if (pts.length < 3) return null;
            let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
            for (const p of pts) { x0 = Math.min(x0, p.x); y0 = Math.min(y0, p.y); x1 = Math.max(x1, p.x); y1 = Math.max(y1, p.y); }
            const p2 = new Vec2();
            let found = false;
            for (let k = 0; k < 20 && !found; k++) {
                p2.set(randomRange(x0, x1), randomRange(y0, y1));
                found = Intersection2D.pointInPolygon(p2, pts as Vec2[]);
            }
            if (!found) return null;
            local.set(off.x + p2.x, off.y + p2.y, 0);
        } else {
            return null;
        }

        const out = new Vec3();
        Vec3.transformMat4(out, local, col.node.worldMatrix);
        return out;
    }
}
