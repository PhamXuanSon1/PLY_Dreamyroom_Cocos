/**
 * ItemsPlacedTrigger — ghép xong ĐỦ các item chỉ định thì bật / tắt 1 số node.
 *
 * Cách dùng: gắn lên 1 node LUÔN ACTIVE (vd ItemManager, hoặc 1 node rỗng tên "Trigger_..."),
 *   - Items: kéo các item (node có ItemController) cần ghép xong.
 *   - Active Nodes: node được BẬT khi đủ. Deactive Nodes: node bị TẮT khi đủ.
 * Mỗi trigger chỉ chạy 1 lần. Cần nhiều nhóm thì gắn nhiều component.
 */

import { _decorator, Component, Node, Vec3, tween, Tween } from 'cc';
import { ItemController } from '../item/ItemController';
import { ItemManager } from '../managers/ItemManager';

const { ccclass, property } = _decorator;

@ccclass('ItemsPlacedTrigger')
export class ItemsPlacedTrigger extends Component {

    @property({ type: [ItemController], tooltip: 'Các item phải ghép xong HẾT thì mới kích hoạt.' })
    items: ItemController[] = [];

    @property({ type: [Node], tooltip: 'Các node được BẬT khi đã ghép xong hết các item trên.' })
    activeNodes: Node[] = [];

    @property({ type: [Node], tooltip: 'Các node bị TẮT khi đã ghép xong hết các item trên.' })
    deactiveNodes: Node[] = [];

    @property({ tooltip: 'Chờ N giây sau khi item cuối ghép xong mới bật/tắt (vd chờ âm thanh/hiệu ứng ghép).', min: 0 })
    delay = 0.2;

    @property({ tooltip: 'Node được bật sẽ nảy ra từ scale 0 (backOut) thay vì hiện tức thì.' })
    popIn = true;

    @property({ tooltip: 'Thời gian nảy ra (giây).', min: 0.01, visible(this: ItemsPlacedTrigger) { return this.popIn; } })
    popDuration = 0.35;

    private fired = false;
    private itemManager: ItemManager | null = null;

    start() {
        this.itemManager = ItemManager.instance;
        this.itemManager?.node.on(ItemManager.EVENT_ITEM_ARRIVED, this.check, this);
        this.check();
    }

    onDestroy() {
        if (this.itemManager?.isValid) this.itemManager.node.off(ItemManager.EVENT_ITEM_ARRIVED, this.check, this);
    }

    private check(): void {
        if (this.fired) return;
        const list = this.items.filter((it) => it && it.isValid);
        if (list.length === 0 || !list.every((it) => it.isPlaced)) return;
        this.fired = true;
        if (this.delay > 0) this.scheduleOnce(() => this.apply(), this.delay);
        else this.apply();
    }

    private apply(): void {
        for (const n of this.deactiveNodes) if (n && n.isValid) n.active = false;
        for (const n of this.activeNodes) {
            if (!n || !n.isValid) continue;
            if (!this.popIn || n.active) { n.active = true; continue; }
            const scale = n.scale.clone();
            Tween.stopAllByTarget(n);
            n.setScale(0, 0, scale.z);
            n.active = true;
            tween(n).to(this.popDuration, { scale }, { easing: 'backOut' }).call(() => n.setScale(scale)).start();
        }
    }
}
