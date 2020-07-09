import { MapCollection } from "../../Extensions/Collections";
import { Client } from "../../main";
import { SellableDecorator } from "../GameAsset/AssetDecorators";
import { GameAsset } from "../GameAsset/GameAsset";

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
			return {
				success: false,
				code: 3,
				error: "The user has an insufficient amount of this item.",
				amount: amountOwned,
			};
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

	/**
	 * Adds all elements of the parameter collection to this one.
	 *
	 * StrictSum will throw if an unknown value is found, rather than creating a new key for it
	 * (like SumCollection would).
	 *
	 * @param gameCollection either a map of elements, with key as name and value as amount or an
	 * array with strings, implicit increment of 1.
	 */
	public StrictSumCollection(gameCollection: Map<string, number>): void;
	public StrictSumCollection(gameCollection: Array<string>): void;
	public StrictSumCollection(gameCollection: Map<string, number> | Array<string>): void {
		if (Array.isArray(gameCollection)) {
			gameCollection.forEach((el) => {
				if (this.get(el) == undefined)
					throw new Error(`Item with name ${el} does not exist when used in StrictSumCollection function.`);
			});
			gameCollection.forEach((el) => {
				const StartValue = this.get(el)!;
				this.set(el, StartValue + 1);
			});
			return;
		}
		gameCollection.forEach((val, key) => {
			if (val < 0) throw new Error(`Negative number '${val}' used in SumCollection function.`);
			if (this.get(key) == undefined)
				throw new Error(`Item with name ${key} does not exist when used in StrictSumCollection function.`);
		});
		gameCollection.forEach((val, key) => {
			const StartValue = this.get(key)!;
			this.set(key, val + StartValue);
		});
	}
	public SumCollection(gameCollection: Map<string, number>): void;
	public SumCollection(gameCollection: Array<string>): void;
	public SumCollection(gameCollection: Map<string, number> | Array<string>): void {
		if (Array.isArray(gameCollection)) {
			gameCollection.forEach((el) => {
				const StartValue = this.get(el);
				this.set(el, (StartValue ?? 0) + 1);
			});
			return;
		}
		gameCollection.forEach((val, key) => {
			if (val < 0) throw new Error(`Negative number '${val}' used in SumCollection function for ${key}.`);
			if (this.get(key) == undefined) this.set(key, 0);
		});
		gameCollection.forEach((val, key) => {
			const StartValue = this.get(key)!;
			this.set(key, val + StartValue);
		});
	}
	/**
	 * @param gameCollection
	 * @returns codes: 200-Success, 403-Insufficient resources
	 */
	public StrictSubtractCollection(gameCollection: Map<string, number>): { code: number; failures: string[] } {
		const Failed: string[] = new Array();
		gameCollection.forEach((val, key) => {
			if (val < 0) throw new Error(`Negative number '${val}' used in SubtractCollection function for ${key}.`);
			if (this.get(key) == undefined) throw new Error(`Item with name ${key} does not exist when used in SumCollection function.`);
			if (this.get(key)! < val) Failed.push(key);
		});
		if (Failed.length > 0) return { code: 403, failures: Failed };
		gameCollection.forEach((val, key) => {
			const InputValue = this.get(key)!;
			this.set(key, InputValue - val);
		});
		return { code: 200, failures: Failed };
	}
	/**
	 * @param gameCollection
	 * @returns codes: 200-Success, 403-Insufficient resources
	 */
	public SubtractCollection(gameCollection: Map<string, number>): { code: number; failures: string[] } {
		const Failed: string[] = new Array();
		gameCollection.forEach((val, key) => {
			if (val < 0) throw new Error(`Negative number '${val}' used in SubtractCollection function for ${key}.`);
			if (this.get(key) == undefined) this.set(key, 0);
			if (this.get(key)! < val) Failed.push(key);
		});
		if (Failed.length > 0) return { code: 403, failures: Failed };
		gameCollection.forEach((val, key) => {
			const InputValue = this.get(key)!;
			this.set(key, InputValue - val);
		});
		return { code: 200, failures: Failed };
	}

	/** @virtual */
	public GetCollectionValue(): number {
		let total = 0;
		this.forEach((amount, name) => {
			const Item = Client.Get().Registry.AnyResolve(name);
			if (Item != undefined) total += (new SellableDecorator(Item).PriceData.cost || 0) * amount;
		});
		return total;
	}

	/**
	 * @param name the name(s) of the items.
	 * @returns an array/single IGetResult. Codes: 200-Success, 404-Item not found
	 */
	public DetailedGet(name: GameAsset): IGetResult;
	public DetailedGet(name: GameAsset[]): IGetResult[];
	public DetailedGet(name: string): IGetResult;
	public DetailedGet(name: string[]): IGetResult[];
	public DetailedGet(name: string | string[] | GameAsset | GameAsset[]): IGetResult[] | IGetResult {
		if (name instanceof GameAsset) return this.DetailGetHelper([name.Name])[0];
		else if (typeof name == "string") return this.DetailGetHelper([name])[0];
		else if (name.every((el: any) => typeof el == "string")) return this.DetailGetHelper(name as string[]);
		else return this.DetailGetHelper((name as GameAsset[]).map((el) => el.Name));
	}

	private DetailGetHelper(names: string[]): IGetResult[] {
		let data = new Array<IGetResult>();
		names.forEach((name) => {
			const Item = Client.Reg.AnyResolve(name);
			if (Item == undefined) {
				data.push({ success: false, code: 404 });
			} else {
				const Quantity = this.get(Item.Name);
				data.push({ success: true, quantity: Quantity ?? 0, item: Item, code: 200 });
			}
		});
		return data;
	}

	/**
	 * Generate a random collection for this class. Template method.
	 */
	public GenerateCollection(options: IGenerationOptions): GameCollectionBase {
		let intermediatePrice = this.GetCollectionValue();
		const CompatibleItems = this.GetCompatibleItems(options.minRarity, options.maxRarity);
		const ItemNames = CompatibleItems.array();
		const Weights = this.GenerateWeights(ItemNames, options.centralRarity, options.minRarity, options.maxRarity);
		let FlatArray = new Array<GameAsset>();
		//Generates the flat array of probabilities. See benchmarks for why this method was used
		if (options.rarity) for (let i = 0; i < ItemNames.length; ++i) for (let j = 0; j < Weights[i]; ++j) FlatArray.push(ItemNames[i]);
		else FlatArray = CompatibleItems.array();
		//Generate the collection
		do {
			const Selected = FlatArray[~~(this.RandomNumber() * FlatArray.length)];
			const Material = new SellableDecorator(Selected);

			const ExistingAmount = this.get(Selected.Name) ?? 0;
			this.set(Selected.Name, ExistingAmount + 1);
			intermediatePrice += Material.PriceData.cost ?? 0;
		} while (intermediatePrice < options.value);
		return this;
	}

	/**
	 * Gets the size of the collection (the sum of all the values)
	 */
	public get CollectionSize(): number {
		return [...this.values()].reduce((acc, cur) => acc + cur, 0);
	}

	/**
	 * Required method for GenerateCollection
	 * @param minRarity the minimum rarity that a valid item can be
	 * @param maxRarity the maximum rarity that a valid item can be
	 */
	public abstract GetCompatibleItems(minRarity: number, maxRarity: number): MapCollection<string, GameAsset>;
	/**
	 * Required method for GenerateCollection
	 * @param items array of input items
	 * @param centralRarity the rarity that should be most common
	 * @returns should return an array with the weights of each GameAsset, such that the weight
	 *          of a GameAsset at position *i* is in position *i* of the returned array.
	 */
	public abstract GenerateWeights(items: GameAsset[], centralRarity: number, minRarity: number, maxRarity: number): number[];
	/**
	 * Optional method for GenerateCollection. Can be overridden if different behaviour is desired
	 */
	public RandomNumber() {
		return Math.random();
	}
}

export interface IGenerationOptions {
	/**The minimum value of the collection*/
	value: number;
	/**If item rarity should effect the inventory generation frequencies*/
	rarity: boolean;
	/**The minimum rarity an item must be to appear (independent from rarity property)*/
	minRarity: number;
	/**The maximum rarity an item can be to appear (independent from rarity property)*/
	maxRarity: number;
	/**The most common rarity to generate (i.e. if this is 5, then 5 will be the most common generation).
	 * Only used if rarity is enabled.*/
	centralRarity: number;
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
