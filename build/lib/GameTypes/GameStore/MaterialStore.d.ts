import { BaseStore } from "./BaseStore";
import { Material } from "../GameAsset/Material/Material";
import { MapCollection } from "../../Extensions/Collections";
import { GameCollectionBase } from "../GameCollections/GameCollectionBase";
import { GameAsset } from "../GameAsset/GameAsset";
export declare class MaterialStore extends BaseStore<Material> {
    private value;
    private rarity;
    private maxRarity;
    private minRarity;
    constructor({ value, rarity, maxRarity, minRarity, credits }: {
        value?: number;
        rarity?: boolean;
        maxRarity?: number;
        minRarity?: number;
        credits?: number;
    });
    private GenerateInventory;
    SetInventory(data: MapCollection<Material, number> | GameCollectionBase): void;
    GetItem(itemName: string): Material | undefined;
    GetCostOfItem(item: GameAsset): number | undefined;
    Sell(): void;
    Update(): void;
}
