import { GameAsset, IGameAssetOptions } from "../GameAsset.ts";
import { Blueprint } from "../Blueprint/Blueprint.ts";


export class Material extends GameAsset implements IMaterial {
	private buildable: boolean;
	private mineable: boolean;
	private sellable: boolean;
	private cost: number | undefined;
	private blueprint: Blueprint | undefined;

	constructor(materialOptions: IMaterialOptions) {
		super({ name: materialOptions.name, description: materialOptions.description });
		this.buildable = materialOptions.buildable;
		this.mineable = materialOptions.mineable;
		this.sellable = materialOptions.sellable;

		this.cost = materialOptions.cost;
		this.blueprint = materialOptions.blueprint;
	}

	public IsSellable(): boolean {
		return this.sellable;
	}
	public IsMineable(): boolean {
		return this.mineable;
	}
	public IsBuildable(): boolean {
		return this.buildable;
	}

	public GetMaterialCost(): number | undefined {
		return this.cost;
	}
	public GetMaterialBlueprint(): Blueprint | undefined {
		return this.blueprint;
	}
}
export interface IMaterial {
	IsSellable(): boolean;
	IsMineable(): boolean;
	IsBuildable(): boolean;

	GetMaterialCost(): number | undefined;
	GetMaterialBlueprint(): Blueprint | undefined;
}

export class MaterialBuilder {
	private options: IMaterialOptions;

	public constructor(materialOptions: IMaterialOptions) {
		this.options = materialOptions;
		this.options.buildable = false;
		this.options.mineable = false;
		this.options.sellable = true;
	}
	public EnableBuild(): MaterialBuilder {
		this.options.buildable = true;
		return this;
	}
	public EnableMine(): MaterialBuilder {
		this.options.mineable = true;
		return this;
	}
	public DisableSell(): MaterialBuilder {
		this.options.sellable = false;
		return this;
	}
	public SetCost(cost: number): MaterialBuilder {
		this.options.cost = cost;
		return this;
	}
	public SetBlueprint(blueprint: Blueprint): MaterialBuilder {
		this.options.blueprint = blueprint;
		return this;
	}
	public Build(): Material {
		return new Material(this.options);
	}
}

interface IMaterialOptions extends IGameAssetOptions {
	buildable: boolean;
	mineable: boolean;
	sellable: boolean;
	cost?: number;
	blueprint?: Blueprint;
}
