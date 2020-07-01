import { MaterialDecorator } from "./MaterialDecorator";
import { Material } from "./Material";
import { Buildable, IBlueprintInfo } from "../GameAsset";
export declare class MaterialDecoratorBuildable extends MaterialDecorator implements Buildable {
    constructor(material: Material);
    GetBlueprint(): IBlueprintInfo;
}
