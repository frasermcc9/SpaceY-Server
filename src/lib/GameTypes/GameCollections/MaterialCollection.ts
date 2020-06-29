import { Client } from "../../Client/Client";
import { util } from "../../Util/util";
import { MaterialDecoratorSellable } from "../GameAsset/Material/DecoratorSellable";
import { IMaterial, Material } from "../GameAsset/Material/Material";
import { GameCollectionBase } from "./GameCollectionBase";

export class MaterialCollection extends GameCollectionBase {
	public constructor(options?: IMaterialCollectionOptions) {
		super();
		//Create map with all empty material values, but set defined materials to the given value.
		if (options?.data) {
			Client.Get().Registry.MaterialRegistry.forEach((material) => {
				this.set(material.Name, options.data?.get(material.Name) || 0);
			});
		} else {
			Client.Get().Registry.MaterialRegistry.forEach((material) => {
				this.set(material.Name, 0);
			});
		}
	}

	public DataFromName(name: string): IMaterialQuantity {
		const material = Client.Get().Registry.MaterialRegistry.get(name);
		if (material == undefined) return { success: false, name: name, quantity: -1, material: null, error: MAT_NOT_FOUND };

		const quantity = this.get(material.Name);
		return { success: true, name: material.Name, quantity: quantity || 0, material: material };
	}

	public DataFromNames(names: string[]): IMaterialQuantity[] {
		let data = new Array<IMaterialQuantity>();
		names.forEach((name) => {
			const material = Client.Get().Registry.MaterialRegistry.get(name);
			if (material == undefined) {
				data.push({ success: false, name: name, quantity: -1, material: null, error: MAT_NOT_FOUND });
			} else {
				const quantity = this.get(material.Name);
				data.push({ success: true, name: material.Name, quantity: quantity || 0, material: material });
			}
		});
		return data;
	}

	public DataFromMaterial(material: Material): IMaterialQuantity {
		const quantity = this.get(material.Name);
		if (quantity == undefined) {
			return { success: false, name: material.Name, quantity: -1, material: null, error: MAT_NOT_FOUND };
		}
		return { success: true, name: material.Name, quantity: quantity || 0, material: material };
	}

	public static GenerateMineableCollection(value: number): MaterialCollection {
		const Template = Array.from(Client.Get().Registry.MineableMaterialRegistry.values());
		const ItemCount = Template.length;
		const MineableCollection = new MaterialCollection();
		let currentPrice = 0;

		do {
			const Selected = util.chooseFrom<Material>(Template);
			const Material: IMaterial = new MaterialDecoratorSellable(Selected.item);
			const ExistingAmount = MineableCollection.get(Selected.item.Name);
			currentPrice += Material.GetMaterialCost() || 0;
			if (ExistingAmount) MineableCollection.set(Selected.item.Name, ExistingAmount + 1);
		} while (currentPrice < value);

		return MineableCollection;
	}
}

export interface IMaterialCollectionOptions {
	data?: Map<string, number>;
}

interface IMaterialQuantity {
	success: boolean;
	name: string;
	quantity: number;
	material: Material | null;
	error?: string;
}

const MAT_NOT_FOUND = "This material does not exist in the client collection.";
