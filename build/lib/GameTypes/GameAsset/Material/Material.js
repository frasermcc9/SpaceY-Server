"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaterialBuilder = exports.Material = void 0;
const GameAsset_1 = require("../GameAsset");
class Material extends GameAsset_1.GameAsset {
    constructor(materialOptions) {
        super(materialOptions);
        this.mineable = materialOptions.mineable ?? false;
        this.rarity = materialOptions.rarity || 1;
    }
    IsMineable() {
        return this.mineable;
    }
    GetMaterialRarity() {
        return this.rarity;
    }
}
exports.Material = Material;
class MaterialBuilder {
    constructor(options) {
        this.options = options;
    }
    EnableSell(price) {
        this.options.cost = price;
        return this;
    }
    EnableBuild(blueprint) {
        this.options.blueprint = blueprint;
        return this;
    }
    EnableMine() {
        this.options.mineable = true;
        return this;
    }
    SetRarity(level) {
        this.options.rarity = level;
        return this;
    }
    Build() {
        return new Material({
            description: this.options.description,
            mineable: this.options.mineable,
            name: this.options.name,
            techLevel: this.options.techLevel,
            rarity: this.options.rarity,
            blueprint: this.options.blueprint,
            cost: this.options.cost,
        });
    }
}
exports.MaterialBuilder = MaterialBuilder;
//# sourceMappingURL=Material.js.map