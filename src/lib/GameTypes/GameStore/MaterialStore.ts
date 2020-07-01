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

	public constructor({ value, rarity, maxRarity, minRarity, credits }: { value?: number; rarity?: boolean; maxRarity?: number; minRarity?: number; credits?: number }) {
		super(credits ?? 0);
		this.value = value ?? 0;
		this.rarity = rarity ?? false;
		this.maxRarity = maxRarity ?? Client.Get().Registry.MaxRarity;
		this.minRarity = minRarity ?? 0;
	}

	private GenerateInventory(value: number = this.value, rarity: boolean = this.rarity, minRarity: number = this.minRarity, maxRarity: number = this.maxRarity): void {
		let currentPrice = 0;
		const CompatibleMaterials = Client.Get().Registry.MaterialRegistry.filter(
			(val) => val.Cost != undefined && val.GetMaterialRarity() <= maxRarity && val.GetMaterialRarity() >= minRarity
		);
		const MaterialNames = CompatibleMaterials.array();
		const Weights = CompatibleMaterials.array().map((val) => Client.Get().Registry.MaxRarity + 1 - val.GetMaterialRarity());
		let FlatArray = new Array<Material>();
		if (rarity)
			for (let i = 0; i < MaterialNames.length; ++i) {
				for (let j = 0; j < Weights[i]; ++j) {
					FlatArray.push(MaterialNames[i]);
				}
			}
		else {
			FlatArray = CompatibleMaterials.array();
		}
		do {
			const Selected = FlatArray[~~(Math.random() * FlatArray.length)];
			const Material = new SellableDecorator(Selected);
			const ExistingAmount = this.get(Selected.Name) || 0;
			this.set(Selected.Name, ExistingAmount + 1);
			currentPrice += Material.PriceData.cost ?? 0;
		} while (currentPrice < value);
	}

	public SetInventory(data: MapCollection<Material, number> | GameCollectionBase): void {
		if (data instanceof GameCollectionBase) {
			return this.SumCollection(data);
		}
		const stringData: GameCollectionBase = new MaterialCollection();
		data.forEach((val, key) => stringData.set(key.Name, val));
		return this.SumCollection(stringData);
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
		this.GenerateInventory(this.value, this.rarity, this.minRarity, this.maxRarity);
	}
}
