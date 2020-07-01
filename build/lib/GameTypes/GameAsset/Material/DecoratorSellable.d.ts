import { MaterialDecorator } from "./MaterialDecorator";
import { Sellable, ISellInfo } from "../GameAsset";
import { Material } from "./Material";
export declare class MaterialDecoratorSellable extends MaterialDecorator implements Sellable {
    constructor(material: Material);
    GetCost(): ISellInfo;
}
