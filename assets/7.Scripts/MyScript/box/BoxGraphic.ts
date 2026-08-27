/**
 * BoxGraphic — Điều khiển Spine Skeleton cho chiếc hộp (Box).
 *
 * Chu trình Animation Spine:
 * 1. Mới vào game: Phát `1-ready-Loop` (Loop).
 * 2. Nhận click đầu tiên: Phát `2-OPEN` (1 lần) -> Tự nối tiếp `3-OPEN-loop-break` (Loop).
 * 3. Các lần click sau: Phát `3-OPEN-click` (1 lần) -> Tự nối tiếp `3-OPEN-loop-break` (Loop).
 * 4. Khi hết item (kết thúc): Phát `Setup-A-2`.
 */

import { _decorator, Component, sp } from 'cc';

const { ccclass, property } = _decorator;

export enum BoxState {
    Closed,
    Opened,
    CLickBox,
    FirstOpen,
    OpenLoopBreak,
    ReadyOpen,
}

@ccclass('BoxGraphic')
export class BoxGraphic extends Component {

    // ========================================== COMPONENTS
    @property({ type: sp.Skeleton, tooltip: 'Spine Skeleton điều khiển chiếc hộp (nếu để trống tự tìm trên Box hoặc BoxImage)' })
    boxSkeleton: sp.Skeleton | null = null;

    // ========================================== ANIMATION NAMES
    @property({ tooltip: '1. Anim chờ khi mới vào game (Loop)' })
    animReadyLoop = '0-pack-idle';

    @property({ tooltip: '2. Anim mở hộp lần đầu tiên khi click (1 lần)' })
    animFirstOpen = '1-unpack';

    @property({ tooltip: '3. Anim mở chờ các click tiếp theo (1 lần theo chu kỳ)' })
    animOpenedLoop = '2-unpack-done-loop';

    @property({ tooltip: 'Thời gian delay sau mỗi lần phát Anim Opened Loop (giây)' })
    openedLoopTime = 2.0;

    @property({ tooltip: '4. Anim click nhả item (1 lần)' })
    animClick = '2-unpack-done-click';

    @property({ tooltip: '5. Anim khi hết item/đóng hộp kết thúc' })
    animClosed = '3-unpack-end';

    currentState: BoxState = BoxState.Closed;

    onLoad() {
        this.resolveSkeletonComponent();
        this.initSkeletonListener();
    }

    onDisable() {
        this.stopOpenedLoopTimer();
    }

    onDestroy() {
        this.stopOpenedLoopTimer();
    }

    /** Tự động tìm Spine Skeleton nếu chưa kéo vào Inspector */
    private resolveSkeletonComponent(): void {
        if (!this.boxSkeleton) {
            this.boxSkeleton = this.getComponent(sp.Skeleton)
                || this.node.getChildByName('BoxImage')?.getComponent(sp.Skeleton)
                || this.getComponentInChildren(sp.Skeleton);
            if (this.boxSkeleton) {
                this.initSkeletonListener();
            }
        }
    }

    /** Lắng nghe khi animation kết thúc */
    private initSkeletonListener(): void {
        if (!this.boxSkeleton) return;
        this.boxSkeleton.setCompleteListener((entry: any) => {
            const animName = entry?.animation?.name;
            if (animName === this.animFirstOpen || animName === this.animClick || animName === this.animOpenedLoop) {
                if (this.currentState === BoxState.FirstOpen || this.currentState === BoxState.CLickBox || this.currentState === BoxState.Opened || this.currentState === BoxState.OpenLoopBreak) {
                    this.currentState = BoxState.Opened;
                    this.scheduleNextOpenedLoop();
                }
            }
        });
    }

    /** Dừng timer lặp của opened loop */
    private stopOpenedLoopTimer(): void {
        this.unschedule(this.triggerOpenedLoop);
    }

    /** Lên lịch phát Anim Opened Loop sau khoảng thời gian openedLoopTime */
    private scheduleNextOpenedLoop(): void {
        this.stopOpenedLoopTimer();
        if (this.currentState === BoxState.Closed || this.currentState === BoxState.ReadyOpen) {
            return;
        }
        if (this.openedLoopTime > 0) {
            this.scheduleOnce(this.triggerOpenedLoop, this.openedLoopTime);
        } else {
            this.triggerOpenedLoop();
        }
    }

    /** Hàm phát Anim Opened Loop 1 lần */
    private triggerOpenedLoop = (): void => {
        if (!this.boxSkeleton) return;
        if (this.currentState !== BoxState.Opened && this.currentState !== BoxState.FirstOpen && this.currentState !== BoxState.CLickBox && this.currentState !== BoxState.OpenLoopBreak) {
            return;
        }
        this.currentState = BoxState.Opened;
        this.boxSkeleton.setAnimation(0, this.animOpenedLoop, false);
    };

    /** Hiển thị trạng thái chờ ban đầu (0-pack-idle). */
    playReady(): void {
        this.currentState = BoxState.ReadyOpen;
        this.stopOpenedLoopTimer();
        this.resolveSkeletonComponent();
        if (!this.boxSkeleton) return;
        this.boxSkeleton.setAnimation(0, this.animReadyLoop, true);
    }

    /** Mở hộp lần đầu (1-unpack -> delay openedLoopTime -> 2-unpack-done-loop). */
    playFirstOpen(): void {
        this.currentState = BoxState.FirstOpen;
        this.stopOpenedLoopTimer();
        this.resolveSkeletonComponent();
        if (!this.boxSkeleton) return;
        this.boxSkeleton.setAnimation(0, this.animFirstOpen, false);
    }

    /** Click nhả item (2-unpack-done-click -> delay openedLoopTime -> 2-unpack-done-loop). */
    playItemDispense(): void {
        this.currentState = BoxState.CLickBox;
        this.stopOpenedLoopTimer();
        this.resolveSkeletonComponent();
        if (!this.boxSkeleton) return;
        this.boxSkeleton.setAnimation(0, this.animClick, false);
    }

    /** Giữ trạng thái mở chờ tương tác tiếp (phát 1 lần rồi lên lịch chu kỳ). */
    playOpenedLoop(): void {
        this.currentState = BoxState.Opened;
        this.stopOpenedLoopTimer();
        this.resolveSkeletonComponent();
        if (!this.boxSkeleton) return;
        this.boxSkeleton.setAnimation(0, this.animOpenedLoop, false);
    }

    /** Hiệu ứng đóng hộp khi hết item (3-unpack-end). */
    playClosing(): void {
        this.currentState = BoxState.Closed;
        this.stopOpenedLoopTimer();
        this.resolveSkeletonComponent();
        if (!this.boxSkeleton) return;
        this.boxSkeleton.setAnimation(0, this.animClosed, false);
    }

    /** Tương thích hàm changeState cũ */
    changeState(newState: BoxState): void {
        switch (newState) {
            case BoxState.ReadyOpen:
                this.playReady();
                break;
            case BoxState.FirstOpen:
                this.playFirstOpen();
                break;
            case BoxState.CLickBox:
                this.playItemDispense();
                break;
            case BoxState.Opened:
            case BoxState.OpenLoopBreak:
                this.playOpenedLoop();
                break;
            case BoxState.Closed:
                this.playClosing();
                break;
        }
    }

    setAutoOpenEnabled(_enabled: boolean): void {
        // Tương thích chữ ký hàm cũ nếu có nơi gọi
    }
}
