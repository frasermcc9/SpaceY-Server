"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const PlayerModel_1 = require("../../../GameApi/Database/Player/PlayerModel");
const PlayerInventory_1 = require("./PlayerInventory");
const Skin_1 = require("./Skin");
const Client_1 = require("../../../Client/Client");
const ShipWrapper_1 = require("../Ship/ShipWrapper");
const util_1 = require("../../../Util/util");
class Player {
    constructor(data) {
        this.allSkins = new Array();
        this.location = Client_1.Client.Reg.DefaultLocation;
        this.blueprints = new Set();
        this.exp = 100;
        this.skillPoints = [0, 0, 0];
        this.uId = data.uId; //ID
        const Ship = Client_1.Client.Reg.ResolveShipFromName(data.ship.name);
        if (Ship == undefined)
            throw new Error(`Mismatch between database and server. No item ${data.ship} exists in server, but does in db for ${this.uId}.`);
        this.ship = new ShipWrapper_1.ShipWrapper(Ship, this);
        this.location = util_1.util.throwUndefined(Client_1.Client.Reg.Spacemap.resolveNodeFromName(data.location), `Mismatch between database and server for location ${data.location}`);
        this.blueprints = new Set(data.blueprints);
        this.exp = data.exp;
        this.skillPoints = data.skills;
        data.ship.equipped.forEach((attachmentName) => {
            const result = this.ship.addAttachment(attachmentName);
            if (result.code == 404)
                throw new Error(`Mismatch between database and server. No such item ${attachmentName} exists despite existing in database for id ${this.uId}.`);
            if (result.code == 403)
                throw new Error(`Mismatch between database and server. Player '${this.uId}' has more items equipped in database than possible on ship.`);
        });
        const skin = new Skin_1.Skin(data.skin?.skinName ?? "", data.skin?.skinUri ?? "");
        this.skin = skin.SkinName == "" ? undefined : skin;
        data.skins?.forEach((skin) => {
            this.allSkins.push(new Skin_1.Skin(skin.skinName, skin.skinUri));
        });
        this.inventory = new PlayerInventory_1.InventoryBuilder()
            .SetCredits(data.inventory.credits)
            .SetReputation({ data: data.inventory.reputation })
            .SetAttachments({ data: data.inventory.attachments })
            .SetMaterials({ data: data.inventory.materials })
            .SetShips({ data: data.inventory.ships })
            .SetTokens(data.inventory.tokens)
            .Build();
        this.inventory.Materials.Owner = this;
    }
    get UId() {
        return this.uId;
    }
    get Inventory() {
        return this.inventory;
    }
    //#region - EXP and Skills
    //#region EXP
    get Exp() {
        return this.exp;
    }
    get Level() {
        return Player.inverseExpFunction(this.exp);
    }
    get ExpToNextLevel() {
        return Math.ceil(Player.expFunction(this.Level + 1) - this.exp);
    }
    addExp(exp) {
        if (this.exp + exp >= this.ExpToNextLevel) {
            //the player levelled up
            Client_1.Client.EventMan.emit("LevelUp", { uId: this.uId, level: this.Level });
        }
        this.exp += exp;
        this.save();
    }
    /**
     * Returns cumulative xp required to reach a level
     * @param x the level
     * @returns the cumulative xp to reach this level
     */
    static expFunction(x) {
        return (5 / 9) * (x + 1) * (4 * x ** 2 - 4 * x + 27);
    }
    /**
     * Returns the level that a player with xp *x* would be
     * @param x the cumulative xp of the player
     * @returns the level that the player would be
     */
    static inverseExpFunction(x) {
        for (let i = 0;; i++) {
            if (this.expFunction(i) > x) {
                return i - 1;
            }
        }
    }
    //#endregion EXP
    //#region Skills
    /**
     * Total skill points of player, including those spent and unspent
     */
    get totalSkillPoints() {
        return this.Level * 3;
    }
    /**
     * Total amount of skill points the player has spent
     */
    get spentSkillPoints() {
        return this.skillPoints.reduce((acc, val) => acc + val, 0);
    }
    /**
     * Gets the amount of unspent skill points the player has
     */
    get unspentSkillPoints() {
        return this.totalSkillPoints - this.spentSkillPoints;
    }
    /**
     * Adds a point to the specified skill
     * @param type the skill to add the point to
     * @returns true if point was allocated successfully
     */
    async addSkillPoint(type) {
        if (this.unspentSkillPoints < 1)
            return false;
        switch (type) {
            case "Weapons":
                this.skillPoints[0] += 1;
                break;
            case "Engineering":
                this.skillPoints[1] += 1;
                break;
            case "Technology":
                this.skillPoints[2] += 1;
                break;
        }
        await this.save();
        return true;
    }
    pollSkillPoints() {
        return this.skillPoints.slice();
    }
    //#endregion Skills
    //#endregion EXP and Skills
    //#region - INVENTORY
    //#region - Credits
    async CreditsIncrement({ amount, implicitSave = true }) {
        if (amount < 0)
            throw new Error("Only positive values can be passed to the incrementCredits method. Consider using decrement to remove credits.");
        const success = this.inventory.AddCredits({ amount: amount });
        if (success && implicitSave) {
            await this.save();
        }
        return success;
    }
    async CreditsDecrement({ amount, implicitSave = true }) {
        if (amount < 0)
            throw new Error("Only positive values can be passed to the decrementCredits method. Consider using increment to add credits.");
        const success = this.inventory.AddCredits({ amount: -amount });
        if (success && implicitSave) {
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
    async InventorySubtract(inventoryName, gameCollection) {
        const result = this.inventory[inventoryName].SubtractCollection(gameCollection);
        await this.save();
        return result;
    }
    /**
     * Will change the user's quantity of the given item by the given amount. This function requires no duplicate
     * entries to work properly (i.e. there cannot be a faction and a material with the same name). This is the
     * easiest method of inventory manipulation.
     * @param name the name of the item
     * @param quantity the amount to change by (positive or negative)
     * @return codes: <br />  \
     * 1 - Success <br />  \
     * 2 - Item Not Found <br />  \
     * 3 - Not enough items <br />  \
     * 4 - Registry Not Found.
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
    //#endregion INVENTORY
    //#region SHIP
    async setShip(ship) {
        if (typeof ship == "string") {
            const candidate = Client_1.Client.Reg.ResolveShipFromName(ship);
            if (candidate == undefined)
                throw new TypeError(`Ship with name ${ship} does not exist in registry, despite trying to set it`);
            ship = candidate;
        }
        const oldItems = this.ship.changeShip(ship);
        const Attachments = oldItems.attachments.map((attachment) => attachment.Name);
        this.inventory.Attachments.StrictSumCollection(Attachments);
        this.inventory.Ships.StrictSumCollection([oldItems.oldShip.Name]);
        await this.save();
    }
    /**@internal */
    getShipWrapper() {
        return this.ship;
    }
    async equipAttachment(attachment) {
        const inInventory = this.inventory.Attachments.get(attachment.toString());
        if (inInventory == undefined || inInventory < 1)
            return { code: 403 };
        const addResult = this.ship.addAttachment(attachment);
        if (addResult.code == 200) {
            if ((await this.AttachmentDecrement(attachment.toString(), 1)).code != 1)
                throw new Error("Server error when decrementing player attachments");
            await this.save();
            return { code: 200 };
        }
        else {
            return addResult;
        }
    }
    async unequipAttachment(attachment) {
        const Result = this.ship.removeAttachment(attachment);
        if (Result.code == 200 && Result.removedAttachment != undefined) {
            this.AttachmentIncrement(Result.removedAttachment.Name, 1);
            await this.save();
            return { code: 200 };
        }
        return { code: 404 };
    }
    /**
     * **FORCE** adds attachment to ship. Does nothing else. For normal add from
     * inventory, use equipAttachment()
     * @param attachment any attachment in client registry
     */
    async addAttachmentToShip(attachment) {
        const Result = this.ship.addAttachment(attachment);
        await this.save();
        return Result;
    }
    /**
     * **FORCE** adds attachment to ship. Does nothing else. For normal remove
     * from ship and add to inventory, use unequipAttachment().
     * @param attachment any attachment in client registry
     */
    async forceRemoveFromShip(attachment) {
        const Result = this.ship.removeAttachment(attachment);
        if (Result.code == 200 && Result.removedAttachment != undefined) {
            await this.save();
            return { code: 200 };
        }
        return { code: 404 };
    }
    //#endregion SHIP
    //#region LOCATION
    get Location() {
        return util_1.util.throwUndefined(this.location, "Player does not have location");
    }
    async travelTo(node) {
        node = util_1.util.throwUndefined(Client_1.Client.Reg.Spacemap.resolveNodeFromName(node));
        if (!this.adjacentLocations().includes(node))
            return false;
        if (this.getShipWrapper().pollWarp(node.RequiredWarp)) {
            this.location = node;
            this.getShipWrapper().warp(node.RequiredWarp);
            await this.save();
            return true;
        }
        return false;
    }
    adjacentLocations() {
        return Client_1.Client.Reg.Spacemap.getConnectedNodes(this.location);
    }
    //#endregion - location
    //#region BLUEPRINT
    hasBlueprintFor(item) {
        return this.blueprints.has(item.toString());
    }
    /**
     * Adds a blueprint to the player. Returns `true` if its new, `false` if the
     * player already has it.
     * @param item
     */
    async discoverBlueprint(item) {
        if (this.blueprints.has(item.toString()))
            return false;
        this.blueprints.add(item.toString());
        await this.save();
        return true;
    }
    //#endregion blueprint
    //#region Character
    get PlayerImage() {
        if (this.skin != undefined) {
            return this.skin.SkinUri;
        }
        else {
            return this.ship.Uri;
        }
    }
    async newSkin(name, uri) {
        if (this.inventory.removeTokens({ amount: 1 })) {
            this.skin = new Skin_1.Skin(name, uri);
            this.allSkins.push(this.skin);
            await this.save();
            return true;
        }
        return false;
    }
    async applySkin(name, uri) {
        const skin = this.allSkins.find((skin) => skin.SkinName == name && skin.SkinUri == uri);
        this.skin = skin;
        await this.save();
    }
    async removeSkin() {
        this.skin = undefined;
        await this.save();
    }
    get availableSkins() {
        return this.allSkins.slice();
    }
    profile() {
        return {
            credits: this.Credits,
            tokens: this.inventory.Tokens,
            skills: this.skillPoints,
            image: this.PlayerImage,
            bestFaction: Client_1.Client.Reg.ResolveFactionFromName(this.inventory.Reputation.keyArray().reduce((a, b) => this.inventory.Reputation.get(a) > this.inventory.Reputation.get(b) ? a : b)),
            ship: this.ship,
            level: this.Level,
            location: this.location,
            exp: this.exp,
            expToNext: this.ExpToNextLevel,
        };
    }
    //#endregion Character
    async save() {
        const skinDb = [];
        this.allSkins.forEach((skin) => {
            skinDb.push({ skinName: skin.SkinName, skinUri: skin.SkinUri });
        });
        await PlayerModel_1.PlayerModel.updateOne({ uId: this.uId }, {
            uId: this.uId,
            inventory: this.inventory.GetGeneric(),
            ship: { name: this.ship.stringifyName(), equipped: this.ship.stringifyAttachments() },
            skin: { skinName: this.skin?.SkinName ?? "", skinUri: this.skin?.SkinUri ?? "" },
            skins: skinDb,
            location: this.location.Name,
            blueprints: Array.from(this.blueprints),
            exp: this.exp,
            skills: this.skillPoints,
        });
    }
}
exports.Player = Player;
Player.RegistryTypes = ["MaterialRegistry", "FactionRegistry", "AttachmentRegistry", "ShipRegistry"];
Player.InventoryTypes = ["materials", "reputation", "attachments", "ships"];
