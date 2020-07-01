import { GameAsset, IGameAssetOptions } from "../GameAsset";
import { Blueprint } from "../Blueprint/Blueprint";
export declare class Material extends GameAsset implements IMaterial {
    private buildable;
    private mineable;
    private sellable;
    private cost;
    private rarity;
    private blueprint;
    constructor(materialOptions: IMaterialOptions);
    get Name(): string;
    get Description(): string;
    IsSellable(): boolean;
    IsMineable(): boolean;
    IsBuildable(): boolean;
    GetMaterialCost(): number | undefined;
    GetMaterialBlueprint(): Blueprint | undefined;
    GetMaterialRarity(): number;
}
export interface IMaterial {
    IsSellable(): boolean;
    IsMineable(): boolean;
    IsBuildable(): boolean;
    GetMaterialCost(): number | undefined;
    GetMaterialBlueprint(): Blueprint | undefined;
    GetMaterialRarity(): number;
}
export declare class MaterialBuilder {
    private buildable;
    private mineable;
    private sellable;
    private cost?;
    private blueprint?;
    private name;
    private description;
    private rarity?;
    constructor({ name, description }: {
        name: string;
        description: string;
    });
    EnableBuild(): MaterialBuilder;
    EnableMine(): MaterialBuilder;
    DisableSell(): MaterialBuilder;
    SetCost(cost: number): MaterialBuilder;
    SetBlueprint(blueprint: Blueprint): MaterialBuilder;
    SetRarity(level: number): MaterialBuilder;
    Build(): Material;
}
interface IMaterialOptions extends IGameAssetOptions {
    buildable: boolean;
    mineable: boolean;
    sellable: boolean;
    cost?: number;
    blueprint?: Blueprint;
    name: string;
    description: string;
    rarity?: number;
}
export {};
