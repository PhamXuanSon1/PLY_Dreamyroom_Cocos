/** BoxManager — port từ Assets/_GAME/Script/Manager/BoxManager.cs (Unity) */

import { _decorator, Component, Node } from 'cc';
import { BoxController } from '../box/BoxController';
import { BoxGraphic, BoxState } from '../box/BoxGraphic';

const { ccclass, property } = _decorator;

@ccclass('BoxManager')
export class BoxManager extends Component {

    static instance: BoxManager | null = null;

    @property({ type: Node, tooltip: 'Object chiếc hộp trong scene.' })
    box: Node | null = null;

    private boxController: BoxController | null = null;
    private boxGraphic: BoxGraphic | null = null;

    /** Đảm bảo animation kết thúc chỉ chạy đúng 1 lần. */
    private isBoxHandled = false;

    onLoad() {
        BoxManager.instance = this;
        if (this.box) {
            this.boxController = this.box.getComponent(BoxController);
            this.boxGraphic = this.box.getComponent(BoxGraphic);
        }
    }

    onDestroy() {
        if (BoxManager.instance === this) BoxManager.instance = null;
    }

    /** Unity: HandleEmptyItems — hết item thì mở hộp rồi 2s sau bay đi. */
    handleEmptyItems(): void {
        if (this.isBoxHandled || !this.boxGraphic) return;
        this.isBoxHandled = true;

        this.boxGraphic.changeState(BoxState.Opened);
        this.scheduleOnce(() => this.boxController?.goToEndPos(), 2);
    }
}
