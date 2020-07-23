import { BaseStore, BaseStoreOptions } from "./BaseStore";
import { Faction } from "../GameAsset/Faction/Faction";
export declare class AttachmentStore extends BaseStore {
    private faction;
    private maxToSell;
    constructor(options: IAttachmentStoreOptions);
    populateInventory(): void;
    identity(): string;
}
interface IAttachmentStoreOptions extends BaseStoreOptions {
    storeFaction: Faction;
    /**The max (but not necessarily the unique amount) of attachments to sell */
    maxToSell: number;
}
export {};
