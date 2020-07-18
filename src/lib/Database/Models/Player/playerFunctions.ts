import { Server } from "../../../Server/Server";
import { InventoryBuilder, PlayerInventory } from "../../../GameTypes/GameAsset/Player/PlayerInventory";
import { Skin } from "../../../GameTypes/GameAsset/Player/Skin";
import { IPlayerDocument, IPlayerModel, IPlayer } from "./PlayerModel";
import { Player } from "../../../GameTypes/GameAsset/Player/Player";

//Section: Instance Methods (for document)

export async function setLastUpdated(this: IPlayerDocument): Promise<void> {
	const now = new Date();
	if (!this.lastUpdated || this.lastUpdated < now) {
		this.lastUpdated = now;
		await this.save();
	}
}
/** @deprecated */
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
/** @deprecated */
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
/** @deprecated */
export async function getCredits(this: IPlayerDocument): Promise<Number> {
	return this.inventory.credits;
}

//Section: Static Methods (for model)

export async function findOneOrCreate(this: IPlayerModel, { uId }: { uId: string }): Promise<Player> {
	const record: IPlayer | null = await this.findOne({ uId: uId });
	if (record != null) {
		return new Player(record);
	} else {
		const record = await this.create({
			uId: uId,
			inventory: new InventoryBuilder().GenericBuild(),
			ship: { name: Server.Get().Registry.DefaultShip.Name, equipped: [] },
			location: Server.Reg.DefaultLocation.Name,
			blueprints: new Array<string>(),
			exp: 30,
			skills: [0, 0, 0],
		});
		return new Player(record);
	}
}

export async function findOneOrCreateRaw(this: IPlayerModel, { uId }: { uId: string }): Promise<IPlayer> {
	let record = await this.findOne({ uId: uId });
	if (!record) {
		record = await this.create({
			uId: uId,
			inventory: new InventoryBuilder().GenericBuild(),
			ship: { name: Server.Get().Registry.DefaultShip.Name, equipped: [] },
			location: Server.Reg.DefaultLocation.Name,
			blueprints: new Array<string>(),
			exp: 30,
			skills: [0, 0, 0],
		});
	}
	return record;
}
