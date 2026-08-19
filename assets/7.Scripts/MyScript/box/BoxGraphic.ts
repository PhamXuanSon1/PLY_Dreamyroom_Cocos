/**
 * BoxGraphic — port từ Assets/_GAME/Script/Box/BoxGraphic.cs (Unity)
 *
 * Tên animation Spine giữ NGUYÊN XI như bản Unity.
 * Bên Unity ChangeSpine() chạy trong Update; ở đây dùng schedule 0.1s cho rẻ.
 */

import { _decorator, Component, sp } from 'cc';

const { ccclass, property } = _decorator;

export enum BoxState {
    Closed, Opened, CLickBox, FirstOpen, OpenLoopBreak, ReadyOpen,
}

@ccclass('BoxGraphic')
export class BoxGraphic extends Component {

    @property({ type: sp.Skeleton, tooltip: 'Spine điều khiển hiệu ứng hộp.' })
    boxSkeleton: sp.Skeleton | null = null;

    @property({ tooltip: 'Bao lâu không thao tác thì hộp tự hé mở (giây).' })
    autoOpenDelay = 4;

    @property({ tooltip: 'Hộp giữ trạng thái hé mở bao lâu trước khi lặp lại.' })
    openedDuration = 4;

    @property({ tooltip: 'Bật chế độ tự hé mở để gọi chú ý.' })
    autoOpenEnabled = false;

    idleTimer = 0;
    currentState: BoxState = BoxState.Closed;

    private autoCloseScheduled = false;

    onLoad() {
        this.schedule(this.tick, 0.1);
    }

    onDestroy() {
        this.unschedule(this.tick);
    }

    /** Unity: ChangeSpine trong Update */
    private tick(): void {
        if (!this.boxSkeleton) return;
        if (!this.autoOpenEnabled) return;
        if (this.currentState === BoxState.Opened) return;

        this.idleTimer += 0.1;
        if (this.idleTimer >= this.autoOpenDelay) {
            this.changeState(BoxState.Opened);
        }
    }

    setAutoOpenEnabled(enabled: boolean): void {
        this.autoOpenEnabled = enabled;
        if (enabled) this.idleTimer = 0;
    }

    /** Unity: ChangeState */
    changeState(newState: BoxState): void {
        if (!this.boxSkeleton) return;
        if (this.currentState === newState) return;

        this.unscheduleAllCallbacks();
        this.schedule(this.tick, 0.1);
        this.autoCloseScheduled = false;

        this.currentState = newState;
        this.idleTimer = 0;

        switch (this.currentState) {
            case BoxState.Closed:
                this.boxSkeleton.setAnimation(0, 'Setup-A-2', false);
                break;
            case BoxState.Opened:
                this.restartOpenedAnimation();
                break;
            case BoxState.CLickBox:
                this.boxSkeleton.setAnimation(0, '3-OPEN-click', false);
                break;
            case BoxState.FirstOpen:
                this.boxSkeleton.setAnimation(0, '2-OPEN', false);
                break;
            case BoxState.ReadyOpen:
                this.restartReadyOpenAnimation();
                break;
            default:
                break;
        }
    }

    private restartReadyOpenAnimation(): void {
        if (!this.boxSkeleton) return;
        this.boxSkeleton.setAnimation(0, '1-ready-Loop', false);
        this.autoCloseScheduled = true;
        this.scheduleOnce(() => {
            if (this.currentState === BoxState.ReadyOpen) this.restartReadyOpenAnimation();
        }, this.openedDuration);
    }

    private restartOpenedAnimation(): void {
        if (!this.boxSkeleton) return;
        this.boxSkeleton.setAnimation(0, '3-OPEN-loop-break', false);
        this.autoCloseScheduled = true;
        this.scheduleOnce(() => {
            if (this.currentState === BoxState.Opened) this.restartOpenedAnimation();
        }, this.openedDuration);
    }
}
