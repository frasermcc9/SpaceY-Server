import { BaseStore, BaseStoreOptions } from "./BaseStore";
import { AttachmentCollection } from "../GameCollections/AttachmentCollection";
import { Faction } from "../GameAsset/Faction/Faction";

export class AttachmentStore extends BaseStore {
    private faction: Faction;
    private maxToSell: number;

    public constructor(options: IAttachmentStoreOptions) {
        super(new AttachmentCollection(), options);
        this.faction = options.storeFaction;
        this.maxToSell = options.maxToSell;
    }

    public populateInventory(): void {
        const candidates = this.faction.SellableAttachments;
        if (candidates.length < 1) return;
        while (this.collection.CollectionSize < this.maxToSell) {
            const selected = candidates[~~(Math.random() * candidates.length)];
            const current = this.collection.get(selected.Name);
            this.collection.set(selected.Name, (current ?? 0) + 1);
        }
    }

    public identity():string{
        return `${this.Name}: Weapons Store`
    }
}

interface IAttachmentStoreOptions extends BaseStoreOptions {
    storeFaction: Faction;
    /**The max (but not necessarily the unique amount) of attachments to sell */
    maxToSell: number;
}
