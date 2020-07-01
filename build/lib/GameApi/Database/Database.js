"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnect = exports.connect = void 0;
const Mongoose = require("mongoose");
const Client_1 = require("../../Client/Client");
let database;
exports.connect = () => {
    //const uri = "mongodb://localhost:27017";
    const uri = Client_1.Client.Get().Uri;
    //const dbName = "stocksim";
    const dbName = Client_1.Client.Get().DbName;
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
        if (Client_1.Client.Get().ConsoleLogging)
            console.log("Connected to database");
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
    if (Client_1.Client.Get().ConsoleLogging)
        console.log("Closed database");
};
