import { Server, IClientSettings } from "./Server";
import { Material } from "../GameTypes/GameAsset/Material/Material";
import { Ship } from "../GameTypes/GameAsset/Ship/Ship";
import { Attachment } from "../GameTypes/GameAsset/Attachment/Attachment";
import { Faction } from "../GameTypes/GameAsset/Faction/Faction";
import { SpacemapNode } from "../GameTypes/GameSpacemap/SpacemapNode";
import { Spacemap } from "../GameTypes/GameSpacemap/Spacemap";
import { util } from "../Util/util";
import { connect } from "../Database/Database";

export class Setup {
	setupClient(settings: IClientSettings): MaterialsAdder {
		Server.Create(settings);

		return new MaterialsAdder();
	}

	static begin(): Setup {
		return new Setup();
	}
}

class MaterialsAdder {
	addMaterials(materials: Material[]): ShipAdder {
		Server.Reg.RegisterMaterials({ materials: materials });
		return new ShipAdder();
	}
}

class ShipAdder {
	addShips(ships: Ship[]): AttachmentAdder {
		Server.Reg.RegisterShips({ ships: ships });
		return new AttachmentAdder();
	}
}

class AttachmentAdder {
	addAttachments(attachments: Attachment[]): FactionAdder {
		Server.Reg.RegisterAttachments({ attachments: attachments });
		return new FactionAdder();
	}
}

class FactionAdder {
	addFactions(factions: Faction[]): LocationAdder {
		Server.Reg.RegisterFactions({ factions: factions });
		return new LocationAdder();
	}
}

class LocationAdder {
	addLocations(locations: SpacemapNode[]): LinkAdder {
		Server.Reg.registerSpacemap(new Spacemap());
		Server.Reg.Spacemap.addNodes(locations);
		return new LinkAdder();
	}
}
class LinkAdder {
	addLink(a: SpacemapNode | string, b: SpacemapNode | string): this {
		Server.Reg.Spacemap.addLink(a, b);
		return this;
	}
	finishMap(): Defaults {
		Server.Reg.Spacemap.updateMap();
		return new Defaults();
	}
}

class Defaults {
	defaultCredits(n: number): this {
		Server.Reg.DefaultCredits = n;
		return this;
	}
	maxMaterialRarity(n: number): this {
		Server.Reg.MaxRarity = n;
		return this;
	}
	maxTechLevel(n: number): this {
		Server.Reg.MaxTech = n;
		return this;
	}
	defaultShip(n: string): this {
		const ship = Server.Reg.ResolveShipFromName(n);
		Server.Reg.DefaultShip = util.throwUndefined(ship, "Default ship used is invalid");
		return this;
	}
	defaultLocation(n: string | SpacemapNode): this {
		const location = Server.Reg.Spacemap.resolveNodeFromName(n);
		Server.Reg.DefaultLocation = util.throwUndefined(location, "Default location used is invalid.");
		return this;
	}
	defaultAsteroidCooldown(seconds: number): this {
		Server.Reg.DefaultAsteroidCooldown = seconds;
		return this;
	}
	finish(): void {
		connect();
		return;
	}
}
