import { BaseStore, BaseStoreOptions } from "./BaseStore";
import { Faction } from "../GameAsset/Faction/Faction";
export declare class ShipStore extends BaseStore {
    private faction;
    private maxToSell;
    constructor(options: IShipStoreOptions);
    populateInventory(): void;
    identity(): string;
}
interface IShipStoreOptions extends BaseStoreOptions {
    storeFaction: Faction;
    /**The max (but not necessarily the unique amount) of attachments to sell */
    maxToSell: number;
}
export {};
