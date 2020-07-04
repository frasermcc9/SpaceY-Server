import { Client } from "../lib/Client/Client";
import { Material, MaterialBuilder } from "../lib/GameTypes/GameAsset/Material/Material";
import { Blueprint, BlueprintBuilder } from "../lib/GameTypes/GameAsset/Blueprint/Blueprint";
import { Ship, ShipBuilder } from "../lib/GameTypes/GameAsset/Ship/Ship";
import { Faction, FactionBuilder } from "../lib/GameTypes/GameAsset/Faction/Faction";
import { Attachment, AttachmentBuilder, AttachmentType, AttachmentReport } from "../lib/GameTypes/GameAsset/Attachment/Attachment";
import { ShipWrapper } from "../lib/GameTypes/GameAsset/Ship/ShipWrapper";

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
		new ShipBuilder({ name: "Shuttle", description: "A small but agile ship" })
			.EnableSell(1500)
			.EnableBuildable(new BlueprintBuilder().AutoBuild({ value: 1000, rarity: true, minRarity: 0, maxRarity: 10, centralRarity: 3 }))
			.SetStats({ baseHp: 100, baseShield: 50 })
			.SetWeapons({ heavyCap: 3, primaryCap: 3, generalCap: 2 })
			.Build(),
		new ShipBuilder({ name: "Warship", description: "A medium sized vehicle" })
			.EnableSell(3000)
			.EnableBuildable(new BlueprintBuilder().AutoBuild({ value: 2550, rarity: true, minRarity: 0, maxRarity: 10, centralRarity: 5 }))
			.SetStats({ baseHp: 150, baseShield: 90, baseCargo: 750 })
			.Build(),
		new ShipBuilder({ name: "Destroyer", description: "A flagship destroyer" })
			.EnableSell(4500)
			.EnableBuildable(new BlueprintBuilder().AutoBuild({ value: 4000, rarity: true, minRarity: 0, maxRarity: 10, centralRarity: 7 }))
			.SetStats({ baseHp: 200, baseShield: 170, baseCargo: 8000 })
			.Build(),
	];
}
export function GENERATED_FACTIONS() {
	return [
		new FactionBuilder("Humans", "Like you and me", 4).Build(),
		new FactionBuilder("Alliance", "The great alliance of the galaxy", 7).Build(),
		new FactionBuilder("Cyborgs", "The sentient robotic race", 10).Build(),
	];
}
export function GENERATED_ATTACHMENTS() {
	const PlatingEquip: (friendly: ShipWrapper) => AttachmentReport = (friendly) => {
		friendly.incrementStatistics({ hp: 20 });
		return { message: `New Health: ${friendly.ShipStatistics.totalHp}` };
	};
	const PlatingUnequip: (friendly: ShipWrapper) => AttachmentReport = (friendly) => {
		friendly.decrementStatistics({ hp: 20 });
		return { message: `New Health: ${friendly.ShipStatistics.totalHp}` };
	};
	return [
		new AttachmentBuilder({ name: "Blaster", description: "Standard issue blaster", type: AttachmentType.PRIMARY, techLevel: 2 }).Build(),
		new AttachmentBuilder({ name: "Space Sword", description: "Not very practical", type: AttachmentType.HEAVY, techLevel: 1 }).Build(),
		new AttachmentBuilder({ name: "Obliterator", description: "This one will hurt", type: AttachmentType.HEAVY, techLevel: 6 }).Build(),
		new AttachmentBuilder({ name: "Iron Plating", description: "Tough metal", techLevel: 2, type: AttachmentType.GENERAL })
			.EquipFn(PlatingEquip)
			.UnequipFn(PlatingUnequip)
			.Build(),
	];
}
