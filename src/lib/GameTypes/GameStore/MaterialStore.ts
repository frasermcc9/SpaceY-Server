import { BaseStore, StoreType, BaseStoreOptions } from "./BaseStore";
import { MaterialCollection } from "../GameCollections/MaterialCollection";
import { Client } from "../../main";
import { IGenerationOptions } from "../GameCollections/GameCollectionBase";

export class MaterialStore extends BaseStore {
    private genValue?: number;

    private rarity: boolean = true;
    private minTech: number;
    private maxTech: number;

    private genCentralRarity: number;
    private minRarity: number;
    private maxRarity: number;

    public constructor(options: IMaterialStoreOptions) {
        super(new MaterialCollection(), options);
        this.genValue = options.generationValue;

        this.minTech = options.minTech ?? 0;
        this.maxTech = options.maxTech ?? Client.Reg.MaxTech;
        this.minRarity = options.minRarity ?? 0;
        this.maxRarity = options.maxRarity ?? Client.Reg.MaxRarity;
        this.genCentralRarity = options.centralRarity ?? (this.maxTech - this.minTech) / 2;

        this.rarity = options.enableRarityEffects ?? true;
    }

    public populateInventory() {
        if (this.genValue == undefined) throw new Error("Cannot generate inventory of MaterialStore that had no value option passed.");
        return this.collection.GenerateCollection({
            value: this.genValue,
            minTech: this.minTech,
            maxTech: this.maxTech,
            minRarity: this.minRarity,
            maxRarity: this.maxRarity,
            centralRarity: this.genCentralRarity,
            rarity: this.rarity,
        });
    }

    public editGenSettings(options: IGenOptions) {
        this.genValue = options.generationValue ?? this.genValue;
        this.minTech = options.minTech ?? this.minTech;
        this.maxTech = options.maxTech ?? this.maxTech;
        this.genCentralRarity = options.centralRarity ?? this.genCentralRarity;
        this.rarity = options.enableRarityEffects ?? this.rarity;
    }

    public identity():string{
        return `${this.Name}: Resource Store`
    }
}

interface IMaterialStoreOptions extends BaseStoreOptions, IGenOptions {}

interface IGenOptions {
    /**The minimum value of the collection*/
    generationValue?: number;
    /**If item rarity should effect the inventory generation frequencies*/
    enableRarityEffects?: boolean;
    /**The minimum tech an item must be to appear (independent from rarity property)*/
    minTech?: number;
    /**The maximum tech an item can be to appear (independent from rarity property)*/
    maxTech?: number;
    /**The most common rarity to generate (i.e. if this is 5, then 5 will be the most common generation).
     * Only used if rarity is enabled.*/
    centralRarity?: number;
    /**The minimum rarity of items that should be generated */
    minRarity?: number;
    /**the maximum rarity of items that should be generated */
    maxRarity?: number;
}
