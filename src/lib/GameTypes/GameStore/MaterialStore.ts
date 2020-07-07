import { BaseStore, StoreType, BaseStoreOptions } from "./BaseStore";
import { MaterialCollection } from "../GameCollections/MaterialCollection";
import { Client } from "../../main";

export class MaterialStore extends BaseStore {
	private genValue?: number;
	private genMinRarity: number;
	private genMaxRarity: number;
	private genCentralRarity: number;

	public constructor(options: IMaterialStoreOptions) {
		super(new MaterialCollection(), options);
		this.genValue = options.value;
		this.genMinRarity = options.minRarity ?? 0;
		this.genMaxRarity = options.maxRarity ?? Client.Reg.MaxRarity;
		this.genCentralRarity = options.centralRarity ?? (this.genMaxRarity - this.genMinRarity) / 2;
	}

	public update() {
		if (this.credits < this.initCredits) {
			this.credits = this.initCredits;
		}
		this.GenerateInventory();
	}
	/**@deprecated */
	public GenerateInventory() {
		return this.generateInventory();
	}
	public generateInventory() {
		if (this.genValue == undefined)
			throw new Error("Cannot generate inventory of MaterialStore that had no value option passed.");
		return this.collection.GenerateCollection({
			value: this.genValue,
			minRarity: this.genMinRarity,
			maxRarity: this.genMaxRarity,
			centralRarity: this.genCentralRarity,
			rarity: true,
		});
	}
}

interface IMaterialStoreOptions extends BaseStoreOptions {
	value?: number;
	minRarity?: number;
	maxRarity?: number;
	centralRarity?: number;
}
