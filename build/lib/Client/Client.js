"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const Registry_1 = require("./Registry");
const Database_1 = require("../GameApi/Database/Database");
class Client {
    constructor(clientSettings) {
        //Section: Registry
        this.registry = new Registry_1.Registry();
        //Section: Database
        this.uri = "";
        this.dbName = "";
        this.uri = clientSettings.databaseUri;
        this.dbName = clientSettings.databaseName;
        this.ConsoleLogging = clientSettings.consoleLogging || false;
        this.registry.DefaultCredits = clientSettings.defaultCredits || 0;
        this.registry.MaxRarity = clientSettings.maximumRarity;
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
    get Uri() {
        return this.uri;
    }
    get DbName() {
        return this.dbName;
    }
    Connect() {
        Database_1.connect();
    }
}
exports.Client = Client;
