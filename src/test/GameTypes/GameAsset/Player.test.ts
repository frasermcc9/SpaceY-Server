import { Client, connect, disconnect } from "../../../lib/main";
import { GenerateClientSet, GENERATED_SHIPS } from "../../TestUtil";
import { PlayerModel } from "../../../lib/GameApi/Database/Player/PlayerModel";
import { AsteroidBuilder } from "../../../lib/GameTypes/GameMechanics/Asteroid";
import { default as must } from "must";
import { Ship } from "../../../lib/GameTypes/GameAsset/Ship/Ship";
import { BlueprintBuilder } from "../../../lib/GameTypes/GameAsset/Blueprint/Blueprint";
import { BuildableDecorator } from "../../../lib/GameTypes/GameAsset/AssetDecorators";
require("must/register");

describe("Player Tests", async () => {
	describe("Player Building from Blueprint Tests", async () => {
		it("Should reject since the player cannot afford the materials.", async () => {
			const ship = GENERATED_SHIPS()[0];
			const Player = await PlayerModel.findOneOrCreate({ uId: "1" });
			(await new BuildableDecorator(ship).Build(Player)).code.must.eql(403);
		});
		it("Should accept since the player can afford the materials.", async () => {
			const ship = GENERATED_SHIPS()[0];
			const Player = await PlayerModel.findOneOrCreate({ uId: "1" });
			const MaterialsToAdd = new Map<string, number>().set("Iron", 1000).set("Gold", 1000).set("Tech", 1000).set("Food", 1000);
			Player.InventorySum("materials", MaterialsToAdd);
			(await new BuildableDecorator(ship).Build(Player)).code.must.eql(200);
        });
	});
});
