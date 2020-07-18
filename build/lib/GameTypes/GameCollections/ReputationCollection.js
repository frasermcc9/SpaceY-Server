"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReputationCollection = void 0;
const Server_1 = require("../../Server/Server");
const GameCollectionBase_1 = require("./GameCollectionBase");
class ReputationCollection extends GameCollectionBase_1.GameCollectionBase {
    constructor(options) {
        super();
        if (options?.data) {
            let data;
            if (options.data instanceof Map)
                data = Object.fromEntries(options.data);
            else
                data = options.data;
            Server_1.Server.Reg.FactionRegistry.forEach((faction) => {
                this.set(faction.Name, data[faction.Name] || 0);
            });
        }
        else {
            Server_1.Server.Reg.FactionRegistry.forEach((faction) => {
                this.set(faction.Name, 0);
            });
        }
    }
    /** @override */
    GetCompatibleItems({ minTech, maxTech }) {
        return Server_1.Server.Reg.FactionRegistry.filter((val) => val.Cost != undefined && val.TechLevel <= maxTech && val.TechLevel >= minTech);
    }
    /** @override */
    GenerateWeights(items, centralRarity, minRarity, maxRarity) {
        return items.map((val) => maxRarity - minRarity - Math.abs(centralRarity - val.TechLevel) + 1);
    }
}
exports.ReputationCollection = ReputationCollection;
