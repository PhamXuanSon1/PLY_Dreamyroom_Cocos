/**
 * UIManager — port từ Assets/_GAME/Script/Manager/UIManager.cs (Unity)
 *
 * BỎ so với bản Unity (theo yêu cầu):
 *   - AppLovinAnalytics.Track(...) và ALEvent
 *   - LifeCycle.GameEnded() / Playable.InstallFullGame()  -> mở URL store
 *   - ProgressTrackingManager
 *   - SetupUIPosition() và toàn bộ phần cân màn theo orientation
 *     (bên Cocos dùng Widget của Canvas, không tính tay)
 *   - Physics.Raycast bắt layer "Download" -> dùng Button/handler tử tế
 */

import { _decorator, Component, Node, Label, Sprite, EventTouch, Vec3, sys } from 'cc';
import { InputManager, InputPriority, IPointerHandler } from '../core/InputManager';
import { ItemManager } from './ItemManager';
import { BallFollowFill } from '../utils/BallFollowFill';
import { TweenUtil } from '../core/TweenUtil';

const { ccclass, property } = _decorator;

@ccclass('UIManager')
export class UIManager extends Component implements IPointerHandler {

    static instance: UIManager | null = null;

    // ---------------- UI ----------------
    @property({ type: Node, tooltip: 'Logo game.' })
    GameLogo: Node | null = null;

    @property({ type: Node, tooltip: 'Nút Play Now.' })
    Playnow: Node | null = null;

    @property({ type: Label, tooltip: 'Chữ tiến trình, vd 1/12.' })
    textNumber: Label | null = null;

    @property({ type: Sprite, tooltip: 'Thanh tiến trình. Type phải để FILLED.' })
    progressBar: Sprite | null = null;

    @property({ type: BallFollowFill, tooltip: 'Icon chạy theo thanh tiến trình.' })
    ballFollowFill: BallFollowFill | null = null;

    // ---------------- Progress ----------------
    @property({ tooltip: 'Tử số — số item đã ghép.' })
    tuSo = 0;

    @property({ tooltip: 'Mẫu số — tổng số item. Start() sẽ lấy từ ItemManager.itemList.' })
    mauSo = 12;

    @property({ tooltip: 'Số item hoàn thành để mở màn End Game.' })
    endGameCount = 12;

    isGameEnded = false;

    // ---------------- Canvas ----------------
    @property({ type: Node, tooltip: 'Canvas UI trong lúc chơi.' })
    GameUICanvas: Node | null = null;

    @property({ type: Node, tooltip: 'Canvas màn hình thắng.' })
    EndUICanvas: Node | null = null;

    @property({ tooltip: 'URL store mở khi bấm CTA. Thay cho Playable.InstallFullGame().' })
    storeUrl = '';

    readonly inputPriority = InputPriority.UI;

    // ======================================================== lifecycle
    onLoad() {
        UIManager.instance = this;
    }

    onEnable() {
        InputManager.register(this);
    }

    onDisable() {
        InputManager.unregister(this);
    }

    onDestroy() {
        if (UIManager.instance === this) UIManager.instance = null;
    }

    start() {
        this.tuSo = 0;

        const im = ItemManager.instance;
        if (im && im.itemList.length > 0) this.mauSo = im.itemList.length;

        // BallFollowFill cố ý không import ItemManager (tránh phụ thuộc vòng)
        if (this.ballFollowFill) this.ballFollowFill.total = this.mauSo;

        this.updateText();

        // Unity: DOTween.To(() => tuSo, x => {tuSo = x; UpdateText();}, 0, 2f)
        // Đếm về 0 trong 2 giây — giữ nguyên để khớp nhịp intro.
        TweenUtil.valueTo(2, () => this.updateText(), 'linear');

        if (this.GameLogo) this.GameLogo.active = true;
        if (this.Playnow) this.Playnow.active = true;
    }

    /** Unity: ActivateGameLogoAndPlaynow */
    activateGameLogoAndPlaynow(): void {
        if (this.GameLogo) this.GameLogo.active = true;
        if (this.Playnow) this.Playnow.active = true;
    }

    // ======================================================== input
    /** Sau khi end game, chạm bất kỳ đâu -> mở store. */
    hitTest(_worldPos: Vec3): boolean {
        return this.isGameEnded;
    }

    onPointerDown(_worldPos: Vec3, _ev: EventTouch): boolean {
        if (!this.isGameEnded) return false;
        this.gotoStore();
        return true;   // nuốt sự kiện
    }

    // ======================================================== progress
    /** Unity: UpdateText */
    updateText(): void {
        if (this.textNumber) this.textNumber.string = `${this.tuSo}/${this.mauSo}`;

        const percent = this.mauSo > 0 ? this.tuSo / this.mauSo : 0;
        if (this.progressBar) this.progressBar.fillRange = percent;

        if (this.ballFollowFill && !this.ballFollowFill.isIntroMoving) {
            this.ballFollowFill.updateBall(this.tuSo);
        }

        this.checkEndGame();
    }

    private checkEndGame(): void {
        if (this.isGameEnded) return;

        const im = ItemManager.instance;
        const arrived = im?.arrivedItemCount ?? this.tuSo;

        if (this.tuSo >= this.mauSo || arrived >= this.endGameCount) {
            this.isGameEnded = true;
            InputManager.canInput = false;

            if (this.GameUICanvas) this.GameUICanvas.active = false;
            if (this.EndUICanvas) this.EndUICanvas.active = true;
            if (this.GameLogo) this.GameLogo.active = false;
            if (this.Playnow) this.Playnow.active = false;

            if (im) {
                for (const c of im.WinConfetti) if (c?.isValid) c.active = true;
            }

            // Cho phép chạm để mở store
            InputManager.canInput = true;
        }
    }

    /** Unity: GotoStore — bỏ Luna/AppLovin, chỉ mở URL. */
    gotoStore(): void {
        if (!this.storeUrl) {
            console.log('[UIManager] gotoStore() — chưa đặt storeUrl.');
            return;
        }
        sys.openURL(this.storeUrl);
    }
}
