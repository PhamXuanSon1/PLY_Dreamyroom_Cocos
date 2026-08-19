/**
 * BaseRoomManager — port từ Assets/_GAME/Script/Manager/BaseRoomManager.cs (Unity)
 *
 * playIntroAnimation() bên Unity đã rỗng (chỉ gọi callback) vì hộp bị loại bỏ
 * khỏi luồng intro — giữ nguyên để BoxController không phải đổi.
 */

import { _decorator, Component, Node, Vec3 } from 'cc';
import { BaseRoom } from '../utils/BaseRoom';

const { ccclass, property } = _decorator;

@ccclass('BaseRoomManager')
export class BaseRoomManager extends Component {

    static instance: BaseRoomManager | null = null;

    @property({ type: Node, tooltip: 'Node căn phòng chính.' })
    BaseRoom: Node | null = null;

    @property({ type: Node, tooltip: 'Vị trí phòng lúc mới vào game (hiệu ứng intro).' })
    baseRoomStartPos: Node | null = null;

    @property({ type: Node, tooltip: 'Vị trí phòng sau khi intro xong.' })
    baseRoomEndPos: Node | null = null;

    @property({ tooltip: 'Tỉ lệ thu nhỏ ban đầu của phòng.' })
    startScaleMultiplier = 0.3;

    private baseRoomOriginalScale = new Vec3(1, 1, 1);

    onLoad() {
        BaseRoomManager.instance = this;

        if (this.BaseRoom) {
            this.baseRoomOriginalScale = this.BaseRoom.scale.clone();
            const room = this.BaseRoom.getComponent(BaseRoom);
            if (room) {
                room.initializeOriginalScale(this.baseRoomOriginalScale);
                room.enableInteraction();
            }
        }
    }

    onDestroy() {
        if (BaseRoomManager.instance === this) BaseRoomManager.instance = null;
    }

    /** Unity: PlayIntroAnimation — hiện chỉ gọi callback. */
    playIntroAnimation(onComplete?: () => void): void {
        onComplete?.();
    }
}
