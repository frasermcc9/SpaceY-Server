import { Client } from "../../Client/Client.ts";
import { Collection } from "../../Extensions/Collection.ts";
import { GameAsset } from "../GameAsset/GameAsset.ts";
import { Material, IMaterial } from "../GameAsset/Material/Material.ts";
import { MaterialDecoratorSellable } from "../GameAsset/Material/DecoratorSellable.ts";
import { util } from "../../Util/util.ts";

export class MaterialCollection extends Collection<Material, number> {
	private materialSet: Map<string, Material> = Client.Get().Registry.MaterialRegistry;

	public constructor(options?: IMaterialCollectionOptions) {
		super();
		//Create map with all empty material values, but set defined materials to the given value.
		if (options?.data) {
			this.materialSet.forEach((material) => {
				this.set(material, options.data?.get(material) || 0);
			});
		} else {
			this.materialSet.forEach((material) => {
				this.set(material, 0);
			});
		}
	}

	public DataFromName(name: string): IMaterialQuantity {
		const material = this.materialSet.get(name);
		if (material == undefined) return { success: false, name: name, quantity: -1, material: null, error: MAT_NOT_FOUND };

		const quantity = this.get(material);
		return { success: true, name: material.Name, quantity: quantity || 0, material: material };
	}

	public DataFromNames(names: string[]): IMaterialQuantity[] {
		let data = new Array<IMaterialQuantity>();
		names.forEach((name) => {
			const material = this.materialSet.get(name);
			if (material == undefined) {
				data.push({ success: false, name: name, quantity: -1, material: null, error: MAT_NOT_FOUND });
			} else {
				const quantity = this.get(material);
				data.push({ success: true, name: material.Name, quantity: quantity || 0, material: material });
			}
		});
		return data;
	}

	public DataFromMaterial(material: Material): IMaterialQuantity {
		const quantity = this.get(material);
		if (quantity == undefined) {
			return { success: false, name: material.Name, quantity: -1, material: null, error: MAT_NOT_FOUND };
		}
		return { success: true, name: material.Name, quantity: quantity || 0, material: material };
	}

	public static GenerateMineableCollection(value: number): MaterialCollection {
		const Template = Array.from(Client.Get().Registry.MineableMaterialRegistry.values());
		const ItemCount = Template.length;
		const Collection = new MaterialCollection();
		let currentPrice = 0;

		do {
			const Selected = util.chooseFrom<Material>(Template);
            const Material: IMaterial = new MaterialDecoratorSellable(Selected.item);
            const ExistingAmount = Collection.get(Selected.item);
			currentPrice += Material.GetMaterialCost() || 0;
			if (ExistingAmount) Collection.set(Selected.item, ExistingAmount + 1);
        } while (currentPrice < value);
        
		return Collection;
	}
}

export interface IMaterialCollectionOptions {
	data?: Map<Material, number>;
}

interface IMaterialQuantity {
	success: boolean;
	name: string;
	quantity: number;
	material: Material | null;
	error?: string;
}

const MAT_NOT_FOUND = "This material does not exist in the client collection.";
