import { GameAsset, IGameAssetOptions } from "../GameAsset";
import { Ship } from "../Ship/Ship";
import { Attachment } from "../Attachment/Attachment";
export declare class Faction extends GameAsset {
    private readonly options;
    constructor(options: IFactionOptions);
    get SellableShips(): Ship[];
    get SellableAttachments(): Attachment[];
    get UsableShips(): Ship[];
    get UsableAttachments(): Attachment[];
    get Uri(): string;
}
export declare class FactionBuilder {
    private readonly options;
    /**Non-optional must be declared in constructor. Other options can be, but
    using the builder methods is suggested.*/
    constructor(options: IFactionBuilderOptions);
    /**
     * Adds a ship that this faction can sell, and adds it to its usable ships
     * as well. Sold ships are ships this faction will sell in their stores.
     * @param ship
     */
    addSoldShips(ship: Ship[] | Ship): this;
    /**
     * Note that sold ships are added to used implicitly, so do not add a sold
     * ship and then add the same ship as a used ship.
     *
     * Used ships are ships that this faction uses - i.e. ships that can be
     * fought in their region.
     * @param ship
     */
    addUsedShips(ship: Ship[] | Ship): this;
    /**
     * Adds an attachment that this faction can sell, and adds it to its usable
     * attachments as well. Sold attachments are attachments this faction will
     * sell in their stores.
     * @param attachment
     */
    addSoldAttachments(attachment: Attachment[] | Attachment): this;
    /**
     * Note that sold attachments are added to used implicitly, so do not add a
     * sold attachment and then add the same attachment as a used attachment.
     *
     * Used attachment are attachment that this faction uses - i.e. their ships
     * will use these attachments.
     * @param attachment
     */
    addUsedAttachments(attachment: Attachment[] | Attachment): this;
    setImageUri(uri: string): this;
    Build(): Faction;
}
interface IFactionBuilderOptions extends IGameAssetOptions {
    /**The ships that are sold by this faction */
    soldShips?: Ship[];
    /**The attachments that are sold by this faction */
    soldAttachments?: Attachment[];
    /**The ships that are used by this faction. Sold ships are used implicitly,
     *  so this is for additional ships that aren't sold, but are to be used */
    usedShips?: Ship[];
    /**The attachments that are used by this faction. Sold attachments are used
     * implicitly, so this is for attachments that aren't sold, but are to be
     * used. */
    usedAttachments?: Attachment[];
    cost?: never;
    blueprint?: never;
    imageUri?: string;
}
interface IFactionOptions extends IGameAssetOptions {
    /**The ships that are sold by this faction */
    soldShips: Ship[];
    /**The attachments that are sold by this faction */
    soldAttachments: Attachment[];
    /**The ships that are used by this faction. Sold ships are used implicitly,
     *  so this is for additional ships that aren't sold, but are to be used */
    usedShips: Ship[];
    /**The attachments that are used by this faction. Sold attachments are used
     * implicitly, so this is for attachments that aren't sold, but are to be
     * used. */
    usedAttachments: Attachment[];
    imageUri: string;
    cost?: never;
    blueprint?: never;
}
export {};
