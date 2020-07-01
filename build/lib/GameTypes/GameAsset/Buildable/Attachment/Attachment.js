"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Attachment = void 0;
const GameAsset_1 = require("../../GameAsset");
const Blueprint_1 = require("../../Blueprint/Blueprint");
class Attachment extends GameAsset_1.GameAsset {
    constructor() {
        super(...arguments);
        this.Blueprint = new Blueprint_1.Blueprint();
    }
    GetBlueprint() {
        return this.Blueprint;
    }
    GetCost() {
        return { cost: 0, success: true };
    }
}
exports.Attachment = Attachment;
