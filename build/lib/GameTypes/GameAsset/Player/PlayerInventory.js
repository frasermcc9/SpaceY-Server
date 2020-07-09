"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryBuilder = exports.PlayerInventory = void 0;
const Client_1 = require("../../../Client/Client");
const AttachmentCollection_1 = require("../../GameCollections/AttachmentCollection");
const ReputationCollection_1 = require("../../GameCollections/ReputationCollection");
const ShipCollection_1 = require("../../GameCollections/ShipCollection");
const PlayerMaterialCollection_1 = require("../../GameCollections/PlayerMaterialCollection");
/**
 * Represents an inventory of a player. Please @see InventoryBuilder too create an inventory.
 */
class PlayerInventory {
    constructor(options) {
        if (isInventory(options)) {
            this.materials = options.materialOptions;
            this.ships = options.shipOptions;
            this.attachments = options.attachmentOptions;
            this.reputation = options.reputationOptions;
            this.credits = options.credits ?? Client_1.Client.Reg.DefaultCredits;
            this.tokens = options.tokens ?? 0;
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
    removeTokens({ amount }) {
        if (amount < 0)
            throw new Error("Cannot remove negative tokens");
        if (this.tokens < amount)
            return false;
        this.tokens -= amount;
        return true;
    }
    addTokens({ amount }) {
        if (amount < 0)
            throw new Error("Cannot add negative tokens");
        this.tokens += amount;
        return true;
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
    constructor() { }
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
        return new PlayerInventory({
            attachmentOptions: new AttachmentCollection_1.AttachmentCollection({ data: this.attachments?.data }),
            materialOptions: new PlayerMaterialCollection_1.PlayerMaterialCollection({ data: this.materials?.data }),
            shipOptions: new ShipCollection_1.ShipCollection({ data: this.ships?.data }),
            reputationOptions: new ReputationCollection_1.ReputationCollection({ data: this.reputation?.data }),
            credits: this.credits,
            tokens: this.tokens,
        });
    }
    GenericBuild() {
        return {
            attachments: new AttachmentCollection_1.AttachmentCollection(),
            credits: Client_1.Client.Get().Registry.DefaultCredits,
            materials: new PlayerMaterialCollection_1.PlayerMaterialCollection(),
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
