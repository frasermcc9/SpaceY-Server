"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerMaterialCollection = void 0;
const MaterialCollection_1 = require("./MaterialCollection");
class PlayerMaterialCollection extends MaterialCollection_1.MaterialCollection {
    constructor(options) {
        super(options);
    }
    maxCollectionSize() {
        if (this.owner == undefined)
            return Infinity;
        //console.log(this.owner.getShipWrapper());
        return this.owner.getShipWrapper().ShipStatistics.totalCargo;
    }
    /**@override */
    set(key, value) {
        const current = this.get(key);
        const diff = this.maxCollectionSize() - (this.CollectionSize - (current ?? 0) + value);
        if (diff >= 0) {
            return super.set(key, value);
        }
        else {
            return super.set(key, value + diff);
        }
    }
    set Owner(player) {
        this.owner = player;
    }
}
exports.PlayerMaterialCollection = PlayerMaterialCollection;
//# sourceMappingURL=PlayerMaterialCollection.js.map