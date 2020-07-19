/// <reference types="node" />
import { EventEmitter } from "events";
export declare class SocketManager extends EventEmitter {
    static readonly PORT: number;
    private server;
    constructor();
    /**
     * Adds all listeners to the client that is added.
     * @param client the client to add the listeners to
     */
    private listen;
    private emitResult;
    private getPlayer;
}
