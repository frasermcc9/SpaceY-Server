import { GameCollectionBase } from "../GameCollections/GameCollectionBase";
import { MapCollection } from "../../Extensions/Collections";
import { GameAsset } from "../GameAsset/GameAsset";
import { Player } from "../GameAsset/Player/Player";

export abstract class BaseStore<K extends GameAsset> extends GameCollectionBase {
	protected credits: number;
	public get Credits(): number {
		return this.credits;
	}
	constructor(credits: number) {
		super();
		this.credits = credits;
	}
	public abstract SetInventory(data: GameCollectionBase): void;
	public abstract SetInventory(data: MapCollection<K, number>): void;

	public async Buy({ buyer, item, quantity }: { buyer: Player; item: string; quantity: number }): Promise<IBuyResult> {
		//Check valid quantity
		if (quantity < 0) return { success: false, amount: 0, code: 6, error: "Negative quantity" };
		//Check if material exists in game
		const Item = this.GetItem(item);
		if (Item == undefined) return { success: false, amount: 0, code: 2, error: "Item not found" };
		//Check if material is sellable, get cost per item
		const cpi = this.GetCostOfItem(Item);
		if (cpi == undefined) return { success: false, amount: 0, code: 5, error: "Invalid item" };
		//Check if this store has enough resources to sell
		if (!this.SufficientToDecrease(item, -quantity)) return { success: false, amount: 0, code: 3, error: "Insufficient amount of item at store" };
		//Check if the user has enough credits
		if (buyer.Credits < cpi * quantity) return { success: false, amount: 0, code: 4, error: "Insufficient credits owned by player" };
		const storeResult = this.ReduceToNonNegative(item, quantity);
		if (!storeResult.success) return { success: false, amount: 0, code: 7, error: "Unknown error occurred." };
		buyer.CreditsDecrement({ amount: cpi * quantity });
		this.credits += cpi * quantity;
		const m = await buyer.MaterialIncrement(item, quantity);
		return { success: true, amount: m.amount, code: 1 };
	}

	/**
	 * Abstract step for the Buy() method.
	 * @param itemName string name of the item
	 */
	public abstract GetItem(itemName: string): GameAsset | undefined;
	public abstract GetCostOfItem(item: GameAsset): number | undefined;

	public abstract Sell(): void;
	public abstract Update(): void;
}
export interface IBuyResult {
	success: boolean;
	amount: number;
	code: 1 | 2 | 3 | 4 | 5 | 6 | 7;
	error?: string | undefined;
}
