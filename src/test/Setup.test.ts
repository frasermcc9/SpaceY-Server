import { Client, connect, disconnect } from "../lib/main";
import { Setup } from "../lib/Client/Setup";
import { GenerateClientSet } from "./TestUtil";
import { Spacemap } from "../lib/GameTypes/GameSpacemap/Spacemap";
import { SpacemapNodeBuilder, WarpPower } from "../lib/GameTypes/GameSpacemap/SpacemapNode";
import { FactionBuilder } from "../lib/GameTypes/GameAsset/Faction/Faction";
import { MaterialBuilder } from "../lib/GameTypes/GameAsset/Material/Material";
import { ShipBuilder } from "../lib/GameTypes/GameAsset/Ship/Ship";
import { BlueprintBuilder } from "../lib/GameTypes/GameAsset/Blueprint/Blueprint";
import { AttachmentBuilder, AttachmentType, AttachmentReport } from "../lib/GameTypes/GameAsset/Attachment/Attachment";
import { ShipWrapper } from "../lib/GameTypes/GameAsset/Ship/ShipWrapper";
import { Asteroid } from "../lib/GameTypes/GameMechanics/Asteroid";
import { PlayerModel } from "../lib/GameApi/Database/Player/PlayerModel";

before(async () => {
	Setup.begin()
		.setupClient({
			databaseName: "testSpaceY",
			databaseUri: "mongodb://localhost:27017",
			testMode: true,
			consoleLogging: false,
		})
		.addMaterials(MATERIALS.apply(null))
		.addShips(SHIPS.apply(null))
		.addAttachments(ATTACHMENTS.apply(null))
		.addFactions(FACTIONS.apply(null))
		.addLocations(NODES.apply(null))
		.addLink("Gemini", "Scorpius")
		.addLink("Scorpius", "Grus")
		.finishMap()
		.defaultAsteroidCooldown(300)
		.defaultCredits(10000)
		.defaultLocation("Gemini")
		.defaultShip("Shuttle")
		.maxMaterialRarity(10)
		.maxTechLevel(10)
		.finish();
});

beforeEach(async () => {
	await PlayerModel.deleteMany({});
});

after(async () => {
	disconnect();
});

const MATERIALS = () => {
	return [
		new MaterialBuilder({ name: "Iron", description: "A small iron nugget.", techLevel: 3 })
			.EnableSell(25)
			.EnableMine()
			.SetRarity(4)
			.Build(),
		new MaterialBuilder({ name: "Gold", description: "A small gold nugget.", techLevel: 4 })
			.EnableSell(75)
			.EnableMine()
			.SetRarity(10)
			.Build(),
		new MaterialBuilder({ name: "Food", description: "Food for one person.", techLevel: 1 }).EnableSell(5).SetRarity(1).Build(),
		new MaterialBuilder({ name: "Tech", description: "Pile of tech pieces.", techLevel: 7 }).EnableSell(50).SetRarity(6).Build(),
	];
};
const SHIPS = () => {
	return [
		new ShipBuilder({ name: "Shuttle", description: "A small but agile ship", techLevel: 4 })
			.EnableSell(1500)
			.EnableBuildable(
				new BlueprintBuilder().AutoBuild({
					value: 1000,
					rarity: true,
					minRarity: 0,
					maxRarity: 10,
					centralRarity: 3,
					minTech: 0,
					maxTech: 10,
				})
			)
			.SetStats({ baseHp: 100, baseShield: 50, baseCargo: 350 })
			.SetWeapons({ heavyCap: 3, primaryCap: 3, generalCap: 2 })
			.Build(),
		new ShipBuilder({ name: "Warship", description: "A medium sized vehicle", techLevel: 6 })
			.EnableSell(3000)
			.EnableBuildable(
				new BlueprintBuilder().AutoBuild({
					value: 2550,
					rarity: true,
					minRarity: 0,
					maxRarity: 10,
					centralRarity: 5,
					minTech: 0,
					maxTech: 10,
				})
			)
			.SetStats({ baseHp: 150, baseShield: 90, baseCargo: 750 })
			.Build(),
		new ShipBuilder({ name: "Destroyer", description: "A flagship destroyer", techLevel: 8 })
			.EnableSell(4500)
			.EnableBuildable(
				new BlueprintBuilder().AutoBuild({
					value: 4000,
					rarity: true,
					minRarity: 0,
					maxRarity: 10,
					centralRarity: 7,
					minTech: 0,
					maxTech: 10,
				})
			)
			.SetStats({ baseHp: 200, baseShield: 170, baseCargo: 8000 })
			.SetWeapons({ generalCap: 5, heavyCap: 5, minerCap: 1, primaryCap: 5, shieldCap: 5 })
			.Build(),
	];
};
const PlatingEquip: (friendly: ShipWrapper) => AttachmentReport = (friendly) => {
	friendly.incrementStatistics({ hp: 20 });
	return { message: `New Health: ${friendly.ShipStatistics.totalHp}`, success: true };
};
const PlatingUnequip: (friendly: ShipWrapper) => AttachmentReport = (friendly) => {
	friendly.decrementStatistics({ hp: 20 });
	return { message: `New Health: ${friendly.ShipStatistics.totalHp}`, success: true };
};
const LaserMine: (inputCollection: Asteroid) => AttachmentReport = (asteroid) => {
	asteroid.forEach((val: number, key: any) => {
		asteroid.set(key, val * 2);
	});
	return { message: "Success", success: true };
};
const ATTACHMENTS = () => {
	return [
		new AttachmentBuilder({
			name: "Blaster",
			description: "Standard issue blaster",
			type: AttachmentType.PRIMARY,
			techLevel: 2,
			strength: 20,
		}).Build(),
		new AttachmentBuilder({
			name: "Space Sword",
			description: "Not very practical",
			type: AttachmentType.HEAVY,
			techLevel: 1,
			strength: 20,
		}).Build(),
		new AttachmentBuilder({
			name: "Obliterator",
			description: "This one will hurt",
			type: AttachmentType.HEAVY,
			techLevel: 6,
			strength: 20,
		}).Build(),
		new AttachmentBuilder({
			name: "Iron Plating",
			description: "Tough metal",
			techLevel: 2,
			type: AttachmentType.GENERAL,
			strength: 20,
		})
			.EquipFn(PlatingEquip)
			.UnequipFn(PlatingUnequip)
			.Build(),
		new AttachmentBuilder({
			name: "Perfected Mining Laser",
			description: "The pinnacle of mining technology",
			type: AttachmentType.MINER,
			techLevel: 8,
			strength: 20,
		})
			.MineFn(LaserMine)
			.Build(),
	];
};
const FACTIONS = () => {
	return [
		new FactionBuilder({ name: "Humans", description: "Like you and me", techLevel: 4 }).Build(),
		new FactionBuilder({ name: "Alliance", description: "The great alliance of the galaxy", techLevel: 7 }).Build(),
		new FactionBuilder({ name: "Cyborgs", description: "The sentient robotic race", techLevel: 10 }).Build(),
	];
};
const NODES = () => {
	return [
		new SpacemapNodeBuilder({
			name: "Gemini",
			requiredWarp: WarpPower.NONE,
			faction: Client.Reg.ResolveFactionFromName("Humans"),
		}).build(),
		new SpacemapNodeBuilder({
			name: "Scorpius",
			requiredWarp: WarpPower.LOW,
			faction: Client.Reg.ResolveFactionFromName("Alliance"),
		}).build(),
		new SpacemapNodeBuilder({
			name: "Grus",
			requiredWarp: WarpPower.MODERATE,
			faction: Client.Reg.ResolveFactionFromName("Cyborgs"),
		}).build(),
	];
};
