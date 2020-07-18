import { BaseStore, BaseStoreOptions } from "./BaseStore";
export declare class MaterialStore extends BaseStore {
    private genValue?;
    private rarity;
    private minTech;
    private maxTech;
    private genCentralRarity;
    private minRarity;
    private maxRarity;
    constructor(options: IMaterialStoreOptions);
    populateInventory(): import("../GameCollections/GameCollectionBase").GameCollectionBase;
    editGenSettings(options: IGenOptions): void;
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
export {};
