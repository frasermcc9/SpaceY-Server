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
    /**
     * Additional listeners that are dynamically added during the battle by
     * attachments. This allows for attachments of type 'do x for y turns',
     * where x can be something simple (do 5 damage), or more complex things
     * (listen for the enemy to increase in shield, and deny it).
     *
     * The key of the map is the array with 2 elements: (the event and its
     * callback function). The value is the number of turns the listener is to
     * remain on for. Note that 1 turn counts as each time another player gets
     * control, so a sequence of [player 1 turn, player 2 turn, player 1 turn]
     * counts as 3 turns.
     *
     * @example
     * const fn = (params)=>{console.log("shield damaged!")}
     * Enemy.on("shieldIncrease", fn);
     * activatedListeners.set(["shieldIncrease",fn], 4)
     * @description
     * will add fn to activated listeners. It will be removed after 4
     * half-turns.
     */
    private persistentEffects;
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
    get MaxHp(): number;
    get MaxShield(): number;
    get MaxW(): number;
    get MaxE(): number;
    get MaxC(): number;
    weaponIncrease(n: number, emit?: boolean): number;
    weaponDecrease(n: number, emit?: boolean): number;
    engineIncrease(n: number, emit?: boolean): number;
    engineDecrease(n: number, emit?: boolean): number;
    cpuIncrease(n: number, emit?: boolean): number;
    cpuDecrease(n: number, emit?: boolean): number;
    shieldIncrease(n: number, emit?: boolean): number;
    shieldDecrease(n: number, emit?: boolean): number;
    hpIncrease(n: number, emit?: boolean): number;
    standardDamage(n: number): this;
    hullDamage(n: number): this;
    addMaxStats(increments: IBattleStatsEffect): this;
    canAfford(cost: [number, number, number]): boolean;
    isReady(cost: [number, number, number]): boolean;
    startTurn(): this;
    private preTurnInit;
    reduceCooldown(n?: number): this;
    private statGain;
    private updatePersistent;
    showInvocable(): Attachment[];
    private fireDamageTaken;
    onPersist<K extends keyof BattleshipEventArgs>(e: K, duration: number, listener: BattleshipEventArgs[K]): void;
    constructor(playerShip: ShipWrapper);
    private init;
    private startFn;
    private maxFn;
    private gainFn;
}
export declare interface Battleship {
    on<K extends keyof BattleshipEventArgs>(event: K, listener: BattleshipEventArgs[K]): this;
}
export interface BattleshipEventArgs {
    damageTaken: (player: Battleship, damage: number) => void;
    criticalDamage: (player: Battleship, damage: number) => void;
    turnStart: (player: Battleship) => void;
    weaponIncrease: (player: Battleship, amount: number) => void;
    weaponDecrease: (player: Battleship, amount: number) => void;
    engineIncrease: (player: Battleship, amount: number) => void;
    engineDecrease: (player: Battleship, amount: number) => void;
    cpuIncrease: (player: Battleship, amount: number) => void;
    cpuDecrease: (player: Battleship, amount: number) => void;
    shieldIncrease: (player: Battleship, amount: number) => void;
    shieldDecrease: (player: Battleship, amount: number) => void;
    hullIncrease: (player: Battleship, amount: number) => void;
    hullDecrease: (player: Battleship, amount: number) => void;
}
interface IBattleStatsEffect {
    hp?: number;
    shield?: number;
    weapon?: number;
    engine?: number;
    cpu?: number;
}
declare type IBattleStatsNames = "hp" | "shield" | "weapon" | "engine" | "cpu";
export {};
