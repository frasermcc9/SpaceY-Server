import { Blueprint } from "./Blueprint/Blueprint";
export declare class GameAsset implements IGameAsset {
    private name;
    get Name(): string;
    private description;
    get Description(): string;
    private cost?;
    get Cost(): number | undefined;
    private blueprint?;
    get Blueprint(): IBlueprintInfo;
    constructor(gameAssetOptions: IGameAssetOptions);
    /** @override */
    toString(): string;
}
export interface IGameAsset {
    Name: string;
    Description: string;
}
export interface Buildable {
    Blueprint: IBlueprintInfo;
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
