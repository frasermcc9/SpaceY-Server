"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttachmentStore = void 0;
const BaseStore_1 = require("./BaseStore");
const AttachmentCollection_1 = require("../GameCollections/AttachmentCollection");
class AttachmentStore extends BaseStore_1.BaseStore {
    constructor(options) {
        super(new AttachmentCollection_1.AttachmentCollection(), options);
        this.faction = options.storeFaction;
        this.maxToSell = options.maxToSell;
    }
    populateInventory() {
        const candidates = this.faction.SellableAttachments;
        if (candidates.length < 1)
            return;
        while (this.collection.CollectionSize < this.maxToSell) {
            const selected = candidates[~~(Math.random() * candidates.length)];
            const current = this.collection.get(selected.Name);
            this.collection.set(selected.Name, (current ?? 0) + 1);
        }
    }
    identity() {
        return `${this.Name}: Weapons Store`;
    }
}
exports.AttachmentStore = AttachmentStore;
//# sourceMappingURL=AttachmentStore.js.map