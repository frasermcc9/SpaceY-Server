import { MapCollection } from "../../Extensions/Collections";
import { GameAsset } from "../GameAsset/GameAsset";
export declare abstract class GameCollectionBase extends MapCollection<string, number> {
    /**
     * Reduces a given item by the given amount. Cannot reduce below zero.
     * @param itemName
     * @param quantity
     * @returns codes: 1-Success, 2-Item Not Found, 3-Not Enough Resources
     */
    ReduceToNonNegative(itemName: string, quantity: number): ReduceToNonNegativeOutput;
    /**
     * Increases the given item by the amount.
     * @param itemName
     * @param quantity
     * @returns codes: 1-Success, 2-Item Not Found
     */
    Increase(itemName: string, quantity: number): IncreaseOutput;
    /**
     * Checks if this inventory can handle the operation without going negative. Input quantity MUST be negative.
     * @param itemName
     * @param quantity amount to see if reduction is possible. **MUST BE NEGATIVE FOR REDUCTION**
     */
    SufficientToDecrease(itemName: string, quantity: number): boolean;
    /**
     * Adds all elements of the parameter collection to this one.
     *
     * StrictSum will throw if an unknown value is found, rather than creating a new key for it
     * (like SumCollection would).
     *
     * @param gameCollection either a map of elements, with key as name and value as amount or an
     * array with strings, implicit increment of 1.
     */
    StrictSumCollection(gameCollection: Map<string, number>): void;
    StrictSumCollection(gameCollection: Array<string>): void;
    SumCollection(gameCollection: Map<string, number>): void;
    SumCollection(gameCollection: Array<string>): void;
    /**
     * @param gameCollection
     * @returns codes: 200-Success, 403-Insufficient resources
     */
    StrictSubtractCollection(
        gameCollection: Map<string, number>
    ): {
        code: number;
        failures: string[];
    };
    /**
     * @param gameCollection
     * @returns codes: 200-Success, 403-Insufficient resources
     */
    SubtractCollection(
        gameCollection: Map<string, number>
    ): {
        code: number;
        failures: string[];
    };
    /** @virtual */
    GetCollectionValue(): number;
    /**
     * @param name the name(s) of the items.
     * @returns an array/single IGetResult. Codes: 200-Success, 404-Item not found
     */
    DetailedGet(name: GameAsset): IGetResult;
    DetailedGet(name: GameAsset[]): IGetResult[];
    DetailedGet(name: string): IGetResult;
    DetailedGet(name: string[]): IGetResult[];
    private DetailGetHelper;
    /**
     * Generate a random collection for this class. Template method.
     */
    GenerateCollection(options: IGenerationOptions): GameCollectionBase;
    /**
     * Gets the size of the collection (the sum of all the values)
     */
    get CollectionSize(): number;
    /**
     * Required method for GenerateCollection
     * @param minRarity the minimum rarity that a valid item can be
     * @param maxRarity the maximum rarity that a valid item can be
     */
    abstract GetCompatibleItems({ minRarity, maxRarity, minTech, maxTech }: ICompatible): MapCollection<string, GameAsset>;
    /**
     * Required method for GenerateCollection
     * @param items array of input items
     * @param centralRarity the rarity that should be most common
     * @returns should return an array with the weights of each GameAsset, such that the weight
     *          of a GameAsset at position *i* is in position *i* of the returned array.
     */
    abstract GenerateWeights(items: GameAsset[], centralRarity: number, minRarity: number, maxRarity: number): number[];
    /**
     * Optional method for GenerateCollection. Can be overridden if different behaviour is desired
     */
    RandomNumber(): number;
}
export interface IGenerationOptions extends ICompatible {
    /**The minimum value of the collection*/
    value: number;
    /**If item rarity should effect the inventory generation frequencies*/
    rarity: boolean;
    /**The most common rarity to generate (i.e. if this is 5, then 5 will be the most common generation).
     * Only used if rarity is enabled.*/
    centralRarity: number;
}
export interface ICompatible {
    /**The minimum rarity of items that should be generated */
    minRarity: number;
    /**the maximum rarity of items that should be generated */
    maxRarity: number;
    /**The minimum tech an item must be to appear (independent from rarity property)*/
    minTech: number;
    /**The maximum tech an item can be to appear (independent from rarity property)*/
    maxTech: number;
}
interface ReduceToNonNegativeOutput {
    success: boolean;
    amount: number;
    code: 1 | 2 | 3;
    error?: string;
}
interface IncreaseOutput {
    success: boolean;
    amount: number;
    code: 1 | 2;
    error?: string;
}
interface IGetResult {
    success: boolean;
    code: number;
    quantity?: number;
    item?: GameAsset | null;
}
export {};
