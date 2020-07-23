import { EventEmitter } from "events";

import * as io from "socket.io";
import stringify from "json-stringify-safe";

import { PlayerModel, IPlayer } from "../../Database/Models/Player/PlayerModel";
import { Player } from "../../GameTypes/GameAsset/Player/Player";

export class SocketManager extends EventEmitter {
    public static readonly PORT: number = 8000;

    private server = io.listen(SocketManager.PORT);

    public constructor() {
        super();

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
    private listen(client: io.Socket) {
        client.on("warp", async ({ id, locationName }: ClientPlayerEvents["warp"]) => {
            const player = await PlayerModel.findOneOrCreate({ uId: id });
            const result = await player.travelTo(locationName);
            this.emitResult(client, result, player.raw(), {
                successMsg: `Successfully traveled to ${locationName}.`,
                failMsg: "Cannot travel to this location.",
            });
        });

        //#region Skin Events

        client.on("createSkin", async ({ id, skinName, uri }: ClientPlayerEvents["createSkin"]) => {
            const player = await PlayerModel.findOneOrCreate({ uId: id });
            const result = await player.newSkin(skinName, uri);
            this.emitResult(client, result, player.raw(), {
                successMsg: `Skin '${skinName}' created.`,
                failMsg: `Cannot create skin. You need a token to create a skin.`,
            });
        });

        client.on("equipSkin", async ({ id, skinName }: ClientPlayerEvents["equipSkin"]) => {
            const player = await PlayerModel.findOneOrCreate({ uId: id });
            const result = await player.applySkin(skinName);
            this.emitResult(client, result, player.raw(), {
                successMsg: `Skin ${skinName} applied!`,
                failMsg: `Skin removed.`,
            });
        });

        client.on("removeSkin", async ({ id }: ClientPlayerEvents["removeSkin"]) => {
            const player = await PlayerModel.findOneOrCreate({ uId: id });
            await player.removeSkin();
            this.emitResult(client, true, player.raw(), { successMsg: "Skin removed." });
        });

        //#endregion

        //#region Mine
        client.on("mine", async ({ id, asteroidName }: ClientPlayerEvents["mine"]) => {
            const player = await PlayerModel.findOneOrCreate({ uId: id });
            const asteroid = player.Location.Asteroids.find((a) => a.Name == asteroidName);
            if (!asteroid)
                return this.emitResult(client, false, player.raw(), { failMsg: "This asteroid doesn't exist here." });

            const result = (await asteroid.mine(player)).code == 200;

            this.emitResult(client, result, player.raw(), {
                successMsg: `Asteroid successfully mined! New cargo: ${player.cargoString()}.`,
                failMsg: `Asteroid cannot be mined. On cooldown for ${asteroid.remainingCooldown(
                    player
                )} more seconds.`,
            });
        });
        //#endregion

        //#region Trading
        client.on("buy", async ({ id, itemName, quantity, storeName }: ClientPlayerEvents["buy"]) => {
            const player = await PlayerModel.findOneOrCreate({ uId: id });
            const store = player.Location.nodeAllStores().find((s) => s.Name == storeName);
            if (store == undefined)
                return this.emitResult(client, false, player.raw(), { failMsg: "Store not found." });
            const result =
                (await store.buyFromStore({ trader: player, item: itemName, quantity: quantity })).code == 200;
            return this.emitResult(client, result, player.raw(), { successMsg: `Item purchase successful.` });
        });

        client.on("sell", async ({ id, itemName, quantity, storeName }: ClientPlayerEvents["sell"]) => {
            const player = await PlayerModel.findOneOrCreate({ uId: id });
            const store = player.Location.nodeAllStores().find((s) => s.Name == storeName);
            if (store == undefined)
                return this.emitResult(client, false, player.raw(), { failMsg: "Store not found." });
            const result =
                (await store.sellToStore({ trader: player, item: itemName, quantity: quantity })).code == 200;
            return this.emitResult(client, result, player.raw(), { successMsg: `Item sold successfully.` });
        });

        client.on("forceSell", async ({ id, itemName, quantity, storeName }: ClientPlayerEvents["forceSell"]) => {
            const player = await PlayerModel.findOneOrCreate({ uId: id });
            const store = player.Location.nodeAllStores().find((s) => s.Name == storeName);
            if (store == undefined)
                return this.emitResult(client, false, player.raw(), { failMsg: "Store not found." });
            const result =
                (await store.sellToStoreForce({ trader: player, item: itemName, quantity: quantity })).code == 200;
            return this.emitResult(client, result, player.raw(), { successMsg: `Item sold successfully.` });
        });
        //#endregion

        //#region Attachments

        client.on("equip", async ({ id, attachment }: ClientPlayerEvents["equip"]) => {
            const player = await PlayerModel.findOneOrCreate({ uId: id });
            const result = (await player.equipAttachment(attachment)).code == 200;
            return this.emitResult(client, result, player.raw(), {
                successMsg: `Successfully equipped ${attachment}.`,
                failMsg: `Failed to equip the attachment.`,
            });
        });

        //#endregion
    }

    private emitResult(
        client: io.Socket,
        result: boolean,
        player: IPlayer,
        { successMsg, failMsg }: { successMsg?: string; failMsg?: string }
    ): void {
        successMsg = successMsg ?? "Success";
        failMsg = failMsg ?? "Internal Server Error";
        const msg = result ? successMsg : failMsg;

        const emitObj: ServerEvents["res"] = { success: result, playerStringified: stringify(player), msg: msg };
        client.emit("res", emitObj);
    }

    private async getPlayer(id: string) {
        return PlayerModel.findOneOrCreate({ uId: id });
    }
}

interface ClientPlayerEvents {
    warp: { id: string; locationName: string };

    createSkin: { id: string; skinName: string; uri: string };
    equipSkin: { id: string; skinName: string };
    removeSkin: { id: string };

    mine: { id: string; asteroidName: string };

    buy: { id: string; storeName: string; itemName: string; quantity: number };
    sell: { id: string; storeName: string; itemName: string; quantity: number };
    forceSell: { id: string; storeName: string; itemName: string; quantity: number };

    equip: { id: string; attachment: string };
}
interface ServerEvents {
    res: { success: boolean; msg: string; playerStringified: string };
}
