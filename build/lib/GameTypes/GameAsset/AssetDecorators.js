"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildableDecorator = exports.SellableDecorator = exports.GameAssetDecorator = void 0;
class GameAssetDecorator {
    constructor(asset) {
        this.asset = asset;
    }
    get Name() {
        return this.asset.Name;
    }
    get Description() {
        return this.asset.Description;
    }
}
exports.GameAssetDecorator = GameAssetDecorator;
class SellableDecorator extends GameAssetDecorator {
    constructor(item) {
        super(item);
    }
    get PriceData() {
        return this.asset.Cost == undefined ? { success: false } : { success: true, cost: this.asset.Cost };
    }
}
exports.SellableDecorator = SellableDecorator;
class BuildableDecorator extends GameAssetDecorator {
    constructor(item) {
        super(item);
    }
    get PriceData() {
        return this.asset.Blueprint;
    }
}
exports.BuildableDecorator = BuildableDecorator;
