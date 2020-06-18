import { MaterialDecorator } from "./MaterialDecorator.ts";
import { Sellable, ISellInfo } from "../../GameAsset.ts";
import { Material } from "./Material.ts";

export class MaterialDecoratorSellable extends MaterialDecorator implements Sellable {
	public constructor(material: Material) {
		super(material);
		if (!material.IsSellable()) console.warn("Material that is not sellable is being instantiated as a sellable material.");
	}

	public GetCost(): ISellInfo {
		const cost = this.GetMaterialCost();
		if (cost) {
			return { success: true, cost: cost };
		}
		console.warn("Material that is not sellable has no attribute cost.");
		return { success: false, cost: undefined };
	}
}
