"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryBuilder = exports.PlayerInventory = void 0;
const Client_1 = require("../../../Client/Client");
const AttachmentCollection_1 = require("../../GameCollections/AttachmentCollection");
const MaterialCollection_1 = require("../../GameCollections/MaterialCollection");
const ReputationCollection_1 = require("../../GameCollections/ReputationCollection");
const ShipCollection_1 = require("../../GameCollections/ShipCollection");
/**
 * Represents an inventory of a player. Please @see InventoryBuilder too create an inventory.
 */
class PlayerInventory {
    constructor(options) {
        if (isInventory(options)) {
            this.materials = options.materialOptions || new MaterialCollection_1.MaterialCollection();
            this.ships = options.shipOptions || new ShipCollection_1.ShipCollection();
            this.attachments = options.attachmentOptions || new AttachmentCollection_1.AttachmentCollection();
            this.reputation = options.reputationOptions || new ReputationCollection_1.ReputationCollection();
            this.credits = options.credits || Client_1.Client.Get().Registry.DefaultCredits;
            this.tokens = options.tokens || 0;
        }
        else {
            throw new Error("Invalid inventory creation.");
        }
    }
    get Materials() {
        return this.materials;
    }
    get Credits() {
        return this.credits;
    }
    get Ships() {
        return this.ships;
    }
    get Attachments() {
        return this.attachments;
    }
    get Reputation() {
        return this.reputation;
    }
    get Tokens() {
        return this.tokens;
    }
    AddCredits({ amount }) {
        let checkAmount = this.credits;
        checkAmount += amount;
        if (checkAmount >= 0) {
            this.credits = checkAmount;
            return true;
        }
        else {
            return false;
        }
    }
    GetGeneric() {
        return {
            attachments: this.attachments,
            credits: this.credits,
            materials: this.materials,
            reputation: this.reputation,
            ships: this.ships,
            tokens: this.tokens,
        };
    }
}
exports.PlayerInventory = PlayerInventory;
class InventoryBuilder {
    SetMaterials(matOptions) {
        this.materials = matOptions;
        return this;
    }
    SetShips(shipOptions) {
        this.ships = shipOptions;
        return this;
    }
    SetAttachments(attachmentOptions) {
        this.attachments = attachmentOptions;
        return this;
    }
    SetReputation(attachmentOptions) {
        this.reputation = attachmentOptions;
        return this;
    }
    SetCredits(credits) {
        this.credits = credits;
        return this;
    }
    SetTokens(tokens) {
        this.tokens = tokens;
        return this;
    }
    Build() {
        var _a, _b, _c, _d;
        return new PlayerInventory({
            attachmentOptions: new AttachmentCollection_1.AttachmentCollection({ data: (_a = this.attachments) === null || _a === void 0 ? void 0 : _a.data }),
            materialOptions: new MaterialCollection_1.MaterialCollection({ data: (_b = this.materials) === null || _b === void 0 ? void 0 : _b.data }),
            shipOptions: new ShipCollection_1.ShipCollection({ data: (_c = this.ships) === null || _c === void 0 ? void 0 : _c.data }),
            reputationOptions: new ReputationCollection_1.ReputationCollection({ data: (_d = this.reputation) === null || _d === void 0 ? void 0 : _d.data }),
            credits: this.credits,
            tokens: this.tokens,
        });
    }
    GenericBuild() {
        return {
            attachments: new AttachmentCollection_1.AttachmentCollection(),
            credits: Client_1.Client.Get().Registry.DefaultCredits,
            materials: new MaterialCollection_1.MaterialCollection(),
            reputation: new ReputationCollection_1.ReputationCollection(),
            ships: new ShipCollection_1.ShipCollection(),
            tokens: 0,
        };
    }
}
exports.InventoryBuilder = InventoryBuilder;
function isInventory(object) {
    return "credits" in object;
}
