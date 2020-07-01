import { GameAsset, IGameAssetOptions } from "../GameAsset";
import { Blueprint } from "../Blueprint/Blueprint";

export class Material extends GameAsset implements IMaterial {
	private buildable: boolean = false;
	private mineable: boolean = false;
	private sellable: boolean = false;
	private cost: number | undefined;
	private rarity: number;
	private blueprint: Blueprint | undefined;

	public constructor(materialOptions: IMaterialOptions) {
		super({ name: materialOptions.name, description: materialOptions.description });
		this.buildable = materialOptions.buildable;
		this.mineable = materialOptions.mineable;
		this.sellable = materialOptions.sellable;

		this.cost = materialOptions.cost;
		this.blueprint = materialOptions.blueprint;
		this.rarity = materialOptions.rarity || 1;
	}
	public get Name(): string {
		return super.Name;
	}
	public get Description(): string {
		return super.Description;
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
	public GetMaterialRarity(): number {
		return this.rarity;
	}
}
export interface IMaterial {
	IsSellable(): boolean;
	IsMineable(): boolean;
	IsBuildable(): boolean;

	GetMaterialCost(): number | undefined;
	GetMaterialBlueprint(): Blueprint | undefined;
	GetMaterialRarity(): number;
}

export class MaterialBuilder {
	//private options: IMaterialOptions;
	private buildable: boolean = false;
	private mineable: boolean = false;
	private sellable: boolean = true;
	private cost?: number;
	private blueprint?: Blueprint;
	private name: string;
	private description: string;
	private rarity?: number;

	public constructor({ name, description }: { name: string; description: string }) {
		this.name = name;
		this.description = description;
	}
	public EnableBuild(): MaterialBuilder {
		this.buildable = true;
		return this;
	}
	public EnableMine(): MaterialBuilder {
		this.mineable = true;
		return this;
	}
	public DisableSell(): MaterialBuilder {
		this.sellable = false;
		return this;
	}
	public SetCost(cost: number): MaterialBuilder {
		this.cost = cost;
		return this;
	}
	public SetBlueprint(blueprint: Blueprint): MaterialBuilder {
		this.blueprint = blueprint;
		return this;
	}
	public SetRarity(level: number): MaterialBuilder {
		this.rarity = level;
		return this;
	}
	public Build(): Material {
		return new Material({
			buildable: this.buildable,
			description: this.description,
			mineable: this.mineable,
			name: this.name,
			sellable: this.sellable,
			blueprint: this.blueprint,
			cost: this.cost,
			rarity: this.rarity,
		});
	}
}

interface IMaterialOptions extends IGameAssetOptions {
	buildable: boolean;
	mineable: boolean;
	sellable: boolean;
	cost?: number;
	blueprint?: Blueprint;
	name: string;
	description: string;
	rarity?: number;
}
