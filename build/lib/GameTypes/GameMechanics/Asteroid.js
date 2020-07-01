"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsteroidBuilder = void 0;
const MaterialCollection_1 = require("../GameCollections/MaterialCollection");
const Client_1 = require("../../Client/Client");
class Asteroid extends MaterialCollection_1.MaterialCollection {
    constructor(options) {
        super(options);
    }
    PlayerMine(player) {
        player.Inventory.Materials.SumCollection(this);
    }
    PlayerMineAndSave(player) {
        player.InventorySum("materials", this);
    }
}
class AsteroidBuilder {
    BuildRandom({ value }) {
        if (value < 0 && Client_1.Client.Get().ConsoleLogging)
            console.warn("Negative asteroid value passed.");
        const collection = MaterialCollection_1.MaterialCollection.GenerateMineableCollection(value);
        return new Asteroid({ data: collection });
    }
    BuildCustom(materialCollection) {
        return new Asteroid(materialCollection);
    }
}
exports.AsteroidBuilder = AsteroidBuilder;
