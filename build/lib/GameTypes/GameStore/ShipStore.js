"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShipStore = void 0;
const BaseStore_1 = require("./BaseStore");
const ShipCollection_1 = require("../GameCollections/ShipCollection");
class ShipStore extends BaseStore_1.BaseStore {
    constructor(options) {
        super(new ShipCollection_1.ShipCollection(), options);
        this.faction = options.storeFaction;
        this.maxToSell = options.maxToSell;
    }
    populateInventory() {
        const candidates = this.faction.SellableShips;
        while (this.collection.CollectionSize < this.maxToSell) {
            const selected = candidates[~~(Math.random() * candidates.length)];
            const current = this.collection.get(selected.Name);
            this.collection.set(selected.Name, (current ?? 0) + 1);
        }
    }
}
exports.ShipStore = ShipStore;
