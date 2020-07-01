import { Material, IMaterial } from "./Material";
import { Blueprint } from "../Blueprint/Blueprint";
export declare abstract class MaterialDecorator implements IMaterial {
    protected material: Material;
    constructor(material: Material);
    get Name(): string;
    get Description(): string;
    IsSellable(): boolean;
    IsMineable(): boolean;
    IsBuildable(): boolean;
    GetMaterialCost(): number | undefined;
    GetMaterialBlueprint(): Blueprint | undefined;
    GetMaterialRarity(): number;
}
