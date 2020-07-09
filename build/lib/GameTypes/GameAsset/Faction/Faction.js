"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FactionBuilder = exports.Faction = void 0;
const GameAsset_1 = require("../GameAsset");
class Faction extends GameAsset_1.GameAsset {
    constructor(options) {
        super(options);
        this.options = options;
        this.options.soldShips = options.soldShips ?? [];
        this.options.usedShips = options.usedShips ?? [];
        this.options.soldAttachments = options.soldAttachments ?? [];
        this.options.usedAttachments = options.usedAttachments ?? [];
    }
    get SellableShips() {
        return this.options.soldShips.slice();
    }
    get SellableAttachments() {
        return this.options.soldAttachments.slice();
    }
    get UsableShips() {
        return this.options.soldShips.slice();
    }
    get UsableAttachments() {
        return this.options.soldAttachments.slice();
    }
}
exports.Faction = Faction;
class FactionBuilder {
    /**Non-optional must be declared in constructor. Other options can be, but
    using the builder methods is suggested.*/
    constructor(options) {
        this.options = options;
        if (options.cost != undefined || options.blueprint != undefined)
            throw new TypeError("");
        this.options.soldShips = options.soldShips ?? [];
        this.options.usedShips = options.usedShips ?? [];
        this.options.soldAttachments = options.soldAttachments ?? [];
        this.options.usedAttachments = options.usedAttachments ?? [];
    }
    addSoldShips(ship) {
        if (!Array.isArray(ship))
            ship = [ship];
        this.options.soldShips?.push(...ship);
        return this;
    }
    addUsedShips(ship) {
        if (!Array.isArray(ship))
            ship = [ship];
        this.options.usedShips?.push(...ship);
        return this;
    }
    addSoldAttachments(attachment) {
        if (!Array.isArray(attachment))
            attachment = [attachment];
        this.options.soldAttachments?.push(...attachment);
        return this;
    }
    addUsedAttachments(attachment) {
        if (!Array.isArray(attachment))
            attachment = [attachment];
        this.options.usedAttachments?.push(...attachment);
        return this;
    }
    Build() {
        return new Faction({
            name: this.options.name,
            description: this.options.description,
            techLevel: this.options.techLevel,
            soldAttachments: this.options.soldAttachments ?? [],
            usedAttachments: this.options.usedAttachments ?? [],
            soldShips: this.options.soldShips ?? [],
            usedShips: this.options.usedShips ?? [],
        });
    }
}
exports.FactionBuilder = FactionBuilder;
