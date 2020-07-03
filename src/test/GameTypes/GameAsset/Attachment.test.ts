import { Client, connect, disconnect } from "../../../lib/main";
import { GenerateClientSet, GENERATED_SHIPS } from "../../TestUtil";
import { PlayerModel } from "../../../lib/GameApi/Database/Player/PlayerModel";
import { AsteroidBuilder } from "../../../lib/GameTypes/GameMechanics/Asteroid";
import { default as must } from "must";
import { Ship } from "../../../lib/GameTypes/GameAsset/Ship/Ship";
import { BlueprintBuilder } from "../../../lib/GameTypes/GameAsset/Blueprint/Blueprint";
import { BuildableDecorator } from "../../../lib/GameTypes/GameAsset/AssetDecorators";
import { Attachment, AttachmentBuilder, AttachmentReport } from "../../../lib/GameTypes/GameAsset/Attachment/Attachment";
require("must/register");

describe("Blueprint Tests", async () => {
	describe("General Blueprint Tests", async () => {
		it.only("Should reject since the player cannot afford the materials.", async () => {
			const S1 = new Ship({
				description: "A small but agile ship",
				name: "Shuttle",
				blueprint: new BlueprintBuilder().AutoBuild({ value: 1000, rarity: true, minRarity: 0, maxRarity: 10, centralRarity: 3 }),
				cost: 1500,
			});
			const S2 = new Ship({ description: "A medium sized vehicle", name: "Warship" });

			const fn: (friendly: Ship, opponent: Ship) => AttachmentReport = (S1, S2) => {
				return { message: "Test Successful!" };
			};
			const attachment = new AttachmentBuilder({ name: "Blaster", description: "A really cool blaster", techLevel: 2 }).BattleStartFn(fn).Build();
			attachment.BattleStart(S1, S2).message.must.eql("Test Successful!");
		});
	});
});
