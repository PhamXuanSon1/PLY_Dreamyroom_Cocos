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
import { DreamyInputManager, InputPriority, IPointerHandler } from '../core/DreamyInputManager';
import { ItemManager } from './ItemManager';
import { BallFollowFill } from '../utils/BallFollowFill';
import { TweenUtil } from '../core/TweenUtil';
import { GameController } from '../../Tool/GameController';

const { ccclass, property } = _decorator;

@ccclass('UIManager')
export class UIManager extends Component implements IPointerHandler {

    static instance: UIManager | null = null;

    // ---------------- UI ----------------
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

    @property({ tooltip: 'Số item ghép xong thì chuyển sang End Game (chạm đâu cũng mở Store). 0 = phải ghép hết tất cả item.' })
    itemsToEndGame = 0;

    @property({
        tooltip: 'Kết thúc vì đã ghép đủ Items To End Game (ít hơn tổng số item): có hiện End Card (WinCard) không. '
            + 'TẮT (mặc định): chỉ chuyển sang chạm đâu cũng mở Store, không hiện End Card. '
            + 'Ghép HẾT mọi item thì End Card luôn hiện.',
        visible(this: UIManager) { return this.itemsToEndGame > 0; },
    })
    showEndCardOnItemsToEndGame = false;

    @property({ tooltip: 'Bật: hết Auto End After Seconds (tính từ lần chạm đầu tiên) mà chưa ghép xong thì chạm đâu cũng ra Store. Tắt: không tự ép theo thời gian.' })
    useAutoEnd = false;

    @property({
        tooltip: 'Sau N giây kể từ lần chạm đầu tiên mà CHƯA ghép xong -> chạm đâu cũng mở Store. '
            + 'Spawn Mode = Box: tính từ lần click hộp đầu tiên. Holder Nodes / Spawn Area: tính từ lần chạm đầu tiên ở bất kỳ đâu.',
        visible(this: UIManager) { return this.useAutoEnd; },
    })
    autoEndAfterSeconds = 60;

    @property({
        tooltip: 'Hết giờ Auto End: bật = hiện End Card + pháo giấy như lúc thắng; tắt = giữ nguyên màn chơi, chỉ là chạm đâu cũng ra Store.',
        visible(this: UIManager) { return this.useAutoEnd; },
    })
    autoEndShowEndCard = false;

    @property({
        tooltip: 'Bật: lúc End Game CHƯA hiện End Card (EndUICanvas, vd popup Logo). Chạm đầu tiên mở Store, '
            + 'người chơi QUAY LẠI game mới hiện End Card; sau đó chạm đâu cũng ra Store. Tắt: hiện ngay lúc End Game.',
    })
    endCardOnNextClick = false;

    @property({
        tooltip: 'Store mở dạng overlay (trang game không bị ẩn) -> sau N giây kể từ lúc mở Store vẫn hiện End Card, '
            + 'để tắt store là thấy.',
        min: 0,
        visible(this: UIManager) { return this.endCardOnNextClick; },
    })
    endCardFallbackDelay = 1;

    isGameEnded = false;
    /** End Card đang chờ cú chạm đầu tiên sau End Game (endCardOnNextClick). */
    private endCardPending = false;
    /** Đã mở Store, chờ người chơi quay lại game để hiện End Card. */
    private waitingReturn = false;
    private leftPage = false;
    private returnFallbackTimer: ReturnType<typeof setTimeout> | null = null;

    /**
     * MapPhaseManager gắn vào: trả true = đang/sắp chuyển lượt -> hoãn End Game theo tiến độ
     * (itemsToEndGame), chuyển lượt xong sẽ gọi recheckEndGame().
     */
    static endGameInterceptor: (() => boolean) | null = null;

    /** Đồng hồ autoEndAfterSeconds đã được bấm chưa (chỉ bấm 1 lần, ở click Box đầu tiên). */
    private autoEndTimerStarted = false;

    // ---------------- Canvas ----------------
    @property({ type: Node, tooltip: 'Canvas UI trong lúc chơi.' })
    GameUICanvas: Node | null = null;

    @property({ type: Node, tooltip: 'Canvas màn hình thắng.' })
    EndUICanvas: Node | null = null;

    @property({ type: Node, tooltip: 'Node hoặc Component GameController để gọi redirectToStore().' })
    gameController: Node | GameController | null = null;

    readonly inputPriority = InputPriority.UI;

    // ======================================================== lifecycle
    onLoad() {
        UIManager.instance = this;
    }

    onEnable() {
        DreamyInputManager.register(this);
    }

    onDisable() {
        DreamyInputManager.unregister(this);
    }

    onDestroy() {
        this.stopWaitingReturn();
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

        // glue Cocos: đồng hồ autoEndAfterSeconds KHÔNG chạy từ đây — chỉ bắt đầu ở lần chạm đầu tiên
        // (Box: click hộp lần đầu; Holder Nodes / Spawn Area: chạm bất kỳ đâu, xem ItemManager.onAnyPointerDown).
    }

    /**
     * glue Cocos: playable ad — bấm đồng hồ autoEndAfterSeconds ở lần chạm đầu tiên; các lần gọi sau
     * bị bỏ qua. Hết giờ mà chưa thắng thì chạm đâu cũng ra Store, không để người chơi kẹt trong màn quá lâu.
     */
    startAutoEndTimer(): void {
        if (this.autoEndTimerStarted || this.isGameEnded) return;
        this.autoEndTimerStarted = true;
        if (this.useAutoEnd && this.autoEndAfterSeconds > 0) {
            this.scheduleOnce(() => this.forceEndGame(), this.autoEndAfterSeconds);
        }
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

    /** Kiểm tra lại điều kiện End Game (sau khi endGameInterceptor thôi chặn). */
    recheckEndGame(): void {
        this.checkEndGame();
    }

    private checkEndGame(): void {
        if (this.isGameEnded) return;
        if (UIManager.endGameInterceptor?.()) return;

        // itemsToEndGame = 0 (ghép hết): chỉ thắng khi MỌI item trong itemList đã isPlaced,
        // không dựa vào bộ đếm tuSo (lệch đếm cũng không ra Store sớm).
        if (this.itemsToEndGame <= 0) {
            const left = this.unplacedItems();
            if (left === null) {
                if (this.tuSo >= this.mauSo) this.activateEndGame();
            } else if (left.length === 0) {
                this.activateEndGame();
            }
            return;
        }

        const need = Math.min(this.itemsToEndGame, this.mauSo);
        if (this.tuSo >= need) {
            // Đủ N item: End Card chỉ hiện khi đã ghép HẾT, hoặc bật showEndCardOnItemsToEndGame
            const left = this.unplacedItems();
            const allPlaced = left ? left.length === 0 : this.tuSo >= this.mauSo;
            this.activateEndGame(allPlaced || this.showEndCardOnItemsToEndGame);
        }
    }

    /** Tên các item trong ItemManager.itemList chưa ghép xong; null nếu không có ItemManager. */
    private unplacedItems(): string[] | null {
        const im = ItemManager.instance;
        if (!im || im.itemList.length === 0) return null;
        const left: string[] = [];
        for (const n of im.itemList) {
            if (!n || !n.isValid) continue;
            // lấy theo tên class để không import ItemController (tránh vòng import)
            const item = n.getComponent('ItemController') as { isPlaced?: boolean } | null;
            if (item && !item.isPlaced) left.push(n.name);
        }
        return left;
    }

    /** glue Cocos: hết autoEndAfterSeconds mà vẫn chưa thắng -> ép chuyển sang End Game để không kẹt màn quá lâu. */
    private forceEndGame(): void {
        if (this.isGameEnded) return;
        console.log(`[UIManager] Hết ${this.autoEndAfterSeconds}s chưa ghép xong -> chạm đâu cũng ra Store.`);
        this.activateEndGame(this.autoEndShowEndCard, this.autoEndShowEndCard);
    }

    /** Bật chế độ chạm bất kỳ đâu để chuyển sang Store. showEndCard = false: giữ nguyên màn chơi, không hiện End Card. */
    enableStoreOnAnyClick(showEndCard = true): void {
        // Đã End rồi (vd End giữa lúc chuyển lượt, canInput bị tắt sau đó) -> chỉ cần mở lại chạm
        if (this.isGameEnded) { DreamyInputManager.canInput = true; return; }
        this.activateEndGame(showEndCard);
    }

    /**
     * Bật chế độ End Game: cho phép chạm đâu cũng ra Store + confetti.
     * showEndCard = true: ẩn UI chơi, hiện End Card (EndUICanvas). false: giữ nguyên màn chơi.
     * confetti = false: không bắn pháo giấy (vd hết giờ Auto End, không phải thắng).
     */
    private activateEndGame(showEndCard = true, confetti = true): void {
        const left = this.unplacedItems();
        console.log(`[UIManager] End game: tuSo=${this.tuSo}/${this.mauSo}, itemsToEndGame=${this.itemsToEndGame}`
            + `, endCard=${showEndCard}`
            + (left ? `, item chưa ghép: ${left.length}${left.length ? ' (' + left.join(', ') + ')' : ''}` : ''));
        this.isGameEnded = true;
        DreamyInputManager.canInput = false;

        if (showEndCard) {
            // endCardOnNextClick: chưa hiện ngay, chờ cú chạm tiếp theo (gotoStore) mới hiện
            if (this.endCardOnNextClick) this.endCardPending = true;
            else this.showEndCard();
        }

        const im = ItemManager.instance;
        if (im && confetti) {
            for (const c of im.WinConfetti) if (c?.isValid) c.active = true;
        }

        // Cho phép chạm để mở store
        DreamyInputManager.canInput = true;
    }

    private showEndCard(): void {
        this.endCardPending = false;
        if (this.GameUICanvas) this.GameUICanvas.active = false;
        if (this.EndUICanvas) this.EndUICanvas.active = true;
    }

    // ======================================================== End Card khi quay lại từ Store
    /** Cú chạm đầu tiên sau End Game vừa mở Store: chờ người chơi quay lại game rồi hiện End Card. */
    private waitReturnFromStore(): void {
        this.endCardPending = false;
        this.waitingReturn = true;
        this.leftPage = false;
        if (typeof document !== 'undefined') document.addEventListener('visibilitychange', this.onVisibilityChange);
        if (typeof window !== 'undefined') {
            window.addEventListener('blur', this.onPageLeave);
            window.addEventListener('focus', this.onPageBack);
            window.addEventListener('pageshow', this.onPageBack);
        }
        // setTimeout (không dùng scheduleOnce): Cocos dừng scheduler khi trang ẩn
        this.returnFallbackTimer = setTimeout(() => {
            this.returnFallbackTimer = null;
            if (this.waitingReturn && !this.leftPage) this.onReturnedFromStore();
        }, this.endCardFallbackDelay * 1000);
    }

    private onVisibilityChange = (): void => {
        if (document.visibilityState === 'hidden') this.onPageLeave();
        else this.onPageBack();
    };

    private onPageLeave = (): void => {
        if (!this.waitingReturn) return;
        this.leftPage = true;
        this.clearReturnFallback();
    };

    private onPageBack = (): void => {
        if (!this.waitingReturn || !this.leftPage) return;
        if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return;
        this.onReturnedFromStore();
    };

    private onReturnedFromStore(): void {
        this.stopWaitingReturn();
        this.showEndCard();
        // chạm đâu cũng ra Store (lỡ có hệ nào tắt canInput lúc trang ẩn)
        DreamyInputManager.canInput = true;
    }

    private clearReturnFallback(): void {
        if (this.returnFallbackTimer !== null) { clearTimeout(this.returnFallbackTimer); this.returnFallbackTimer = null; }
    }

    private stopWaitingReturn(): void {
        this.waitingReturn = false;
        this.clearReturnFallback();
        if (typeof document !== 'undefined') document.removeEventListener('visibilitychange', this.onVisibilityChange);
        if (typeof window !== 'undefined') {
            window.removeEventListener('blur', this.onPageLeave);
            window.removeEventListener('focus', this.onPageBack);
            window.removeEventListener('pageshow', this.onPageBack);
        }
    }

    gotoStore(): void {
        // endCardOnNextClick: cú chạm đầu tiên sau End Game -> mở Store, quay lại mới hiện End Card
        if (this.endCardPending) this.waitReturnFromStore();
        // game controller . redirectToStore
        if (this.gameController instanceof Node) {
            const gc = this.gameController.getComponent(GameController);
            if (gc) {
                gc.redirectToStore();
                return;
            }   
        }
    }
}

