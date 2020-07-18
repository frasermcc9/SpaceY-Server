"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShipCollection = void 0;
const Server_1 = require("../../Server/Server");
const GameCollectionBase_1 = require("./GameCollectionBase");
class ShipCollection extends GameCollectionBase_1.GameCollectionBase {
    constructor(options) {
        super();
        //Create map with all empty attachment values, but set defined attachments to the given value.
        if (options?.data) {
            let data;
            if (options.data instanceof Map)
                data = Object.fromEntries(options.data);
            else
                data = options.data;
            Server_1.Server.Get().Registry.ShipRegistry.forEach((ship) => {
                this.set(ship.Name, data[ship.Name] || 0);
            });
        }
        else {
            Server_1.Server.Get().Registry.ShipRegistry.forEach((ship) => {
                this.set(ship.Name, 0);
            });
        }
    }
    /** @override */
    GetCompatibleItems({ minTech, maxTech }) {
        return Server_1.Server.Reg.ShipRegistry.filter((val) => val.Cost != undefined && val.TechLevel <= maxTech && val.TechLevel >= minTech);
    }
    /** @override */
    GenerateWeights(items, centralRarity, minRarity, maxRarity) {
        return items.map((val) => maxRarity - minRarity - Math.abs(centralRarity - val.TechLevel) + 1);
    }
}
exports.ShipCollection = ShipCollection;
