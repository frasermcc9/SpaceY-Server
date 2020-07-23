"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketManager = void 0;
const events_1 = require("events");
const io = __importStar(require("socket.io"));
const json_stringify_safe_1 = __importDefault(require("json-stringify-safe"));
const PlayerModel_1 = require("../../Database/Models/Player/PlayerModel");
const Player_1 = require("../../GameTypes/GameAsset/Player/Player");
class SocketManager extends events_1.EventEmitter {
    constructor() {
        super();
        this.server = io.listen(SocketManager.PORT);
        //Whenever a client connects, bind the events to the client
        this.server.on("connection", (client) => {
            this.listen(client);
        });
        console.log("Socket started on port " + SocketManager.PORT);
    }
    /**
     * Adds all listeners to the client that is added.
     * @param client the client to add the listeners to
     */
    listen(client) {
        client.on("warp", async ([playerData, location]) => {
            const player = new Player_1.Player(playerData);
            const result = await player.travelTo(location);
            this.emitResult(client, result, player.raw(), {
                successMsg: `Successfully traveled to ${location}.`,
                failMsg: "Cannot travel to this location.",
            });
        });
        //#region Skin Events
        client.on("createSkin", async ([playerData, name, uri]) => {
            const player = new Player_1.Player(playerData);
            const result = await player.newSkin(name, uri);
            this.emitResult(client, result, player.raw(), {
                successMsg: `Skin '${name}' created.`,
                failMsg: `Cannot create skin. You need a token to create a skin.`,
            });
        });
        client.on("equipSkin", async ([playerData, skinName]) => {
            const player = new Player_1.Player(playerData);
            const result = await player.applySkin(skinName);
            this.emitResult(client, result, player.raw(), { successMsg: `Skin ${skinName} applied!`, failMsg: `Skin removed.` });
        });
        client.on("removeSkin", async ([playerData]) => {
            const player = new Player_1.Player(playerData);
            await player.removeSkin();
            this.emitResult(client, true, player.raw(), { successMsg: "Skin removed." });
        });
        //#endregion
        //#region Mine
        client.on("mine", async ([playerData, asteroidName]) => {
            const player = new Player_1.Player(playerData);
            const asteroid = player.Location.Asteroids.find((a) => a.Name == asteroidName);
            if (!asteroid)
                return this.emitResult(client, false, player.raw(), { failMsg: "This asteroid doesn't exist here." });
            const result = (await asteroid.mine(player)).code == 200;
            this.emitResult(client, result, player.raw(), {
                successMsg: "Asteroid Successfully Mined",
                failMsg: `Asteroid cannot be mined. On cooldown for ${asteroid.remainingCooldown(player)} more seconds.`,
            });
        });
        //#endregion
        //#region Trading
        client.on("buy", async ([playerData, storeName, item, quantity]) => {
            const player = new Player_1.Player(playerData);
            const store = player.Location.nodeAllStores().find((s) => s.Name == storeName);
            if (store == undefined)
                return this.emitResult(client, false, player.raw(), { failMsg: "Store not found." });
            const result = (await store.buyFromStore({ trader: player, item: item, quantity: quantity })).code == 200;
            return this.emitResult(client, result, player.raw(), { successMsg: `Item purchase successful.` });
        });
        client.on("sell", async ([playerData, storeName, item, quantity]) => {
            const player = new Player_1.Player(playerData);
            const store = player.Location.nodeAllStores().find((s) => s.Name == storeName);
            if (store == undefined)
                return this.emitResult(client, false, player.raw(), { failMsg: "Store not found." });
            const result = (await store.sellToStore({ trader: player, item: item, quantity: quantity })).code == 200;
            return this.emitResult(client, result, player.raw(), { successMsg: `Item sold successfully.` });
        });
        client.on("forceSell", async ([playerData, storeName, item, quantity]) => {
            const player = new Player_1.Player(playerData);
            const store = player.Location.nodeAllStores().find((s) => s.Name == storeName);
            if (store == undefined)
                return this.emitResult(client, false, player.raw(), { failMsg: "Store not found." });
            const result = (await store.sellToStoreForce({ trader: player, item: item, quantity: quantity })).code == 200;
            return this.emitResult(client, result, player.raw(), { successMsg: `Item sold successfully.` });
        });
        //#endregion
        //#region Attachments
        client.on("equip", async ([playerData, attachment]) => {
            const player = new Player_1.Player(playerData);
            const result = (await player.equipAttachment(attachment)).code == 200;
            return this.emitResult(client, result, player.raw(), {
                successMsg: `Successfully equipped ${attachment}.`,
                failMsg: `Failed to equip the attachment.`,
            });
        });
        //#endregion
    }
    emitResult(client, result, player, { successMsg, failMsg }) {
        successMsg = successMsg ?? "Success";
        failMsg = failMsg ?? "Internal Server Error";
        const msg = result ? successMsg : failMsg;
        client.emit("res", result, msg, json_stringify_safe_1.default(player));
    }
    async getPlayer(id) {
        return PlayerModel_1.PlayerModel.findOneOrCreate({ uId: id });
    }
}
exports.SocketManager = SocketManager;
SocketManager.PORT = 8000;
//# sourceMappingURL=SocketManager.js.map