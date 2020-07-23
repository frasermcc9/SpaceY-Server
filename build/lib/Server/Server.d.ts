import { Registry } from "./Registry";
import { EventManager } from "./EventManager";
import { SocketManager } from "../api/sockets/SocketManager";
import { RestManager } from "../api/routes/index";
export declare class Server {
    static TEST: boolean;
    readonly ConsoleLogging: boolean;
    static Server: Server;
    static Get(): Server;
    static Create(serverOptions: IServerSettings): void;
    static Destroy(): void;
    private constructor();
    private registry;
    get Registry(): Registry;
    CopyRegistry(): Registry;
    static get Reg(): Registry;
    private uri;
    get Uri(): string;
    private dbName;
    get DbName(): string;
    Connect(): void;
    private eventManager;
    private socketManager;
    private restManager;
    static get socket(): SocketManager;
    static get rest(): RestManager;
    static get EventMan(): EventManager;
    get EventMan(): EventManager;
}
export interface IServerSettings {
    databaseName: string;
    databaseUri: string;
    consoleLogging?: boolean;
    testMode?: boolean;
}
