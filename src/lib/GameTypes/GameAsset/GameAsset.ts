import { Blueprint } from "./Blueprint/Blueprint";

export class GameAsset {
	private name: string;
	public get Name() {
		return this.name;
	}

	private description: string;
    public get Description() {
		return this.description;
    }
    
	public constructor(gameAssetOptions: IGameAssetOptions) {
		this.name = gameAssetOptions.name;
		this.description = gameAssetOptions.description;
	}

	/** @override */
	public toString(): string {
		return this.name + ": " + this.description;
	}
}

export interface Buildable {
	GetBlueprint(): Blueprint;
}

export interface Sellable {
	GetCost(): ISellInfo;
}

export interface IGameAssetOptions {
	name: string;
	description: string;
}

export interface ISellInfo {
	success: boolean;
	cost: number | undefined;
}

export interface IBlueprintInfo {
	success: boolean;
	blueprint: Blueprint | undefined;
}
