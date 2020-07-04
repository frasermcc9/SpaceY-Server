import { Faction } from "../GameAsset/Faction/Faction";

export class SpacemapNode {
	private name: string;
	private faction: Faction;
	private requiredWarp: WarpPower;

	public constructor({ name, faction, requiredWarp }: { name: string; faction: Faction; requiredWarp: WarpPower }) {
		this.name = name;
		this.faction = faction;
		this.requiredWarp = requiredWarp;
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

export enum WarpPower {
	NONE,
	LOW,
	MODERATE,
	HIGH,
}
