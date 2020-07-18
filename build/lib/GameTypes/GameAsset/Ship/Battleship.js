"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Battleship = void 0;
const events_1 = require("events");
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
    //#region Init
    constructor(playerShip) {
        super();
        this.statNames = ["hp", "shield", "weapon", "engine", "cpu"];
        this.criticalDamage = false;
        this.playerShip = playerShip;
        this.cooldownArray = new Array(playerShip.copyAttachments().length);
        this.init();
    }
    //#region - Gets
    get Ship() {
        return this.playerShip;
    }
    get Hp() {
        return this.currentStats.hp;
    }
    get Shield() {
        return this.currentStats.shield;
    }
    get W() {
        return this.currentStats.weapon;
    }
    get E() {
        return this.currentStats.engine;
    }
    get C() {
        return this.currentStats.cpu;
    }
    //#endregion gets
    //#region - Stat Modifiers
    weaponIncrease(n, emit = true) {
        if (n < 0) throw new Error("Negative value passed into weaponIncrease method");
        if (this.currentStats.weapon + n > this.maxStats.weapon) {
            n = this.maxStats.weapon - this.currentStats.weapon;
        }
        this.currentStats.weapon += n;
        if (emit) this.emit("weaponIncrease", this, n);
        return this;
    }
    weaponDecrease(n, emit = true) {
        if (n < 0) throw new Error("Negative value passed into weaponDecrease method");
        if (this.currentStats.weapon - n < 0) {
            n = this.currentStats.weapon;
        }
        this.currentStats.weapon -= n;
        if (emit) this.emit("weaponDecrease", this, n);
        return this;
    }
    engineIncrease(n, emit = true) {
        if (n < 0) throw new Error("Negative value passed into engineIncrease method");
        if (this.currentStats.engine + n > this.maxStats.engine) {
            n = this.maxStats.engine - this.currentStats.engine;
        }
        this.currentStats.engine += n;
        if (emit) this.emit("engineIncrease", this, n);
        return this;
    }
    engineDecrease(n, emit = true) {
        if (n < 0) throw new Error("Negative value passed into engineDecrease method");
        if (this.currentStats.engine - n < 0) {
            n = this.currentStats.engine;
        }
        if (emit) this.currentStats.engine -= n;
        this.emit("engineDecrease", this, n);
        return this;
    }
    cpuIncrease(n, emit = true) {
        if (n < 0) throw new Error("Negative value passed into cpuIncrease method");
        if (this.currentStats.cpu + n > this.maxStats.cpu) {
            n = this.maxStats.cpu - this.currentStats.cpu;
        }
        this.currentStats.cpu += n;
        if (emit) this.emit("cpuIncrease", this, n);
        return this;
    }
    cpuDecrease(n, emit = true) {
        if (n < 0) throw new Error("Negative value passed into cpuDecrease method");
        if (this.currentStats.cpu - n < 0) {
            n = this.currentStats.cpu;
        }
        this.currentStats.cpu -= n;
        if (emit) this.emit("cpuDecrease", this, n);
        return this;
    }
    shieldIncrease(n, emit = true) {
        if (n < 0) throw new Error("Negative value passed into shieldIncrease method");
        if (this.currentStats.shield + n > this.maxStats.shield) {
            n = this.maxStats.shield - this.currentStats.shield;
        }
        this.currentStats.shield += n;
        if (emit) this.emit("shieldIncrease", this, n);
        return this;
    }
    shieldDecrease(n, emit = true) {
        if (n < 0) throw new Error("Negative value passed into cpuDecrease method");
        if (this.currentStats.shield - n < 0) {
            n = this.currentStats.shield;
        }
        this.currentStats.shield -= n;
        if (emit) this.emit("shieldDecrease", this, n);
        return this;
    }
    hpIncrease(n, emit = true) {
        if (n < 0) throw new Error("Negative value passed into hpIncrease method");
        if (this.currentStats.hp + n > this.maxStats.hp) {
            n = this.maxStats.hp - this.currentStats.hp;
        }
        this.currentStats.hp += n;
        if (emit) this.emit("hpIncrease", this, n);
        return this;
    }
    //#endregion stat modifiers
    startTurn() {
        this.reduceCooldown();
        this.statGain();
        this.emit("turnStart", this);
        return this;
    }
    statGain() {
        this.hpIncrease(this.gainStats.hp);
        this.shieldIncrease(this.gainStats.shield);
        this.weaponIncrease(this.gainStats.weapon);
        this.engineIncrease(this.gainStats.engine);
        this.cpuIncrease(this.gainStats.cpu);
        return this;
    }
    showInvocable() {
        const invocable = [];
        this.Ship.copyAttachments().forEach((attachment, idx) => {
            if (attachment.isInvocable() && this.cooldownArray[idx] <= 0) {
                invocable.push(attachment);
            }
        });
        return invocable;
    }
    reduceCooldown(n = 1) {
        for (let i = 0; i < this.cooldownArray.length; i++) {
            this.cooldownArray[i] -= n;
            if (this.cooldownArray[i] < 0) this.cooldownArray[i] = 0;
        }
    }
    standardDamage(n) {
        if (n <= this.currentStats.shield) this.currentStats.shield -= n;
        else {
            n -= this.currentStats.shield;
            this.currentStats.shield = 0;
            this.currentStats.hp -= n;
        }
        this.fireDamageTaken(n);
        return this;
    }
    hullDamage(n) {
        this.currentStats.hp -= n;
        this.fireDamageTaken(n);
        return this;
    }
    fireDamageTaken(dmg) {
        if (this.currentStats.hp < 0 && !this.criticalDamage) {
            this.criticalDamage = true;
            this.emit("criticalDamage", this, dmg);
        }
        this.emit("damageTaken", dmg, this);
    }
    init() {
        const maxStats = this.playerShip.ShipStatistics;
        const points = this.playerShip.Owner.pollSkillPoints();
        this.maxStats = {
            hp: maxStats.totalHp,
            shield: maxStats.totalShield,
            weapon: maxStats.totalEnergy[0] + this.maxFn(points[0]),
            engine: maxStats.totalEnergy[1] + this.maxFn(points[1]),
            cpu: maxStats.totalEnergy[2] + this.maxFn(points[2]),
        };
        this.currentStats = {
            hp: ~~maxStats.totalHp,
            shield: ~~maxStats.totalShield,
            weapon: ~~(maxStats.totalEnergy[0] / 4) + this.startFn(points[0]),
            engine: ~~(maxStats.totalEnergy[1] / 4) + this.startFn(points[1]),
            cpu: ~~(maxStats.totalEnergy[2] / 4) + this.startFn(points[2]),
        };
        this.gainStats = {
            hp: 0,
            shield: 0,
            weapon: ~~(maxStats.totalEnergy[0] / 5) + this.gainFn(points[0]),
            engine: ~~(maxStats.totalEnergy[1] / 5) + this.gainFn(points[0]),
            cpu: ~~(maxStats.totalEnergy[2] / 5) + this.gainFn(points[0]),
        };
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
