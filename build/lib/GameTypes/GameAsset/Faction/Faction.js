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
        this.options.imageUri = options.imageUri ?? "";
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
    get Uri() {
        return this.options.imageUri;
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
    /**
     * Adds a ship that this faction can sell, and adds it to its usable ships
     * as well. Sold ships are ships this faction will sell in their stores.
     * @param ship
     */
    addSoldShips(ship) {
        if (!Array.isArray(ship))
            ship = [ship];
        this.options.soldShips?.push(...ship);
        this.options.usedShips?.push(...ship);
        return this;
    }
    /**
     * Note that sold ships are added to used implicitly, so do not add a sold
     * ship and then add the same ship as a used ship.
     *
     * Used ships are ships that this faction uses - i.e. ships that can be
     * fought in their region.
     * @param ship
     */
    addUsedShips(ship) {
        if (!Array.isArray(ship))
            ship = [ship];
        this.options.usedShips?.push(...ship);
        return this;
    }
    /**
     * Adds an attachment that this faction can sell, and adds it to its usable
     * attachments as well. Sold attachments are attachments this faction will
     * sell in their stores.
     * @param attachment
     */
    addSoldAttachments(attachment) {
        if (!Array.isArray(attachment))
            attachment = [attachment];
        this.options.soldAttachments?.push(...attachment);
        this.options.usedAttachments?.push(...attachment);
        return this;
    }
    /**
     * Note that sold attachments are added to used implicitly, so do not add a
     * sold attachment and then add the same attachment as a used attachment.
     *
     * Used attachment are attachment that this faction uses - i.e. their ships
     * will use these attachments.
     * @param attachment
     */
    addUsedAttachments(attachment) {
        if (!Array.isArray(attachment))
            attachment = [attachment];
        this.options.usedAttachments?.push(...attachment);
        return this;
    }
    setImageUri(uri) {
        this.options.imageUri = uri;
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
            imageUri: this.options.imageUri ?? "",
        });
    }
}
exports.FactionBuilder = FactionBuilder;
