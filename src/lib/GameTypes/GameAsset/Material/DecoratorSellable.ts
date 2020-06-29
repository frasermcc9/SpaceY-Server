import { MaterialDecorator } from "./MaterialDecorator";
import { Sellable, ISellInfo } from "../GameAsset";
import { Material } from "./Material";

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
