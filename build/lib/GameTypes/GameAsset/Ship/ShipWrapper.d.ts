import { Asteroid } from "../../GameMechanics/Asteroid";
import { Attachment, AttachmentType } from "../Attachment/Attachment";
import { Player } from "../Player/Player";
import { Ship } from "./Ship";
import { MapCollection } from "../../../Extensions/Collections";
export declare class ShipWrapper {
    private ship;
    private owner;
    private bonusHp;
    private bonusShield;
    private bonusEnergy;
    private bonusCargo;
    private bonusHandling;
    private attachments;
    private Slots;
    constructor(ship: Ship, player: Player);
    /**
     * Stringifies the ship for database
     */
    stringifyName(): string;
    stringifyAttachments(): string[];
    get Owner(): Player;
    get Strength(): number;
    /**
     * Gets weapon capacities (copy - does not mutate)
     */
    get WeaponCapacities(): Map<AttachmentType, number>;
    get Uri(): string;
    copyAttachments(): Attachment[];
    availableSlots(): MapCollection<AttachmentType, number>;
    get Statistics(): IShipStats;
    /**
     * Gets the increase in energy capacity based on the number of skill points
     * the player has in the relevant field.
     * @param i the number of points in the skill
     */
    private lvlIncrease;
    /**
     * Gets the ship statistics from the ship, with the effects from attachments
     * taken into account
     */
    get ShipStatistics(): {
        totalHp: number;
        totalShield: number;
        totalEnergy: number[];
        totalCargo: number;
        totalHandling: number;
    };
    /**
     * Gets base statistics that are from the standard ship without adjustments
     */
    get BaseStatistics(): {
        baseHp: number;
        baseShield: number;
        baseEnergy: [number, number, number];
        baseCargo: number;
        baseHandling: number;
    };
    incrementStatistics(stats: BonusStatChanger): void;
    decrementStatistics(stats: BonusStatChanger): void;
    /**
     * Changes the ship stored in this wrapper. Does not handle the addition of the old
     * attachments and old ship back into the players inventory.
     * @param newShip the ship to change this to
     * @returns array of attachments that were removed and the ship that was replaced
     */
    changeShip(newShip: Ship): {
        attachments: Attachment[];
        oldShip: Ship;
    };
    /**
     * Adds attachment with either the attachment itself, or the name of it
     * @param attachment
     * @returns codes:<br />  \
     *  200: success<br />  \
     *  404: attachment not found in registry<br />  \
     *  403: not enough room to add item (space or tech)
     */
    addAttachment(attachment: Attachment | string): {
        code: 200 | 403 | 404;
    };
    getTotalTech(): number;
    /**
     *
     * @param attachment
     * @returns codes - 200: success, 404: Attachment not found on ship
     */
    removeAttachment(attachment: Attachment | string): {
        code: number;
        removedAttachment?: Attachment;
    };
    pollWarp(warpRequired: number): boolean;
    warp(warpRequired: number): boolean;
    mineEvent(asteroid: Asteroid): void;
}
declare type BonusStatChanger = {
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
export {};
