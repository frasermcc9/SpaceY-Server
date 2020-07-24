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
        client.on("warp", async ({ id, locationName }) => {
            const player = await PlayerModel_1.PlayerModel.findOneOrCreate({ uId: id });
            const result = await player.travelTo(locationName);
            this.emitResult(client, result, player.raw(), {
                successMsg: `Successfully traveled to ${locationName}.`,
                failMsg: "Cannot travel to this location.",
            });
        });
        //#region Skin Events
        client.on("createSkin", async ({ id, skinName, uri }) => {
            const player = await PlayerModel_1.PlayerModel.findOneOrCreate({ uId: id });
            const result = await player.newSkin(skinName, uri);
            this.emitResult(client, result, player.raw(), {
                successMsg: `Skin '${skinName}' created.`,
                failMsg: `Cannot create skin. You need a token to create a skin.`,
            });
        });
        client.on("equipSkin", async ({ id, skinName }) => {
            const player = await PlayerModel_1.PlayerModel.findOneOrCreate({ uId: id });
            const result = await player.applySkin(skinName);
            this.emitResult(client, result, player.raw(), {
                successMsg: `Skin ${skinName} applied!`,
                failMsg: `Skin removed.`,
            });
        });
        client.on("removeSkin", async ({ id }) => {
            const player = await PlayerModel_1.PlayerModel.findOneOrCreate({ uId: id });
            await player.removeSkin();
            this.emitResult(client, true, player.raw(), { successMsg: "Skin removed." });
        });
        //#endregion
        //#region Mine
        client.on("mine", async ({ id, asteroidName }) => {
            const player = await PlayerModel_1.PlayerModel.findOneOrCreate({ uId: id });
            const asteroid = player.Location.Asteroids.find((a) => a.Name == asteroidName);
            if (!asteroid)
                return this.emitResult(client, false, player.raw(), { failMsg: "This asteroid doesn't exist here." });
            const result = (await asteroid.mine(player)).code == 200;
            this.emitResult(client, result, player.raw(), {
                successMsg: `Asteroid successfully mined! New cargo: ${player.cargoString()}.`,
                failMsg: `Asteroid cannot be mined. On cooldown for ${asteroid.remainingCooldown(player)} more seconds.`,
            });
        });
        //#endregion
        //#region Trading
        client.on("buy", async ({ id, itemName, quantity, storeName }) => {
            const player = await PlayerModel_1.PlayerModel.findOneOrCreate({ uId: id });
            const store = player.Location.nodeAllStores().find((s) => s.Name == storeName);
            if (store == undefined)
                return this.emitResult(client, false, player.raw(), { failMsg: "Store not found." });
            const result = await store.buyFromStore({ trader: player, item: itemName, quantity: quantity });
            return this.emitResult(client, result.code == 200, player.raw(), {
                successMsg: `Item purchase successful.`,
                failMsg: result.code + "",
            });
        });
        client.on("sell", async ({ id, itemName, quantity, storeName }) => {
            const player = await PlayerModel_1.PlayerModel.findOneOrCreate({ uId: id });
            const store = player.Location.nodeAllStores().find((s) => s.Name == storeName);
            if (store == undefined)
                return this.emitResult(client, false, player.raw(), { failMsg: "Store not found." });
            const result = await store.sellToStore({ trader: player, item: itemName, quantity: quantity });
            return this.emitResult(client, result.code == 200, player.raw(), {
                successMsg: `Item sold successfully.`,
                failMsg: result.code + "",
            });
        });
        client.on("forceSell", async ({ id, itemName, quantity, storeName }) => {
            const player = await PlayerModel_1.PlayerModel.findOneOrCreate({ uId: id });
            const store = player.Location.nodeAllStores().find((s) => s.Name == storeName);
            if (store == undefined)
                return this.emitResult(client, false, player.raw(), { failMsg: "Store not found." });
            const result = await store.sellToStoreForce({ trader: player, item: itemName, quantity: quantity });
            return this.emitResult(client, result.code == 200, player.raw(), {
                successMsg: `Item sold successfully.`,
                failMsg: result.code + "",
            });
        });
        //#endregion
        //#region Attachments
        client.on("equip", async ({ id, attachment }) => {
            const player = await PlayerModel_1.PlayerModel.findOneOrCreate({ uId: id });
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
        const emitObj = { success: result, playerStringified: json_stringify_safe_1.default(player), msg: msg };
        client.emit("res", emitObj);
    }
    async getPlayer(id) {
        return PlayerModel_1.PlayerModel.findOneOrCreate({ uId: id });
    }
}
exports.SocketManager = SocketManager;
SocketManager.PORT = 8000;
//# sourceMappingURL=SocketManager.js.map