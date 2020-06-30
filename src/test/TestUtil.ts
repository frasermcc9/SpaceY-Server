import { Client } from "../lib/Client/Client";
import { Material, MaterialBuilder } from "../lib/GameTypes/GameAsset/Material/Material";
import { Blueprint } from "../lib/GameTypes/GameAsset/Blueprint/Blueprint";
import { Ship } from "../lib/GameTypes/GameAsset/Buildable/Ship/Ship";
import { Faction } from "../lib/GameTypes/GameAsset/Faction/Faction";
import { Attachment } from "../lib/GameTypes/GameAsset/Buildable/Attachment/Attachment";

export function GenerateMaterialsForActiveClient() {
	const client = Client.Get();
	client.Registry.RegisterMaterials({ materials: GENERATED_MATERIALS });
}
export function GenerateShipsForActiveClient() {
	const client = Client.Get();
	client.Registry.RegisterShips({ ships: GENERATED_SHIPS });
}
export function GenerateFactionsForActiveClient() {
	const client = Client.Get();
	client.Registry.RegisterFactions({ factions: GENERATED_FACTIONS });
}
export function GenerateAttachmentsForActiveClient() {
	const client = Client.Get();
	client.Registry.RegisterAttachments({ attachments: GENERATED_ATTACHMENTS });
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
export const GENERATED_MATERIALS = [
	new MaterialBuilder({ name: "Iron", description: "A small iron nugget." }).SetCost(25).SetBlueprint(new Blueprint()).EnableMine().Build(),
	new MaterialBuilder({ name: "Gold", description: "A small gold nugget." }).SetCost(75).SetBlueprint(new Blueprint()).EnableMine().Build(),
	new MaterialBuilder({ name: "Food", description: "Food for one person." }).SetCost(5).SetBlueprint(new Blueprint()).Build(),
	new MaterialBuilder({ name: "Tech", description: "Pile of tech pieces." }).SetCost(50).SetBlueprint(new Blueprint()).Build(),
];
export const GENERATED_SHIPS = [
	new Ship({ description: "A small but agile ship", name: "Shuttle" }),
	new Ship({ description: "A medium sized vehicle", name: "Warship" }),
	new Ship({ description: "A flagship destroyer", name: "Destroyer" }),
];
export const GENERATED_FACTIONS = [
	new Faction({ description: "Like you. And me.", name: "Humans" }),
	new Faction({ description: "The great alliance of the galaxy", name: "Alliance" }),
	new Faction({ description: "The sentient robotic race", name: "Cyborgs" }),
];
export const GENERATED_ATTACHMENTS = [
	new Attachment({ name: "Blaster", description: "Standard Issue Blaster" }),
	new Attachment({ name: "Space Sword", description: "Not very practical" }),
	new Attachment({ name: "Obliterator", description: "Quite scary, really" }),
];
