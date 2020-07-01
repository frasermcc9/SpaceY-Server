import { Blueprint } from "./Blueprint/Blueprint";
export declare class GameAsset {
    private name;
    get Name(): string;
    private description;
    get Description(): string;
    constructor(gameAssetOptions: IGameAssetOptions);
    /** @override */
    toString(): string;
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
