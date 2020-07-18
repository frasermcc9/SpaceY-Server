import { GameAsset, IGameAsset, IGameAssetOptions } from "../GameAsset";
import { Blueprint } from "../Blueprint/Blueprint";
import { AttachmentType } from "../Attachment/Attachment";
import { StrengthComparable } from "../AssetDecorators";
export declare class Ship extends GameAsset implements IShip, StrengthComparable {
    private subclass;
    private baseHp;
    private baseShield;
    private baseEnergy;
    private baseCargo;
    private baseHandling;
    private strength;
    private maxTech;
    private AttachmentCaps;
    private imageUri;
    constructor(options: ShipOptions);
    stringify(): string;
    get Strength(): number;
    get MaxTech(): number;
    get ImageUri(): string;
    get Subclass(): string;
    get WeaponCapacities(): Map<AttachmentType, number>;
    get ShipStatistics(): {
        baseHp: number;
        baseShield: number;
        baseEnergy: [number, number, number];
        baseCargo: number;
        baseHandling: number;
    };
}
export interface IShip extends IGameAsset {
    Subclass: string;
    TechLevel: number;
    ImageUri: string;
    WeaponCapacities: Map<AttachmentType, number>;
    ShipStatistics: {
        baseHp: number;
        baseShield: number;
        baseEnergy: number[];
        baseCargo: number;
        baseHandling: number;
    };
}
export declare class ShipBuilder {
    private readonly options;
    constructor(options: ShipOptions);
    EnableSell(price: number): ShipBuilder;
    SetMisc({ uri, subclass }: { uri?: string; subclass?: string }): this;
    EnableBuildable(blueprint: Blueprint): ShipBuilder;
    SetStats(stats: ShipStats): ShipBuilder;
    SetWeapons(weapons: WeaponOptions): ShipBuilder;
    Build(): Ship;
}
interface ShipOptions extends IGameAssetOptions, ShipStats, WeaponOptions {
    subclass?: string;
    imageUri?: string;
}
interface ShipStats {
    baseHp?: number;
    baseShield?: number;
    baseEnergy?: [number, number, number];
    baseCargo?: number;
    baseHandling?: number;
}
interface WeaponOptions {
    primaryCap?: number;
    shieldCap?: number;
    heavyCap?: number;
    minerCap?: number;
    generalCap?: number;
}
export {};
