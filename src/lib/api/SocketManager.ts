import { EventEmitter } from "events";

import * as io from "socket.io";
import stringify from "json-stringify-safe";

import { PlayerModel, IPlayer } from "../Database/Models/Player/PlayerModel";
import { Player } from "../GameTypes/GameAsset/Player/Player";

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
		client.on("warp", async ([playerData, location]: [IPlayer, string]) => {
			const player = new Player(playerData);
			const result = await player.travelTo(location);
			this.emitResult(client, result, player.raw(), {
				successMsg: `Successfully traveled to ${location}.`,
				failMsg: "Cannot travel to this location.",
			});
		});

		//#region Skin Events

		client.on("createSkin", async ([playerData, name, uri]: [IPlayer, string, string]) => {
			const player = new Player(playerData);
			const result = await player.newSkin(name, uri);
			this.emitResult(client, result, player.raw(), {
				successMsg: `Skin '${name}' created.`,
				failMsg: `Cannot create skin. You need a token to create a skin.`,
			});
		});

		client.on("equipSkin", async ([playerData, skinName]: [IPlayer, string]) => {
			const player = new Player(playerData);
			const result = await player.applySkin(skinName);
			this.emitResult(client, result, player.raw(), { successMsg: `Skin ${skinName} applied!`, failMsg: `Skin removed.` });
		});

		client.on("removeSkin", async ([playerData]: [IPlayer]) => {
			const player = new Player(playerData);
			await player.removeSkin();
			this.emitResult(client, true, player.raw(), { successMsg: "Skin removed." });
		});

		//#endregion

		//#region Mine
		client.on("mine", async ([userId, asteroid]: [string, string]) => {});
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

		client.emit("res", result, msg, stringify(player));
	}

	private async getPlayer(id: string) {
		return PlayerModel.findOneOrCreate({ uId: id });
	}
}
