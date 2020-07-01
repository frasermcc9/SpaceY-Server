"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameAsset = void 0;
class GameAsset {
    constructor(gameAssetOptions) {
        this.name = gameAssetOptions.name;
        this.description = gameAssetOptions.description;
    }
    get Name() {
        return this.name;
    }
    get Description() {
        return this.description;
    }
    /** @override */
    toString() {
        return this.name + ": " + this.description;
    }
}
exports.GameAsset = GameAsset;
