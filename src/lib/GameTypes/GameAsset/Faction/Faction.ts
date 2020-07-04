import { GameAsset } from "../GameAsset";

export class Faction extends GameAsset {
	private techLevel: number;

	public constructor(options: FactionOptions) {
		super({ name: options.name, description: options.description });
		this.techLevel = options.techLevel ?? 0;
	}

	public get TechLevel(): number {
		return this.techLevel;
	}
}

export class FactionBuilder {
	private name: string;
	private description: string;
	private techLevel?: number;
	public constructor(name: string, description: string, techLevel?: number) {
		this.name = name;
		this.description = description;
		this.techLevel = techLevel;
	}
	public Build(): Faction {
		return new Faction({ name: this.name, description: this.description, techLevel: this.techLevel });
	}
}

interface FactionOptions {
	name: string;
	description: string;
	techLevel?: number;
}
