import { Blueprint } from "./Blueprint/Blueprint.ts";

export abstract class GameAsset {
	protected name: string;
	public get Name() {
		return this.name;
	}
	protected description: string;

	public constructor(GameAssetOptions: IGameAssetOptions) {
		this.name = GameAssetOptions.name;
		this.description = GameAssetOptions.description;
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
	GetCost(): number;
}

interface IGameAssetOptions {
	name: string;
	description: string;
}
