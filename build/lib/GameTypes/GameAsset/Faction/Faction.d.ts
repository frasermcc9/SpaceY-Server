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
}
export declare class FactionBuilder {
    private readonly options;
    /**Non-optional must be declared in constructor. Other options can be, but
    using the builder methods is suggested.*/
    constructor(options: IFactionBuilderOptions);
    addSoldShips(ship: Ship[] | Ship): this;
    addUsedShips(ship: Ship[] | Ship): this;
    addSoldAttachments(attachment: Attachment[] | Attachment): this;
    addUsedAttachments(attachment: Attachment[] | Attachment): this;
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
    cost?: never;
    blueprint?: never;
}
export {};
