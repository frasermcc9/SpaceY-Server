"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const Registry_1 = require("./Registry");
const Database_1 = require("../Database/Database");
const EventManager_1 = require("./EventManager");
const SocketManager_1 = require("../api/SocketManager");
const RestManager_1 = require("../api/routes/RestManager");
class Server {
    constructor(serverOptions) {
        //#region Registry
        this.registry = new Registry_1.Registry();
        //#endregion registry
        //#region Database
        this.uri = "";
        this.dbName = "";
        //#endregion Database
        //#region EventManager
        this.eventManager = new EventManager_1.EventManager();
        this.socketManager = new SocketManager_1.SocketManager();
        this.restManager = new RestManager_1.RestManager();
        this.uri = serverOptions.databaseUri;
        this.dbName = serverOptions.databaseName;
        this.ConsoleLogging = serverOptions.consoleLogging ?? false;
        Server.TEST = serverOptions.testMode ?? false;
    }
    static Get() {
        if (this.Server == null) {
            throw new Error("You must explicity create the client. Did you forget to go Client.CreateClient(IClientSettings)?");
        }
        return this.Server;
    }
    static Create(serverOptions) {
        if (this.Server)
            return; //throw new Error("A client has already been made. Please use Client.Get() to access it.");
        this.Server = new Server(serverOptions);
    }
    static Destroy() {
        delete this.Server;
    }
    get Registry() {
        return this.registry;
    }
    CopyRegistry() {
        return new Registry_1.Registry(this.registry);
    }
    static get Reg() {
        return this.Get().Registry;
    }
    get Uri() {
        return this.uri;
    }
    get DbName() {
        return this.dbName;
    }
    Connect() {
        Database_1.connect();
    }
    static get socket() {
        return this.Get().socketManager;
    }
    static get rest() {
        return this.Get().restManager;
    }
    static get EventMan() {
        return this.Get().eventManager;
    }
    get EventMan() {
        return this.eventManager;
    }
}
exports.Server = Server;
Server.TEST = false;
