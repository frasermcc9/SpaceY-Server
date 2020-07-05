import { Faction } from "../GameAsset/Faction/Faction";
import { BaseStore } from "../GameStore/BaseStore";
import { Asteroid, AsteroidBuilder } from "../GameMechanics/Asteroid";

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
		this.requiredWarp = requiredWarp ?? WarpPower.NONE;
		this.stores = stores;
		this.techLevel = techLevel ?? 0;
		this.asteroids = asteroids;
	}
	public toString(): string {
		return `${this.faction.Name}: ${this.name}`;
	}
	public get Name(): string {
		return this.name;
	}
	public get Faction(): Faction {
		return this.faction;
	}
	public get RequiredWarp(): WarpPower {
		return this.requiredWarp;
	}
}

export class SpacemapNodeBuilder {
	private name: string;
	private faction: Faction;
	private requiredWarp?: WarpPower;
	private stores: BaseStore[] = [];
	private techLevel?: number;

	private asteroids: Asteroid[] = [];

	public constructor({ name, faction }: { name: string; faction: Faction }) {
		this.name = name;
		this.faction = faction;
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

	requiredWarp?: WarpPower;
	stores: BaseStore[];
	techLevel?: number;
};
