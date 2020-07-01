import { BaseStore } from "./BaseStore";
import { Material } from "../GameAsset/Material/Material";
import { MaterialCollection } from "../GameCollections/MaterialCollection";
import { MapCollection } from "../../Extensions/Collections";
import { GameCollectionBase } from "../GameCollections/GameCollectionBase";
export declare class MaterialStore extends MaterialCollection implements BaseStore<Material> {
    private value;
    private rarity;
    private maxRarity;
    private minRarity;
    constructor({ value, rarity, maxRarity, minRarity }: {
        value?: number;
        rarity?: boolean;
        maxRarity?: number;
        minRarity?: number;
    });
    private GenerateInventory;
    SetInventory(data: MapCollection<Material, number> | GameCollectionBase): void;
    Buy(): void;
    Sell(): void;
    Update(): void;
}
