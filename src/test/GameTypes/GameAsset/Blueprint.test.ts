import { Client, connect, disconnect } from "../../../lib/main";
import { GenerateClientSet, GENERATED_SHIPS } from "../../TestUtil";
import { PlayerModel } from "../../../lib/GameApi/Database/Player/PlayerModel";
import { AsteroidBuilder } from "../../../lib/GameTypes/GameMechanics/Asteroid";
import { default as must } from "must";
import { Ship } from "../../../lib/GameTypes/GameAsset/Ship/Ship";
import { BlueprintBuilder } from "../../../lib/GameTypes/GameAsset/Blueprint/Blueprint";
import { BuildableDecorator } from "../../../lib/GameTypes/GameAsset/AssetDecorators";
require("must/register");

describe("Blueprint Tests", async () => {
	describe("General Blueprint Tests", async () => {
		it("Should reject since the player cannot afford the materials.", async () => {
			const ship = new Ship({
				description: "An iron hunk that can barely fly",
				name: "Iron Ball",
				blueprint: new BlueprintBuilder().DefinedBuild({ value: 1000, rarity: true, minRarity: 0, maxRarity: 10, centralRarity: 3 }, "Iron Ball"),
				cost: 1500,
			});
			const ship2 = new Ship({
				description: "A second iron hunk that can barely fly",
				name: "Iron Ball 2",
				blueprint: new BlueprintBuilder().DefinedBuild({ value: 1000, rarity: true, minRarity: 0, maxRarity: 10, centralRarity: 3 }, "Iron Ball"),
				cost: 2500,
			});
			ship.Blueprint.must.eql(ship2.Blueprint);
		});
	});
});
