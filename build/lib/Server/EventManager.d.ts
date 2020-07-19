/// <reference types="node" />
import { EventEmitter } from "events";
export declare class EventManager extends EventEmitter {
}
export declare interface EventManager {
    on(event: "LevelUp", listener: ({ uId, level }: {
        uId: string;
        level: number;
    }) => void): this;
}
