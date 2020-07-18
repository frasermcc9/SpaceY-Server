import { GameCollectionBase } from "../GameCollections/GameCollectionBase";
import { MapCollection } from "../../Extensions/Collections";
import { Player } from "../GameAsset/Player/Player";
import { IMarketForces } from "../GameAsset/AssetDecorators";
import { Faction } from "../GameAsset/Faction/Faction";
export declare abstract class BaseStore implements IStoreUpdatable {
    protected collection: GameCollectionBase;
    protected credits: number;
    get Credits(): number;
    protected readonly storeType: StoreType;
    protected manualEnabled: boolean;
    protected manualInventory: MapCollection<string, number>;
    protected readonly name: string;
    protected readonly initCredits: number;
    protected readonly marketForces: boolean;
    protected marketForceSettings: IMarketForces;
    set MarketForceSettings(options: { randEffect?: number; loTechEffect?: number; hiTechEffect?: number });
    constructor(collection: GameCollectionBase, options: BaseStoreOptions);
    setFaction(faction: Faction): void;
    /**
     * Buys from the store, removing it from the store collection and into the
     * player.
     * @param TradeOptions type
     * @returns codes <br />  \
     * 200: Success<br />  \
     * 400: Invalid input, check quantity signs<br />  \
     * 404: Not found, no item could be found for the given name<br />  \
     * 405: Cannot buy item, the item provided cannot be bought<br />  \
     * 403: Not allowed, the store or player has insufficient resource<br />  \
     * 500: Unknown server error
     */
    buyFromStore({ trader, item, quantity }: TradeOptions): Promise<TradeOutput>;
    /**
     * Sells from the store, removing it from the player into the store.
     * @param TradeOptions type
     * @returns codes <br />  \
     * 200: Success<br />  \
     * 400: Invalid input, check quantity signs<br />  \
     * 404: Not found, no item could be found for the given name<br />  \
     * 405: Cannot buy item, the item provided cannot be bought<br />  \
     * 403: Not allowed, the store or player has insufficient resource<br />  \
     * 500: Unknown server error
     */
    sellToStore({ trader, item, quantity }: TradeOptions): Promise<TradeOutput>;
    /**
     * Sells from the store, removing it from the player into the store. **Will
     * execute even if the store has insufficient credits to buy. The player
     * will only be compensated for the credits held by the store.**
     * @param TradeOptions type
     * @returns codes <br />  \
     * 200: Success<br />  \
     * 400: Invalid input, check quantity signs<br />  \
     * 404: Not found, no item could be found for the given name<br />  \
     * 405: Cannot buy item, the item provided cannot be bought<br />  \
     * 403: Not allowed, the store or player has insufficient resource<br />  \
     * 500: Unknown server error
     */
    sellToStoreForce({ trader, item, quantity }: TradeOptions): Promise<TradeOutput>;
    getCostPerItem(item: string): number | undefined;
    getCollectionValue(): number;
    /**@deprecated */
    GetCollectionValue(): number;
    /**
     * Gets items in the store
     * @returns Map<item name, amount available>
     */
    getStoreItems(includeEmpty?: boolean): MapCollection<string, number>;
    /**
     * Gets costs of items in the store
     * @returns Map<item name, cost>
     */
    get StoreItemCosts(): MapCollection<string, number>;
    isType(type: StoreType): boolean;
    update(): void;
    generateInventory(): void;
    get Name(): string;
    get Faction(): Faction | undefined;
    abstract populateInventory(): void;
    /**
     * Clears the current inventory, and sets it to what is given in the input parameter.
     * @param data
     */
    setInventory(data: Map<string, number>): void;
    identity(): string;
    INTERNAL_AlterItem(item: string, n: number): void;
    INTERNAL_GetCollection(): GameCollectionBase;
}
declare type TradeOutput = {
    /**The number of credits the player has */
    playerCredits?: number;
    /**The quantity of the item the player now has */
    itemAmount?: number;
    /**The code of the output */
    code: 200 | 400 | 404 | 405 | 403 | 500;
};
declare type TradeOptions = {
    /**The player trading */
    trader: Player;
    /**The name of the item to be traded */
    item: string;
    /**The amount to be traded */
    quantity: number;
};
export declare type BaseStoreOptions = {
    /**Name of the store (for displays) */
    storeName: string;
    /**The default number of credits*/
    initialCredits: number;
    /**The type of the store */
    type: StoreType;
    /**Whether to enable *market forces*, fluctuations to prices based on tech
     * level and randomness */
    marketForces?: boolean;
};
export interface IStoreUpdatable {
    update(): void;
}
export declare enum StoreType {
    BASE = 0,
    MATERIAL_STORE = 1,
    SHIP_STORE = 2,
    ATTACHMENT_STORE = 3,
}
export {};
