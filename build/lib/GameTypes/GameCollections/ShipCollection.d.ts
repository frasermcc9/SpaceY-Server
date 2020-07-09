import { GameCollectionBase } from "./GameCollectionBase";
import { MapCollection } from "../../Extensions/Collections";
import { Ship } from "../GameAsset/Ship/Ship";
export declare class ShipCollection extends GameCollectionBase {
    constructor(options?: IShipCollectionOptions);
    /** @override */
    GetCompatibleItems(minRarity: number, maxRarity: number): MapCollection<string, Ship>;
    /** @override */
    GenerateWeights(items: Ship[], centralRarity: number, minRarity: number, maxRarity: number): number[];
}
export interface IShipCollectionOptions {
    data?: Map<string, number>;
}
