"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaterialBuilder = exports.Material = void 0;
const GameAsset_1 = require("../GameAsset");
class Material extends GameAsset_1.GameAsset {
    constructor(materialOptions) {
        super({ name: materialOptions.name, description: materialOptions.description });
        this.buildable = false;
        this.mineable = false;
        this.sellable = false;
        this.buildable = materialOptions.buildable;
        this.mineable = materialOptions.mineable;
        this.sellable = materialOptions.sellable;
        this.cost = materialOptions.cost;
        this.blueprint = materialOptions.blueprint;
        this.rarity = materialOptions.rarity || 1;
    }
    get Name() {
        return super.Name;
    }
    get Description() {
        return super.Description;
    }
    IsSellable() {
        return this.sellable;
    }
    IsMineable() {
        return this.mineable;
    }
    IsBuildable() {
        return this.buildable;
    }
    GetMaterialCost() {
        return this.cost;
    }
    GetMaterialBlueprint() {
        return this.blueprint;
    }
    GetMaterialRarity() {
        return this.rarity;
    }
}
exports.Material = Material;
class MaterialBuilder {
    constructor({ name, description }) {
        //private options: IMaterialOptions;
        this.buildable = false;
        this.mineable = false;
        this.sellable = true;
        this.name = name;
        this.description = description;
    }
    EnableBuild() {
        this.buildable = true;
        return this;
    }
    EnableMine() {
        this.mineable = true;
        return this;
    }
    DisableSell() {
        this.sellable = false;
        return this;
    }
    SetCost(cost) {
        this.cost = cost;
        return this;
    }
    SetBlueprint(blueprint) {
        this.blueprint = blueprint;
        return this;
    }
    SetRarity(level) {
        this.rarity = level;
        return this;
    }
    Build() {
        return new Material({
            buildable: this.buildable,
            description: this.description,
            mineable: this.mineable,
            name: this.name,
            sellable: this.sellable,
            blueprint: this.blueprint,
            cost: this.cost,
            rarity: this.rarity,
        });
    }
}
exports.MaterialBuilder = MaterialBuilder;
