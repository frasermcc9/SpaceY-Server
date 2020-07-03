import { Client } from "../lib/Client/Client";
import { Material, MaterialBuilder } from "../lib/GameTypes/GameAsset/Material/Material";
import { Blueprint, BlueprintBuilder } from "../lib/GameTypes/GameAsset/Blueprint/Blueprint";
import { Ship } from "../lib/GameTypes/GameAsset/Ship/Ship";
import { Faction } from "../lib/GameTypes/GameAsset/Faction/Faction";
import { Attachment } from "../lib/GameTypes/GameAsset/Attachment/Attachment";

export function GenerateMaterialsForActiveClient() {
	const client = Client.Get();
	client.Registry.RegisterMaterials({ materials: GENERATED_MATERIALS() });
}
export function GenerateShipsForActiveClient() {
	const client = Client.Get();
	client.Registry.RegisterShips({ ships: GENERATED_SHIPS() });
}
export function GenerateFactionsForActiveClient() {
	const client = Client.Get();
	client.Registry.RegisterFactions({ factions: GENERATED_FACTIONS() });
}
export function GenerateAttachmentsForActiveClient() {
	const client = Client.Get();
	client.Registry.RegisterAttachments({ attachments: GENERATED_ATTACHMENTS() });
}

export function GenerateClientSet() {
	GenerateMaterialsForActiveClient();
	GenerateShipsForActiveClient();
	GenerateFactionsForActiveClient();
	GenerateAttachmentsForActiveClient();
}
/**
 * Iron, Gold, Food, Tech
 */
export function GENERATED_MATERIALS() {
	return [
		new MaterialBuilder({ name: "Iron", description: "A small iron nugget." }).EnableSell(25).EnableMine().SetRarity(4).Build(),
		new MaterialBuilder({ name: "Gold", description: "A small gold nugget." }).EnableSell(75).EnableMine().SetRarity(10).Build(),
		new MaterialBuilder({ name: "Food", description: "Food for one person." }).EnableSell(5).SetRarity(1).Build(),
		new MaterialBuilder({ name: "Tech", description: "Pile of tech pieces." }).EnableSell(50).SetRarity(6).Build(),
	];
}
export function GENERATED_SHIPS() {
	return [
		new Ship({
			description: "A small but agile ship",
			name: "Shuttle",
			blueprint: new BlueprintBuilder().AutoBuild({ value: 1000, rarity: true, minRarity: 0, maxRarity: 10, centralRarity: 3 }),
			cost: 1500,
		}),
		new Ship({ description: "A medium sized vehicle", name: "Warship" }),
		new Ship({ description: "A flagship destroyer", name: "Destroyer" }),
	];
}
export function GENERATED_FACTIONS() {
	return [
		new Faction({ description: "Like you. And me.", name: "Humans", techLevel: 4 }),
		new Faction({ description: "The great alliance of the galaxy", name: "Alliance", techLevel: 7 }),
		new Faction({ description: "The sentient robotic race", name: "Cyborgs", techLevel: 10 }),
	];
}
export function GENERATED_ATTACHMENTS() {
	return [
		new Attachment({ name: "Blaster", description: "Standard Issue Blaster" }),
		new Attachment({ name: "Space Sword", description: "Not very practical" }),
		new Attachment({ name: "Obliterator", description: "Quite scary, really" }),
	];
}
