"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameAsset = void 0;
class GameAsset {
    constructor(gameAssetOptions) {
        this.name = gameAssetOptions.name;
        this.description = gameAssetOptions.description;
        this.cost = gameAssetOptions.cost;
        this.blueprint = gameAssetOptions.blueprint;
        this.techLevel = gameAssetOptions.techLevel;
    }
    get Name() {
        return this.name;
    }
    get Description() {
        return this.description;
    }
    get TechLevel() {
        return this.techLevel;
    }
    get Cost() {
        return this.cost;
    }
    get Blueprint() {
        if (this.blueprint == undefined)
            return { success: false };
        return { success: true, blueprint: this.blueprint };
    }
    toString() {
        return this.name;
    }
    stringDetails() {
        return `${this.name}: ${this.description} Tech Level: ${this.techLevel}`;
    }
}
exports.GameAsset = GameAsset;
