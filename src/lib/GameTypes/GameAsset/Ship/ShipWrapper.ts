import { Server } from "../../../Server/Server";
import { Asteroid } from "../../GameMechanics/Asteroid";
import { Attachment, AttachmentReport, AttachmentType, GameEvent } from "../Attachment/Attachment";
import { Player } from "../Player/Player";
import { Ship } from "./Ship";
import { MapCollection } from "../../../Extensions/Collections";

export class ShipWrapper {
    private ship: Ship;
    private owner: Player;

    private bonusHp: number = 0;
    private bonusShield: number = 0;
    private bonusEnergy: number[] = [0, 0, 0];
    private bonusCargo: number = 0;
    private bonusHandling: number = 0;

    private attachments: Array<Attachment> = new Array();
    private Slots: Map<AttachmentType, number> = new Map()
        .set(AttachmentType.GENERAL, 0)
        .set(AttachmentType.HEAVY, 0)
        .set(AttachmentType.MINER, 0)
        .set(AttachmentType.PRIMARY, 0)
        .set(AttachmentType.SHIELD, 0);

    public constructor(ship: Ship, player: Player) {
        this.ship = ship;
        this.owner = player;
    }
    /**
     * Stringifies the ship for database
     */
    public stringifyName(): string {
        return this.ship.Name;
    }
    public stringifyAttachments(): string[] {
        return this.attachments.map((attachment) => attachment.Name);
    }

    public get Owner(): Player {
        return this.owner;
    }
    public get Strength(): number {
        let strength = this.ship.Strength;
        this.attachments.forEach((attachment) => (strength += attachment.Strength));
        return strength;
    }

    public raw() {
        return {
            name: this.Name,
            description: this.Description,
            techLevel: this.MaxTech,
            equipped: this.copyAttachments().map((a) => {
                return {
                    name: a.Name,
                    description: a.Description,
                    energyCost: a.EnergyCost,
                    techLevel: a.TechLevel,
                    type: a.Type,
                    strength: a.Strength,
                    cost: a.Cost,
                };
            }),
            baseStats: this.BaseStatistics,
            playerStats: this.Statistics,
            weaponCapacities: Object.fromEntries(this.WeaponCapacities),
            equippedSlots: Object.fromEntries(this.availableSlots()),
            maxTech: this.MaxTech,
            strength: this.Strength,

            baseShip: this.ship,
        };
    }

    /**
     * Gets weapon capacities (copy - does not mutate)
     */
    public get WeaponCapacities(): Map<AttachmentType, number> {
        return new Map(this.ship.WeaponCapacities);
    }

    public get Uri() {
        return this.ship.ImageUri;
    }
    public get Name() {
        return this.ship.Name;
    }
    public get Description() {
        return this.ship.Description;
    }
    public get MaxTech() {
        return this.ship.MaxTech;
    }

    public copyAttachments(): Attachment[] {
        return this.attachments.slice();
    }

    public availableSlots() {
        /**value: capacity, key: type */
        const capacity = this.WeaponCapacities;
        capacity.forEach((v, k) => {
            capacity.set(k, v - this.Slots.get(k)!);
        });
        return new MapCollection(capacity);
    }

    public get Statistics(): IShipStats {
        const base = this.ShipStatistics;
        const e = base.totalEnergy;
        const levels = this.Owner.pollSkillPoints();
        return {
            hp: base.totalHp,
            shield: base.totalShield,
            handling: base.totalHandling,
            cargo: base.totalCargo,
            energy: [e[0] + this.lvlIncrease(levels[0]), e[1] + this.lvlIncrease(levels[1]), e[2] + this.lvlIncrease(levels[2])],
        };
    }
    /**
     * Gets the increase in energy capacity based on the number of skill points
     * the player has in the relevant field.
     * @param i the number of points in the skill
     */
    private lvlIncrease(i: number) {
        i -= 1;
        return 2 * ~~(i / 5) + Math.ceil((i % 5) / 2);
    }
    /**
     * Gets the ship statistics from the ship, with the effects from attachments
     * taken into account
     */
    public get ShipStatistics() {
        const Base = this.ship.ShipStatistics;
        return {
            totalHp: Base.baseHp + this.bonusHp,
            totalShield: Base.baseShield + this.bonusShield,
            totalEnergy: Base.baseEnergy.map((el, idx) => el + this.bonusEnergy[idx]),
            totalCargo: Base.baseCargo + this.bonusCargo,
            totalHandling: Base.baseHandling + this.bonusHandling,
        };
    }
    /**
     * Gets base statistics that are from the standard ship without adjustments
     */
    public get BaseStatistics() {
        return this.ship.ShipStatistics;
    }

    public incrementStatistics(stats: BonusStatChanger): void {
        if (stats.hp) this.bonusHp += stats.hp ?? 0;
        if (stats.shield) this.bonusShield += stats.shield ?? 0;
        if (stats.energy) this.bonusEnergy = this.bonusEnergy.map((el, idx) => (el += stats.energy![idx] ?? 0));
        if (stats.cargo) this.bonusCargo += stats.cargo ?? 0;
        if (stats.handling) this.bonusHandling += stats.handling ?? 0;
    }
    public decrementStatistics(stats: BonusStatChanger): void {
        if (stats.hp) this.bonusHp -= stats.hp ?? 0;
        if (stats.shield) this.bonusShield -= stats.shield ?? 0;
        if (stats.energy) this.bonusEnergy = this.bonusEnergy.map((el, idx) => (el -= stats.energy![idx] ?? 0));
        if (stats.cargo) this.bonusCargo -= stats.cargo ?? 0;
        if (stats.handling) this.bonusHandling -= stats.handling ?? 0;
    }

    /**
     * Changes the ship stored in this wrapper. Does not handle the addition of the old
     * attachments and old ship back into the players inventory.
     * @param newShip the ship to change this to
     * @returns array of attachments that were removed and the ship that was replaced
     */
    public changeShip(newShip: Ship): { attachments: Attachment[]; oldShip: Ship } {
        //shallow copy attachment array and ship
        const oldAttachments = this.attachments.slice();
        const oldShip = this.ship;
        //Unequip all attachments
        this.attachments.forEach((el) => this.removeAttachment(el));
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
    public addAttachment(attachment: Attachment | string): { code: 200 | 403 | 404 } {
        if (typeof attachment == "string") {
            const candidate = Server.Reg.ResolveAttachmentFromName(attachment);
            if (candidate == undefined) return { code: 404 };
            attachment = candidate;
        }
        const Type = attachment.Type;
        const NumEquipped = this.Slots.get(Type);
        const MaxEquipped = this.ship.WeaponCapacities.get(Type);
        if (NumEquipped == undefined || MaxEquipped == undefined)
            throw new TypeError(
                `Unsupported attachment type ${Type}. It could not be found. NumEquipped:${NumEquipped}, MaxEquipped${MaxEquipped}`
            );
        if (NumEquipped >= MaxEquipped) return { code: 403 };
        if (this.getTotalTech() + attachment.TechLevel > this.ship.MaxTech) return { code: 403 };
        this.Slots.set(Type, NumEquipped + 1);
        this.attachments.push(attachment);
        attachment.dispatch(GameEvent.EQUIP, this);
        return { code: 200 };
    }

    public getTotalTech(): number {
        return this.attachments.reduce((acc, val) => acc + val.TechLevel, 0);
    }

    /**
     *
     * @param attachment
     * @returns codes - 200: success, 404: Attachment not found on ship
     */
    public removeAttachment(attachment: Attachment | string): { code: number; removedAttachment?: Attachment } {
        if (typeof attachment != "string") attachment = attachment.Name;
        const idxAttachment = this.attachments.findIndex((val) => val.Name == attachment);
        if (idxAttachment == undefined) return { code: 404 };
        const Attachment = this.attachments.splice(idxAttachment, 1);
        Attachment[0].dispatch(GameEvent.UNEQUIP, this);
        return { code: 200, removedAttachment: Attachment[0] };
    }

    public pollWarp(warpRequired: number): boolean {
        if (warpRequired == 0) return true;
        const result: AttachmentReport[] = [];
        this.attachments.forEach((attachment) => {
            const data = attachment.dispatch(GameEvent.WARP_POLL, this, warpRequired);
            if (data != undefined) result.push(data);
        });

        if (result == undefined) return false;
        if (result.length > 1) return false;
        return result[0]?.success;
    }
    public warp(warpRequired: number): boolean {
        const result: AttachmentReport[] = [];
        this.attachments.forEach((attachment) => {
            const data = attachment.dispatch(GameEvent.WARP, this, warpRequired);
            if (data != undefined) result.push(data);
        });

        if (result == undefined) return false;
        if (result.length > 1) return false;
        return result[0]?.success;
    }
    public mineEvent(asteroid: Asteroid): void {
        this.attachments.forEach((attachment) => {
            attachment.dispatch(GameEvent.MINE, asteroid);
        });
    }
}

type BonusStatChanger = {
    hp?: number;
    shield?: number;
    energy?: [number, number, number];
    cargo?: number;
    handling?: number;
};

interface IShipStats {
    hp: number;
    shield: number;
    energy: [number, number, number];
    handling: number;
    cargo: number;
}
