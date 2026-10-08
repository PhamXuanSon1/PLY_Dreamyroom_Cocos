import { _decorator, Component, Sprite, sp } from 'cc';

const { ccclass, property, requireComponent, executeInEditMode } = _decorator;

/**
 * Replaces a Sprite's visual with a Spine skeleton (on this node, usually a
 * child of the sprite node) while keeping the Sprite as the "logical"
 * renderer that game code drives.
 *
 * The Sprite keeps no spriteFrame so it draws nothing; every frame its
 * enabled state and color (set by ItemGraphic shadow/restore, FollowNode,
 * ...) are mirrored onto the skeleton.
 */
@ccclass('SpineFollowSprite')
@requireComponent(sp.Skeleton)
@executeInEditMode(true)
export class SpineFollowSprite extends Component {
    @property({ type: Sprite, tooltip: 'Sprite gốc mà game code bật/tắt, đổi màu. Để trống thì lấy Sprite ở node cha.' })
    public sprite: Sprite | null = null;

    private skeleton: sp.Skeleton | null = null;

    protected onLoad(): void {
        this.skeleton = this.getComponent(sp.Skeleton);
        if (!this.sprite) this.sprite = this.node.parent?.getComponent(Sprite) ?? null;
    }

    protected lateUpdate(): void {
        const sprite = this.sprite;
        const skeleton = this.skeleton;
        if (!sprite || !sprite.isValid || !skeleton) return;

        if (skeleton.enabled !== sprite.enabled) skeleton.enabled = sprite.enabled;
        if (!skeleton.color.equals(sprite.color)) skeleton.color = sprite.color;
    }
}
