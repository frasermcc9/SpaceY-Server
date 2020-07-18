import { Registry } from "./Registry";
import { connect } from "../Database/Database";
import { EventManager } from "./EventManager";
import { SocketManager } from "../api/SocketManager";
import { RestManager } from "../api/routes/RestManager";

export class Server {
    public static TEST = false;
    //Section: Declared Constants
    public readonly ConsoleLogging: boolean;
    //Section: Client Singleton
    public static Server: Server;
    public static Get() {
        if (this.Server == null) {
            throw new Error("You must explicity create the client. Did you forget to go Client.CreateClient(IClientSettings)?");
        }
        return this.Server;
    }

    public static Create(serverOptions: IServerSettings) {
        if (this.Server) return; //throw new Error("A client has already been made. Please use Client.Get() to access it.");
        this.Server = new Server(serverOptions);
    }
    public static Destroy() {
        delete this.Server;
    }
    private constructor(serverOptions: IServerSettings) {
        this.uri = serverOptions.databaseUri;
        this.dbName = serverOptions.databaseName;
        this.ConsoleLogging = serverOptions.consoleLogging ?? false;

        Server.TEST = serverOptions.testMode ?? false;
    }

    //#region Registry
    private registry: Registry = new Registry();
    public get Registry(): Registry {
        return this.registry;
    }
    public CopyRegistry(): Registry {
        return new Registry(this.registry);
    }

    public static get Reg(): Registry {
        return this.Get().Registry;
    }
    //#endregion registry

    //#region Database
    private uri: string = "";
    public get Uri() {
        return this.uri;
    }
    private dbName: string = "";
    public get DbName() {
        return this.dbName;
    }
    public Connect(): void {
        connect();
    }
    //#endregion Database

    //#region EventManager

    private eventManager: EventManager = new EventManager();
    private socketManager = new SocketManager();
    private restManager = new RestManager();
    public static get socket() {
        return this.Get().socketManager;
    }
    public static get rest() {
        return this.Get().restManager;
    }
    public static get EventMan(): EventManager {
        return this.Get().eventManager;
    }
    public get EventMan(): EventManager {
        return this.eventManager;
    }
    //#endregion EventManager
}

export interface IServerSettings {
    databaseName: string;
    databaseUri: string;
    consoleLogging?: boolean;
    /* 	defaultCredits?: number;
	maximumRarity: number;
	maximumTechLevel: number; */
    testMode?: boolean;
}
