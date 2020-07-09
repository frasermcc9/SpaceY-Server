"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReputationCollection = void 0;
const Client_1 = require("../../Client/Client");
const GameCollectionBase_1 = require("./GameCollectionBase");
class ReputationCollection extends GameCollectionBase_1.GameCollectionBase {
    constructor(options) {
        super();
        if (options?.data) {
            Client_1.Client.Reg.FactionRegistry.forEach((faction) => {
                this.set(faction.Name, options.data?.get(faction.Name) ?? 0);
            });
        }
        else {
            Client_1.Client.Reg.FactionRegistry.forEach((faction) => {
                this.set(faction.Name, 0);
            });
        }
    }
    /** @override */
    GetCompatibleItems(minRarity, maxRarity) {
        return Client_1.Client.Reg.FactionRegistry.filter((val) => val.Cost != undefined && val.TechLevel <= maxRarity && val.TechLevel >= minRarity);
    }
    /** @override */
    GenerateWeights(items, centralRarity, minRarity, maxRarity) {
        return items.map((val) => maxRarity - minRarity - Math.abs(centralRarity - val.TechLevel) + 1);
    }
}
exports.ReputationCollection = ReputationCollection;
