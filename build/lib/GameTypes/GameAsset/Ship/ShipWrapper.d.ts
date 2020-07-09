import { Asteroid } from "../../GameMechanics/Asteroid";
import { Attachment, AttachmentType } from "../Attachment/Attachment";
import { Player } from "../Player/Player";
import { Ship } from "./Ship";
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
    get WeaponCapacities(): Map<AttachmentType, number>;
    copyAttachments(): Attachment[];
    get ShipStatistics(): {
        totalHp: number;
        totalShield: number;
        totalEnergy: number[];
        totalCargo: number;
        totalHandling: number;
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
    energy?: number[];
    cargo?: number;
    handling?: number;
};
export {};