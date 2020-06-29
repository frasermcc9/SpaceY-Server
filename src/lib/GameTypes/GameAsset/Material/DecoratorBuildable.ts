import { MaterialDecorator } from "./MaterialDecorator";
import { Material } from "./Material";
import { Buildable, IBlueprintInfo } from "../GameAsset";

export class MaterialDecoratorBuildable extends MaterialDecorator implements Buildable {
	public constructor(material: Material) {
		super(material);
		if (!material.IsBuildable()) console.warn("Material that is not buildable is being instantiated as a buildable material.");
	}

	public GetBlueprint(): IBlueprintInfo {
		const blueprint = this.GetMaterialBlueprint();
		if (blueprint) {
			return { success: true, blueprint: blueprint };
		}
		return { success: false, blueprint: undefined };
	}
}
