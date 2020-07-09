import { Registry } from "./Registry";
import { EventManager } from "./EventManager";
export declare class Client {
    static TEST: boolean;
    readonly ConsoleLogging: boolean;
    static Client: Client;
    static Get(): Client;
    static Create(ClientSettings: IClientSettings): void;
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
    static get EventMan(): EventManager;
    get EventMan(): EventManager;
}
export interface IClientSettings {
    databaseName: string;
    databaseUri: string;
    consoleLogging?: boolean;
    testMode?: boolean;
}
