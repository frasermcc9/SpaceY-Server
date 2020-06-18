import { Ship } from "../GameTypes/GameAsset/Buildable/Ship/Ship.ts";
import { Attachment } from "../GameTypes/GameAsset/Buildable/Attachment/Attachment.ts";
import { Faction } from "../GameTypes/GameAsset/Faction/Faction.ts";
import { Material } from "../GameTypes/GameAsset/Buildable/Material/Material.ts";
import { Collection } from "../Extensions/Collection.ts";
import { GameAsset } from "../GameTypes/GameAsset/GameAsset.ts";

export class Registry {
	public constructor(copyReg?: Registry) {
		if (copyReg) {
			this.shipRegistry = new Collection(copyReg.shipRegistry);
			this.attachmentRegistry = new Collection(copyReg.attachmentRegistry);
			this.factionRegistry = new Collection(copyReg.factionRegistry);
			this.materialRegistry = new Collection(copyReg.materialRegistry);
		}
	}

	private readonly shipRegistry = new Collection<string, Ship>();
	public get ShipRegistry() {
		return this.shipRegistry;
	}
	private readonly attachmentRegistry = new Collection<string, Attachment>();
	public get AttachmentRegistry() {
		return this.attachmentRegistry;
	}
	private readonly factionRegistry = new Collection<string, Faction>();
	public get FactionRegistry() {
		return this.factionRegistry;
	}
	private readonly materialRegistry = new Collection<string, Material>();
	public get MaterialRegistry() {
		return this.materialRegistry;
	}

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
			this.materialRegistry.set(material.Name, material);
		});
		return this;
	}

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
	public NameResolver<T>(name: string, registry: Collection<string, T>): T | undefined {
		return registry.get(name);
	}
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
