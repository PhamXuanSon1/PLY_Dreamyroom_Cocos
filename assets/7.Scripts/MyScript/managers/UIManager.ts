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

    @property({ tooltip: 'Bật: hết Auto End After Seconds (tính từ click Box đầu tiên) mà chưa ghép xong thì tự ép ra Store. Tắt: không tự ép theo thời gian.' })
    useAutoEnd = false;

    @property({
        tooltip: 'Sau N giây kể từ lần CLICK ĐẦU TIÊN vào Box (không đếm từ lúc Start) mà CHƯA ghép đủ item, '
            + 'tự ép chuyển sang chế độ End Game (giống hệt lúc thắng: chạm đâu cũng mở Store) — mặc định 60s = 1 phút. '
            + 'Chỉ có tác dụng khi bật Use Auto End.',
        visible(this: UIManager) { return this.useAutoEnd; },
    })
    autoEndAfterSeconds = 60;

    isGameEnded = false;

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

        // glue Cocos: đồng hồ autoEndAfterSeconds KHÔNG chạy từ đây — chỉ bắt đầu khi người chơi
        // click vào Box lần đầu (BoxController.onClick -> startAutoEndTimer).
    }

    /**
     * glue Cocos: playable ad — bấm đồng hồ autoEndAfterSeconds. Gọi từ BoxController khi người chơi
     * click vào Box lần đầu; các lần gọi sau bị bỏ qua. Hết giờ mà chưa thắng thì ép ra Store,
     * không để người chơi kẹt trong màn quá lâu.
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

    private checkEndGame(): void {
        if (this.isGameEnded) return;

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
        console.log(`[UIManager] Hết ${this.autoEndAfterSeconds}s chưa ghép xong -> tự chuyển sang chế độ ra Store.`);
        this.activateEndGame();
    }

    /** Bật chế độ chạm bất kỳ đâu để chuyển sang Store. */
    enableStoreOnAnyClick(): void {
        this.activateEndGame();
    }

    /**
     * Bật chế độ End Game: cho phép chạm đâu cũng ra Store + confetti.
     * showEndCard = true: ẩn UI chơi, hiện End Card (EndUICanvas). false: giữ nguyên màn chơi.
     */
    private activateEndGame(showEndCard = true): void {
        const left = this.unplacedItems();
        console.log(`[UIManager] End game: tuSo=${this.tuSo}/${this.mauSo}, itemsToEndGame=${this.itemsToEndGame}`
            + `, endCard=${showEndCard}`
            + (left ? `, item chưa ghép: ${left.length}${left.length ? ' (' + left.join(', ') + ')' : ''}` : ''));
        this.isGameEnded = true;
        DreamyInputManager.canInput = false;

        if (showEndCard) {
            if (this.GameUICanvas) this.GameUICanvas.active = false;
            if (this.EndUICanvas) this.EndUICanvas.active = true;
        }

        const im = ItemManager.instance;
        if (im) {
            for (const c of im.WinConfetti) if (c?.isValid) c.active = true;
        }

        // Cho phép chạm để mở store
        DreamyInputManager.canInput = true;
    }

    gotoStore(): void {
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

