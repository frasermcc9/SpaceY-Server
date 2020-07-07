import { GameAsset, IGameAsset, IGameAssetOptions, IStrengthOptions } from "../GameAsset";
import { Blueprint } from "../Blueprint/Blueprint";
import { AttachmentType } from "../Attachment/Attachment";
import { StrengthComparable } from "../AssetDecorators";
import { MapCollection } from "../../../Extensions/Collections";

export class Ship extends GameAsset implements IShip, StrengthComparable {
	//Inherited: Name, Description, Cost, Blueprint, TechLevel

	private subclass: string;

	private baseHp: number;
	private baseShield: number;
	private baseEnergy: number[];
	private baseCargo: number;
	private baseHandling: number;

	private strength: number;
	private maxTech: number;

	private AttachmentCaps: MapCollection<AttachmentType, number> = new MapCollection();

	private imageUri: string;

	public constructor(options: ShipOptions) {
		super(options);
		this.subclass = options.subclass ?? "";
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
		this.maxTech = [...this.AttachmentCaps.values()].reduce((acc, cur) => acc + cur, 0) * this.TechLevel + 3;

		this.strength = Math.round(
			(16000 * this.TechLevel +
				575 * this.baseHp +
				450 * this.baseShield +
				1500 * this.baseEnergy[0] +
				1500 * this.baseEnergy[1] +
				1500 * this.baseEnergy[2] +
				50 * this.baseCargo +
				12000 * this.baseHandling +
				25000 * (options.primaryCap ?? 0) +
				20000 * (options.shieldCap ?? 0) +
				15000 * (options.heavyCap ?? 0) +
				7000 * (options.minerCap ?? 0) +
				15000 * (options.generalCap ?? 0) +
				1000 * ([...this.AttachmentCaps.values()].reduce((acc, cur) => acc + cur, 0) * this.TechLevel + 3)) /
				1000
		);
	}

	public stringify(): string {
		return JSON.stringify(this);
	}

	public get Strength(): number {
		return this.strength;
	}
	public get MaxTech(): number {
		return this.maxTech;
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
	public get ShipStatistics(): {
		baseHp: number;
		baseShield: number;
		baseEnergy: number[];
		baseCargo: number;
		baseHandling: number;
	} {
		return {
			baseHp: this.baseHp,
			baseShield: this.baseShield,
			baseEnergy: this.baseEnergy.slice(),
			baseCargo: this.baseCargo,
			baseHandling: this.baseHandling,
		};
	}
}

export interface IShip extends IGameAsset {
	Subclass: string;
	TechLevel: number;
	ImageUri: string;
	WeaponCapacities: Map<AttachmentType, number>;
	ShipStatistics: {
		baseHp: number;
		baseShield: number;
		baseEnergy: number[];
		baseCargo: number;
		baseHandling: number;
	};
}

export class ShipBuilder {
	public constructor(private readonly options: ShipOptions) {}

	public EnableSell(price: number): ShipBuilder {
		this.options.cost = price;
		return this;
	}
	public SetMisc({ uri, subclass }: { uri?: string; subclass?: string }): this {
		this.options.imageUri = uri;
		this.options.subclass = subclass;
		return this;
	}

	public EnableBuildable(blueprint: Blueprint): ShipBuilder {
		this.options.blueprint = blueprint;
		return this;
	}

	/* 	public SetTechLevel(techLevel: number): ShipBuilder {
		this.options.techLevel = techLevel;
		return this;
	} */
	public SetStats(stats: ShipStats): ShipBuilder {
		this.options.baseHp = stats.baseHp;
		this.options.baseShield = stats.baseShield;
		this.options.baseEnergy = stats.baseEnergy;
		this.options.baseCargo = stats.baseCargo;
		this.options.baseHandling = stats.baseHandling;
		return this;
	}
	public SetWeapons(weapons: WeaponOptions): ShipBuilder {
		this.options.primaryCap = weapons.primaryCap;
		this.options.shieldCap = weapons.shieldCap;
		this.options.heavyCap = weapons.heavyCap;
		this.options.minerCap = weapons.minerCap;
		this.options.generalCap = weapons.generalCap;
		return this;
	}

	public Build(): Ship {
		return new Ship(this.options);
	}
}

interface ShipOptions extends IGameAssetOptions, ShipStats, WeaponOptions {
	subclass?: string;
	imageUri?: string;
}

interface ShipStats {
	baseHp?: number;
	baseShield?: number;
	baseEnergy?: number[];
	baseCargo?: number;
	baseHandling?: number;
}

interface WeaponOptions {
	primaryCap?: number;
	shieldCap?: number;
	heavyCap?: number;
	minerCap?: number;
	generalCap?: number;
}
