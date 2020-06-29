import { IPlayerDocument, PlayerModel } from "../../../GameApi/Database/Player/PlayerModel";
import { Ship } from "../Buildable/Ship/Ship";
import { InventoryBuilder, PlayerInventory } from "./PlayerInventory";
import { Skin } from "./Skin";

/**
 * @deprecated this class is not used. IPlayerDocument is the player class.
 */
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

	//SECTION - Credits

	public async AddCredits({ amount, noImplicitSave }: { amount: number; noImplicitSave?: boolean }): Promise<boolean> {
		if (amount < 0) throw new Error("Only positive values can be passed to the incrementCredits method. Consider using decrement to remove credits.");
		const success: boolean = this.inventory.AddCredits({ amount: amount });
		if (success && !noImplicitSave) {
			await this.save();
		}
		return success;
	}
	public async RemoveCredits({ amount, noImplicitSave }: { amount: number; noImplicitSave?: boolean }): Promise<boolean> {
		if (amount < 0) throw new Error("Only positive values can be passed to the decrementCredits method. Consider using increment to add credits.");
		const success: boolean = this.inventory.AddCredits({ amount: -amount });
		if (success && !noImplicitSave) {
			await this.save();
		}
		return success;
	}
	public get Credits(): number {
		return this.inventory.Credits;
	}

	//SECTION - Materials

	/**
	 * Increases the given item by the amount.
	 * @param itemName
	 * @param quantity
	 * @returns codes: 1-Success, 2-Item Not Found
	 */
	public async MaterialIncrement(name: string, quantity: number): Promise<{ success: boolean; amount: number; code: 1 | 2; error?: string }> {
		const result = this.inventory.Materials.Increase(name, quantity);
		await this.save();
		return result;
	}

	/**
	 * Reduces a given item by the given amount. Cannot reduce below zero.
	 * @param itemName
	 * @param quantity
	 * @returns codes: 1-Success, 2-Item Not Found, 3-Not Enough Resources
	 */
	public async MaterialDecrement(name: string, quantity: number): Promise<{ success: boolean; amount: number; code: 1 | 2 | 3; error?: string }> {
		const result = this.inventory.Materials.ReduceToNonNegative(name, quantity);
		await this.save();
		return result;
	}

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
}
