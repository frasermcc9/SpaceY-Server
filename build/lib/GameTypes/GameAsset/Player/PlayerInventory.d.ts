import { AttachmentCollection, IAttachmentCollectionOptions } from "../../GameCollections/AttachmentCollection";
import { IMaterialCollectionOptions, MaterialCollection } from "../../GameCollections/MaterialCollection";
import { IReputationCollectionOptions, ReputationCollection } from "../../GameCollections/ReputationCollection";
import { IShipCollectionOptions, ShipCollection } from "../../GameCollections/ShipCollection";
/**
 * Represents an inventory of a player. Please @see InventoryBuilder too create an inventory.
 */
export declare class PlayerInventory {
    private readonly materials;
    get Materials(): MaterialCollection;
    private readonly ships;
    private readonly attachments;
    private readonly reputation;
    private credits;
    private tokens;
    get Credits(): number;
    get Ships(): ShipCollection;
    get Attachments(): AttachmentCollection;
    get Reputation(): ReputationCollection;
    get Tokens(): number;
    constructor(options: IPlayerInventoryOptions);
    AddCredits({ amount }: {
        amount: number;
    }): boolean;
    GetGeneric(): {
        credits: number;
        tokens: number;
        materials: Map<string, number>;
        ships: Map<string, number>;
        attachments: Map<string, number>;
        reputation: Map<string, number>;
    };
}
export declare type TRegistered = "materials" | "reputation" | "attachments" | "ships";
export declare class InventoryBuilder {
    private materials?;
    private ships?;
    private attachments?;
    private reputation?;
    private credits?;
    private tokens?;
    SetMaterials(matOptions: IMaterialCollectionOptions): InventoryBuilder;
    SetShips(shipOptions: IShipCollectionOptions): InventoryBuilder;
    SetAttachments(attachmentOptions: IAttachmentCollectionOptions): InventoryBuilder;
    SetReputation(attachmentOptions: IReputationCollectionOptions): InventoryBuilder;
    SetCredits(credits: number): InventoryBuilder;
    SetTokens(tokens: number): InventoryBuilder;
    Build(): PlayerInventory;
    GenericBuild(): {
        credits: number;
        tokens: number;
        materials: {};
        ships: {};
        attachments: {};
        reputation: {};
    };
}
interface IPlayerInventoryOptions {
    materialOptions?: MaterialCollection;
    shipOptions?: ShipCollection;
    attachmentOptions?: AttachmentCollection;
    reputationOptions?: ReputationCollection;
    credits?: number;
    tokens?: number;
}
export {};
