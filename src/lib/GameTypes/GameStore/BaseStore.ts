import { GameCollectionBase } from "../GameCollections/GameCollectionBase";
import { MapCollection } from "../../Extensions/Collections";
import { GameAsset } from "../GameAsset/GameAsset";
import { Player } from "../GameAsset/Player/Player";
import { SellableDecorator, IMarketForces } from "../GameAsset/AssetDecorators";
import { Faction } from "../GameAsset/Faction/Faction";
import { util } from "../../Util/util";
import { SpacemapNode } from "../GameSpacemap/SpacemapNode";
import { Server } from "../../Server/Server";

export abstract class BaseStore implements IStoreUpdatable {
	protected collection: GameCollectionBase;
	protected credits: number;
	public get Credits(): number {
		return this.credits;
	}
	protected readonly storeType: StoreType;

	protected manualEnabled: boolean = false;
	protected manualInventory: MapCollection<string, number>;

	protected readonly name: string;
	protected readonly initCredits: number;

	protected readonly marketForces: boolean;
	protected marketForceSettings: IMarketForces = {
		randEffect: 10,
		hiTechEffect: 25,
		loTechEffect: 15,
	};

	public set MarketForceSettings(options: { randEffect?: number; loTechEffect?: number; hiTechEffect?: number }) {
		this.marketForceSettings.hiTechEffect = options.hiTechEffect ?? 30;
		this.marketForceSettings.loTechEffect = options.loTechEffect ?? 15;
		this.marketForceSettings.randEffect = options.randEffect ?? 20;
	}

	public constructor(collection: GameCollectionBase, options: BaseStoreOptions) {
		this.collection = collection;

		this.name = options.storeName;
		this.credits = options.initialCredits;
		this.initCredits = options.initialCredits;
		this.storeType = options.type;
		this.marketForces = options.marketForces ?? false;

		this.manualInventory = new MapCollection();
	}

	public setFaction(faction: Faction): void {
		this.marketForceSettings.territory = faction;
	}

	//#region Trading

	/**
	 * Buys from the store, removing it from the store collection and into the
	 * player.
	 * @param TradeOptions type
	 * @returns codes <br />  \
	 * 200: Success<br />  \
	 * 400: Invalid input, check quantity signs<br />  \
	 * 404: Not found, no item could be found for the given name<br />  \
	 * 405: Cannot buy item, the item provided cannot be bought<br />  \
	 * 403: Not allowed, the store or player has insufficient resource<br />  \
	 * 500: Unknown server error
	 */
	public async buyFromStore({ trader, item, quantity }: TradeOptions): Promise<TradeOutput> {
		//Check valid quantity
		if (quantity < 0) return { code: 400 };
		//Check if material exists in game
		if (this.collection.has(item) == undefined) return { code: 404 };
		//Check if material is sellable, get cost per item
		const cpi = this.getCostPerItem(item);
		if (cpi == undefined) return { code: 405 };
		//Check if this store has enough resources to sell
		if (!this.collection.SufficientToDecrease(item, -quantity)) return { code: 403 };
		//Check if the user has enough credits
		if (trader.Credits < cpi * quantity) return { code: 403 };
		const storeResult = this.collection.ReduceToNonNegative(item, quantity);
		if (!storeResult.success) return { code: 500 };
		trader.CreditsDecrement({ amount: cpi * quantity });
		this.credits += cpi * quantity;
		const m = await trader.AutoInventoryEdit(item, quantity);
		trader.save();
		return { itemAmount: m.amount, playerCredits: trader.Credits, code: 200 };
	}
	/**
	 * Sells from the store, removing it from the player into the store.
	 * @param TradeOptions type
	 * @returns codes <br />  \
	 * 200: Success<br />  \
	 * 400: Invalid input, check quantity signs<br />  \
	 * 404: Not found, no item could be found for the given name<br />  \
	 * 405: Cannot buy item, the item provided cannot be bought<br />  \
	 * 403: Not allowed, the store or player has insufficient resource<br />  \
	 * 500: Unknown server error
	 */
	public async sellToStore({ trader, item, quantity }: TradeOptions): Promise<TradeOutput> {
		if (quantity < 0) return { code: 400 };
		if (this.collection.has(item) == undefined) return { code: 404 };
		const cpi = this.getCostPerItem(item);
		if (cpi == undefined) return { code: 405 };
		//Check if the player and store can afford to sell
		const inPlayerInventory = trader.AutoInventoryRetrieve(item).amount;
		if (inPlayerInventory == undefined) return { code: 500 };
		if (inPlayerInventory < quantity) return { code: 403 };
		if (this.credits < cpi * quantity) return { code: 403 };

		this.credits -= cpi * quantity;
		this.collection.Increase(item, quantity);
		trader.CreditsIncrement({ amount: cpi * quantity });
		const playerNew = (await trader.AutoInventoryEdit(item, -quantity)).amount;
		if (playerNew == undefined) return { code: 500 };
		trader.save();
		return { itemAmount: playerNew, playerCredits: trader.Credits, code: 200 };
	}

	/**
	 * Sells from the store, removing it from the player into the store. **Will
	 * execute even if the store has insufficient credits to buy. The player
	 * will only be compensated for the credits held by the store.**
	 * @param TradeOptions type
	 * @returns codes <br />  \
	 * 200: Success<br />  \
	 * 400: Invalid input, check quantity signs<br />  \
	 * 404: Not found, no item could be found for the given name<br />  \
	 * 405: Cannot buy item, the item provided cannot be bought<br />  \
	 * 403: Not allowed, the store or player has insufficient resource<br />  \
	 * 500: Unknown server error
	 */
	public async sellToStoreForce({ trader, item, quantity }: TradeOptions): Promise<TradeOutput> {
		if (quantity < 0) return { code: 400 };
		if (this.collection.has(item) == undefined) return { code: 404 };

		const cpi = this.getCostPerItem(item);
		if (cpi == undefined) return { code: 405 };

		//Check if the player and store can afford to sell
		const inPlayerInventory = trader.AutoInventoryRetrieve(item).amount;
		if (inPlayerInventory == undefined) return { code: 500 };
		if (inPlayerInventory < quantity) return { code: 403 };
		let storeCreditsToSpend = cpi * quantity;
		if (this.credits < storeCreditsToSpend) storeCreditsToSpend = this.credits;

		this.credits -= storeCreditsToSpend;
		this.collection.Increase(item, quantity);
		trader.CreditsIncrement({ amount: storeCreditsToSpend });
		const playerNew = (await trader.AutoInventoryEdit(item, -quantity)).amount;
		if (playerNew == undefined) return { code: 500 };
		trader.save();
		return { itemAmount: playerNew, playerCredits: trader.Credits, code: 200 };
	}

	public getCostPerItem(item: string): number | undefined {
		if (this.marketForces) {
			return new SellableDecorator(item).fluctuatingPriceData(this.marketForceSettings).cost;
		}
		return new SellableDecorator(item).PriceData.cost;
	}

	//#endregion - Trading

	public getCollectionValue(): number {
		return this.collection.GetCollectionValue();
	}
	/**@deprecated */
	public GetCollectionValue(): number {
		return this.getCollectionValue();
	}

	/**
	 * Gets items in the store
	 * @returns Map<item name, amount available>
	 */
	public getStoreItems(includeEmpty: boolean = false): MapCollection<string, number> {
		const full = new MapCollection(this.collection);
		if (includeEmpty) return full;
		const reduced = new MapCollection<string, number>();
		full.forEach((q, n) => {
			if (q != 0) reduced.set(n, q);
		});
		return reduced;
	}
	/**
	 * Gets costs of items in the store
	 * @returns Map<item name, cost>
	 */
	public get StoreItemCosts(): MapCollection<string, number> {
		const output = new MapCollection<string, number>();
		this.collection.forEach((_, item) => {
			output.set(item, util.throwUndefined(this.getCostPerItem(item)));
		});
		return output;
	}

	public isType(type: StoreType) {
		return type == this.storeType;
	}

	//Refresh the store with new stock
	public update() {
		if (this.credits < this.initCredits) {
			this.credits = this.initCredits;
		}
		if (this.manualEnabled) {
			return this.setInventory(this.manualInventory);
		}
		return this.populateInventory();
	}

	public generateInventory(): void {
		this.manualEnabled = true;
		this.populateInventory();
	}

	public get Name(): string {
		return this.name;
	}

	public get Faction() {
		return this.marketForceSettings.territory;
	}

	public abstract populateInventory(): void;
	/**
	 * Clears the current inventory, and sets it to what is given in the input parameter.
	 * @param data
	 */
	public setInventory(data: Map<string, number>): void {
		this.manualEnabled = true;
		this.collection.forEach((_el, key) => {
			this.collection.set(key, 0);
		});
		this.manualInventory = new MapCollection(data);
		return this.collection.StrictSumCollection(data);
	}

	public identity(): string {
		return this.name;
	}

	//#region TESTING METHODS

	public INTERNAL_AlterItem(item: string, n: number): void {
		if (!Server.TEST) throw new Error("Internal prefix functions can only be used in test mode.");
		const currentAmount = this.collection.get(item);
		this.collection.set(item, (currentAmount ?? 0) + n);
	}

	public INTERNAL_GetCollection() {
		return this.collection;
	}

	//#endregion
}

type TradeOutput = {
	/**The number of credits the player has */
	playerCredits?: number;
	/**The quantity of the item the player now has */
	itemAmount?: number;
	/**The code of the output */
	code: 200 | 400 | 404 | 405 | 403 | 500;
};
type TradeOptions = {
	/**The player trading */
	trader: Player;
	/**The name of the item to be traded */
	item: string;
	/**The amount to be traded */
	quantity: number;
};
export type BaseStoreOptions = {
	/**Name of the store (for displays) */
	storeName: string;
	/**The default number of credits*/
	initialCredits: number;
	/**The type of the store */
	type: StoreType;
	/**Whether to enable *market forces*, fluctuations to prices based on tech
	 * level and randomness */
	marketForces?: boolean;
};

export interface IStoreUpdatable {
	update(): void;
}

export enum StoreType {
	BASE,
	MATERIAL_STORE,
	SHIP_STORE,
	ATTACHMENT_STORE,
}
