import { Faction } from "../GameAsset/Faction/Faction";
import { GameCollectionBase, ICompatible } from "./GameCollectionBase";
import { MapCollection } from "../../Extensions/Collections";
export declare class ReputationCollection extends GameCollectionBase {
    constructor(options?: IReputationCollectionOptions);
    /** @override */
    GetCompatibleItems({ minTech, maxTech }: ICompatible): MapCollection<string, Faction>;
    /** @override */
    GenerateWeights(items: Faction[], centralRarity: number, minRarity: number, maxRarity: number): number[];
}
export interface IReputationCollectionOptions {
    data?: Map<string, number>;
}
