/// <reference types="node" />
import { ShipWrapper } from "./ShipWrapper";
import { EventEmitter } from "events";
import { Attachment } from "../Attachment/Attachment";
/**
 * Battleship Class
 *
 * Represents player ships (ShipWrapper) in a battle. Specifically, adds support
 * for statistics that can change throughout a battle (i.e. hp, shield, energy),
 * being at or below some maximum capacity defined by the ShipWrapper.
 *
 * @since 1.0.0
 */
export declare class Battleship extends EventEmitter {
    readonly statNames: IBattleStatsNames[];
    private playerShip;
    private cooldownArray;
    private maxStats;
    private currentStats;
    private gainStats;
    private criticalDamage;
    get Ship(): ShipWrapper;
    get Hp(): number;
    get Shield(): number;
    get W(): number;
    get E(): number;
    get C(): number;
    weaponIncrease(n: number, emit?: boolean): this;
    weaponDecrease(n: number, emit?: boolean): this;
    engineIncrease(n: number, emit?: boolean): this;
    engineDecrease(n: number, emit?: boolean): this;
    cpuIncrease(n: number, emit?: boolean): this;
    cpuDecrease(n: number, emit?: boolean): this;
    shieldIncrease(n: number, emit?: boolean): this;
    shieldDecrease(n: number, emit?: boolean): this;
    hpIncrease(n: number, emit?: boolean): this;
    startTurn(): this;
    private statGain;
    showInvocable(): Attachment[];
    reduceCooldown(n?: number): void;
    standardDamage(n: number): this;
    hullDamage(n: number): this;
    private fireDamageTaken;
    constructor(playerShip: ShipWrapper);
    private init;
    private startFn;
    private maxFn;
    private gainFn;
}
export declare interface Battleship {
    on(event: "damageTaken", listener: (player: Battleship, damage: number) => void): this;
    on(event: "criticalDamage", listener: (player: Battleship, damage: number) => void): this;
    on(event: "turnStart", listener: (player: Battleship) => void): this;
    on(event: "weaponIncrease", listener: (player: Battleship, amount: number) => void): this;
    on(event: "weaponDecrease", listener: (player: Battleship, amount: number) => void): this;
    on(event: "engineIncrease", listener: (player: Battleship, amount: number) => void): this;
    on(event: "engineDecrease", listener: (player: Battleship, amount: number) => void): this;
    on(event: "cpuIncrease", listener: (player: Battleship, amount: number) => void): this;
    on(event: "cpuDecrease", listener: (player: Battleship, amount: number) => void): this;
    on(event: "shieldIncrease", listener: (player: Battleship, amount: number) => void): this;
    on(event: "shieldDecrease", listener: (player: Battleship, amount: number) => void): this;
    on(event: "hullIncrease", listener: (player: Battleship, amount: number) => void): this;
    on(event: "hullDecrease", listener: (player: Battleship, amount: number) => void): this;
}
declare type IBattleStatsNames = "hp" | "shield" | "weapon" | "engine" | "cpu";
export {};
