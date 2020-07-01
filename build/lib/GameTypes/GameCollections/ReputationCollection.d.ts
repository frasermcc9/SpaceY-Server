import { GameCollectionBase } from "./GameCollectionBase";
export declare class ReputationCollection extends GameCollectionBase {
    private factionSet;
    constructor(options?: IReputationCollectionOptions);
}
export interface IReputationCollectionOptions {
    data?: Map<string, number>;
}
