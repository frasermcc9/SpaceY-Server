import { BaseStore, BaseStoreOptions } from "./BaseStore";
export declare class MaterialStore extends BaseStore {
    private genValue?;
    private genMinRarity;
    private genMaxRarity;
    private genCentralRarity;
    private rarity;
    constructor(options: IMaterialStoreOptions);
    populateInventory(): import("../GameCollections/GameCollectionBase").GameCollectionBase;
    editGenSettings(options: IGenOptions): void;
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
export {};
