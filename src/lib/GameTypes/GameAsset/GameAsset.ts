import { Blueprint } from "./Blueprint/Blueprint";
import { Player } from "./Player/Player";

export class GameAsset implements IGameAsset {
	private name: string;
	public get Name() {
		return this.name;
	}

	private description: string;
	public get Description() {
		return this.description;
	}

	private cost?: number;
	public get Cost(): number | undefined {
		return this.cost;
	}

	private blueprint?: Blueprint;
	public get Blueprint(): IBlueprintInfo {
		if (this.blueprint == undefined) return { success: false };
		return { success: true, blueprint: this.blueprint };
	}

	public constructor(gameAssetOptions: IGameAssetOptions) {
		this.name = gameAssetOptions.name;
		this.description = gameAssetOptions.description;
		this.cost = gameAssetOptions.cost;
		this.blueprint = gameAssetOptions.blueprint;
	}

	/** @override */
	public toString(): string {
		return this.name + ": " + this.description;
	}
}

export interface IGameAsset {
	Name: string;
	Description: string;
}

export interface Buildable {
    Blueprint: IBlueprintInfo;
    Build(player:Player): Promise<{ code: number; failures: string[] }>;
}

export interface Sellable {
	PriceData: ISellInfo; 
}

export interface IGameAssetOptions {
	name: string;
	description: string;
	cost?: number;
	blueprint?: Blueprint;
}

export interface ISellInfo {
	success: boolean;
	cost?: number;
}

export interface IBlueprintInfo {
	success: boolean;
	blueprint?: Blueprint;
}
