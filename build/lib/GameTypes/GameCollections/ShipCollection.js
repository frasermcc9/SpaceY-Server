"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShipCollection = void 0;
const Client_1 = require("../../Client/Client");
const GameCollectionBase_1 = require("./GameCollectionBase");
class ShipCollection extends GameCollectionBase_1.GameCollectionBase {
    constructor(options) {
        super();
        //Create map with all empty attachment values, but set defined attachments to the given value.
        if (options?.data) {
            Client_1.Client.Get().Registry.ShipRegistry.forEach((ship) => {
                this.set(ship.Name, options.data?.get(ship.Name) || 0);
            });
        }
        else {
            Client_1.Client.Get().Registry.ShipRegistry.forEach((ship) => {
                this.set(ship.Name, 0);
            });
        }
    }
    /** @override */
    GetCompatibleItems({ minTech, maxTech }) {
        return Client_1.Client.Reg.ShipRegistry.filter((val) => val.Cost != undefined && val.TechLevel <= maxTech && val.TechLevel >= minTech);
    }
    /** @override */
    GenerateWeights(items, centralRarity, minRarity, maxRarity) {
        return items.map((val) => maxRarity - minRarity - Math.abs(centralRarity - val.TechLevel) + 1);
    }
}
exports.ShipCollection = ShipCollection;
