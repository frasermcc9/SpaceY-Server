import { Material } from "../GameAsset/Material/Material";
import { GameCollectionBase } from "./GameCollectionBase";
export declare class MaterialCollection extends GameCollectionBase {
    constructor(options?: IMaterialCollectionOptions);
    DataFromName(name: string): IMaterialQuantity;
    DataFromNames(names: string[]): IMaterialQuantity[];
    DataFromMaterial(material: Material): IMaterialQuantity;
    GetCollectionValue(): number;
    static GenerateMineableCollection(value: number): MaterialCollection;
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
