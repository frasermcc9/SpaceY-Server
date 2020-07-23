import { Material } from "../GameAsset/Material/Material";
import { GameCollectionBase, ICompatible } from "./GameCollectionBase";
import { MapCollection } from "../../Extensions/Collections";
export declare class MaterialCollection extends GameCollectionBase {
    static WEIGHTS?: number[];
    constructor(options?: IMaterialCollectionOptions);
    /**@deprecated*/
    DataFromName(name: string): IMaterialQuantity;
    /**@deprecated*/
    DataFromNames(names: string[]): IMaterialQuantity[];
    /**@deprecated*/
    DataFromMaterial(material: Material): IMaterialQuantity;
    GetCollectionValue(): number;
    static GenerateMineableCollection(value: number, central?: number): MaterialCollection;
    private static GenerateMiningWeights;
    static RefreshMiningWeightCache(): void;
    /** @override */
    GetCompatibleItems({ minRarity, maxRarity, minTech, maxTech }: ICompatible): MapCollection<string, Material>;
    /** @override */
    GenerateWeights(items: Material[], centralRarity: number, minRarity: number, maxRarity: number): number[];
}
export interface IMaterialCollectionOptions {
    data?: Map<string, number>;
}
interface IMaterialQuantity {
    success: boolean;
    name: string;
    quantity: number;
    material: Material | null;
    error?: string;
}
export {};
