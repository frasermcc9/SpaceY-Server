import { Client } from "../lib/Client/Client.ts";
import { BaseMaterial } from "../lib/GameTypes/GameAsset/Buildable/Material/BaseMaterial.ts";

export function GenerateMaterialsForActiveClient() {
	const client = Client.Get();
	client.Registry.RegisterMaterials({ materials: GENERATED_MATERIALS });
}
/**
 * Iron, Gold, Food, Tech
 */
export const GENERATED_MATERIALS = [
	new BaseMaterial({ name: "Iron", description: "A small iron nugget." }),
	new BaseMaterial({ name: "Gold", description: "A small gold nugget." }),
	new BaseMaterial({ name: "Food", description: "Food for one person." }),
	new BaseMaterial({ name: "Tech", description: "Pile of tech pieces." }),
];
