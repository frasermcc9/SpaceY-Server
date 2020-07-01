import { Material, IMaterial } from "./Material";
import { Blueprint } from "../Blueprint/Blueprint";

export abstract class MaterialDecorator implements IMaterial {
	protected material: Material;

	public constructor(material: Material) {
		this.material = material;
	}

	public get Name(): string {
		return this.material.Name;
	}
	public get Description(): string {
		return this.material.Description;
	}

	public IsSellable(): boolean {
		return this.material.IsSellable();
	}
	public IsMineable(): boolean {
		return this.material.IsMineable();
	}
	public IsBuildable(): boolean {
		return this.material.IsBuildable();
	}

	public GetMaterialCost(): number | undefined {
		return this.material.GetMaterialCost();
	}
	public GetMaterialBlueprint(): Blueprint | undefined {
		return this.material.GetMaterialBlueprint();
	}
	public GetMaterialRarity(): number {
		return this.material.GetMaterialRarity();
	}
}
