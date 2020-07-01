import { GameCollectionBase } from "./GameCollectionBase";
export declare class ShipCollection extends GameCollectionBase {
    constructor(options?: IShipCollectionOptions);
}
export interface IShipCollectionOptions {
    data?: Map<string, number>;
}
