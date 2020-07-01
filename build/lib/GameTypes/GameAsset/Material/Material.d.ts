import { GameAsset, IGameAssetOptions, IGameAsset } from "../GameAsset";
import { Blueprint } from "../Blueprint/Blueprint";
export declare class Material extends GameAsset implements IMaterial {
    private mineable;
    private rarity;
    constructor(materialOptions: IMaterialOptions);
    IsMineable(): boolean;
    GetMaterialRarity(): number;
}
export interface IMaterial extends IGameAsset {
    IsMineable(): boolean;
    GetMaterialRarity(): number;
}
export declare class MaterialBuilder {
    private name;
    private description;
    private cost?;
    private blueprint?;
    private mineable;
    private rarity?;
    constructor({ name, description }: {
        name: string;
        description: string;
    });
    EnableSell(price: number): MaterialBuilder;
    EnableBuild(blueprint: Blueprint): MaterialBuilder;
    EnableMine(): MaterialBuilder;
    SetRarity(level: number): MaterialBuilder;
    Build(): Material;
}
interface IMaterialOptions extends IGameAssetOptions {
    mineable: boolean;
    rarity?: number;
    name: string;
    description: string;
    cost?: number;
    blueprint?: Blueprint;
}
export {};
