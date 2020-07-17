import { Server } from "../../../Server/Server";
import { AttachmentCollection, IAttachmentCollectionOptions } from "../../GameCollections/AttachmentCollection";
import { IMaterialCollectionOptions } from "../../GameCollections/MaterialCollection";
import { IReputationCollectionOptions, ReputationCollection } from "../../GameCollections/ReputationCollection";
import { IShipCollectionOptions, ShipCollection } from "../../GameCollections/ShipCollection";
import { PlayerMaterialCollection } from "../../GameCollections/PlayerMaterialCollection";
import { Player } from "./Player";

/**
 * Represents an inventory of a player. Please @see InventoryBuilder too create an inventory.
 */
export class PlayerInventory {
	private readonly materials: PlayerMaterialCollection;
	public get Materials(): PlayerMaterialCollection {
		return this.materials;
	}
	private readonly ships: ShipCollection;
	private readonly attachments: AttachmentCollection;
	private readonly reputation: ReputationCollection;
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
			this.materials = options.materialOptions;
			this.ships = options.shipOptions;
			this.attachments = options.attachmentOptions;
			this.reputation = options.reputationOptions;
			this.credits = options.credits ?? Server.Reg.DefaultCredits;
			this.tokens = options.tokens ?? 0;
		} else {
			throw new Error("Invalid inventory creation.");
		}
	}

	public removeTokens({ amount }: { amount: number }): boolean {
		if (amount < 0) throw new Error("Cannot remove negative tokens");
		if (this.tokens < amount) return false;
		this.tokens -= amount;
		return true;
	}
	public addTokens({ amount }: { amount: number }): boolean {
		if (amount < 0) throw new Error("Cannot add negative tokens");
		this.tokens += amount;
		return true;
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

export type TRegistered = "materials" | "reputation" | "attachments" | "ships";

export class InventoryBuilder {
	private materials?: IMaterialCollectionOptions;
	private ships?: IShipCollectionOptions;
	private attachments?: IAttachmentCollectionOptions;
	private reputation?: IReputationCollectionOptions;

	private credits?: number;
	private tokens?: number;

	public constructor() {}

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
			materialOptions: new PlayerMaterialCollection({ data: this.materials?.data }),
			shipOptions: new ShipCollection({ data: this.ships?.data }),
			reputationOptions: new ReputationCollection({ data: this.reputation?.data }),
			credits: this.credits,
			tokens: this.tokens,
		});
	}

	public GenericBuild(): {
		credits: number;
		tokens: number;
		materials: Map<string, number>;
		ships: Map<string, number>;
		attachments: Map<string, number>;
		reputation: Map<string, number>;
	} {
		return {
			attachments: new AttachmentCollection(),
			credits: Server.Get().Registry.DefaultCredits,
			materials: new PlayerMaterialCollection(),
			reputation: new ReputationCollection(),
			ships: new ShipCollection(),
			tokens: 0,
		};
	}
}

interface IPlayerInventoryOptions {
	materialOptions: PlayerMaterialCollection;
	shipOptions: ShipCollection;
	attachmentOptions: AttachmentCollection;
	reputationOptions: ReputationCollection;

	credits?: number;
	tokens?: number;
}

function isInventory(object: any): object is IPlayerInventoryOptions {
	return "credits" in object;
}
