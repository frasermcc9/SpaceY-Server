"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaterialStore = void 0;
const BaseStore_1 = require("./BaseStore");
const MaterialCollection_1 = require("../GameCollections/MaterialCollection");
const main_1 = require("../../main");
class MaterialStore extends BaseStore_1.BaseStore {
    constructor(options) {
        super(new MaterialCollection_1.MaterialCollection(), options);
        this.rarity = true;
        this.genValue = options.generationValue;
        this.minTech = options.minTech ?? 0;
        this.maxTech = options.maxTech ?? main_1.Client.Reg.MaxTech;
        this.minRarity = options.minRarity ?? 0;
        this.maxRarity = options.maxRarity ?? main_1.Client.Reg.MaxRarity;
        this.genCentralRarity = options.centralRarity ?? (this.maxTech - this.minTech) / 2;
        this.rarity = options.enableRarityEffects ?? true;
    }
    populateInventory() {
        if (this.genValue == undefined)
            throw new Error("Cannot generate inventory of MaterialStore that had no value option passed.");
        return this.collection.GenerateCollection({
            value: this.genValue,
            minTech: this.minTech,
            maxTech: this.maxTech,
            minRarity: this.minRarity,
            maxRarity: this.maxRarity,
            centralRarity: this.genCentralRarity,
            rarity: this.rarity,
        });
    }
    editGenSettings(options) {
        this.genValue = options.generationValue ?? this.genValue;
        this.minTech = options.minTech ?? this.minTech;
        this.maxTech = options.maxTech ?? this.maxTech;
        this.genCentralRarity = options.centralRarity ?? this.genCentralRarity;
        this.rarity = options.enableRarityEffects ?? this.rarity;
    }
}
exports.MaterialStore = MaterialStore;
//# sourceMappingURL=MaterialStore.js.map