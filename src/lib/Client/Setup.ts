import { Client, IClientSettings } from "./Client";
import { Material } from "../GameTypes/GameAsset/Material/Material";
import { Ship } from "../GameTypes/GameAsset/Ship/Ship";
import { Attachment } from "../GameTypes/GameAsset/Attachment/Attachment";
import { Faction } from "../GameTypes/GameAsset/Faction/Faction";
import { SpacemapNode } from "../GameTypes/GameSpacemap/SpacemapNode";
import { Spacemap } from "../GameTypes/GameSpacemap/Spacemap";
import { util } from "../Util/util";
import { connect } from "../GameApi/Database/Database";

export class Setup {
	setupClient(settings: IClientSettings): MaterialsAdder {
		Client.Create(settings);

		return new MaterialsAdder();
	}

	static begin(): Setup {
		return new Setup();
	}
}

class MaterialsAdder {
	addMaterials(materials: Material[]): ShipAdder {
		Client.Reg.RegisterMaterials({ materials: materials });
		return new ShipAdder();
	}
}

class ShipAdder {
	addShips(ships: Ship[]): AttachmentAdder {
		Client.Reg.RegisterShips({ ships: ships });
		return new AttachmentAdder();
	}
}

class AttachmentAdder {
	addAttachments(attachments: Attachment[]): FactionAdder {
		Client.Reg.RegisterAttachments({ attachments: attachments });
		return new FactionAdder();
	}
}

class FactionAdder {
	addFactions(factions: Faction[]): LocationAdder {
		Client.Reg.RegisterFactions({ factions: factions });
		return new LocationAdder();
	}
}

class LocationAdder {
	addLocations(locations: SpacemapNode[]): LinkAdder {
		Client.Reg.registerSpacemap(new Spacemap());
		Client.Reg.Spacemap.addNodes(locations);
		return new LinkAdder();
	}
}
class LinkAdder {
	addLink(a: SpacemapNode | string, b: SpacemapNode | string): this {
		Client.Reg.Spacemap.addLink(a, b);
		return this;
	}
	finishMap(): Defaults {
		Client.Reg.Spacemap.updateMap();
		return new Defaults();
	}
}

class Defaults {
	defaultCredits(n: number): this {
		Client.Reg.DefaultCredits = n;
		return this;
	}
	maxMaterialRarity(n: number): this {
		Client.Reg.MaxRarity = n;
		return this;
	}
	maxTechLevel(n: number): this {
		Client.Reg.MaxTech = n;
		return this;
	}
	defaultShip(n: string): this {
		const ship = Client.Reg.ResolveShipFromName(n);
		Client.Reg.DefaultShip = util.throwUndefined(ship, "Default ship used is invalid");
		return this;
	}
	defaultLocation(n: string | SpacemapNode): this {
		const location = Client.Reg.Spacemap.resolveNodeFromName(n);
		Client.Reg.DefaultLocation = util.throwUndefined(location, "Default location used is invalid.");
		return this;
	}
	defaultAsteroidCooldown(seconds: number): this {
		Client.Reg.DefaultAsteroidCooldown = seconds;
		return this;
	}
	finish(): void {
		connect();
		return;
	}
}
