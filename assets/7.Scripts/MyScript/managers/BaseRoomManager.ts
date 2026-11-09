import { _decorator, Component, Node, Vec3 } from 'cc';
import { BaseRoom } from '../utils/BaseRoom';
import { TweenUtil } from '../core/TweenUtil';
import type { RoomView } from './MapPhaseManager';

const { ccclass, property } = _decorator;

@ccclass('BaseRoomManager')
export class BaseRoomManager extends Component {

    static instance: BaseRoomManager | null = null;

    /** MapPhaseManager (Multi Phase) gắn vào: khung nhìn lượt 1 = chỗ intro dừng lại. null = dùng baseRoomEndPos. */
    static introViewProvider: (() => RoomView | null) | null = null;

    @property({ type: Node, tooltip: 'Node căn phòng chính.' })
    baseRoom: Node | null = null;

    @property({ tooltip: 'Bật hiệu ứng intro: phòng bắt đầu ở Start Pos (thu nhỏ theo Start Scale Multiplier), click Box lần đầu thì phóng to + bay về End Pos. Tắt = phòng đứng yên đúng vị trí/scale đặt trong scene.' })
    enableIntro = true;

    @property({ type: Node, tooltip: 'Vị trí phòng lúc mới vào game (hiệu ứng intro).', visible(this: BaseRoomManager) { return this.enableIntro; } })
    baseRoomStartPos: Node | null = null;

    @property({ type: Node, tooltip: 'Vị trí phòng sau khi intro xong (Single Phase). Multi Phase: lượt 1 bật Room View thì dùng khung đó, bỏ qua ô này.', visible(this: BaseRoomManager) { return this.enableIntro; } })
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

    /** Scale gốc của phòng (scale đặt trong scene) — mốc cho startScaleMultiplier / roomScaleMultiplier. */
    get originalScale(): Readonly<Vec3> {
        return this.baseRoomOriginalScale;
    }

    /**
     * MapPhaseManager gọi khi sang lượt mới: phòng bay tới khung nhìn `view` (vị trí world + scale tuyệt đối).
     * Xong thì scale mới thành mốc cho pinch/zoom (min/maxScaleMultiplier tính theo scale này) và đặt
     * khung kéo quanh view.pos. Không tự bật lại kéo phòng.
     */
    moveToView(view: RoomView, duration: number, easing = 'sineInOut', onComplete?: () => void): void {
        const roomNode = this.baseRoom;
        if (!roomNode) { onComplete?.(); return; }
        TweenUtil.killAll(roomNode);

        let pending = view.pos ? 2 : 1;
        const done = () => {
            if (--pending > 0) return;
            this.applyView(view);
            onComplete?.();
        };
        TweenUtil.scaleTo(roomNode, view.scale, duration, easing, done);
        if (view.pos) TweenUtil.moveTo(roomNode, view.pos, duration, easing, done);
    }

    /** Phòng đã tới khung `view`: chốt scale làm mốc zoom + đặt khung kéo (nếu có). */
    private applyView(view: RoomView): void {
        const room = this.baseRoom?.getComponent(BaseRoom);
        if (!room) return;
        room.initializeOriginalScale(view.scale);
        if (view.pos && view.panRange) room.setPanBounds(view.pos, view.panRange);
    }

    /**
     * Unity: PlayIntroAnimation — phóng to BaseRoom và di chuyển tới khung nhìn đầu tiên.
     * Multi Phase: khung = Room View của lượt 1 (introViewProvider). Không có thì như cũ:
     * scale gốc + baseRoomEndPos, giới hạn kéo là 4 node Limit của BaseRoom.
     */
    playIntroAnimation(onComplete?: () => void): void {
        if (!this.baseRoom) {
            onComplete?.();
            return;
        }

        const view: RoomView = BaseRoomManager.introViewProvider?.() ?? {
            pos: this.baseRoomEndPos ? this.baseRoomEndPos.worldPosition.clone() : this.baseRoomOriginalWorldPos.clone(),
            scale: this.baseRoomOriginalScale.clone(),
            panRange: null,
        };
        const finish = () => {
            this.applyView(view);
            const room = this.baseRoom?.getComponent(BaseRoom);
            room?.warnIfOutsideLimits();
            room?.enableInteraction();
            onComplete?.();
        };

        // Tắt intro -> không tween, đặt phòng vào khung luôn và bật pan/zoom
        if (!this.enableIntro) {
            this.baseRoom.setScale(view.scale);
            if (view.pos) this.baseRoom.setWorldPosition(view.pos);
            finish();
            return;
        }

        TweenUtil.scaleTo(this.baseRoom, view.scale, this.introDuration, 'linear');
        if (view.pos) TweenUtil.moveTo(this.baseRoom, view.pos, this.introDuration, 'linear', finish);
        else this.scheduleOnce(finish, this.introDuration);
    }
}
