import { GameAsset, IGameAsset } from "../GameAsset";
import { Blueprint } from "../Blueprint/Blueprint";
import { AttachmentType } from "../Attachment/Attachment";

export class Ship extends GameAsset implements IShip {
	//Inherited: Name, Description, Cost, Blueprint

	private subclass: string;
	private techLevel: number;

	private baseHp: number;
	private baseShield: number;
	private baseEnergy: number[];
	private baseCargo: number;
	private baseHandling: number;

	private AttachmentCaps: Map<AttachmentType, number> = new Map();

	private imageUri: string;

	public constructor(options: ShipOptions) {
		super({ name: options.name, description: options.description, blueprint: options.blueprint, cost: options.cost });
		this.subclass = options.subclass ?? "";
		this.techLevel = options.techLevel ?? 0;
		this.baseHp = options.baseHp ?? 0;
		this.baseShield = options.baseShield ?? 0;
		this.baseEnergy = options.baseEnergy ?? [0, 0, 0];
		this.baseCargo = options.baseCargo ?? 0;
		this.baseHandling = options.baseHandling ?? 0;

		this.AttachmentCaps.set(AttachmentType.GENERAL, options.generalCap ?? 0)
			.set(AttachmentType.HEAVY, options.heavyCap ?? 0)
			.set(AttachmentType.MINER, options.minerCap ?? 0)
			.set(AttachmentType.PRIMARY, options.primaryCap ?? 0)
			.set(AttachmentType.SHIELD, options.shieldCap ?? 0);

		this.imageUri = options.imageUri ?? "";
	}

	public stringify(): string {
		return JSON.stringify(this);
	}

	public get TechLevel(): number {
		return this.techLevel;
	}
	public get ImageUri(): string {
		return this.imageUri;
	}
	public get Subclass(): string {
		return this.subclass;
	}
	public get WeaponCapacities(): Map<AttachmentType, number> {
		return new Map(this.AttachmentCaps);
	}
	public get ShipStatistics(): { baseHp: number; baseShield: number; baseEnergy: number[]; baseCargo: number; baseHandling: number } {
		return { baseHp: this.baseHp, baseShield: this.baseShield, baseEnergy: this.baseEnergy.slice(), baseCargo: this.baseCargo, baseHandling: this.baseHandling };
	}
}

export interface IShip extends IGameAsset {
	Subclass: string;
	TechLevel: number;
	ImageUri: string;
	WeaponCapacities: Map<AttachmentType, number>;
	ShipStatistics: { baseHp: number; baseShield: number; baseEnergy: number[]; baseCargo: number; baseHandling: number };
}

export class ShipBuilder {
	private name: string;
	private description: string;
	private cost?: number;
	private blueprint?: Blueprint;
	private subclass?: string;
	private techLevel?: number;
	private baseHp?: number;
	private baseShield?: number;
	private baseEnergy?: number[];
	private baseCargo?: number;
	private baseHandling?: number;
	private generalCap?: number;
	private primaryCap?: number;
	private heavyCap?: number;
	private shieldCap?: number;
	private minerCap?: number;
	private imageUri?: string;

	public constructor({ name, description }: { name: string; description: string }) {
		this.name = name;
		this.description = description;
	}

	public EnableSell(price: number): ShipBuilder {
		this.cost = price;
		return this;
	}

	public EnableBuildable(blueprint: Blueprint): ShipBuilder {
		this.blueprint = blueprint;
		return this;
	}
	public SetSubclass(subclass: string): ShipBuilder {
		this.subclass = subclass;
		return this;
	}
	public SetTechLevel(techLevel: number): ShipBuilder {
		this.techLevel = techLevel;
		return this;
	}
	public SetStats(stats: ShipStats): ShipBuilder {
		this.baseHp = stats.baseHp;
		this.baseShield = stats.baseShield;
		this.baseEnergy = stats.baseEnergy;
		this.baseCargo = stats.baseCargo;
		this.baseHandling = stats.baseHandling;
		return this;
	}
	public SetWeapons(weapons: WeaponOptions): ShipBuilder {
		this.primaryCap = weapons.primaryCap;
		this.shieldCap = weapons.shieldCap;
		this.heavyCap = weapons.heavyCap;
		this.minerCap = weapons.minerCap;
		this.generalCap = weapons.generalCap;
		return this;
	}
	public SetImageUri(uri: string): ShipBuilder {
		this.imageUri = uri;
		return this;
	}

	public Build(): Ship {
		return new Ship({
			name: this.name,
			description: this.description,
			cost: this.cost,
			blueprint: this.blueprint,
			subclass: this.subclass,
			techLevel: this.techLevel,
			baseHp: this.baseHp,
			baseShield: this.baseShield,
			baseEnergy: this.baseEnergy,
			baseCargo: this.baseCargo,
			baseHandling: this.baseHandling,
			generalCap: this.generalCap,
			primaryCap: this.primaryCap,
			heavyCap: this.heavyCap,
			shieldCap: this.shieldCap,
			minerCap: this.minerCap,
			imageUri: this.imageUri,
		});
	}
}

type ShipOptions = {
	name: string;
	description: string;
	cost?: number;
	blueprint?: Blueprint;
	subclass?: string;
	techLevel?: number;
	baseHp?: number;
	baseShield?: number;
	baseEnergy?: number[];
	baseCargo?: number;
	baseHandling?: number;
	generalCap?: number;
	primaryCap?: number;
	heavyCap?: number;
	shieldCap?: number;
	minerCap?: number;
	imageUri?: string;
};

type ShipStats = {
	baseHp?: number;
	baseShield?: number;
	baseEnergy?: number[];
	baseCargo?: number;
	baseHandling?: number;
};

type WeaponOptions = {
	primaryCap?: number;
	shieldCap?: number;
	heavyCap?: number;
	minerCap?: number;
	generalCap?: number;
};
