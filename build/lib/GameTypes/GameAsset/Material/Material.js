"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaterialBuilder = exports.Material = void 0;
const GameAsset_1 = require("../GameAsset");
class Material extends GameAsset_1.GameAsset {
    constructor(materialOptions) {
        super({ name: materialOptions.name, description: materialOptions.description, cost: materialOptions.cost, blueprint: materialOptions.blueprint });
        this.mineable = false;
        this.mineable = materialOptions.mineable;
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
    constructor({ name, description }) {
        this.mineable = false;
        this.name = name;
        this.description = description;
    }
    EnableSell(price) {
        this.cost = price;
        return this;
    }
    EnableBuild(blueprint) {
        this.blueprint = blueprint;
        return this;
    }
    EnableMine() {
        this.mineable = true;
        return this;
    }
    SetRarity(level) {
        this.rarity = level;
        return this;
    }
    Build() {
        return new Material({
            description: this.description,
            mineable: this.mineable,
            name: this.name,
            rarity: this.rarity,
            blueprint: this.blueprint,
            cost: this.cost,
        });
    }
}
exports.MaterialBuilder = MaterialBuilder;
