/** HandOfBox — port từ Assets/_GAME/Script/Utils/HandOfBox.cs (Unity) */

import { _decorator, Component, Node } from 'cc';
import { TweenUtil } from '../core/TweenUtil';

const { ccclass, property } = _decorator;

@ccclass('HandOfBox')
export class HandOfBox extends Component {

    @property({ type: Node, tooltip: 'Vị trí bàn tay bay tới sau intro.' })
    MoveAfterIntroPosOfHand: Node | null = null;

    moveAfterIntro(duration: number): void {
        if (!this.MoveAfterIntroPosOfHand) return;
        TweenUtil.moveTo(
            this.node,
            this.MoveAfterIntroPosOfHand.worldPosition,
            duration,
            'linear',
            () => { this.node.active = false; },
        );
    }
}
