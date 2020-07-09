"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShipWrapper = void 0;
const Client_1 = require("../../../Client/Client");
const Attachment_1 = require("../Attachment/Attachment");
class ShipWrapper {
    constructor(ship, player) {
        this.bonusHp = 0;
        this.bonusShield = 0;
        this.bonusEnergy = [0, 0, 0];
        this.bonusCargo = 0;
        this.bonusHandling = 0;
        this.attachments = new Array();
        this.Slots = new Map()
            .set(Attachment_1.AttachmentType.GENERAL, 0)
            .set(Attachment_1.AttachmentType.HEAVY, 0)
            .set(Attachment_1.AttachmentType.MINER, 0)
            .set(Attachment_1.AttachmentType.PRIMARY, 0)
            .set(Attachment_1.AttachmentType.SHIELD, 0);
        this.ship = ship;
        this.owner = player;
    }
    /**
     * Stringifies the ship for database
     */
    stringifyName() {
        return this.ship.Name;
    }
    stringifyAttachments() {
        return this.attachments.map((attachment) => attachment.Name);
    }
    get Owner() {
        return this.owner;
    }
    get Strength() {
        let strength = this.ship.Strength;
        this.attachments.forEach((attachment) => (strength += attachment.Strength));
        return strength;
    }
    get WeaponCapacities() {
        return this.ship.WeaponCapacities;
    }
    copyAttachments() {
        return this.attachments.slice();
    }
    get ShipStatistics() {
        const Base = this.ship.ShipStatistics;
        return {
            totalHp: Base.baseHp + this.bonusHp,
            totalShield: Base.baseShield + this.bonusShield,
            totalEnergy: Base.baseEnergy.map((el, idx) => el + this.bonusEnergy[idx]),
            totalCargo: Base.baseCargo + this.bonusCargo,
            totalHandling: Base.baseHandling + this.bonusHandling,
        };
    }
    incrementStatistics(stats) {
        if (stats.hp)
            this.bonusHp += stats.hp ?? 0;
        if (stats.shield)
            this.bonusShield += stats.shield ?? 0;
        if (stats.energy)
            this.bonusEnergy = this.bonusEnergy.map((el, idx) => (el += stats.energy[idx] ?? 0));
        if (stats.cargo)
            this.bonusCargo += stats.cargo ?? 0;
        if (stats.handling)
            this.bonusHandling += stats.handling ?? 0;
    }
    decrementStatistics(stats) {
        if (stats.hp)
            this.bonusHp -= stats.hp ?? 0;
        if (stats.shield)
            this.bonusShield -= stats.shield ?? 0;
        if (stats.energy)
            this.bonusEnergy = this.bonusEnergy.map((el, idx) => (el -= stats.energy[idx] ?? 0));
        if (stats.cargo)
            this.bonusCargo -= stats.cargo ?? 0;
        if (stats.handling)
            this.bonusHandling -= stats.handling ?? 0;
    }
    /**
     * Changes the ship stored in this wrapper. Does not handle the addition of the old
     * attachments and old ship back into the players inventory.
     * @param newShip the ship to change this to
     * @returns array of attachments that were removed and the ship that was replaced
     */
    changeShip(newShip) {
        //shallow copy attachment array and ship
        const oldAttachments = this.attachments.slice();
        const oldShip = this.ship;
        //Unequip all attachments
        this.attachments = [];
        this.Slots.forEach((_, key) => this.Slots.set(key, 0));
        //Change ship
        this.ship = newShip;
        //return all attachments. return the ship.
        return { attachments: oldAttachments, oldShip: oldShip };
    }
    /**
     * Adds attachment with either the attachment itself, or the name of it
     * @param attachment
     * @returns codes:<br />  \
     *  200: success<br />  \
     *  404: attachment not found in registry<br />  \
     *  403: not enough room to add item (space or tech)
     */
    addAttachment(attachment) {
        if (typeof attachment == "string") {
            const candidate = Client_1.Client.Reg.ResolveAttachmentFromName(attachment);
            if (candidate == undefined)
                return { code: 404 };
            attachment = candidate;
        }
        const Type = attachment.Type;
        const NumEquipped = this.Slots.get(Type);
        const MaxEquipped = this.ship.WeaponCapacities.get(Type);
        if (NumEquipped == undefined || MaxEquipped == undefined)
            throw new TypeError(`Unsupported attachment type ${Type}. It could not be found. NumEquipped:${NumEquipped}, MaxEquipped${MaxEquipped}`);
        if (NumEquipped >= MaxEquipped)
            return { code: 403 };
        if (this.getTotalTech() + attachment.TechLevel > this.ship.MaxTech)
            return { code: 403 };
        this.Slots.set(Type, NumEquipped + 1);
        this.attachments.push(attachment);
        attachment.dispatch(Attachment_1.GameEvent.EQUIP, this);
        return { code: 200 };
    }
    getTotalTech() {
        return this.attachments.reduce((acc, val) => acc + val.TechLevel, 0);
    }
    /**
     *
     * @param attachment
     * @returns codes - 200: success, 404: Attachment not found on ship
     */
    removeAttachment(attachment) {
        if (typeof attachment != "string")
            attachment = attachment.Name;
        const idxAttachment = this.attachments.findIndex((val) => val.Name == attachment);
        if (idxAttachment == undefined)
            return { code: 404 };
        const Attachment = this.attachments.splice(idxAttachment, 1);
        Attachment[0].dispatch(Attachment_1.GameEvent.UNEQUIP, this);
        return { code: 200, removedAttachment: Attachment[0] };
    }
    pollWarp(warpRequired) {
        if (warpRequired == 0)
            return true;
        const result = [];
        this.attachments.forEach((attachment) => {
            const data = attachment.dispatch(Attachment_1.GameEvent.WARP_POLL, this, warpRequired);
            if (data != undefined)
                result.push(data);
        });
        if (result == undefined)
            return false;
        if (result.length > 1)
            return false;
        return result[0].success;
    }
    warp(warpRequired) {
        const result = [];
        this.attachments.forEach((attachment) => {
            const data = attachment.dispatch(Attachment_1.GameEvent.WARP, this, warpRequired);
            if (data != undefined)
                result.push(data);
        });
        if (result == undefined)
            return false;
        if (result.length > 1)
            return false;
        return result[0].success;
    }
    mineEvent(asteroid) {
        this.attachments.forEach((attachment) => {
            attachment.dispatch(Attachment_1.GameEvent.MINE, asteroid);
        });
    }
}
exports.ShipWrapper = ShipWrapper;
