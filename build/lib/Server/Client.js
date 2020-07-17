"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const Registry_1 = require("./Registry");
const Database_1 = require("../GameApi/Database/Database");
const EventManager_1 = require("./EventManager");
class Client {
    constructor(clientSettings) {
        //#region Registry
        this.registry = new Registry_1.Registry();
        //#endregion registry
        //#region Database
        this.uri = "";
        this.dbName = "";
        //#endregion Database
        //#region EventManager
        this.eventManager = new EventManager_1.EventManager();
        this.uri = clientSettings.databaseUri;
        this.dbName = clientSettings.databaseName;
        this.ConsoleLogging = clientSettings.consoleLogging ?? false;
        //this.registry.DefaultCredits = clientSettings.defaultCredits ?? 0;
        //this.registry.MaxRarity = clientSettings.maximumRarity;
        //this.registry.MaxTech = clientSettings.maximumTechLevel;
        Client.TEST = clientSettings.testMode ?? false;
    }
    static Get() {
        if (this.Client == null) {
            throw new Error("You must explicity create the client. Did you forget to go Client.CreateClient(IClientSettings)?");
        }
        return this.Client;
    }
    static Create(ClientSettings) {
        if (this.Client)
            return; //throw new Error("A client has already been made. Please use Client.Get() to access it.");
        this.Client = new Client(ClientSettings);
    }
    static Destroy() {
        delete this.Client;
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
    static get EventMan() {
        return this.Get().eventManager;
    }
    get EventMan() {
        return this.eventManager;
    }
}
exports.Client = Client;
Client.TEST = false;
