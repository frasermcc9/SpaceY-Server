import { IPlayerDocument, PlayerModel } from "../../../GameApi/Database/Player/PlayerModel";
import { Ship } from "../Buildable/Ship/Ship";
import { InventoryBuilder, PlayerInventory, TRegistered } from "./PlayerInventory";
import { Skin } from "./Skin";
import { Client } from "../../../Client/Client";
import { RegistryNames } from "../../../Client/Registry";

export class Player {
	private uId!: string;
	public get UId(): string {
		return this.uId;
	}

	private ship!: Ship;
	private skin!: Skin;

	private inventory!: PlayerInventory;
	public get Inventory(): PlayerInventory {
		return this.inventory;
	}
	//private location:

	//#region - Credits

	public async CreditsIncrement({ amount, implicitSave = true }: { amount: number; implicitSave?: boolean }): Promise<boolean> {
		if (amount < 0) throw new Error("Only positive values can be passed to the incrementCredits method. Consider using decrement to remove credits.");
		const success: boolean = this.inventory.AddCredits({ amount: amount });
		if (success && !implicitSave) {
			await this.save();
		}
		return success;
	}
	public async CreditsDecrement({ amount, implicitSave = true }: { amount: number; implicitSave?: boolean }): Promise<boolean> {
		if (amount < 0) throw new Error("Only positive values can be passed to the decrementCredits method. Consider using increment to add credits.");
		const success: boolean = this.inventory.AddCredits({ amount: -amount });
		if (success && implicitSave) {
			await this.save();
		}
		return success;
	}
	public get Credits(): number {
		return this.inventory.Credits;
	}
	//#endregion

	//#region - Materials

	/**
	 * Increases the given item by the amount.
	 * @param itemName
	 * @param quantity
	 * @returns codes: 1-Success, 2-Item Not Found, 4-Registry not found
	 */
	public async MaterialIncrement(name: string, quantity: number): Promise<{ success: boolean; amount: number; code: 1 | 2 | 3 | 4; error?: string }> {
		return this.InventoryIncrement("materials", name, quantity);
	}

	/**
	 * Reduces a given item by the given amount. Cannot reduce below zero.
	 * @param itemName
	 * @param quantity
	 * @returns codes: 1-Success, 2-Item Not Found, 3-Not Enough Resources, 4-Registry not found
	 */
	public async MaterialDecrement(name: string, quantity: number): Promise<{ success: boolean; amount: number; code: 1 | 2 | 3 | 4; error?: string }> {
		return this.InventoryDecrement("materials", name, quantity);
	}
	/**
	 * Will increment/decrement with any quantity (i.e. positive for increase, negative for decrease)
	 * @param name
	 * @param quantity
	 * @returns codes: 1-Success, 2-Item Not Found, 3-Not Enough Resources, 4-Registry not found
	 */
	public async MaterialEdit(name: string, quantity: number): Promise<{ success: boolean; amount: number; code: 1 | 2 | 3 | 4; error?: string }> {
		let result;
		if (quantity >= 0) result = this.MaterialIncrement(name, quantity);
		else result = this.MaterialDecrement(name, Math.abs(quantity));
		return result;
	}
	//#endregion

	//#region - Ships

	/**
	 * Increases the given item by the amount.
	 * @param itemName
	 * @param quantity
	 * @returns codes: 1-Success, 2-Item Not Found, 4-Registry not found
	 */
	public async ShipIncrement(name: string, quantity: number): Promise<{ success: boolean; amount: number; code: 1 | 2 | 3 | 4; error?: string }> {
		return this.InventoryIncrement("ships", name, quantity);
	}

	/**
	 * Reduces a given item by the given amount. Cannot reduce below zero.
	 * @param itemName
	 * @param quantity
	 * @returns codes: 1-Success, 2-Item Not Found, 3-Not Enough Resources, 4-Registry not found
	 */
	public async ShipDecrement(name: string, quantity: number): Promise<{ success: boolean; amount: number; code: 1 | 2 | 3 | 4; error?: string }> {
		return this.InventoryDecrement("ships", name, quantity);
	}
	/**
	 * Will increment/decrement with any quantity (i.e. positive for increase, negative for decrease)
	 * @param name
	 * @param quantity
	 * @returns codes: 1-Success, 2-Item Not Found, 3-Not Enough Resources, 4-Registry not found
	 */
	public async ShipEdit(name: string, quantity: number): Promise<{ success: boolean; amount: number; code: 1 | 2 | 3 | 4; error?: string }> {
		let result;
		if (quantity >= 0) result = this.ShipDecrement(name, quantity);
		else result = this.ShipDecrement(name, Math.abs(quantity));
		return result;
	}
	//#endregion - Ships

	//#region - Attachments
	/**
	 * Increases the given item by the amount.
	 * @param itemName
	 * @param quantity
	 * @returns codes: 1-Success, 2-Item Not Found, 4-Registry not found
	 */
	public async AttachmentIncrement(name: string, quantity: number): Promise<{ success: boolean; amount: number; code: 1 | 2 | 3 | 4; error?: string }> {
		return this.InventoryIncrement("attachments", name, quantity);
	}

	/**
	 * Reduces a given item by the given amount. Cannot reduce below zero.
	 * @param itemName
	 * @param quantity
	 * @returns codes: 1-Success, 2-Item Not Found, 3-Not Enough Resources, 4-Registry not found
	 */
	public async AttachmentDecrement(name: string, quantity: number): Promise<{ success: boolean; amount: number; code: 1 | 2 | 3 | 4; error?: string }> {
		return this.InventoryDecrement("attachments", name, quantity);
	}
	/**
	 * Will increment/decrement with any quantity (i.e. positive for increase, negative for decrease)
	 * @param name
	 * @param quantity
	 * @returns codes: 1-Success, 2-Item Not Found, 3-Not Enough Resources, 4-Registry not found
	 */
	public async AttachmentEdit(name: string, quantity: number): Promise<{ success: boolean; amount: number; code: 1 | 2 | 3 | 4; error?: string }> {
		let result;
		if (quantity >= 0) result = this.AttachmentIncrement(name, quantity);
		else result = this.AttachmentDecrement(name, Math.abs(quantity));
		return result;
	}
	//#endregion - Attachments

	//#region - Reputation
	/**
	 * Increases the given item by the amount.
	 * @param itemName
	 * @param quantity
	 * @returns codes: 1-Success, 2-Item Not Found, 4-Registry not found
	 */
	public async ReputationIncrement(name: string, quantity: number): Promise<{ success: boolean; amount: number; code: 1 | 2 | 3 | 4; error?: string }> {
		return this.InventoryIncrement("reputation", name, quantity);
	}

	/**
	 * Reduces a given item by the given amount. Cannot reduce below zero.
	 * @param itemName
	 * @param quantity
	 * @returns codes: 1-Success, 2-Item Not Found, 3-Not Enough Resources, 4-Registry not found
	 */
	public async ReputationDecrement(name: string, quantity: number): Promise<{ success: boolean; amount: number; code: 1 | 2 | 3 | 4; error?: string }> {
		return this.InventoryDecrement("reputation", name, quantity);
	}
	/**
	 * Will increment/decrement with any quantity (i.e. positive for increase, negative for decrease)
	 * @param name
	 * @param quantity
	 * @returns codes: 1-Success, 2-Item Not Found, 3-Not Enough Resources, 4-Registry not found
	 */
	public async ReputationEdit(name: string, quantity: number): Promise<{ success: boolean; amount: number; code: 1 | 2 | 3 | 4; error?: string }> {
		let result;
		if (quantity >= 0) result = this.ReputationIncrement(name, quantity);
		else result = this.ReputationDecrement(name, Math.abs(quantity));
		return result;
	}
	//#endregion - Reputation

	//#region - General Inventory
	/**
	 *
	 * @param registryName
	 * @param name
	 * @param quantity
	 * @returns codes: 1-Success, 2-Item Not Found, 4-RegistryNotFound
	 */
	public async InventoryIncrement(registryName: TRegistered, name: string, quantity: number): Promise<{ success: boolean; amount: number; code: 1 | 2 | 4; error?: string }> {
		const result = this.inventory[registryName].Increase(name, quantity);
		if (result.success) await this.save();
		return result;
	}

	/**
	 * Decrements the item from the given registry by the given amount. Will not allow reduction below 0.
	 * @param registryName
	 * @param name
	 * @param quantity
	 * @returns codes: 1-Success, 2-Item Not Found, 3-Not enough items, 4-Registry Not Found
	 */
	public async InventoryDecrement(registryName: TRegistered, name: string, quantity: number): Promise<{ success: boolean; amount: number; code: 1 | 2 | 3 | 4; error?: string }> {
		const result = this.inventory[registryName].ReduceToNonNegative(name, quantity);
		if (result.success) await this.save();
		return result;
	}

	public async InventorySum(inventoryName: TRegistered, gameCollection: Map<string, number>): Promise<boolean> {
		try {
			this.inventory[inventoryName].SumCollection(gameCollection);
			await this.save();
			return true;
		} catch (e) {
			if (Client.Get().ConsoleLogging) console.warn(e);
			return false;
		}
	}

	/**
	 * Will change the user's quantity of the given item by the given amount. This function requires no duplicate
	 * entries to work properly (i.e. there cannot be a faction and a material with the same name). This is the
	 * easiest method of inventory manipulation.
	 * @param name the name of the item
	 * @param quantity the amount to change by (positive or negative)
	 * @return codes: 1-Success, 2-Item Not Found, 3-Not enough items, 4-Registry Not Found.
	 */
	public async AutoInventoryEdit(name: string, quantity: number): Promise<{ success: boolean; amount?: number; code: 1 | 2 | 3 | 4; error?: string }> {
		const Reg = Client.Get().Registry;

		let result;
		//loops through registries. If one is found, then call inventory functions on that type
		for (let i = 0; i < 4; i++)
			if (Reg[Player.RegistryTypes[i]].get(name) != undefined) {
				if (quantity >= 0) result = this.InventoryIncrement(Player.InventoryTypes[i], name, quantity);
				else result = this.InventoryDecrement(Player.InventoryTypes[i], name, Math.abs(quantity));
				return result;
			}
		return { success: false, amount: 0, code: 2, error: "Could not find this item in any registry" };
	}
	/**
	 * Will change the user's quantity of the given item by the given amount. This function requires no duplicate
	 * entries to work properly (i.e. there cannot be a faction and a material with the same name). This is the
	 * easiest method of inventory manipulation.
	 * @param name the name of the item
	 * @param quantity the amount to change by (positive or negative)
	 * @return codes: 1-Success, 2-Item Not Found, 3-Not enough items
	 */
	public async BatchAutoInventoryEdit(pairs: { name: string; quantity: number }[]): Promise<{ success: boolean; code: 1 | 2 | 3 }> {
		const ValidTest = this.BatchSufficientToDecrease(pairs);
		if (!ValidTest.success) return { success: false, code: ValidTest.code };

		const Reg = Client.Get().Registry;

		for (const pair of pairs) {
			const name = pair.name;
			const quantity = pair.quantity;
			let intermediateResult;
			for (let i = 0; i < 4; i++) {
				if (Reg[Player.RegistryTypes[i]].get(name) != undefined) {
					if (quantity >= 0) {
						intermediateResult = this.inventory[Player.InventoryTypes[i]].Increase(name, quantity);
					} else {
						intermediateResult = this.inventory[Player.InventoryTypes[i]].ReduceToNonNegative(name, Math.abs(quantity));
					}
					if (intermediateResult.success == true) {
						break;
					} else {
						return { success: false, code: intermediateResult.code };
					}
				}
				if (i == 3) return { success: false, code: 2 };
			}
		}
		await this.save();
		return { success: true, code: 1 };
	}

	/**
	 * Checks if the user has the sufficient resources to be reduced by the given amount.
	 * @param pairs array of {name, quantity} object literals.
	 * @param ignoreInvalid Will not check for invalid names (i.e. they will be ignored. An invalid name will not cause a false return value).
	 * @returns codes: 1-Success, 2-Item not found, 3-Not enough items
	 */
	private BatchSufficientToDecrease(pairs: { name: string; quantity: number }[], ignoreInvalid: boolean = false): { success: boolean; code: 1 | 2 | 3 } {
		const Reg = Client.Get().Registry;
		for (const pair of pairs) {
			for (let i = 0; i < 4; i++) {
				if (Reg[Player.RegistryTypes[i]].get(pair.name) != undefined) {
					if (!this.inventory[Player.InventoryTypes[i]].SufficientToDecrease(pair.name, pair.quantity)) {
						return { success: false, code: 3 };
					}
					break;
				}
				if (i == 3 && !ignoreInvalid) {
					return { success: false, code: 2 };
				}
			}
		}

		return { success: true, code: 1 };
	}

	/**
	 * Will find the user's current quantity of the given item. This function requires no duplicate
	 * entries to work properly (i.e. there cannot be a faction and a material with the same name). This is the
	 * easiest method of inventory manipulation.
	 * @param name the name of the item
	 * @return codes: 1-Success, 2-Item Not Found
	 */
	public AutoInventoryRetrieve(name: string): { success: boolean; amount?: number; code: 1 | 2; error?: string } {
		const Reg = Client.Get().Registry;

		for (let i = 0; i < 4; i++) {
			if (Reg[Player.RegistryTypes[i]].get(name) != undefined) {
				return { success: true, code: 1, amount: this.inventory[Player.InventoryTypes[i]].get(name) };
			}
		}
		return { success: false, amount: 0, code: 2, error: "Could not find this item in any registry" };
	}

	/**
	 * Will find the user's current quantity of the given item. This function requires no duplicate
	 * entries to work properly (i.e. there cannot be a faction and a material with the same name). This is the
	 * easiest method of inventory manipulation.
	 * @param name the name of the item
	 * @return The array returned includes quantities in order they were provided. Items not found will be given quantity of 0.
	 */
	public BatchAutoInventoryRetrieve(names: string[]): number[] {
		const Reg = Client.Get().Registry;
		const quantity: number[] = new Array<number>();
		for (const name of names) {
			for (let i = 0; i < 4; i++) {
				if (Reg[Player.RegistryTypes[i]].get(name) != undefined) {
					quantity.push(this.inventory[Player.InventoryTypes[i]].get(name) || 0);
					break;
				}
				if (i == 3) quantity.push(0);
			}
		}
		return quantity;
	}

	//#endregion - General Inventory

	public async save(): Promise<void> {
		await PlayerModel.updateOne({ uId: this.uId }, { uId: this.uId, inventory: this.inventory.GetGeneric(), ship: this.ship, skin: this.skin });
	}

	public constructor(data: IPlayerDocument) {
		this.uId = data.uId;
		this.ship = data.ship;
		this.skin = data.skin;
		this.inventory = new InventoryBuilder()
			.SetCredits(data.inventory.credits)
			.SetReputation({ data: data.inventory.reputation })
			.SetAttachments({ data: data.inventory.attachments })
			.SetMaterials({ data: data.inventory.materials })
			.SetShips({ data: data.inventory.ships })
			.SetTokens(data.inventory.tokens)
			.Build();
	}

	private static readonly RegistryTypes: RegistryNames[] = ["MaterialRegistry", "FactionRegistry", "AttachmentRegistry", "ShipRegistry"];
	private static readonly InventoryTypes: TRegistered[] = ["materials", "reputation", "attachments", "ships"];
}
