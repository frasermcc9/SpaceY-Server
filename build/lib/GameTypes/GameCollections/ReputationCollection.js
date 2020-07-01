"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReputationCollection = void 0;
const Client_1 = require("../../Client/Client");
const GameCollectionBase_1 = require("./GameCollectionBase");
class ReputationCollection extends GameCollectionBase_1.GameCollectionBase {
    constructor(options) {
        super();
        this.factionSet = Client_1.Client.Get().Registry.FactionRegistry;
        if (options === null || options === void 0 ? void 0 : options.data) {
            this.factionSet.forEach((faction) => {
                var _a;
                this.set(faction.Name, ((_a = options.data) === null || _a === void 0 ? void 0 : _a.get(faction.Name)) || 0);
            });
        }
        else {
            this.factionSet.forEach((faction) => {
                this.set(faction.Name, 0);
            });
        }
    }
}
exports.ReputationCollection = ReputationCollection;
