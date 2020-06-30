import { MaterialDecorator } from "./MaterialDecorator";
import { Sellable, ISellInfo } from "../GameAsset";
import { Material } from "./Material";
import { Client } from "../../../Client/Client";

export class MaterialDecoratorSellable extends MaterialDecorator implements Sellable {
	public constructor(material: Material) {
		super(material);
		if (!material.IsSellable() && Client.Get().ConsoleLogging) console.warn("Material that is not sellable is being instantiated as a sellable material.");
	}

	public GetCost(): ISellInfo {
		const cost = this.GetMaterialCost();
		if (cost) {
			return { success: true, cost: cost };
		}
		if (Client.Get().ConsoleLogging) console.warn("Material that is not sellable has no attribute cost.");
		return { success: false, cost: undefined };
	}
}
