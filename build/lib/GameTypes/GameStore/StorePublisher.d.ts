/// <reference types="node" />
import { EventEmitter } from "events";
import { BaseStore } from "./BaseStore";
import { GameAsset } from "../GameAsset/GameAsset";
export declare class StorePublisher extends EventEmitter {
    private intervals;
    StartLoop(loopName: string, eventName: string, interval: number): this;
    TerminateLoop(loopName: string): boolean;
    RegisterStore<K extends GameAsset>(baseStore: BaseStore<K>, updateInterval: number, storeName: string): this;
    DeregisterStore(Store: string): boolean;
}
