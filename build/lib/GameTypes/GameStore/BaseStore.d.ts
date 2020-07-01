import { GameCollectionBase } from "../GameCollections/GameCollectionBase";
import { MapCollection } from "../../Extensions/Collections";
import { GameAsset } from "../GameAsset/GameAsset";
export interface BaseStore<K extends GameAsset> extends GameCollectionBase {
    SetInventory(data: GameCollectionBase): void;
    SetInventory(data: MapCollection<K, number>): void;
    Buy(): void;
    Sell(): void;
    Update(): void;
}
