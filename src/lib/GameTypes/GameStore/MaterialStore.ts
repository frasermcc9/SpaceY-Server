import { BaseStore } from "./BaseStore";
import { Material, IMaterial } from "../GameAsset/Material/Material";
import { MaterialCollection } from "../GameCollections/MaterialCollection";
import { Client } from "../../main";
import { MaterialDecoratorSellable } from "../GameAsset/Material/DecoratorSellable";
import { MapCollection } from "../../Extensions/Collections";
import { GameCollectionBase } from "../GameCollections/GameCollectionBase";

export class MaterialStore extends MaterialCollection implements BaseStore<Material> {
	private value: number;
	private rarity: boolean;
	private maxRarity: number;
	private minRarity: number;

	public constructor({ value, rarity, maxRarity, minRarity }: { value?: number; rarity?: boolean; maxRarity?: number; minRarity?: number }) {
		super();
		this.value = value || 0;
		this.rarity = rarity || false;
		this.maxRarity = maxRarity || Client.Get().Registry.MaxRarity;
		this.minRarity = minRarity || 0;
	}

	private GenerateInventory(value: number = this.value, rarity: boolean = this.rarity, minRarity: number = this.minRarity, maxRarity: number = this.maxRarity): void {
		let currentPrice = 0;
		const CompatibleMaterials = Client.Get().Registry.MaterialRegistry.filter(
			(val) => val.IsSellable() && val.GetMaterialRarity() <= maxRarity && val.GetMaterialRarity() >= minRarity
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
			const Material: IMaterial = new MaterialDecoratorSellable(Selected);
			const ExistingAmount = this.get(Selected.Name) || 0;
			this.set(Selected.Name, ExistingAmount + 1);
			currentPrice += Material.GetMaterialCost() || 0;
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

	public Buy(): void {}
	public Sell(): void {}

	public Update(): void {
		this.clear();
		this.GenerateInventory(this.value, this.rarity, this.minRarity, this.maxRarity);
	}
}
