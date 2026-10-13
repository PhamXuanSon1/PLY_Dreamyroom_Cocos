/**
 * FollowNode — node "đi theo" một node khác dù không còn là con của nó trong cây.
 *
 * SceneBuilder gắn component này khi phải TÁCH một sprite con ra khỏi cha để xếp đúng
 * thứ tự render (Unity xếp bằng sortingOrder toàn cục, Cocos xếp theo thứ tự cây —
 * có lúc 1 sprite con phải nằm giữa các sprite của node khác, không thể ở dưới cha).
 *
 * Trong scene đã lưu, node tách ra nằm trong folder `Follow` dưới chính target (dễ tìm, sửa
 * vị trí tay được). Lúc chạy, khi node được active lần đầu (start) nó tự chuyển ra đúng chỗ
 * xếp lớp: con của `renderParent`, đứng ngay trước `renderBefore`.
 *
 * Mỗi frame: world transform = target.worldMatrix × offset (offset chụp lúc tách),
 * và bật/tắt các renderer theo target.activeInHierarchy.
 */

import { _decorator, Component, Node, Mat4, Vec3, Quat, UIRenderer } from 'cc';
import { EDITOR } from 'cc/env';

const { ccclass, property, executeInEditMode, menu } = _decorator;

@ccclass('FollowNode')
@executeInEditMode(true)
@menu('Pipeline/FollowNode')
export class FollowNode extends Component {

    @property({ type: Node, tooltip: 'Node cha "logic" cần đi theo (transform + active).' })
    target: Node | null = null;

    @property({ tooltip: 'Bật/tắt renderer của node này theo activeInHierarchy của target.' })
    followActive = true;

    @property({ tooltip: 'Cha gốc trong Unity (chỉ để tra cứu).', readonly: true })
    originalParentPath = '';

    @property({ type: Node, tooltip: 'Lúc chạy, chuyển node ra làm con của node này (đúng thứ tự render).' })
    renderParent: Node | null = null;

    @property({ type: Node, tooltip: 'Chèn ngay TRƯỚC node này trong renderParent. Trống = cuối danh sách.' })
    renderBefore: Node | null = null;

    @property({ tooltip: 'Thứ tự giữa các FollowNode cùng chèn trước 1 node (nhỏ đứng trước).' })
    renderRank = 0;

    /** Offset local so với target, chụp lúc tách. */
    @property({ visible: false }) private offset: Mat4 = new Mat4();
    @property({ visible: false }) private hasOffset = false;

    /**
     * Ẩn renderer dù target đang active — dùng khi target chỉ đang hiện dạng BÓNG lúc kéo item
     * (ItemController.showTargetShadow); snap xong mới bỏ ẩn. Không serialize.
     */
    suppressed = false;

    private static readonly all = new Set<FollowNode>();

    private static readonly tmpM = new Mat4();
    private static readonly tmpP = new Vec3();
    private static readonly tmpR = new Quat();
    private static readonly tmpS = new Vec3();

    /** Bật/tắt suppressed cho mọi FollowNode có target là `root` hoặc con cháu của `root`. */
    static setSuppressedFor(root: Node, value: boolean): void {
        for (const f of FollowNode.all) {
            const t = f.target;
            if (t && t.isValid && (t === root || t.isChildOf(root))) f.suppressed = value;
        }
    }

    onLoad(): void {
        FollowNode.all.add(this);
    }

    onDestroy(): void {
        FollowNode.all.delete(this);
    }

    /** Gọi ngay sau khi setParent để chụp offset hiện tại so với target. */
    captureOffset(): void {
        if (!this.target || !this.target.isValid) return;
        const inv = Mat4.invert(FollowNode.tmpM, this.target.worldMatrix);
        Mat4.multiply(this.offset, inv, this.node.worldMatrix);
        this.hasOffset = true;
    }

    /**
     * Không làm trong onLoad/onEnable: lúc đó target đang được active đệ quy, rút con ra
     * giữa chừng sẽ làm NodeActivator bỏ sót node anh em.
     */
    start(): void {
        if (!EDITOR) this.moveToRenderParent();
    }

    /** Chuyển node ra khỏi folder Follow, về đúng chỗ xếp lớp trong renderParent. */
    private moveToRenderParent(): void {
        const P = this.renderParent;
        if (!P || !P.isValid || this.node.parent === P) return;
        if (!this.hasOffset) this.captureOffset();

        this.node.setParent(P, true);
        const kids = P.children;
        const before = this.renderBefore;
        let idx = before && before.isValid && before.parent === P ? before.getSiblingIndex() : kids.length - 1;
        // các FollowNode khác đã chuyển ra trước, cùng chèn trước `before` nhưng rank lớn hơn → đứng sau mình
        while (idx > 0) {
            const f = kids[idx - 1].getComponent(FollowNode);
            if (!f || f === this || f.renderParent !== P || f.renderBefore !== before || f.renderRank < this.renderRank) break;
            idx--;
        }
        this.node.setSiblingIndex(idx);
    }

    lateUpdate(): void {
        const t = this.target;
        if (!t || !t.isValid) return;

        // Còn nằm trong target (folder Follow trong editor): đi theo tự nhiên,
        // chỉ chụp lại offset để chỉnh tay vị trí trong editor vẫn giữ được.
        if (this.node.isChildOf(t)) {
            this.captureOffset();
            return;
        }
        if (!this.hasOffset) this.captureOffset();

        const m = Mat4.multiply(FollowNode.tmpM, t.worldMatrix, this.offset);
        Mat4.toRTS(m, FollowNode.tmpR, FollowNode.tmpP, FollowNode.tmpS);
        this.node.setWorldPosition(FollowNode.tmpP);
        this.node.setWorldRotation(FollowNode.tmpR);
        this.node.setWorldScale(FollowNode.tmpS);

        if (this.followActive) {
            const on = t.activeInHierarchy && !this.suppressed;
            for (const r of this.node.getComponentsInChildren(UIRenderer)) {
                if (r.enabled !== on) r.enabled = on;
            }
        }
    }
}
