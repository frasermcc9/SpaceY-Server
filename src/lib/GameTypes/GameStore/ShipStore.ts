import { BaseStore, BaseStoreOptions } from "./BaseStore";
import { Faction } from "../GameAsset/Faction/Faction";
import { ShipCollection } from "../GameCollections/ShipCollection";

export class ShipStore extends BaseStore {
    private faction: Faction;
    private maxToSell: number;

    public constructor(options: IShipStoreOptions) {
        super(new ShipCollection(), options);
        this.faction = options.storeFaction;
        this.maxToSell = options.maxToSell;
    }

    public populateInventory(): void {
        const candidates = this.faction.SellableShips;
        if (candidates.length < 1) return;
        while (this.collection.CollectionSize < this.maxToSell) {
            const selected = candidates[~~(Math.random() * candidates.length)];
            const current = this.collection.get(selected.Name);
            this.collection.set(selected.Name, (current ?? 0) + 1);
        }
    }
}

interface IShipStoreOptions extends BaseStoreOptions {
    storeFaction: Faction;
    /**The max (but not necessarily the unique amount) of attachments to sell */
    maxToSell: number;
}
