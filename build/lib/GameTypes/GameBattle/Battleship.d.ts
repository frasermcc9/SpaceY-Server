/// <reference types="node" />
import { ShipWrapper } from "../GameAsset/Ship/ShipWrapper";
import { EventEmitter } from "events";
import { Attachment } from "../GameAsset/Attachment/Attachment";
import { IBattleshipStat } from "./BattleshipStat";
/**
 * Battleship Class
 *
 * Represents player ships (ShipWrapper) in a battle. Specifically, adds support
 * for statistics that can change throughout a battle (i.e. hp, shield, energy),
 * being at or below some maximum capacity defined by the ShipWrapper.
 *
 * @since 1.0.0
 */
export declare class Battleship extends EventEmitter implements IBattleship {
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
    private stats;
    private criticalDamage;
    get Ship(): ShipWrapper;
    getStat(stat: keyof BattleStats): number;
    getMaxOfStat(stat: keyof BattleStats): number;
    minimizeStat(stat: keyof BattleStats): number;
    maximizeStat(stat: keyof BattleStats): number;
    increaseMaxOfStat(stat: keyof BattleStats, n: number): void;
    decreaseMaxOfStat(stat: keyof BattleStats, n: number): void;
    increaseStat(stat: keyof BattleStats, n: number): number;
    decreaseStat(stat: keyof BattleStats, n: number): number;
    get hp(): IBattleshipStat;
    get shield(): IBattleshipStat;
    get w(): IBattleshipStat;
    get e(): IBattleshipStat;
    get c(): IBattleshipStat;
    damage(n: number): number;
    hullDamage(n: number): number;
    multiIncrease(stats: IBattleStatsEffect): void;
    multiDecrease(stats: IBattleStatsEffect): void;
    multiMaxIncrease(stats: IBattleStatsEffect): void;
    multiMaximize(...stats: Array<keyof BattleStats>): void;
    multiMinimize(...stats: Array<keyof BattleStats>): void;
    canAfford(cost: [number, number, number]): boolean;
    isReady(cost: [number, number, number]): boolean;
    startTurn(): this;
    private preTurnInit;
    reduceCooldowns(n?: number): this;
    private statGain;
    private updatePersistent;
    showInvocable(): Attachment[];
    private fireDamageTaken;
    onPersist<K extends keyof BattleshipEventArgs>(e: K, duration: number, listener: BattleshipEventArgs[K]): void;
    typedEmit<K extends keyof BattleshipEventArgs>(e: K, ...eventArgs: EventArgs[K]): boolean;
    constructor(playerShip: ShipWrapper);
    private init;
    private eventInit;
    private startFn;
    private maxFn;
    private gainFn;
}
export declare interface Battleship {
    on<K extends keyof BattleshipEventArgs>(event: K, listener: BattleshipEventArgs[K]): this;
}
interface BattleshipEventArgs {
    damageTaken: (...args: EventArgs["damageTaken"]) => void;
    criticalDamage: (...args: EventArgs["criticalDamage"]) => void;
    turnStart: (...args: EventArgs["turnStart"]) => void;
    turnEnd: (...args: EventArgs["turnEnd"]) => void;
    weaponIncrease: (...args: EventArgs["weaponIncrease"]) => void;
    weaponDecrease: (...args: EventArgs["weaponDecrease"]) => void;
    engineIncrease: (...args: EventArgs["engineIncrease"]) => void;
    engineDecrease: (...args: EventArgs["engineDecrease"]) => void;
    cpuIncrease: (...args: EventArgs["cpuIncrease"]) => void;
    cpuDecrease: (...args: EventArgs["cpuDecrease"]) => void;
    shieldIncrease: (...args: EventArgs["shieldIncrease"]) => void;
    shieldDecrease: (...args: EventArgs["shieldDecrease"]) => void;
    hullIncrease: (...args: EventArgs["hullIncrease"]) => void;
    hullDecrease: (...args: EventArgs["hullDecrease"]) => void;
}
interface EventArgs {
    damageTaken: [Battleship, number];
    criticalDamage: [Battleship, number];
    turnStart: [Battleship];
    turnEnd: [Battleship];
    weaponIncrease: [Battleship, number];
    weaponDecrease: [Battleship, number];
    engineIncrease: [Battleship, number];
    engineDecrease: [Battleship, number];
    cpuIncrease: [Battleship, number];
    cpuDecrease: [Battleship, number];
    shieldIncrease: [Battleship, number];
    shieldDecrease: [Battleship, number];
    hullIncrease: [Battleship, number];
    hullDecrease: [Battleship, number];
}
interface IBattleStatsEffect {
    hp?: number;
    shield?: number;
    w?: number;
    e?: number;
    c?: number;
}
interface BattleStats {
    hp: IBattleshipStat;
    shield: IBattleshipStat;
    w: IBattleshipStat;
    e: IBattleshipStat;
    c: IBattleshipStat;
}
export interface IBattleship {
    onPersist<K extends keyof BattleshipEventArgs>(e: K, duration: number, listener: BattleshipEventArgs[K]): void;
    getStat(stat: keyof BattleStats): number;
    increaseStat(stat: keyof BattleStats, n: number): number;
    decreaseStat(stat: keyof BattleStats, n: number): number;
    multiIncrease(stats: IBattleStatsEffect): void;
    multiDecrease(stats: IBattleStatsEffect): void;
    multiMaxIncrease(stats: IBattleStatsEffect): void;
    minimizeStat(stat: keyof BattleStats): number;
    maximizeStat(stat: keyof BattleStats): number;
    multiMinimize(...stats: Array<keyof BattleStats>): void;
    multiMaximize(...stats: Array<keyof BattleStats>): void;
    getMaxOfStat(stat: keyof BattleStats): number;
    increaseMaxOfStat(stat: keyof BattleStats, n: number): void;
    decreaseMaxOfStat(stat: keyof BattleStats, n: number): void;
    damage(n: number): number;
    hullDamage(n: number): number;
    reduceCooldowns(n?: number): void;
}
export {};
