import { GameAsset, Sellable, ISellInfo, IGameAsset, IBlueprintInfo } from "./GameAsset";
export declare abstract class GameAssetDecorator implements IGameAsset {
    protected asset: GameAsset;
    constructor(asset: GameAsset);
    get Name(): string;
    get Description(): string;
}
export declare class SellableDecorator extends GameAssetDecorator implements Sellable {
    constructor(item: GameAsset);
    get PriceData(): ISellInfo;
}
export declare class BuildableDecorator extends GameAssetDecorator implements Sellable {
    constructor(item: GameAsset);
    get PriceData(): IBlueprintInfo;
}
