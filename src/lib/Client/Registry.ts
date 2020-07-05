import { Ship, ShipBuilder } from "../GameTypes/GameAsset/Ship/Ship";
import { Attachment } from "../GameTypes/GameAsset/Attachment/Attachment";
import { Faction } from "../GameTypes/GameAsset/Faction/Faction";
import { Material } from "../GameTypes/GameAsset//Material/Material";
import { MapCollection } from "../Extensions/Collections";
import { GameAsset } from "../GameTypes/GameAsset/GameAsset";
import { BlueprintBuilder } from "../GameTypes/GameAsset/Blueprint/Blueprint";

export class Registry {
	public constructor(copyReg?: Registry) {
		if (copyReg) {
			this.shipRegistry = new MapCollection(copyReg.shipRegistry);
			this.attachmentRegistry = new MapCollection(copyReg.attachmentRegistry);
			this.factionRegistry = new MapCollection(copyReg.factionRegistry);
			this.materialRegistry = new MapCollection(copyReg.materialRegistry);
		}
		this.RegisterShips({ ships: [BlankShip] });
		this.defaultShip = BlankShip;
	}
	private maxRarity: number = 1;
	public get MaxRarity() {
		return this.maxRarity;
	}
	public set MaxRarity(v: number) {
		this.maxRarity = v;
	}

	//#region - Defaults

	private defaultShip: Ship;
	public get DefaultShip(): Ship {
		return this.defaultShip;
	}
	public set DefaultShip(value: Ship) {
		if (this.defaultShip != BlankShip)
			throw new Error(
				"Default ship has already been set. It can only be set once. If this was intentional, use the 'ForceChangeDefaultShip()' method."
			);
		this.defaultShip = value;
	}
	public set ForceChangeDefaultShip(value: Ship) {
		this.defaultShip = value;
	}

	private defaultCredits = 0;
	public get DefaultCredits(): number {
		return this.defaultCredits;
	}
	public set DefaultCredits(value: number) {
		if (this.defaultCredits != 0)
			throw new Error(
				"Default credits has already been set. It can only be set once. If this was intentional, use the 'ForceChangeDefaultCredits()' method."
			);
		this.defaultCredits = value;
	}
	public set ForceChangeDefaultCredits(value: number) {
		this.defaultCredits = value;
	}

	private defaultAsteroidCooldown: number = 0;
	public get DefaultAsteroidCooldown(): number {
		return this.defaultAsteroidCooldown;
	}
	public set DefaultAsteroidCooldown(seconds: number) {
		this.defaultAsteroidCooldown = seconds;
	}

	//#endregion - Defaults

	//#region - Registries

	private readonly shipRegistry = new MapCollection<string, Ship>();
	public get ShipRegistry() {
		return this.shipRegistry;
	}
	private readonly attachmentRegistry = new MapCollection<string, Attachment>();
	public get AttachmentRegistry() {
		return this.attachmentRegistry;
	}
	private readonly factionRegistry = new MapCollection<string, Faction>();
	public get FactionRegistry() {
		return this.factionRegistry;
	}
	private readonly materialRegistry = new MapCollection<string, Material>();
	public get MaterialRegistry() {
		return this.materialRegistry;
	}
	private readonly mineableMaterialRegistry = new MapCollection<string, Material>();
	public get MineableMaterialRegistry() {
		return this.mineableMaterialRegistry;
	}
	private readonly sellableMaterialRegistry = new MapCollection<string, Material>();
	public get SellableMaterialRegistry() {
		return this.sellableMaterialRegistry;
	}

	//#endregion - Registries

	//#region - Register Methods

	public RegisterShips(data: IShips): Registry {
		data.ships.forEach((ship) => {
			this.shipRegistry.set(ship.Name, ship);
		});
		return this;
	}
	public RegisterAttachments(data: IAttachments): Registry {
		data.attachments.forEach((attachment) => {
			this.attachmentRegistry.set(attachment.Name, attachment);
		});
		return this;
	}
	public RegisterFactions(data: IFactions): Registry {
		data.factions.forEach((faction) => {
			this.factionRegistry.set(faction.Name, faction);
		});
		return this;
	}
	public RegisterMaterials(data: IMaterials): Registry {
		data.materials.forEach((material) => {
			this.materialRegistry.set(material.Name, material); //add to complete registry
			if (material.IsMineable()) this.mineableMaterialRegistry.set(material.Name, material); //if mineable, add to mineable registry too
		});
		return this;
	}

	//#endregion - Register Methods

	//#region - Resolution Methods

	public ResolveShipFromName(name: string): Ship | undefined {
		const result = this.NameResolver<Ship>(name, this.ShipRegistry);
		if (!result) return undefined;
		return result;
	}
	public ResolveAttachmentFromName(name: string): Attachment | undefined {
		const result = this.NameResolver<Attachment>(name, this.AttachmentRegistry);
		if (!result) return undefined;
		return result;
	}
	public ResolveMaterialFromName(name: string): Material | undefined {
		const result = this.NameResolver<Material>(name, this.MaterialRegistry);
		if (!result) return undefined;
		return result;
	}
	public ResolveFactionFromName(name: string): Faction | undefined {
		const result = this.NameResolver<Faction>(name, this.FactionRegistry);
		if (!result) return undefined;
		return result;
	}
	/**
	 * @param T the type of object that should be resolved
	 * @param name the string name of the object
	 * @param registry the registry to search
	 */
	private NameResolver<T>(name: string, registry: MapCollection<string, T>): T | undefined {
		return registry.get(name);
	}

	public AnyResolve(name: string): GameAsset | undefined {
		return (
			this.materialRegistry.get(name) ??
			this.attachmentRegistry.get(name) ??
			this.factionRegistry.get(name) ??
			this.shipRegistry.get(name)
		);
	}

	//#endregion - Resolution Methods
}

interface IShips {
	ships: Ship[];
}
interface IAttachments {
	attachments: Attachment[];
}
interface IFactions {
	factions: Faction[];
}
interface IMaterials {
	materials: Material[];
}

const BlankShip = new ShipBuilder({ name: "Default Ship", description: "There is no default ship" })
	.EnableSell(15000)
	.SetStats({ baseShield: 15, baseCargo: 100, baseEnergy: [3, 5, 1], baseHandling: 1, baseHp: 50 })
	.SetWeapons({ generalCap: 1, heavyCap: 0, minerCap: 1, primaryCap: 1, shieldCap: 0 })
	.SetSubclass("Scrap Ship")
	.SetTechLevel(1)
	.SetImageUri("No Image")
	.Build();

export type RegistryNames = "AttachmentRegistry" | "FactionRegistry" | "MaterialRegistry" | "ShipRegistry";
