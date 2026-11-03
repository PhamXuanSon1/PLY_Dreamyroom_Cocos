/**
 * DrawerHandler — ngăn kéo (tủ lạnh, tủ quần áo...) chứa đích của item bên trong.
 *
 * Gắn vào node ngăn kéo (vd: Drawer 1), kéo tay node mở / đóng vào Open Nodes / Close Nodes.
 * Đích nằm trong Open Nodes (đang tắt):
 *   - ghép xong tủ chứa ngăn -> mở ngăn (bật open, tắt close) nếu còn item có đích trong ngăn
 *   - còn item chưa ghép -> ngăn giữ mở (kể cả thả hụt)
 *   - ghép xong item cuối cùng của ngăn -> đóng ngăn sau closeDelay giây
 * ItemController (refreshDrawer) gọi thẳng các hàm này, không poll mỗi frame.
 */

import { _decorator, Component, Node } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('DrawerHandler')
export class DrawerHandler extends Component {

    @property({ type: [Node], tooltip: 'Node BẬT khi mở ngăn (chứa đích của item). Kéo tay node vào đây.' })
    openNodes: Node[] = [];

    @property({ type: [Node], tooltip: 'Node TẮT khi mở ngăn (hình ngăn đang đóng). Kéo tay node vào đây.' })
    closeNodes: Node[] = [];

    @property({ tooltip: 'Ghép đúng xong bao lâu thì tự đóng ngăn (giây).' })
    closeDelay = 0.8;

    private isOpen = false;

    onLoad() {
        if (this.openNodes.length === 0) console.warn(`[DrawerHandler] "${this.node.name}" chưa gán Open Nodes!`);
        if (this.closeNodes.length === 0) console.warn(`[DrawerHandler] "${this.node.name}" chưa gán Close Nodes!`);
    }

    /**
     * Ngăn kéo có Open Nodes chứa đích này: dò ngược lên các node cha.
     * Không dùng danh sách đăng ký trong onLoad vì ngăn có thể nằm trong đích đang tắt (chưa onLoad).
     */
    static findFor(target: Node | null): DrawerHandler | null {
        if (!target || !target.isValid) return null;
        for (let n = target.parent; n; n = n.parent) {
            const d = n.getComponent(DrawerHandler);
            if (d) return d.contains(target) ? d : null;
        }
        return null;
    }

    contains(target: Node): boolean {
        for (let n = target.parent; n && n !== this.node; n = n.parent) {
            if (this.openNodes.includes(n)) return true;
        }
        return false;
    }

    openDrawer(): void {
        this.unschedule(this.closeDrawer);
        if (this.isOpen) return;
        this.isOpen = true;
        for (const n of this.openNodes) if (n?.isValid) n.active = true;
        for (const n of this.closeNodes) if (n?.isValid) n.active = false;
    }

    closeDrawer(): void {
        this.unschedule(this.closeDrawer);
        if (!this.isOpen) return;
        this.isOpen = false;
        for (const n of this.openNodes) if (n?.isValid) n.active = false;
        for (const n of this.closeNodes) if (n?.isValid) n.active = true;
    }

    closeAfterDelay(): void {
        this.unschedule(this.closeDrawer);
        this.scheduleOnce(this.closeDrawer, this.closeDelay);
    }
}
