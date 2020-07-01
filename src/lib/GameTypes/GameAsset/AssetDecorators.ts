import { GameAsset, Sellable, ISellInfo, IGameAsset, IBlueprintInfo } from "./GameAsset";

export abstract class GameAssetDecorator implements IGameAsset {
	protected asset: GameAsset;

	public constructor(asset: GameAsset) {
		this.asset = asset;
	}

	public get Name(): string {
		return this.asset.Name;
	}
	public get Description(): string {
		return this.asset.Description;
	}
}

export class SellableDecorator extends GameAssetDecorator implements Sellable {
	public constructor(item: GameAsset) {
		super(item);
	}

	public get PriceData(): ISellInfo {
		return this.asset.Cost == undefined ? { success: false } : { success: true, cost: this.asset.Cost };
	}
}

export class BuildableDecorator extends GameAssetDecorator implements Sellable {
	public constructor(item: GameAsset) {
		super(item);
	}

	public get PriceData(): IBlueprintInfo {
		return this.asset.Blueprint;
	}
}
