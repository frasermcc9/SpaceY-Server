"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const PlayerModel_1 = require("../../../GameApi/Database/Player/PlayerModel");
const PlayerInventory_1 = require("./PlayerInventory");
const Client_1 = require("../../../Client/Client");
class Player {
    constructor(data) {
        this.uId = data.uId;
        this.ship = data.ship;
        this.skin = data.skin;
        this.inventory = new PlayerInventory_1.InventoryBuilder()
            .SetCredits(data.inventory.credits)
            .SetReputation({ data: data.inventory.reputation })
            .SetAttachments({ data: data.inventory.attachments })
            .SetMaterials({ data: data.inventory.materials })
            .SetShips({ data: data.inventory.ships })
            .SetTokens(data.inventory.tokens)
            .Build();
    }
    get UId() {
        return this.uId;
    }
    get Inventory() {
        return this.inventory;
    }
    //private location:
    //#region - Credits
    async CreditsIncrement({ amount, noImplicitSave }) {
        if (amount < 0)
            throw new Error("Only positive values can be passed to the incrementCredits method. Consider using decrement to remove credits.");
        const success = this.inventory.AddCredits({ amount: amount });
        if (success && !noImplicitSave) {
            await this.save();
        }
        return success;
    }
    async CreditsDecrement({ amount, noImplicitSave }) {
        if (amount < 0)
            throw new Error("Only positive values can be passed to the decrementCredits method. Consider using increment to add credits.");
        const success = this.inventory.AddCredits({ amount: -amount });
        if (success && !noImplicitSave) {
            await this.save();
        }
        return success;
    }
    get Credits() {
        return this.inventory.Credits;
    }
    //#endregion
    //#region - Materials
    /**
     * Increases the given item by the amount.
     * @param itemName
     * @param quantity
     * @returns codes: 1-Success, 2-Item Not Found, 4-Registry not found
     */
    async MaterialIncrement(name, quantity) {
        return this.InventoryIncrement("materials", name, quantity);
    }
    /**
     * Reduces a given item by the given amount. Cannot reduce below zero.
     * @param itemName
     * @param quantity
     * @returns codes: 1-Success, 2-Item Not Found, 3-Not Enough Resources, 4-Registry not found
     */
    async MaterialDecrement(name, quantity) {
        return this.InventoryDecrement("materials", name, quantity);
    }
    /**
     * Will increment/decrement with any quantity (i.e. positive for increase, negative for decrease)
     * @param name
     * @param quantity
     * @returns codes: 1-Success, 2-Item Not Found, 3-Not Enough Resources, 4-Registry not found
     */
    async MaterialEdit(name, quantity) {
        let result;
        if (quantity >= 0)
            result = this.MaterialIncrement(name, quantity);
        else
            result = this.MaterialDecrement(name, Math.abs(quantity));
        return result;
    }
    //#endregion
    //#region - Ships
    /**
     * Increases the given item by the amount.
     * @param itemName
     * @param quantity
     * @returns codes: 1-Success, 2-Item Not Found, 4-Registry not found
     */
    async ShipIncrement(name, quantity) {
        return this.InventoryIncrement("ships", name, quantity);
    }
    /**
     * Reduces a given item by the given amount. Cannot reduce below zero.
     * @param itemName
     * @param quantity
     * @returns codes: 1-Success, 2-Item Not Found, 3-Not Enough Resources, 4-Registry not found
     */
    async ShipDecrement(name, quantity) {
        return this.InventoryDecrement("ships", name, quantity);
    }
    /**
     * Will increment/decrement with any quantity (i.e. positive for increase, negative for decrease)
     * @param name
     * @param quantity
     * @returns codes: 1-Success, 2-Item Not Found, 3-Not Enough Resources, 4-Registry not found
     */
    async ShipEdit(name, quantity) {
        let result;
        if (quantity >= 0)
            result = this.ShipDecrement(name, quantity);
        else
            result = this.ShipDecrement(name, Math.abs(quantity));
        return result;
    }
    //#endregion - Ships
    //#region - Attachments
    /**
     * Increases the given item by the amount.
     * @param itemName
     * @param quantity
     * @returns codes: 1-Success, 2-Item Not Found, 4-Registry not found
     */
    async AttachmentIncrement(name, quantity) {
        return this.InventoryIncrement("attachments", name, quantity);
    }
    /**
     * Reduces a given item by the given amount. Cannot reduce below zero.
     * @param itemName
     * @param quantity
     * @returns codes: 1-Success, 2-Item Not Found, 3-Not Enough Resources, 4-Registry not found
     */
    async AttachmentDecrement(name, quantity) {
        return this.InventoryDecrement("attachments", name, quantity);
    }
    /**
     * Will increment/decrement with any quantity (i.e. positive for increase, negative for decrease)
     * @param name
     * @param quantity
     * @returns codes: 1-Success, 2-Item Not Found, 3-Not Enough Resources, 4-Registry not found
     */
    async AttachmentEdit(name, quantity) {
        let result;
        if (quantity >= 0)
            result = this.AttachmentIncrement(name, quantity);
        else
            result = this.AttachmentDecrement(name, Math.abs(quantity));
        return result;
    }
    //#endregion - Attachments
    //#region - Reputation
    /**
     * Increases the given item by the amount.
     * @param itemName
     * @param quantity
     * @returns codes: 1-Success, 2-Item Not Found, 4-Registry not found
     */
    async ReputationIncrement(name, quantity) {
        return this.InventoryIncrement("reputation", name, quantity);
    }
    /**
     * Reduces a given item by the given amount. Cannot reduce below zero.
     * @param itemName
     * @param quantity
     * @returns codes: 1-Success, 2-Item Not Found, 3-Not Enough Resources, 4-Registry not found
     */
    async ReputationDecrement(name, quantity) {
        return this.InventoryDecrement("reputation", name, quantity);
    }
    /**
     * Will increment/decrement with any quantity (i.e. positive for increase, negative for decrease)
     * @param name
     * @param quantity
     * @returns codes: 1-Success, 2-Item Not Found, 3-Not Enough Resources, 4-Registry not found
     */
    async ReputationEdit(name, quantity) {
        let result;
        if (quantity >= 0)
            result = this.ReputationIncrement(name, quantity);
        else
            result = this.ReputationDecrement(name, Math.abs(quantity));
        return result;
    }
    //#endregion - Reputation
    //#region - General Inventory
    /**
     *
     * @param registryName
     * @param name
     * @param quantity
     * @returns codes: 1-Success, 2-Item Not Found, 4-RegistryNotFound
     */
    async InventoryIncrement(registryName, name, quantity) {
        const result = this.inventory[registryName].Increase(name, quantity);
        if (result.success)
            await this.save();
        return result;
    }
    /**
     * Decrements the item from the given registry by the given amount. Will not allow reduction below 0.
     * @param registryName
     * @param name
     * @param quantity
     * @returns codes: 1-Success, 2-Item Not Found, 3-Not enough items, 4-Registry Not Found
     */
    async InventoryDecrement(registryName, name, quantity) {
        const result = this.inventory[registryName].ReduceToNonNegative(name, quantity);
        if (result.success)
            await this.save();
        return result;
    }
    async InventorySum(inventoryName, gameCollection) {
        try {
            this.inventory[inventoryName].SumCollection(gameCollection);
            await this.save();
            return true;
        }
        catch (e) {
            if (Client_1.Client.Get().ConsoleLogging)
                console.warn(e);
            return false;
        }
    }
    /**
     * Will change the user's quantity of the given item by the given amount. This function requires no duplicate
     * entries to work properly (i.e. there cannot be a faction and a material with the same name). This is the
     * easiest method of inventory manipulation.
     * @param name the name of the item
     * @param quantity the amount to change by (positive or negative)
     * @return codes: 1-Success, 2-Item Not Found, 3-Not enough items, 4-Registry Not Found.
     */
    async AutoInventoryEdit(name, quantity) {
        const Reg = Client_1.Client.Get().Registry;
        let result;
        //loops through registries. If one is found, then call inventory functions on that type
        for (let i = 0; i < 4; i++)
            if (Reg[Player.RegistryTypes[i]].get(name) != undefined) {
                if (quantity >= 0)
                    result = this.InventoryIncrement(Player.InventoryTypes[i], name, quantity);
                else
                    result = this.InventoryDecrement(Player.InventoryTypes[i], name, Math.abs(quantity));
                return result;
            }
        return { success: false, amount: 0, code: 2, error: "Could not find this item in any registry" };
    }
    /**
     * Will change the user's quantity of the given item by the given amount. This function requires no duplicate
     * entries to work properly (i.e. there cannot be a faction and a material with the same name). This is the
     * easiest method of inventory manipulation.
     * @param name the name of the item
     * @param quantity the amount to change by (positive or negative)
     * @return codes: 1-Success, 2-Item Not Found, 3-Not enough items
     */
    async BatchAutoInventoryEdit(pairs) {
        const ValidTest = this.BatchSufficientToDecrease(pairs);
        if (!ValidTest.success)
            return { success: false, code: ValidTest.code };
        const Reg = Client_1.Client.Get().Registry;
        for (const pair of pairs) {
            const name = pair.name;
            const quantity = pair.quantity;
            let intermediateResult;
            for (let i = 0; i < 4; i++) {
                if (Reg[Player.RegistryTypes[i]].get(name) != undefined) {
                    if (quantity >= 0) {
                        intermediateResult = this.inventory[Player.InventoryTypes[i]].Increase(name, quantity);
                    }
                    else {
                        intermediateResult = this.inventory[Player.InventoryTypes[i]].ReduceToNonNegative(name, Math.abs(quantity));
                    }
                    if (intermediateResult.success == true) {
                        break;
                    }
                    else {
                        return { success: false, code: intermediateResult.code };
                    }
                }
                if (i == 3)
                    return { success: false, code: 2 };
            }
        }
        await this.save();
        return { success: true, code: 1 };
    }
    /**
     * Checks if the user has the sufficient resources to be reduced by the given amount.
     * @param pairs array of {name, quantity} object literals.
     * @param ignoreInvalid Will not check for invalid names (i.e. they will be ignored. An invalid name will not cause a false return value).
     * @returns codes: 1-Success, 2-Item not found, 3-Not enough items
     */
    BatchSufficientToDecrease(pairs, ignoreInvalid = false) {
        const Reg = Client_1.Client.Get().Registry;
        for (const pair of pairs) {
            for (let i = 0; i < 4; i++) {
                if (Reg[Player.RegistryTypes[i]].get(pair.name) != undefined) {
                    if (!this.inventory[Player.InventoryTypes[i]].SufficientToDecrease(pair.name, pair.quantity)) {
                        return { success: false, code: 3 };
                    }
                    break;
                }
                if (i == 3 && !ignoreInvalid) {
                    return { success: false, code: 2 };
                }
            }
        }
        return { success: true, code: 1 };
    }
    /**
     * Will find the user's current quantity of the given item. This function requires no duplicate
     * entries to work properly (i.e. there cannot be a faction and a material with the same name). This is the
     * easiest method of inventory manipulation.
     * @param name the name of the item
     * @return codes: 1-Success, 2-Item Not Found
     */
    AutoInventoryRetrieve(name) {
        const Reg = Client_1.Client.Get().Registry;
        for (let i = 0; i < 4; i++) {
            if (Reg[Player.RegistryTypes[i]].get(name) != undefined) {
                return { success: true, code: 1, amount: this.inventory[Player.InventoryTypes[i]].get(name) };
            }
        }
        return { success: false, amount: 0, code: 2, error: "Could not find this item in any registry" };
    }
    /**
     * Will find the user's current quantity of the given item. This function requires no duplicate
     * entries to work properly (i.e. there cannot be a faction and a material with the same name). This is the
     * easiest method of inventory manipulation.
     * @param name the name of the item
     * @return The array returned includes quantities in order they were provided. Items not found will be given quantity of 0.
     */
    BatchAutoInventoryRetrieve(names) {
        const Reg = Client_1.Client.Get().Registry;
        const quantity = new Array();
        for (const name of names) {
            for (let i = 0; i < 4; i++) {
                if (Reg[Player.RegistryTypes[i]].get(name) != undefined) {
                    quantity.push(this.inventory[Player.InventoryTypes[i]].get(name) || 0);
                    break;
                }
                if (i == 3)
                    quantity.push(0);
            }
        }
        return quantity;
    }
    //#endregion - General Inventory
    async save() {
        await PlayerModel_1.PlayerModel.updateOne({ uId: this.uId }, { uId: this.uId, inventory: this.inventory.GetGeneric(), ship: this.ship, skin: this.skin });
    }
}
exports.Player = Player;
Player.RegistryTypes = ["MaterialRegistry", "FactionRegistry", "AttachmentRegistry", "ShipRegistry"];
Player.InventoryTypes = ["materials", "reputation", "attachments", "ships"];
