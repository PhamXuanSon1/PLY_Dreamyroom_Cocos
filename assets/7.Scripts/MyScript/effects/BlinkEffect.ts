/** BlinkEffect — port từ Assets/_GamePlay_/Scripts/Effect/BlinkEffect.cs (Unity) */

import { _decorator, Component } from 'cc';
import { ObjectPool, PoolType } from '../core/ObjectPool';

const { ccclass } = _decorator;

@ccclass('BlinkEffect')
export class BlinkEffect extends Component {

    /** Unity: DeSpawnByTime — Invoke(nameof(DeSpawn), 2f) */
    deSpawnByTime(delay = 2): void {
        this.scheduleOnce(() => this.deSpawn(), delay);
    }

    deSpawn(): void {
        ObjectPool.instance?.despawn(PoolType.BlinkFX, this.node);
    }
}
