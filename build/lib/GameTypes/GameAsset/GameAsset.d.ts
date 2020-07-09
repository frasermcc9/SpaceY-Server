import { Blueprint } from "./Blueprint/Blueprint";
import { Player } from "./Player/Player";
export declare class GameAsset implements IGameAsset {
    private name;
    get Name(): string;
    private description;
    get Description(): string;
    private techLevel;
    get TechLevel(): number;
    private cost?;
    get Cost(): number | undefined;
    private blueprint?;
    get Blueprint(): IBlueprintInfo;
    constructor(gameAssetOptions: IGameAssetOptions);
    toString(): string;
    stringDetails(): string;
}
export interface IGameAsset {
    Name: string;
    Description: string;
}
export interface Buildable {
    Blueprint: IBlueprintInfo;
    Build(player: Player): Promise<{
        code: number;
        failures: string[];
    }>;
}
export interface Sellable {
    PriceData: ISellInfo;
}
export interface IGameAssetOptions {
    /**The name of the asset */
    name: string;
    /**A description of the asset */
    description: string;
    /**The tech level of the asset */
    techLevel: number;
    /***Optional*: the price of the asset */
    cost?: number;
    /***Optional*: the blueprint to build the asset */
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
export interface IStrengthOptions {
    strength: number;
}
