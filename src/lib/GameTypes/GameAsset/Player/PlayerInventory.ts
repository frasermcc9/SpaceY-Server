import { MaterialCollection, IMaterialCollectionOptions } from "../../GameCollections/MaterialCollection.ts";
import { ShipCollection, IShipCollectionOptions } from "../../GameCollections/ShipCollection.ts";
import { AttachmentCollection, IAttachmentCollectionOptions } from "../../GameCollections/AttachmentCollection.ts";
import { Client } from "../../../Client/Client.ts";

/**
 * Represents an inventory of a player. Please @see InventoryBuilder too create an inventory.
 */
export class PlayerInventory {
	private materials: MaterialCollection;
	private ships: ShipCollection;
	private attachments: AttachmentCollection;

	private credits: number;
	private tokens: number;

	constructor(options: IPlayerInventoryOptions) {
		this.materials = options.materialOptions || new MaterialCollection();
		this.ships = options.shipOptions || new ShipCollection();
		this.attachments = options.attachmentOptions || new AttachmentCollection();
		this.credits = options.credits || Client.Get().NewUserCreditValue;
		this.tokens = options.tokens || 0;
	}
}

export class InventoryBuilder {
	private materials?: IMaterialCollectionOptions;
	private ships?: IShipCollectionOptions;
	private attachments?: IAttachmentCollectionOptions;

	private credits?: number;
	private tokens?: number;

	public SetMaterials(matOptions: IMaterialCollectionOptions): InventoryBuilder {
		this.materials = matOptions;
		return this;
	}
	public SetShips(shipOptions: IShipCollectionOptions): InventoryBuilder {
		this.ships = shipOptions;
		return this;
	}
	public SetAttachments(attachmentOptions: IAttachmentCollectionOptions): InventoryBuilder {
		this.attachments = attachmentOptions;
		return this;
	}
	public SetCredits(credits: number): InventoryBuilder {
		this.credits = credits;
		return this;
	}
	public SetTokens(tokens: number): InventoryBuilder {
		this.tokens = tokens;
		return this;
	}

	public Build(): PlayerInventory {
		return new PlayerInventory({
			attachmentOptions: new AttachmentCollection({ data: this.attachments?.data }),
			materialOptions: new MaterialCollection({ data: this.materials?.data }),
			shipOptions: new ShipCollection({ data: this.ships?.data }),
			credits: this.credits,
			tokens: this.tokens,
		});
	}
}

interface IPlayerInventoryOptions {
	materialOptions?: MaterialCollection;
	shipOptions?: ShipCollection;
	attachmentOptions?: AttachmentCollection;

	credits?: number;
	tokens?: number;
}
