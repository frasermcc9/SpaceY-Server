import { GameAsset, IGameAssetOptions, IGameAsset } from "../GameAsset";
import { Blueprint } from "../Blueprint/Blueprint";

export class Material extends GameAsset implements IMaterial {
	private mineable: boolean = false;
	private rarity: number;

	public constructor(materialOptions: IMaterialOptions) {
		super({ name: materialOptions.name, description: materialOptions.description, cost: materialOptions.cost, blueprint: materialOptions.blueprint });

		this.mineable = materialOptions.mineable;
        this.rarity = materialOptions.rarity || 1;
	}

	public IsMineable(): boolean {
		return this.mineable;
	}

	public GetMaterialRarity(): number {
		return this.rarity;
	}
}
export interface IMaterial extends IGameAsset {
	IsMineable(): boolean;
	GetMaterialRarity(): number;
}

export class MaterialBuilder {
	private name: string;
	private description: string;
	private cost?: number;
	private blueprint?: Blueprint;

	private mineable: boolean = false;
	private rarity?: number;

	public constructor({ name, description }: { name: string; description: string }) {
		this.name = name;
		this.description = description;
	}
	public EnableSell(price: number): MaterialBuilder {
		this.cost = price;
		return this;
	}
	public EnableBuild(blueprint: Blueprint): MaterialBuilder {
		this.blueprint = blueprint;
		return this;
	}
	public EnableMine(): MaterialBuilder {
		this.mineable = true;
		return this;
	}
	public SetRarity(level: number): MaterialBuilder {
		this.rarity = level;
		return this;
	}
	public Build(): Material {
		return new Material({
			description: this.description,
			mineable: this.mineable,
			name: this.name,
			rarity: this.rarity,
			blueprint: this.blueprint,
			cost: this.cost,
		});
	}
}

interface IMaterialOptions extends IGameAssetOptions {
	mineable: boolean;
	rarity?: number;

	name: string;
	description: string;
	cost?: number;
	blueprint?: Blueprint;
}
