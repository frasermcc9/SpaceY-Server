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
        this.genMinRarity = options.minRarity ?? 0;
        this.genMaxRarity = options.maxRarity ?? main_1.Client.Reg.MaxRarity;
        this.genCentralRarity = options.centralRarity ?? (this.genMaxRarity - this.genMinRarity) / 2;
        this.rarity = options.enableRarityEffects ?? true;
    }
    populateInventory() {
        if (this.genValue == undefined)
            throw new Error("Cannot generate inventory of MaterialStore that had no value option passed.");
        return this.collection.GenerateCollection({
            value: this.genValue,
            minRarity: this.genMinRarity,
            maxRarity: this.genMaxRarity,
            centralRarity: this.genCentralRarity,
            rarity: this.rarity,
        });
    }
    editGenSettings(options) {
        this.genValue = options.generationValue ?? this.genValue;
        this.genMinRarity = options.minRarity ?? this.genMinRarity;
        this.genMaxRarity = options.maxRarity ?? this.genMaxRarity;
        this.genCentralRarity = options.centralRarity ?? this.genCentralRarity;
        this.rarity = options.enableRarityEffects ?? this.rarity;
    }
}
exports.MaterialStore = MaterialStore;
