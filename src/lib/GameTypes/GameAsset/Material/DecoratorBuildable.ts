import { MaterialDecorator } from "./MaterialDecorator.ts";
import { Material } from "./Material.ts";
import { Buildable, IBlueprintInfo } from "../GameAsset.ts";

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
