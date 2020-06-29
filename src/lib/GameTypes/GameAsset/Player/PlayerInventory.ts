import { MaterialCollection, IMaterialCollectionOptions } from "../../GameCollections/MaterialCollection";
import { ShipCollection, IShipCollectionOptions } from "../../GameCollections/ShipCollection";
import { AttachmentCollection, IAttachmentCollectionOptions } from "../../GameCollections/AttachmentCollection";
import { Client } from "../../../Client/Client";
import { ReputationCollection, IReputationCollectionOptions } from "../../GameCollections/ReputationCollection";
import { IPlayerDocument } from "../../../GameApi/Database/Player/PlayerModel";
import { Material } from "../Material/Material";

/**
 * Represents an inventory of a player. Please @see InventoryBuilder too create an inventory.
 */
export class PlayerInventory {
	private materials: MaterialCollection;
	public get Materials(): MaterialCollection {
		return this.materials;
	}
	private ships: ShipCollection;
	private attachments: AttachmentCollection;
	private reputation: ReputationCollection;
	private credits: number;
	private tokens: number;

	public get Credits(): number {
		return this.credits;
	}
	public get Ships(): ShipCollection {
		return this.ships;
	}
	public get Attachments(): AttachmentCollection {
		return this.attachments;
	}
	public get Reputation(): ReputationCollection {
		return this.reputation;
	}
	public get Tokens(): number {
		return this.tokens;
	}

	public constructor(options: IPlayerInventoryOptions) {
		if (isInventory(options)) {
			this.materials = options.materialOptions || new MaterialCollection();
			this.ships = options.shipOptions || new ShipCollection();
			this.attachments = options.attachmentOptions || new AttachmentCollection();
			this.reputation = options.reputationOptions || new ReputationCollection();
			this.credits = options.credits || Client.Get().Registry.DefaultCredits;
			this.tokens = options.tokens || 0;
		} else {
			throw new Error("Invalid inventory creation.");
		}
	}

	public AddCredits({ amount }: { amount: number }): boolean {
		let checkAmount = this.credits;
		checkAmount += amount;
		if (checkAmount >= 0) {
			this.credits = checkAmount;
			return true;
		} else {
			return false;
		}
	}
	public GetGeneric(): {
		credits: number;
		tokens: number;
		materials: Map<string, number>;
		ships: Map<string, number>;
		attachments: Map<string, number>;
		reputation: Map<string, number>;
	} {
		return {
			attachments: this.attachments,
			credits: this.credits,
			materials: this.materials,
			reputation: this.reputation,
			ships: this.ships,
			tokens: this.tokens,
		};
	}
}

export class InventoryBuilder {
	private materials?: IMaterialCollectionOptions;
	private ships?: IShipCollectionOptions;
	private attachments?: IAttachmentCollectionOptions;
	private reputation?: IReputationCollectionOptions;

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
	public SetReputation(attachmentOptions: IReputationCollectionOptions): InventoryBuilder {
		this.reputation = attachmentOptions;
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
			reputationOptions: new ReputationCollection({ data: this.reputation?.data }),
			credits: this.credits,
			tokens: this.tokens,
		});
	}

	public GenericBuild(): { credits: number; tokens: number; materials: {}; ships: {}; attachments: {}; reputation: {} } {
		return {
			attachments: new AttachmentCollection(),
			credits: Client.Get().Registry.DefaultCredits,
			materials: new MaterialCollection(),
			reputation: new ReputationCollection(),
			ships: new ShipCollection(),
			tokens: 0,
		};
	}
}

interface IPlayerInventoryOptions {
	materialOptions?: MaterialCollection;
	shipOptions?: ShipCollection;
	attachmentOptions?: AttachmentCollection;
	reputationOptions?: ReputationCollection;

	credits?: number;
	tokens?: number;
}

function isDocument(object: any): object is IPlayerDocument {
	return "inventory" in object;
}
function isInventory(object: any): object is IPlayerInventoryOptions {
	return "credits" in object;
}
