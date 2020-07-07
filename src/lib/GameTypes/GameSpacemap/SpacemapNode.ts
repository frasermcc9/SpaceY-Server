import { Faction } from "../GameAsset/Faction/Faction";
import { BaseStore, StoreType } from "../GameStore/BaseStore";
import { Asteroid, AsteroidBuilder } from "../GameMechanics/Asteroid";
import { Player } from "../GameAsset/Player/Player";

export class SpacemapNode {
	private name: string;
	private faction: Faction;
	private requiredWarp: WarpPower;

	private stores: BaseStore[];
	private techLevel: number;

	private asteroids: Asteroid[];

	public constructor({ name, faction, requiredWarp, stores, techLevel, asteroids }: TSpaceMapNode) {
		this.name = name;
		this.faction = faction;
		this.requiredWarp = requiredWarp;
		this.stores = stores;
		this.techLevel = techLevel ?? 0;
		this.asteroids = asteroids;
	}

	public toString(): string {
		return `${this.faction.Name}: ${this.name}`;
	}

	//#region - Gets
	public get Name(): string {
		return this.name;
	}
	public get Faction(): Faction {
		return this.faction;
	}
	public get RequiredWarp(): WarpPower {
		return this.requiredWarp;
	}
	public get TechLevel(): number {
		return this.techLevel;
	}
	//#endregion - Gets

	//#region - Asteroids
	public get Asteroids(): Asteroid[] {
		return this.asteroids;
	}
	public availableAsteroids(player: Player): Asteroid[] {
		return this.asteroids.filter((val) => val.isAvailableForUser(player));
	}
	//#endregion - Asteroids

	//#region - Stores

	public storeDisplayNames(): string[] {
		return this.stores.map((el) => el.identity());
	}

	public nodeMaterialStores(): BaseStore[] {
		return this.stores.filter((el) => el.isType(StoreType.MATERIAL_STORE));
	}
	public nodeShipStores(): BaseStore[] {
		return this.stores.filter((el) => el.isType(StoreType.SHIP_STORE));
	}
	public nodeAttachmentStores(): BaseStore[] {
		return this.stores.filter((el) => el.isType(StoreType.ATTACHMENT_STORE));
	}

	//#endregion
}

export class SpacemapNodeBuilder {
	private name: string;
	private faction: Faction;
	private requiredWarp: WarpPower;
	private stores: BaseStore[] = [];
	private techLevel?: number;

	private asteroids: Asteroid[] = [];

	public constructor({ name, faction, requiredWarp }: { name: string; faction: Faction; requiredWarp: WarpPower }) {
		this.name = name;
		this.faction = faction;
		this.requiredWarp = requiredWarp;
	}

	public addStore(store: BaseStore) {
		this.stores.push(store);
	}

	public addAsteroid(asteroid: Asteroid) {
		this.asteroids.push(asteroid);
	}

	public build(): SpacemapNode {
		return new SpacemapNode({
			name: this.name,
			faction: this.faction,
			requiredWarp: this.requiredWarp,
			stores: this.stores,
			techLevel: this.techLevel,
			asteroids: this.asteroids,
		});
	}
}

export enum WarpPower {
	NONE,
	LOW,
	MODERATE,
	HIGH,
}

type TSpaceMapNode = {
	name: string;
	faction: Faction;

	asteroids: Asteroid[];

	requiredWarp: WarpPower;
	stores: BaseStore[];
	techLevel?: number;
};
