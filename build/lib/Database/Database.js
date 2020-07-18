"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnect = exports.connect = void 0;
const Mongoose = require("mongoose");
const Server_1 = require("../Server/Server");
let database;
exports.connect = () => {
    //const uri = "mongodb://localhost:27017";
    const uri = Server_1.Server.Get().Uri;
    //const dbName = "stocksim";
    const dbName = Server_1.Server.Get().DbName;
    if (database) {
        return;
    }
    Mongoose.connect(uri, {
        useNewUrlParser: true,
        useFindAndModify: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        dbName: dbName,
    });
    database = Mongoose.connection;
    database.once("open", async () => {
        if (Server_1.Server.Get().ConsoleLogging) console.log("Connected to database");
    });
    database.on("error", () => {
        console.warn("Error connecting to database");
    });
    return;
};
exports.disconnect = () => {
    if (!database) {
        return;
    }
    Mongoose.disconnect();
    if (Server_1.Server.Get().ConsoleLogging) console.log("Closed database");
};
