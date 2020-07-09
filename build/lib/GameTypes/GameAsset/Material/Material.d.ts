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
    private readonly options;
    constructor(options: IMaterialOptions);
    EnableSell(price: number): MaterialBuilder;
    EnableBuild(blueprint: Blueprint): MaterialBuilder;
    EnableMine(): MaterialBuilder;
    SetRarity(level: number): MaterialBuilder;
    Build(): Material;
}
interface IMaterialOptions extends IGameAssetOptions {
    /**If the material can be mined. Default: false */
    mineable?: boolean;
    /**The rarity of the material. Default: 1 */
    rarity?: number;
}
export {};
