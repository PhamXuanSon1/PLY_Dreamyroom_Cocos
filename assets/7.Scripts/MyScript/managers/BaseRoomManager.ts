import { _decorator, Component, Node, Vec3 } from 'cc';
import { BaseRoom } from '../utils/BaseRoom';
import { TweenUtil } from '../core/TweenUtil';

const { ccclass, property } = _decorator;

@ccclass('BaseRoomManager')
export class BaseRoomManager extends Component {

    static instance: BaseRoomManager | null = null;

    @property({ type: Node, tooltip: 'Node căn phòng chính.' })
    baseRoom: Node | null = null;

    @property({ tooltip: 'Bật hiệu ứng intro: phòng bắt đầu ở Start Pos (thu nhỏ theo Start Scale Multiplier), click Box lần đầu thì phóng to + bay về End Pos. Tắt = phòng đứng yên đúng vị trí/scale đặt trong scene.' })
    enableIntro = true;

    @property({ type: Node, tooltip: 'Vị trí phòng lúc mới vào game (hiệu ứng intro).', visible(this: BaseRoomManager) { return this.enableIntro; } })
    baseRoomStartPos: Node | null = null;

    @property({ type: Node, tooltip: 'Vị trí phòng sau khi intro xong.', visible(this: BaseRoomManager) { return this.enableIntro; } })
    baseRoomEndPos: Node | null = null;

    @property({ tooltip: 'Tỉ lệ thu nhỏ ban đầu của phòng.', visible(this: BaseRoomManager) { return this.enableIntro; } })
    startScaleMultiplier = 0.352941;

    @property({ tooltip: 'Thời gian chuyển động phóng to và di chuyển BaseRoom khi mở hộp (giây).', visible(this: BaseRoomManager) { return this.enableIntro; } })
    introDuration = 1.2;

    private baseRoomOriginalScale = new Vec3(1, 1, 1);
    private baseRoomOriginalWorldPos = new Vec3(0, 0, 0);

    onLoad() {
        BaseRoomManager.instance = this;

        // glue Cocos: quên kéo baseRoom thì playIntroAnimation không bao giờ gọi
        // enableInteraction() -> BaseRoom không pan/zoom được. Tự dò trong scene.
        if (!this.baseRoom) {
            const room = this.node.scene?.getComponentInChildren(BaseRoom);
            if (room) {
                this.baseRoom = room.node;
                console.warn(`[BaseRoomManager] baseRoom chưa gán, tự dùng "${room.node.name}"`);
            }
        }

        if (this.baseRoom) {
            this.baseRoomOriginalScale = this.baseRoom.scale.clone();
            this.baseRoomOriginalWorldPos = this.baseRoom.worldPosition.clone();

            const room = this.baseRoom.getComponent(BaseRoom);
            if (room) {
                room.initializeOriginalScale(this.baseRoomOriginalScale);
            }

            // Tắt intro -> giữ nguyên vị trí/scale đặt trong scene
            if (!this.enableIntro) return;

            // 1. Thu nhỏ BaseRoom khi bắt đầu game theo startScaleMultiplier
            const startScale = new Vec3(
                this.baseRoomOriginalScale.x * this.startScaleMultiplier,
                this.baseRoomOriginalScale.y * this.startScaleMultiplier,
                this.baseRoomOriginalScale.z * this.startScaleMultiplier,
            );
            this.baseRoom.setScale(startScale);

            // 2. Đặt BaseRoom tại baseRoomStartPos nếu có
            if (this.baseRoomStartPos) {
                this.baseRoom.setWorldPosition(this.baseRoomStartPos.worldPosition.clone());
            }
        }
    }

    onDestroy() {
        if (BaseRoomManager.instance === this) BaseRoomManager.instance = null;
    }

    /**
     * MapPhaseManager gọi khi sang lượt mới: phòng bay tới `pos` (world, null = đứng yên) và
     * scale = scale gốc × `scaleMultiplier`. Xong thì scale mới thành mốc cho pinch/zoom
     * (min/maxScaleMultiplier tính theo scale này). Không tự bật lại kéo phòng.
     */
    moveToPhase(pos: Node | null, scaleMultiplier: number, duration: number, easing = 'sineInOut', onComplete?: () => void): void {
        const roomNode = this.baseRoom;
        if (!roomNode) { onComplete?.(); return; }

        const s = this.baseRoomOriginalScale;
        const m = scaleMultiplier > 0 ? scaleMultiplier : 1;
        const targetScale = new Vec3(s.x * m, s.y * m, s.z * m);
        TweenUtil.killAll(roomNode);

        let pending = pos ? 2 : 1;
        const done = () => {
            if (--pending > 0) return;
            roomNode.getComponent(BaseRoom)?.initializeOriginalScale(targetScale);
            onComplete?.();
        };
        TweenUtil.scaleTo(roomNode, targetScale, duration, easing, done);
        if (pos) TweenUtil.moveTo(roomNode, pos.worldPosition.clone(), duration, easing, done);
    }

    /** Unity: PlayIntroAnimation — Phóng to BaseRoom về scale gốc và di chuyển về baseRoomEndPos khi mở hộp. */
    playIntroAnimation(onComplete?: () => void): void {
        if (!this.baseRoom) {
            onComplete?.();
            return;
        }

        // Tắt intro -> không tween, bật pan/zoom luôn
        if (!this.enableIntro) {
            const room = this.baseRoom.getComponent(BaseRoom);
            if (room) {
                room.initializeOriginalScale(this.baseRoomOriginalScale);
                room.enableInteraction();
            }
            onComplete?.();
            return;
        }

        // 1. Phóng to BaseRoom về lại kích thước bình thường
        TweenUtil.scaleTo(this.baseRoom, this.baseRoomOriginalScale, this.introDuration, 'linear');

        // 2. Di chuyển BaseRoom tới baseRoomEndPos
        const targetWorldPos = this.baseRoomEndPos
            ? this.baseRoomEndPos.worldPosition.clone()
            : this.baseRoomOriginalWorldPos.clone();

        TweenUtil.moveTo(this.baseRoom, targetWorldPos, this.introDuration, 'linear', () => {
            const room = this.baseRoom?.getComponent(BaseRoom);
            if (room) {
                room.initializeOriginalScale(this.baseRoomOriginalScale);
                room.enableInteraction();
            }
            onComplete?.();
        });
    }
}
