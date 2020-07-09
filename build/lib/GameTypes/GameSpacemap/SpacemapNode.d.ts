import { Faction } from "../GameAsset/Faction/Faction";
import { BaseStore } from "../GameStore/BaseStore";
import { Asteroid } from "../GameMechanics/Asteroid";
import { Player } from "../GameAsset/Player/Player";
import { MaterialStore } from "../GameStore/MaterialStore";
import { ShipStore } from "../GameStore/ShipStore";
import { AttachmentStore } from "../GameStore/AttachmentStore";
export declare class SpacemapNode {
    private name;
    private faction;
    private requiredWarp;
    private stores;
    private techLevel;
    private asteroids;
    constructor({ name, faction, requiredWarp, stores, techLevel, asteroids }: TSpaceMapNode);
    toString(): string;
    get Name(): string;
    get Faction(): Faction;
    get RequiredWarp(): WarpPower;
    get TechLevel(): number;
    get Asteroids(): Asteroid[];
    availableAsteroids(player: Player): Asteroid[];
    addStore(store: BaseStore): void;
    addAsteroid(asteroid: Asteroid): void;
    storeDisplayNames(): string[];
    nodeAllStores(): BaseStore[];
    nodeMaterialStores(): MaterialStore[];
    nodeShipStores(): ShipStore[];
    nodeAttachmentStores(): AttachmentStore[];
}
export declare class SpacemapNodeBuilder {
    private name;
    private faction;
    private requiredWarp;
    private stores;
    private techLevel?;
    private asteroids;
    constructor({ name, faction, requiredWarp }: {
        name: string;
        faction: Faction;
        requiredWarp: WarpPower;
    });
    addStore(store: BaseStore): this;
    addAsteroid(asteroid: Asteroid): this;
    build(): SpacemapNode;
}
export declare enum WarpPower {
    NONE = 0,
    LOW = 1,
    MODERATE = 2,
    HIGH = 3
}
declare type TSpaceMapNode = {
    name: string;
    faction: Faction;
    asteroids: Asteroid[];
    requiredWarp: WarpPower;
    stores: BaseStore[];
    techLevel?: number;
};
export {};
