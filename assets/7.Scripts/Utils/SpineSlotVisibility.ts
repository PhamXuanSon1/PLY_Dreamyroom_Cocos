import { _decorator, Component, sp } from 'cc';
import { ItemController } from '../MyScript/item/ItemController';

const { ccclass, property, requireComponent } = _decorator;

@ccclass('SpineSlotRule')
export class SpineSlotRule {
    @property({ tooltip: 'Tên slot trong spine (vd "Layer 577").' })
    slot = '';

    @property({
        type: ItemController,
        tooltip: 'Slot chỉ hiện khi item này đã ghép xong. Để trống = slot luôn ẩn '
            + '(dùng khi phần đó đã có item riêng, tránh vẽ trùng).',
    })
    showWhenPlaced: ItemController | null = null;
}

/**
 * Ẩn/hiện từng slot của spine cùng node.
 * Dùng cho spine vẽ kèm đồ vật của item khác: vd gấu mẹ có sẵn tay vịn ghế tựa
 * (chỉ hiện khi ghế đã ghép), gấu con có sẵn giỏ len (trùng item giỏ len -> ẩn hẳn).
 */
@ccclass('SpineSlotVisibility')
@requireComponent(sp.Skeleton)
export class SpineSlotVisibility extends Component {
    @property({ type: [SpineSlotRule] })
    rules: SpineSlotRule[] = [];

    private skeleton: sp.Skeleton | null = null;
    private attachmentNames = new Map<string, string>();

    protected onLoad(): void {
        this.skeleton = this.getComponent(sp.Skeleton);
    }

    protected lateUpdate(): void {
        const sk = this.skeleton;
        if (!sk || !sk.skeletonData) return;
        for (const rule of this.rules) {
            if (!rule.slot) continue;
            const slot = sk.findSlot(rule.slot);
            if (!slot) continue;
            const show = !!rule.showWhenPlaced && rule.showWhenPlaced.isPlaced;
            const current = slot.getAttachment();
            // Spine 4.2 (wasm) của Cocos 3.8 không có slot.data.attachmentName -> nhớ tên
            // attachment lúc slot còn hiện, để hiện lại được sau khi đã ẩn.
            if (current && current.name) this.attachmentNames.set(rule.slot, current.name);
            if (show && !current) {
                const name = this.attachmentNames.get(rule.slot)
                    ?? (slot.data as any).attachmentName ?? rule.slot;
                sk.setAttachment(rule.slot, name);
            } else if (!show && current) {
                slot.setAttachment(null);
            }
        }
    }
}
