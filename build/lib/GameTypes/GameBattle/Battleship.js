"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Battleship = void 0;
const events_1 = require("events");
const mnemonist_1 = require("mnemonist");
const BattleshipStat_1 = require("./BattleshipStat");
/**
 * Battleship Class
 *
 * Represents player ships (ShipWrapper) in a battle. Specifically, adds support
 * for statistics that can change throughout a battle (i.e. hp, shield, energy),
 * being at or below some maximum capacity defined by the ShipWrapper.
 *
 * @since 1.0.0
 */
class Battleship extends events_1.EventEmitter {
    //#endregion
    //#region Init
    constructor(playerShip) {
        super();
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
        this.persistentEffects = new mnemonist_1.MultiMap();
        this.criticalDamage = false;
        this.playerShip = playerShip;
        this.cooldownArray = new Array(playerShip.copyAttachments().length);
        this.init();
        this.eventInit();
    }
    //#region - Stat Modifiers
    get Ship() {
        return this.playerShip;
    }
    getStat(stat) {
        return this[stat].Value;
    }
    getMaxOfStat(stat) {
        return this[stat].MaxValue;
    }
    minimizeStat(stat) {
        return this[stat].minimise();
    }
    maximizeStat(stat) {
        return this[stat].minimise();
    }
    increaseMaxOfStat(stat, n) {
        return this[stat].increaseMax(n);
    }
    decreaseMaxOfStat(stat, n) {
        return this[stat].decreaseMax(n);
    }
    increaseStat(stat, n) {
        return this[stat].increase(n);
    }
    decreaseStat(stat, n) {
        return this[stat].decrease(n);
    }
    get hp() {
        return this.stats.hp;
    }
    get shield() {
        return this.stats.shield;
    }
    get w() {
        return this.stats.w;
    }
    get e() {
        return this.stats.e;
    }
    get c() {
        return this.stats.c;
    }
    damage(n) {
        if (n <= this.stats.shield.Value)
            this.decreaseStat("shield", n);
        else {
            n -= this.stats.shield.Value;
            this.minimizeStat("shield");
            this.decreaseStat("hp", n);
        }
        return n;
    }
    hullDamage(n) {
        n = this.decreaseStat("hp", n);
        return n;
    }
    multiIncrease(stats) {
        this.increaseStat("hp", stats.hp ?? 0);
        this.increaseStat("shield", stats.shield ?? 0);
        this.increaseStat("w", stats.w ?? 0);
        this.increaseStat("e", stats.e ?? 0);
        this.increaseStat("c", stats.c ?? 0);
    }
    multiDecrease(stats) {
        this.decreaseStat("hp", stats.hp ?? 0);
        this.decreaseStat("shield", stats.shield ?? 0);
        this.decreaseStat("w", stats.w ?? 0);
        this.decreaseStat("e", stats.e ?? 0);
        this.decreaseStat("c", stats.c ?? 0);
    }
    multiMaxIncrease(stats) {
        this.increaseMaxOfStat("hp", stats.hp ?? 0);
        this.increaseMaxOfStat("shield", stats.shield ?? 0);
        this.increaseMaxOfStat("w", stats.w ?? 0);
        this.increaseMaxOfStat("e", stats.e ?? 0);
        this.increaseMaxOfStat("c", stats.c ?? 0);
    }
    multiMaximize(...stats) {
        stats.forEach((el) => this.maximizeStat(el));
    }
    multiMinimize(...stats) {
        stats.forEach((el) => this.minimizeStat(el));
    }
    //#endregion stat modifiers
    canAfford(cost) {
        return this.getStat("w") >= cost[0] && this.getStat("e") >= cost[1] && this.getStat("c") >= cost[2];
    }
    isReady(cost) {
        return false;
        //TODO cooldown system
    }
    //#region Turn Start
    startTurn() {
        this.preTurnInit();
        this.emit("turnStart", this);
        return this;
    }
    preTurnInit() {
        return this.reduceCooldowns().statGain().updatePersistent();
    }
    reduceCooldowns(n = 1) {
        for (let i = 0; i < this.cooldownArray.length; i++) {
            this.cooldownArray[i] -= n;
            if (this.cooldownArray[i] < 0)
                this.cooldownArray[i] = 0;
        }
        return this;
    }
    statGain() {
        this.hp.applyGain();
        this.shield.applyGain();
        this.w.applyGain();
        this.e.applyGain();
        this.c.applyGain();
        return this;
    }
    updatePersistent() {
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
    showInvocable() {
        const invocable = [];
        this.Ship.copyAttachments().forEach((attachment, idx) => {
            if (attachment.isInvocable() && this.cooldownArray[idx] <= 0) {
                invocable.push(attachment);
            }
        });
        return invocable;
    }
    //#region events
    fireDamageTaken(dmg) {
        if (this.stats.hp.Value < 0 && !this.criticalDamage) {
            this.criticalDamage = true;
            this.emit("criticalDamage", this, dmg);
        }
        this.emit("damageTaken", dmg, this);
    }
    onPersist(e, duration, listener) {
        this.on(e, listener);
        this.persistentEffects.set([e, listener], duration);
    }
    typedEmit(e, ...eventArgs) {
        return this.emit(e, eventArgs);
    }
    init() {
        const maxStats = this.playerShip.ShipStatistics;
        const points = this.playerShip.Owner.pollSkillPoints();
        this.stats = {
            hp: BattleshipStat_1.battleStat(maxStats.totalHp, maxStats.totalHp, 0),
            shield: BattleshipStat_1.battleStat(maxStats.totalShield, maxStats.totalShield, 0),
            w: BattleshipStat_1.battleStat(~~(maxStats.totalEnergy[0] / 4) + this.startFn(points[0]), maxStats.totalEnergy[0] + this.maxFn(points[0]), ~~(maxStats.totalEnergy[0] / 5) + this.gainFn(points[0])),
            e: BattleshipStat_1.battleStat(~~(maxStats.totalEnergy[1] / 4) + this.startFn(points[1]), maxStats.totalEnergy[1] + this.maxFn(points[1]), ~~(maxStats.totalEnergy[1] / 5) + this.gainFn(points[1])),
            c: BattleshipStat_1.battleStat(~~(maxStats.totalEnergy[2] / 4) + this.startFn(points[2]), maxStats.totalEnergy[2] + this.maxFn(points[2]), ~~(maxStats.totalEnergy[2] / 5) + this.gainFn(points[2])),
        };
    }
    eventInit() {
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
    startFn(i) {
        return 2 * ~~(i / 5) + Math.ceil((i % 5) / 2);
    }
    maxFn(i) {
        return this.startFn(i - 1);
    }
    gainFn(i) {
        return ~~(i / 5);
    }
}
exports.Battleship = Battleship;
//# sourceMappingURL=Battleship.js.map