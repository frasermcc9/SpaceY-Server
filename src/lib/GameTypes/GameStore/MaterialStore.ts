import { BaseStore, StoreType, BaseStoreOptions } from "./BaseStore";
import { MaterialCollection } from "../GameCollections/MaterialCollection";
import { Client } from "../../main";
import { IGenerationOptions } from "../GameCollections/GameCollectionBase";

export class MaterialStore extends BaseStore {
	private genValue?: number;
	private genMinRarity: number;
	private genMaxRarity: number;
	private genCentralRarity: number;
	private rarity: boolean = true;

	public constructor(options: IMaterialStoreOptions) {
		super(new MaterialCollection(), options);
		this.genValue = options.generationValue;
		this.genMinRarity = options.minRarity ?? 0;
		this.genMaxRarity = options.maxRarity ?? Client.Reg.MaxRarity;
		this.genCentralRarity = options.centralRarity ?? (this.genMaxRarity - this.genMinRarity) / 2;
		this.rarity = options.enableRarityEffects ?? true;
	}

	public populateInventory() {
		if (this.genValue == undefined)
			throw new Error("Cannot generate inventory of MaterialStore that had no value option passed.");
		return this.collection.GenerateCollection({
			value: this.genValue,
			minRarity: this.genMinRarity,
			maxRarity: this.genMaxRarity,
			centralRarity: this.genCentralRarity,
			rarity: this.rarity,
		});
	}

	public editGenSettings(options: IGenOptions) {
		this.genValue = options.generationValue ?? this.genValue;
		this.genMinRarity = options.minRarity ?? this.genMinRarity;
		this.genMaxRarity = options.maxRarity ?? this.genMaxRarity;
		this.genCentralRarity = options.centralRarity ?? this.genCentralRarity;
		this.rarity = options.enableRarityEffects ?? this.rarity;
	}
}

interface IMaterialStoreOptions extends BaseStoreOptions {
	generationValue?: number;
	minRarity?: number;
	maxRarity?: number;
	centralRarity?: number;
	enableRarityEffects?: boolean;
}

interface IGenOptions {
	/**The minimum value of the collection*/
	generationValue?: number;
	/**If item rarity should effect the inventory generation frequencies*/
	enableRarityEffects?: boolean;
	/**The minimum rarity an item must be to appear (independent from rarity property)*/
	minRarity?: number;
	/**The maximum rarity an item can be to appear (independent from rarity property)*/
	maxRarity?: number;
	/**The most common rarity to generate (i.e. if this is 5, then 5 will be the most common generation).
	 * Only used if rarity is enabled.*/
	centralRarity?: number;
}
