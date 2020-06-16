import { Ship } from "../GameTypes/GameAsset/Buildable/Ship/Ship.ts";
import { Attachment } from "../GameTypes/GameAsset/Buildable/Attachment/Attachment.ts";
import { Faction } from "../GameTypes/GameAsset/Faction/Faction.ts";
import { BaseMaterial } from "../GameTypes/GameAsset/Buildable/Material/BaseMaterial.ts";
import { Collection } from "../Extensions/Collection.ts";

export class Registry {
	public constructor() {}

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
	private readonly materialRegistry = new Collection<string, BaseMaterial>();
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
	materials: BaseMaterial[];
}
