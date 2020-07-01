import { GameCollectionBase } from "../GameCollections/GameCollectionBase";
import { MapCollection } from "../../Extensions/Collections";
import { GameAsset } from "../GameAsset/GameAsset";
import { Player } from "../GameAsset/Player/Player";
export declare abstract class BaseStore<K extends GameAsset> extends GameCollectionBase {
    protected credits: number;
    get Credits(): number;
    constructor(credits: number);
    abstract SetInventory(data: GameCollectionBase): void;
    abstract SetInventory(data: MapCollection<K, number>): void;
    Buy({ buyer, item, quantity }: {
        buyer: Player;
        item: string;
        quantity: number;
    }): Promise<IBuyResult>;
    /**
     * Abstract step for the Buy() method.
     * @param itemName string name of the item
     */
    abstract GetItem(itemName: string): GameAsset | undefined;
    abstract GetCostOfItem(item: GameAsset): number | undefined;
    abstract Sell(): void;
    abstract Update(): void;
}
export interface IBuyResult {
    success: boolean;
    amount: number;
    code: 1 | 2 | 3 | 4 | 5 | 6 | 7;
    error?: string | undefined;
}
