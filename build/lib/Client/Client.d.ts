import { Registry } from "./Registry";
export declare class Client {
    readonly ConsoleLogging: boolean;
    static Client: Client;
    static Get(): Client;
    static Create(ClientSettings: IClientSettings): void;
    static Destroy(): void;
    private constructor();
    private registry;
    get Registry(): Registry;
    CopyRegistry(): Registry;
    private uri;
    get Uri(): string;
    private dbName;
    get DbName(): string;
    Connect(): void;
}
interface IClientSettings {
    databaseName: string;
    databaseUri: string;
    consoleLogging?: boolean;
    defaultCredits?: number;
    maximumRarity: number;
}
export {};
