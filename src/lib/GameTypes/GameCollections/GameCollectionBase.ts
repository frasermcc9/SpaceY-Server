import { Collection } from "mongoose";

import { MapCollection } from "../../Extensions/Collections";
import { Client } from "../../main";
import { SellableDecorator } from "../GameAsset/AssetDecorators";

export abstract class GameCollectionBase extends MapCollection<string, number> {
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

	/**
	 * Checks if this inventory can handle the operation without going negative. Input quantity MUST be negative.
	 * @param itemName
	 * @param quantity amount to see if reduction is possible. **MUST BE NEGATIVE FOR REDUCTION**
	 */
	public SufficientToDecrease(itemName: string, quantity: number): boolean {
		if (quantity > 0) return true;
		const amountOwned = this.get(itemName);
		if (amountOwned != undefined && amountOwned >= Math.abs(quantity)) return true;
		return false;
	}
	public StrictSumCollection(gameCollection: Map<string, number>): void {
		gameCollection.forEach((val, key) => {
			if (val < 0) throw new Error(`Negative number '${val}' used in SumCollection function.`);
			if (this.get(key) == undefined) throw new Error(`Item with name ${key} does not exist when used in SumCollection function.`);
		});
		gameCollection.forEach((val, key) => {
			const InputValue = this.get(key)!;
			this.set(key, val + InputValue);
		});
	}
	public SumCollection(gameCollection: Map<string, number>): void {
		gameCollection.forEach((val, key) => {
			if (val < 0) throw new Error(`Negative number '${val}' used in SumCollection function.`);
			if (this.get(key) == undefined) this.set(key, 0);
		});
		gameCollection.forEach((val, key) => {
			const InputValue = this.get(key)!;
			this.set(key, val + InputValue);
		});
	}
	/**
	 * @virtual default implementation returns 0.
	 */
	public GetCollectionValue(): number {
		let total = 0;
		this.forEach((amount, name) => {
			const Item = Client.Get().Registry.AnyResolve(name);
			if (Item != undefined) total += (new SellableDecorator(Item).PriceData.cost || 0) * amount;
		});
		return total;
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
