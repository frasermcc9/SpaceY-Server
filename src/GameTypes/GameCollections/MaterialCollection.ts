import { BaseMaterial } from "../GameAsset/Buildable/Material/BaseMaterial.ts";
import { Client } from "../../Client/Client.ts";

export class MaterialCollection {
	private materialSet: Map<string, BaseMaterial> = Client.GetClient().Registry.MaterialRegistry;
	private materialInventory: Map<BaseMaterial, number> = new Map();

	public constructor(options: MaterialCollectionOptions) {
		if (!(options.data || options.emptyCollection)) console.warn("A MaterialCollection was instantiated with no arguments. Defaulting to empty collection.");
		if (options.data) {
		}
		this.materialSet.forEach((material) => {
			this.materialInventory.set(material, 0);
		});
	}

	public GetAmountFromName(name: string): MaterialQuantity {
		const material = this.materialSet.get(name);
		if (material == undefined) return { success: false, name: "None", quantity: -1, material: null };
		const quantity = this.materialInventory.get(material);
		return { success: true, name: material.Name, quantity: quantity || 0, material: material };
	}
}

interface MaterialCollectionOptions {
	emptyCollection?: boolean;
	data?: Map<BaseMaterial, number>;
}

interface MaterialQuantity {
	success: boolean;
	name: string;
	quantity: number;
	material: BaseMaterial | null;
}
