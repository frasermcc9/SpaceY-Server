import { Material, IMaterial } from "./Material";
import { Blueprint } from "../Blueprint/Blueprint";

export abstract class MaterialDecorator implements IMaterial {
	protected material: Material;

	public constructor(material: Material) {
		this.material = material;
	}

	public IsSellable = (): boolean => this.material.IsSellable();
	public IsMineable = (): boolean => this.material.IsMineable();
	public IsBuildable = (): boolean => this.material.IsBuildable();

	public GetMaterialCost(): number | undefined {
		const cost = this.material.GetMaterialCost();
		return cost;
	}

	public GetMaterialBlueprint(): Blueprint | undefined {
		const blueprint = this.material.GetMaterialBlueprint();
		return blueprint;
	}
}
