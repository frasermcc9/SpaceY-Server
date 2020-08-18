import { ShipWrapper } from "../GameAsset/Ship/ShipWrapper";
import { EventEmitter } from "events";
import { Attachment } from "../GameAsset/Attachment/Attachment";
import { MultiMap } from "mnemonist";
import { IBattleshipStat, battleStat } from "./BattleshipStat";

/**
 * Battleship Class
 *
 * Represents player ships (ShipWrapper) in a battle. Specifically, adds support
 * for statistics that can change throughout a battle (i.e. hp, shield, energy),
 * being at or below some maximum capacity defined by the ShipWrapper.
 *
 * @since 1.0.0
 */

export class Battleship extends EventEmitter implements IBattleship {
    private playerShip: ShipWrapper;

    private cooldownArray: number[];

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
    private persistentEffects = new MultiMap<
        [keyof BattleshipEventArgs, BattleshipEventArgs[keyof BattleshipEventArgs]],
        number
    >();

    private stats!: BattleStats;

    private criticalDamage: boolean = false;

    //#region - Stat Modifiers

    public get Ship(): ShipWrapper {
        return this.playerShip;
    }

    public getStat(stat: keyof BattleStats): number {
        return this[stat].Value;
    }

    public getMaxOfStat(stat: keyof BattleStats): number {
        return this[stat].MaxValue;
    }

    public minimizeStat(stat: keyof BattleStats): number {
        return this[stat].minimise();
    }

    public maximizeStat(stat: keyof BattleStats): number {
        return this[stat].maximise();
    }

    public increaseMaxOfStat(stat: keyof BattleStats, n: number): void {
        return this[stat].increaseMax(n);
    }

    public decreaseMaxOfStat(stat: keyof BattleStats, n: number): void {
        return this[stat].decreaseMax(n);
    }

    public increaseStat(stat: keyof BattleStats, n: number): number {
        return this[stat].increase(n);
    }
    public decreaseStat(stat: keyof BattleStats, n: number): number {
        return this[stat].decrease(n);
    }

    public get hp(): IBattleshipStat {
        return this.stats.hp;
    }
    public get shield(): IBattleshipStat {
        return this.stats.shield;
    }
    public get w(): IBattleshipStat {
        return this.stats.w;
    }
    public get e(): IBattleshipStat {
        return this.stats.e;
    }
    public get c(): IBattleshipStat {
        return this.stats.c;
    }

    public damage(n: number): number {
        const base = n;
        if (n <= this.stats.shield.Value) this.decreaseStat("shield", n);
        else {
            n -= this.stats.shield.Value;
            this.minimizeStat("shield");
            this.decreaseStat("hp", n);
        }
        return base;
    }

    public hullDamage(n: number): number {
        n = this.decreaseStat("hp", n);
        return n;
    }

    public multiIncrease(stats: IBattleStatsEffect): void {
        this.increaseStat("hp", stats.hp ?? 0);
        this.increaseStat("shield", stats.shield ?? 0);
        this.increaseStat("w", stats.w ?? 0);
        this.increaseStat("e", stats.e ?? 0);
        this.increaseStat("c", stats.c ?? 0);
    }
    public multiDecrease(stats: IBattleStatsEffect): void {
        this.decreaseStat("hp", stats.hp ?? 0);
        this.decreaseStat("shield", stats.shield ?? 0);
        this.decreaseStat("w", stats.w ?? 0);
        this.decreaseStat("e", stats.e ?? 0);
        this.decreaseStat("c", stats.c ?? 0);
    }
    public multiMaxIncrease(stats: IBattleStatsEffect): void {
        this.increaseMaxOfStat("hp", stats.hp ?? 0);
        this.increaseMaxOfStat("shield", stats.shield ?? 0);
        this.increaseMaxOfStat("w", stats.w ?? 0);
        this.increaseMaxOfStat("e", stats.e ?? 0);
        this.increaseMaxOfStat("c", stats.c ?? 0);
    }
    public multiMaximize(...stats: Array<keyof BattleStats>) {
        stats.forEach((el) => this.maximizeStat(el));
    }
    public multiMinimize(...stats: Array<keyof BattleStats>) {
        stats.forEach((el) => this.minimizeStat(el));
    }

    //#endregion stat modifiers

    public canAfford(cost: [number, number, number]): boolean {
        return this.getStat("w") >= cost[0] && this.getStat("e") >= cost[1] && this.getStat("c") >= cost[2];
    }
    public isReady(cost: [number, number, number]): boolean {
        return false;
        //TODO cooldown system
    }

    private dynamicFields: { [key: string]: number } = {};
    public dynamicAssign(key: string, value: number) {
        this.dynamicFields[key] = value;
    }
    public dynamicRetrieve(key: string): number | undefined {
        return this.dynamicFields[key];
    }

    //#region Turn Start

    public startTurn(): this {
        this.preTurnInit();
        this.emit("turnStart", this);
        return this;
    }

    private preTurnInit(): this {
        return this.reduceCooldowns().statGain().updatePersistent();
    }

    public reduceCooldowns(n: number = 1): this {
        for (let i = 0; i < this.cooldownArray.length; i++) {
            this.cooldownArray[i] -= n;
            if (this.cooldownArray[i] < 0) this.cooldownArray[i] = 0;
        }
        return this;
    }

    private statGain(): this {
        this.hp.applyGain();
        this.shield.applyGain();
        this.w.applyGain();
        this.e.applyGain();
        this.c.applyGain();
        return this;
    }

    private updatePersistent(): this {
        this.persistentEffects.forEach((val, key) => {
            this.persistentEffects.set(key, val - 1);
            if (val - 1 == 0) {
                this.removeListener(...key);
                this.persistentEffects.delete(key);
            }
        });
        return this;
    }

    //#endregion

    public showInvocable(): Attachment[] {
        const invocable: Attachment[] = [];
        this.Ship.copyAttachments().forEach((attachment, idx) => {
            if (attachment.isInvocable() && this.cooldownArray[idx] <= 0) {
                invocable.push(attachment);
            }
        });
        return invocable;
    }

    //#region events

    private fireDamageTaken(dmg: number): void {
        if (this.stats.hp.Value < 0 && !this.criticalDamage) {
            this.criticalDamage = true;
            this.emit("criticalDamage", this, dmg);
        }
        this.emit("damageTaken", dmg, this);
    }

    public onPersist<K extends keyof BattleshipEventArgs>(e: K, duration: number, listener: BattleshipEventArgs[K]) {
        this.on(e, listener);
        this.persistentEffects.set([e, listener], duration);
    }

    public typedEmit<K extends keyof BattleshipEventArgs>(e: K, ...eventArgs: EventArgs[K]): boolean {
        return this.emit(e, eventArgs);
    }

    //#endregion

    //#region Init

    public constructor(playerShip: ShipWrapper) {
        super();
        this.playerShip = playerShip;
        this.cooldownArray = new Array(playerShip.copyAttachments().length);
        this.init();
        this.eventInit();
    }

    private init(): void {
        const maxStats = this.playerShip.ShipStatistics;
        const points = this.playerShip.Owner.pollSkillPoints();

        this.stats = {
            hp: battleStat(maxStats.totalHp, maxStats.totalHp, 0),
            shield: battleStat(maxStats.totalShield, maxStats.totalShield, 0),
            w: battleStat(
                ~~(maxStats.totalEnergy[0] / 4) + this.startFn(points[0]),
                maxStats.totalEnergy[0] + this.maxFn(points[0]),
                ~~(maxStats.totalEnergy[0] / 5) + this.gainFn(points[0])
            ),
            e: battleStat(
                ~~(maxStats.totalEnergy[1] / 4) + this.startFn(points[1]),
                maxStats.totalEnergy[1] + this.maxFn(points[1]),
                ~~(maxStats.totalEnergy[1] / 5) + this.gainFn(points[1])
            ),
            c: battleStat(
                ~~(maxStats.totalEnergy[2] / 4) + this.startFn(points[2]),
                maxStats.totalEnergy[2] + this.maxFn(points[2]),
                ~~(maxStats.totalEnergy[2] / 5) + this.gainFn(points[2])
            ),
        };
    }

    private eventInit(): void {
        this.stats.hp.on("decreased", (n) => this.fireDamageTaken(n));
        this.stats.shield.on("decreased", (n) => this.fireDamageTaken(n));

        this.stats.hp.on("increased", (n) => this.typedEmit("hullIncrease", this, n));
        this.stats.hp.on("decreased", (n) => this.typedEmit("hullDecrease", this, n));
        this.stats.shield.on("increased", (n) => this.typedEmit("shieldIncrease", this, n));
        this.stats.shield.on("decreased", (n) => this.typedEmit("shieldDecrease", this, n));

        this.stats.w.on("increased", (n) => this.typedEmit("weaponIncrease", this, n));
        this.stats.w.on("decreased", (n) => this.typedEmit("weaponDecrease", this, n));
        this.stats.e.on("increased", (n) => this.typedEmit("engineIncrease", this, n));
        this.stats.e.on("decreased", (n) => this.typedEmit("engineDecrease", this, n));
        this.stats.c.on("increased", (n) => this.typedEmit("cpuIncrease", this, n));
        this.stats.c.on("decreased", (n) => this.typedEmit("cpuDecrease", this, n));
    }

    private startFn(i: number) {
        return 2 * ~~(i / 5) + Math.ceil((i % 5) / 2);
    }
    private maxFn(i: number) {
        return this.startFn(i - 1);
    }
    private gainFn(i: number) {
        return ~~(i / 5);
    }

    //#endregion Init
}

export declare interface Battleship {
    on<K extends keyof BattleshipEventArgs>(event: K, listener: BattleshipEventArgs[K]): this;
}
export interface BattleshipEventArgs {
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

export interface IBattleStatsEffect {
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
    /**Do *n* damage to this ship. */
    damage(n: number): number;
    /**Do *n* damage direct to the hull. */
    hullDamage(n: number): number;
    /**Reduce cooldowns by *n* amount. */
    reduceCooldowns(n?: number): void;
    /**Assign a string-number property to this battleship for future reference. */
    dynamicAssign(key: string, value: number): void;
    /**Get the value number from a dynamically assigned field, from its string
     * named. */
    dynamicRetrieve(key: string): number | undefined;
}
