import { Collection } from "mongoose";

import { MapCollection } from "../../Extensions/Collections";

export class GameCollectionBase extends MapCollection<string, number> {
	/**
	 * Reduces a given item by the given amount. Cannot reduce below zero.
	 * @param itemName
	 * @param quantity
	 * @returns codes: 1-Success, 2-Item Not Found, 3-Not Enough Resources
	 */
	public ReduceToNonNegative(itemName: string, quantity: number): ReduceToNonNegativeOutput {
		if (quantity < 0) throw new TypeError("A negative number has been passed when " + this.ReduceToNonNegative.name + " was called");
		const amountOwned = this.get(itemName);
		if (amountOwned == undefined) {
			return { success: false, code: 2, error: "The given item could not be found.", amount: 0 };
		}
		if (amountOwned < quantity) {
			return { success: false, code: 3, error: "The user has an insufficient amount of this item.", amount: amountOwned };
		}
		this.set(itemName, amountOwned - quantity);
		return { success: true, code: 1, amount: amountOwned - quantity };
	}

	/**
	 * Increases the given item by the amount.
	 * @param itemName
	 * @param quantity
	 * @returns codes: 1-Success, 2-Item Not Found
	 */
	public Increase(itemName: string, quantity: number): IncreaseOutput {
		if (quantity < 0) throw new TypeError("A negative number has been passed when " + this.Increase.name + " was called");
		const amountOwned = this.get(itemName);
		if (amountOwned == undefined) {
			return { success: false, code: 2, error: "The given item could not be found.", amount: 0 };
		}
		this.set(itemName, amountOwned + quantity);
		return { success: true, code: 1, amount: amountOwned + quantity };
	}
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
