import { MapCollection } from "../../Extensions/Collections";
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
    StrictSumCollection(gameCollection: Map<string, number>): void;
    SumCollection(gameCollection: Map<string, number>): void;
    /**
     * @virtual default implementation returns 0.
     */
    GetCollectionValue(): number;
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
export {};
