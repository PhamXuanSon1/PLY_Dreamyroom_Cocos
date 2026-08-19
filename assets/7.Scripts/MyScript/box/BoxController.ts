/**
 * BoxController — port từ Assets/_GAME/Script/Box/BoxController.cs (Unity)
 *
 * KHÁC bản Unity:
 *   - Không poll Input + Physics.Raycast; đăng ký IPointerHandler ở mức Box.
 *   - DOJump -> TweenUtil.jumpTo.
 *   - SaveLayersAndSetTo20 -> ItemGraphic.bringToFront (lớp kéo).
 *   - Bỏ SetLayerRecursively (dead code bên Unity, không nơi nào gọi).
 */

import { _decorator, Component, Node, Vec3, EventTouch, randomRange } from 'cc';
import { InputManager, InputPriority, IPointerHandler } from '../core/InputManager';
import { BoxGraphic, BoxState } from './BoxGraphic';
import { ItemManager } from '../managers/ItemManager';
import { UIManager } from '../managers/UIManager';
import { BaseRoomManager } from '../managers/BaseRoomManager';
import { ItemController } from '../item/ItemController';
import { HolderSlot } from '../utils/HolderSlot';
import { HandOfBox } from '../utils/HandOfBox';
import { SoundManager, FxType } from '../core/SoundManager';
import { TweenUtil } from '../core/TweenUtil';

const { ccclass, property } = _decorator;

@ccclass('BoxController')
export class BoxController extends Component implements IPointerHandler {

    @property({ type: Node, tooltip: 'Vị trí item rớt ra từ hộp.' })
    StartTf: Node | null = null;

    @property({ type: Node, tooltip: 'Vị trí hộp bay tới trước khi biến mất.' })
    endTf: Node | null = null;

    @property({ type: Node, tooltip: 'Vị trí hộp di chuyển tới sau intro.' })
    MoveAfterIntroPosOfBox: Node | null = null;

    @property({ type: Node, tooltip: 'Bàn tay/chữ hướng dẫn click vào hộp.' })
    handText: Node | null = null;

    @property({ type: HandOfBox, tooltip: 'Script di chuyển bàn tay theo hộp lúc intro.' })
    handOfBox: HandOfBox | null = null;

    @property({ type: Node, tooltip: 'Thanh trượt UI hiện khi bắt đầu tương tác.' })
    slider: Node | null = null;

    @property({ type: Node, tooltip: 'Object slogan.' })
    sloganText: Node | null = null;

    @property({ tooltip: 'Đã xong lượt click tutorial mở hộp đầu tiên chưa.' })
    finishedTutorial = false;

    private isClicked = false;
    private boxGraphic: BoxGraphic | null = null;

    readonly inputPriority = InputPriority.Box;

    // ======================================================== lifecycle
    onLoad() {
        this.boxGraphic = this.getComponent(BoxGraphic);
        this.boxGraphic?.changeState(BoxState.ReadyOpen);
    }

    onEnable() { InputManager.register(this); }
    onDisable() { InputManager.unregister(this); }

    // ======================================================== input
    hitTest(worldPos: Vec3): boolean {
        if (this.isClicked) return false;
        return InputManager.hitTestSelfOrChildren(this.node, worldPos);
    }

    onPointerDown(_worldPos: Vec3, _ev: EventTouch): boolean {
        if (this.isClicked) return false;
        this.onClick();
        return true;
    }

    // ======================================================== logic
    /** Unity: OnClick */
    private onClick(): void {
        if (this.isClicked) return;

        SoundManager.instance?.playFx(FxType.ClickBox);

        const im = ItemManager.instance;
        if (im) {
            if (im.handIntro) im.handIntro.active = false;
            im.enableFirstClickObjects();
        }

        UIManager.instance?.activateGameLogoAndPlaynow();

        if (this.handText) this.handText.active = false;
        this.isClicked = true;

        if (this.slider) this.slider.active = true;

        // ---- CLICK ĐẦU TIÊN ----
        if (!this.finishedTutorial) {
            this.boxGraphic?.changeState(BoxState.FirstOpen);

            TweenUtil.delayedCall(this, 1, () => this.spawnItem());

            if (this.MoveAfterIntroPosOfBox) {
                TweenUtil.moveTo(this.node, this.MoveAfterIntroPosOfBox.worldPosition, 1.2, 'linear');
            }

            this.handOfBox?.moveAfterIntro(1.2);

            const finish = () => {
                this.finishedTutorial = true;
                this.isClicked = false;
                this.boxGraphic?.setAutoOpenEnabled(true);
            };

            if (BaseRoomManager.instance) BaseRoomManager.instance.playIntroAnimation(finish);
            else finish();

            return;
        }

        // ---- NHỮNG CLICK SAU ----
        this.boxGraphic?.changeState(BoxState.CLickBox);
        this.spawnItem();
        this.isClicked = false;
    }

    /** Unity: SpawnItem */
    private spawnItem(): void {
        if (!this.StartTf) return;

        const im = ItemManager.instance;
        if (!im) return;

        if (!im.hasAvailableHolder()) {
            console.warn('[BoxController] Hết holder trống!');
            return;
        }

        const currentItem = im.getCurrentItem();
        if (!currentItem) {
            console.warn('[BoxController] Hết item rồi!');
            return;
        }

        currentItem.setWorldPosition(this.StartTf.worldPosition.clone());
        currentItem.active = true;

        const pop = im.enablePopScale ? im.popScaleAmount : 1;
        currentItem.setScale(pop, pop, pop);

        const itemScript = currentItem.getComponent(ItemController);
        itemScript?.itemGraphic?.bringToFront();

        currentItem.setRotationFromEuler(0, 0, randomRange(-90, 90));

        const holder = im.getCurrentHolder();
        if (!holder) return;

        const holderSlot = holder.getComponent(HolderSlot);
        if (holderSlot) {
            holderSlot.isEmpty = false;
            if (itemScript) itemScript.currentHolderSlot = holderSlot;
        }

        // Unity: DOJump(holder.position, 1.5f, 1, 1f).SetEase(Ease.OutBack)
        TweenUtil.jumpTo(
            currentItem, holder.worldPosition, 150, 1, 1, 'backOut',
            () => {
                if (!holderSlot) return;
                holderSlot.setItem(currentItem);
                if (itemScript) im.showFirstDragHint(itemScript);
            },
        );
    }

    /** Unity: GoToEndPos */
    goToEndPos(): void {
        if (!this.endTf) return;
        TweenUtil.moveTo(this.node, this.endTf.worldPosition, 0.5, 'sineInOut',
            () => { this.node.active = false; });
    }
}
