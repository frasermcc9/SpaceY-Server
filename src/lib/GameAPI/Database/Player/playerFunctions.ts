import { Client } from "../../../Client/Client";
import { InventoryBuilder, PlayerInventory } from "../../../GameTypes/GameAsset/Player/PlayerInventory";
import { Skin } from "../../../GameTypes/GameAsset/Player/Skin";
import { IPlayerDocument, IPlayerModel } from "./PlayerModel";
import { Player } from "../../../GameTypes/GameAsset/Player/Player";

//Section: Instance Methods (for document)

export async function setLastUpdated(this: IPlayerDocument): Promise<void> {
	const now = new Date();
	if (!this.lastUpdated || this.lastUpdated < now) {
		this.lastUpdated = now;
		await this.save();
	}
}
export async function incrementCredits(this: IPlayerDocument, { amount }: { amount: number }): Promise<boolean> {
	if (amount < 0) {
		throw new Error("Only positive values can be passed to the incrementCredits method. Consider using decrement to remove credits.");
	}
	this.inventory.credits += amount;
	this.markModified("inventory");
	await this.save();
	await this.setLastUpdated();
	return true;
}
export async function decrementCredits(this: IPlayerDocument, { amount }: { amount: number }): Promise<boolean> {
	if (amount < 0) {
		throw new Error("Only positive values can be passed to the decrementCredits method. Consider using increment to add credits.");
	}
	const success = this.inventory.credits - amount > 0;
	if (success) {
		this.inventory.credits -= amount;
		this.markModified("inventory");
		await this.save();
		await this.setLastUpdated();
		return true;
	} else {
		return false;
	}
}
export async function getCredits(this: IPlayerDocument): Promise<Number> {
	return this.inventory.credits;
}

//Section: Static Methods (for model)

export async function findOneOrCreate(this: IPlayerModel, { uId }: { uId: string }): Promise<Player> {
	const record = await this.findOne({ uId: uId });
	if (record) {
		return new Player(record);
	} else {
		const record = await this.create({
			uId: uId,
			inventory: new InventoryBuilder().GenericBuild(),
			ship: Client.Get().Registry.DefaultShip,
			skin: new Skin(),
		});
		return new Player(record);
	}
}
