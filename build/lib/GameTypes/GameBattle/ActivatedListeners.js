"use strict";
/* import { BattleshipEventArgs } from "./Battleship";
import e from "express";
import { MapCollection } from "../../Extensions/Collections";

//TODO maybe switch to array

export class ActivatedListeners
    extends MapCollection<[keyof BattleshipEventArgs, BattleshipEventArgs[keyof BattleshipEventArgs]], number>
    implements IActivatedListeners {
    add<K extends keyof BattleshipEventArgs>(e: K, duration: number, fn: BattleshipEventArgs[K]) {
        this.set([e, fn], duration);
    }

    reduce<K extends keyof BattleshipEventArgs>(key: [K, BattleshipEventArgs[K]]) {
        const current = this.get(key) ?? 1;
        this.set(key, current - 1);
        if (current - 1 < 1) {
            //TODO remove event listener
            this.delete(key);
        }
    }

    static new(): IActivatedListeners {
        return new ActivatedListeners();
    }

    private constructor() {
        super();
    }
}

export interface IActivatedListeners {
    add<K extends keyof BattleshipEventArgs>(e: K, duration: number, fn: BattleshipEventArgs[K]): void;
    reduce<K extends keyof BattleshipEventArgs>([a, b]: [K, BattleshipEventArgs[K]]): void;
    forEach(
        callbackfn: (
            value: number,
            key: [keyof BattleshipEventArgs, BattleshipEventArgs[keyof BattleshipEventArgs]],
            map: Map<[keyof BattleshipEventArgs, BattleshipEventArgs[keyof BattleshipEventArgs]], number>
        ) => void,
        thisArg?: any
    ): void;
}
 */ 
//# sourceMappingURL=ActivatedListeners.js.map