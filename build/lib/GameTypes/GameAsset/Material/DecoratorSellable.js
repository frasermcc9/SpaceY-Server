"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaterialDecoratorSellable = void 0;
const MaterialDecorator_1 = require("./MaterialDecorator");
const Client_1 = require("../../../Client/Client");
class MaterialDecoratorSellable extends MaterialDecorator_1.MaterialDecorator {
    constructor(material) {
        super(material);
        if (!material.IsSellable() && Client_1.Client.Get().ConsoleLogging)
            console.warn("Material that is not sellable is being instantiated as a sellable material.");
    }
    GetCost() {
        const cost = this.GetMaterialCost();
        if (cost) {
            return { success: true, cost: cost };
        }
        if (Client_1.Client.Get().ConsoleLogging)
            console.warn("Material that is not sellable has no attribute cost.");
        return { success: false, cost: undefined };
    }
}
exports.MaterialDecoratorSellable = MaterialDecoratorSellable;
