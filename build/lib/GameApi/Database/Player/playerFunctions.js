"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOneOrCreate = exports.getCredits = exports.decrementCredits = exports.incrementCredits = exports.setLastUpdated = void 0;
const Client_1 = require("../../../Client/Client");
const PlayerInventory_1 = require("../../../GameTypes/GameAsset/Player/PlayerInventory");
const Skin_1 = require("../../../GameTypes/GameAsset/Player/Skin");
const Player_1 = require("../../../GameTypes/GameAsset/Player/Player");
//Section: Instance Methods (for document)
async function setLastUpdated() {
    const now = new Date();
    if (!this.lastUpdated || this.lastUpdated < now) {
        this.lastUpdated = now;
        await this.save();
    }
}
exports.setLastUpdated = setLastUpdated;
/** @deprecated */
async function incrementCredits({ amount }) {
    if (amount < 0) {
        throw new Error("Only positive values can be passed to the incrementCredits method. Consider using decrement to remove credits.");
    }
    this.inventory.credits += amount;
    this.markModified("inventory");
    await this.save();
    await this.setLastUpdated();
    return true;
}
exports.incrementCredits = incrementCredits;
/** @deprecated */
async function decrementCredits({ amount }) {
    if (amount < 0) {
        throw new Error("Only positive values can be passed to the decrementCredits method. Consider using increment to add credits.");
    }
    const success = this.inventory.credits - amount > 0;
    if (success) {
        this.inventory.credits -= amount;
        this.markModified("inventory");
        await this.save();
        await this.setLastUpdated();
        return true;
    }
    else {
        return false;
    }
}
exports.decrementCredits = decrementCredits;
/** @deprecated */
async function getCredits() {
    return this.inventory.credits;
}
exports.getCredits = getCredits;
//Section: Static Methods (for model)
async function findOneOrCreate({ uId }) {
    const record = await this.findOne({ uId: uId });
    if (record) {
        return new Player_1.Player(record);
    }
    else {
        const record = await this.create({
            uId: uId,
            inventory: new PlayerInventory_1.InventoryBuilder().GenericBuild(),
            ship: { name: Client_1.Client.Get().Registry.DefaultShip.Name, equipped: [] },
            skin: new Skin_1.Skin(),
            location: Client_1.Client.Reg.DefaultLocation.Name,
            blueprints: new Array(),
            exp: 30,
            skills: [0, 0, 0],
        });
        return new Player_1.Player(record);
    }
}
exports.findOneOrCreate = findOneOrCreate;
