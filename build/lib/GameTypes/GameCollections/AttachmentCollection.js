"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttachmentCollection = void 0;
const Client_1 = require("../../Client/Client");
const GameCollectionBase_1 = require("./GameCollectionBase");
class AttachmentCollection extends GameCollectionBase_1.GameCollectionBase {
    constructor(options) {
        super();
        //Create map with all empty attachment values, but set defined attachments to the given value.
        if (options?.data) {
            Client_1.Client.Reg.AttachmentRegistry.forEach((attachment) => {
                this.set(attachment.Name, options.data?.get(attachment.Name) ?? 0);
            });
        }
        else {
            Client_1.Client.Reg.AttachmentRegistry.forEach((attachment) => {
                this.set(attachment.Name, 0);
            });
        }
    }
    /** @override */
    GetCompatibleItems(minRarity, maxRarity) {
        return Client_1.Client.Reg.AttachmentRegistry.filter((val) => val.Cost != undefined && val.TechLevel <= maxRarity && val.TechLevel >= minRarity);
    }
    /** @override */
    GenerateWeights(items, centralRarity, minRarity, maxRarity) {
        return items.map((val) => maxRarity - minRarity - Math.abs(centralRarity - val.TechLevel) + 1);
    }
}
exports.AttachmentCollection = AttachmentCollection;
