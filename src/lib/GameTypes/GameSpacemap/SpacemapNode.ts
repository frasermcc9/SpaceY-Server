import { Faction } from "../GameAsset/Faction/Faction";
import { BaseStore, StoreType } from "../GameStore/BaseStore";
import { Asteroid, AsteroidBuilder } from "../GameMechanics/Asteroid";
import { Player } from "../GameAsset/Player/Player";
import { MaterialStore } from "../GameStore/MaterialStore";
import { ShipStore } from "../GameStore/ShipStore";
import { AttachmentStore } from "../GameStore/AttachmentStore";

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

	public addStore(store: BaseStore) {
		store.setFaction(this.faction);
		this.stores.push(store);
	}

	public addAsteroid(asteroid: Asteroid) {
		this.asteroids.push(asteroid);
	}

	public storeDisplayNames(): string[] {
		return this.stores.map((el) => el.identity());
	}

	public nodeAllStores(): BaseStore[] {
		return this.stores;
	}

	public nodeMaterialStores(): MaterialStore[] {
		return this.stores.filter((el) => el.isType(StoreType.MATERIAL_STORE)) as MaterialStore[];
	}
	public nodeShipStores(): ShipStore[] {
		return this.stores.filter((el) => el.isType(StoreType.SHIP_STORE)) as ShipStore[];
	}
	public nodeAttachmentStores(): AttachmentStore[] {
		return this.stores.filter((el) => el.isType(StoreType.ATTACHMENT_STORE)) as AttachmentStore[];
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

	public addStore(store: BaseStore): this {
		store.setFaction(this.faction);
		this.stores.push(store);
		return this;
	}

	public addAsteroid(asteroid: Asteroid): this {
		this.asteroids.push(asteroid);
		return this;
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
