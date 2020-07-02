import { BaseStore } from "./BaseStore";
import { Material } from "../GameAsset/Material/Material";
import { MaterialCollection } from "../GameCollections/MaterialCollection";
import { Client } from "../../main";
import { MapCollection } from "../../Extensions/Collections";
import { GameCollectionBase } from "../GameCollections/GameCollectionBase";
import { GameAsset } from "../GameAsset/GameAsset";
import { SellableDecorator } from "../GameAsset/AssetDecorators";

export class MaterialStore extends BaseStore<Material> {
	private value: number;
	private rarity: boolean;
	private maxRarity: number;
	private minRarity: number;
	private centralRarity: number;

	public constructor({
		value,
		rarity,
		maxRarity,
		minRarity,
		credits,
		centralRarity,
	}: {
		value?: number;
		rarity?: boolean;
		maxRarity?: number;
		minRarity?: number;
		credits?: number;
		centralRarity?: number;
	}) {
		super(credits ?? 0);
		this.value = value ?? 0;
		this.rarity = rarity ?? false;
		this.maxRarity = maxRarity ?? Client.Get().Registry.MaxRarity;
		this.minRarity = minRarity ?? 0;
		this.centralRarity = centralRarity ?? 0;
	}

	public GenerateInventory() {
		return super.GenerateCollection({ value: this.value, rarity: this.rarity, minRarity: this.minRarity, maxRarity: this.maxRarity, centralRarity: this.centralRarity });
	}
	/** @override */
	public GetCompatibleItems(minRarity: number, maxRarity: number): MapCollection<string, Material> {
		return Client.Reg.MaterialRegistry.filter((val) => val.Cost != undefined && val.GetMaterialRarity() <= maxRarity && val.GetMaterialRarity() >= minRarity);
	}

	/** @override */
	public GenerateWeights(items: Material[], centralRarity: number, minRarity: number, maxRarity: number): number[] {
		return items.map((val) => (maxRarity-minRarity+1) - Math.abs(centralRarity - val.GetMaterialRarity()) + 1);
	}

	public GetItem(itemName: string): Material | undefined {
		return Client.Get().Registry.ResolveMaterialFromName(itemName);
	}
	public GetCostOfItem(item: GameAsset): number | undefined {
		return new SellableDecorator(item).PriceData.cost;
	}

	public Sell(): void {}

	public Update(): void {
		this.clear();
		this.GenerateInventory();
	}
}
