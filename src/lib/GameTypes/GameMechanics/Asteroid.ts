import { MaterialCollection, IMaterialCollectionOptions } from "../GameCollections/MaterialCollection";
import { Player } from "../GameAsset/Player/Player";
import { Client } from "../../Client/Client";
import { GameEvent } from "../GameAsset/Attachment/Attachment";

export class Asteroid extends MaterialCollection {
	private cooldown: number;
	private timeoutMap = new Map<string, number>();
	private timeoutIntervals = new Set<NodeJS.Timeout>();

	constructor(options: IMaterialCollectionOptions, cooldown: number = Client.Reg.DefaultAsteroidCooldown) {
		super(options);
		this.cooldown = cooldown;
	}
	/**
	 * Asynchronously adds and then removes players from the cooldown map after
	 * the duration provided. Stores the player uid for the timeout, and keeps
	 * track of the time it was added.
	 * @param player the player to add to the timeout
	 * @param cooldown the duration (in seconds) of the cooldown (optional)
	 */
	private cooldownManager(player: Player, cooldown: number = this.cooldown): void {
		this.timeoutMap.set(player.UId, Date.now());
		this.timeoutIntervals.add(
			setTimeout(() => {
				this.timeoutMap.delete(player.UId);
			}, 1000 * cooldown)
		);
	}
	/**
	 * Finds the time remaining for a given player's cooldown, in seconds. Will
	 * return 0 if they are not in the timeout map/
	 * @param player the player to query.
	 * @returns time in seconds (rounded to nearest second) remaining.
	 */
	private remainingCooldown(player: Player): number {
		const now = Date.now(),
			started = this.timeoutMap.get(player.UId) ?? now,
			inMap = (started - now) / 1000;
		if (started == now) return 0;
		return Math.floor(this.cooldown - inMap);
	}
	public isAvailableForUser(player: Player): boolean {
		return this.remainingCooldown(player) == 0;
	}
	/**
	 *
	 * @param player
	 * @param percent
	 * @param cooldownOverride
	 * @returns codes:<br />  \
	 * 200 - success<br />  \
	 * 403 - on cooldown<br />  \
	 */
	public async mine(
		player: Player,
		percent?: number,
		cooldownOverride?: boolean
	): Promise<{ code: 200 | 403; cooldown?: number }> {
		//check cooldown
		const cd = this.remainingCooldown(player);
		if (cd > 0 && !cooldownOverride) return { code: 403, cooldown: cd };
		//apply probabilities
		if (percent != undefined) this.applyDeviation(percent);
		//apply mining laser
		player.getShipWrapper().dispatch(GameEvent.MINE, { asteroid: this });
		//set cooldown
		this.cooldownManager(player, this.cooldown);
		//add to player
		await player.InventorySum("materials", this);
		return { code: 200 };
	}

	public clearCooldowns(): void {
		this.timeoutMap.clear();
		this.timeoutIntervals.forEach((el) => clearTimeout(el));
	}

	/**
	 * Mines the collection without saving it to the database. The save method
	 * must be called manually in order to save the materials.
	 * @param player the player that mined the collection
	 * @internal
	 */
	public PlayerMine(player: Player): void {
		player.Inventory.Materials.SumCollection(this);
	}
	/**
	 * Mines the collection and saves its contents to the players inventory.
	 * @param player the player that mined the collection
	 * @internal
	 */
	public PlayerMineAndSave(player: Player): void {
		player.InventorySum("materials", this);
	}
	/**
	 * Modifies the collection, applying a random percent change to the values
	 * of the collection. Makes the collection more dynamic.
	 * @param percent should be entered as '20' for 20%, not 0.2.
	 * @internal
	 */
	private applyDeviation(percent: number): void {
		let mean = ~~(this.CollectionSize / this.size),
			deviation = Math.ceil(mean * (percent / 100)),
			max = mean + deviation,
			min = mean - deviation > 0 ? mean - deviation : 0;
		this.forEach((el, key) => {
			const NewAmount = el + Math.ceil(Math.random() * (max - min) - (max - min) / 2);
			if (el != 0) this.set(key, NewAmount);
		});
	}
}

export class AsteroidBuilder {
	public cooldown?: number;

	public setCooldown(seconds: number): this {
		this.cooldown = seconds;
		return this;
	}

	public BuildRandom({ value }: { value: number }): Asteroid {
		if (value < 0 && Client.Get().ConsoleLogging) console.warn("Negative asteroid value passed.");
		const collection = MaterialCollection.GenerateMineableCollection(value);
		return new Asteroid({ data: collection }, this.cooldown);
	}

	public BuildCustom(materialCollection: IMaterialCollectionOptions): Asteroid {
		return new Asteroid(materialCollection, this.cooldown);
	}
}
