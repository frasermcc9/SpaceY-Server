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

export class Battleship extends EventEmitter {
	public readonly statNames: IBattleStatsNames[] = ["hp", "shield", "weapon", "engine", "cpu"];

	private playerShip: ShipWrapper;

	private cooldownArray: number[];

	private maxStats!: IBattleStats;
	private currentStats!: IBattleStats;
	private gainStats!: IBattleStats;

	private criticalDamage: boolean = false;

	//#region - Gets

	public get Ship(): ShipWrapper {
		return this.playerShip;
	}

	public get Hp(): number {
		return this.currentStats.hp;
	}
	//#endregion gets

	//#region - Stat Modifiers

	public weaponIncrease(n: number, emit: boolean = true) {
		if (n < 0) throw new Error("Negative value passed into weaponIncrease method");
		if (this.currentStats.weapon + n > this.maxStats.weapon) {
			n = this.maxStats.weapon - this.currentStats.weapon;
		}
		this.currentStats.weapon += n;
		if (emit) this.emit("weaponIncrease", this, n);
		return this;
	}

	public weaponDecrease(n: number, emit: boolean = true) {
		if (n < 0) throw new Error("Negative value passed into weaponDecrease method");
		if (this.currentStats.weapon - n < 0) {
			n = this.currentStats.weapon;
		}
		this.currentStats.weapon -= n;
		if (emit) this.emit("weaponDecrease", this, n);
		return this;
	}

	public engineIncrease(n: number, emit: boolean = true) {
		if (n < 0) throw new Error("Negative value passed into engineIncrease method");
		if (this.currentStats.engine + n > this.maxStats.engine) {
			n = this.maxStats.engine - this.currentStats.engine;
		}
		this.currentStats.engine += n;
		if (emit) this.emit("engineIncrease", this, n);
		return this;
	}

	public engineDecrease(n: number, emit: boolean = true) {
		if (n < 0) throw new Error("Negative value passed into engineDecrease method");
		if (this.currentStats.engine - n < 0) {
			n = this.currentStats.engine;
		}
		if (emit) this.currentStats.engine -= n;
		this.emit("engineDecrease", this, n);
		return this;
	}
	public cpuIncrease(n: number, emit: boolean = true) {
		if (n < 0) throw new Error("Negative value passed into cpuIncrease method");
		if (this.currentStats.cpu + n > this.maxStats.cpu) {
			n = this.maxStats.cpu - this.currentStats.cpu;
		}
		this.currentStats.cpu += n;
		if (emit) this.emit("cpuIncrease", this, n);
		return this;
	}

	public cpuDecrease(n: number, emit: boolean = true) {
		if (n < 0) throw new Error("Negative value passed into cpuDecrease method");
		if (this.currentStats.cpu - n < 0) {
			n = this.currentStats.cpu;
		}
		this.currentStats.cpu -= n;
		if (emit) this.emit("cpuDecrease", this, n);
		return this;
	}

	public shieldIncrease(n: number, emit: boolean = true) {
		if (n < 0) throw new Error("Negative value passed into shieldIncrease method");
		if (this.currentStats.shield + n > this.maxStats.shield) {
			n = this.maxStats.shield - this.currentStats.shield;
		}
		this.currentStats.shield += n;
		if (emit) this.emit("shieldIncrease", this, n);
		return this;
	}

	public shieldDecrease(n: number, emit: boolean = true) {
		if (n < 0) throw new Error("Negative value passed into cpuDecrease method");
		if (this.currentStats.shield - n < 0) {
			n = this.currentStats.shield;
		}
		this.currentStats.shield -= n;
		if (emit) this.emit("shieldDecrease", this, n);
		return this;
	}

	public hpIncrease(n: number, emit: boolean = true) {
		if (n < 0) throw new Error("Negative value passed into hpIncrease method");
		if (this.currentStats.hp + n > this.maxStats.hp) {
			n = this.maxStats.hp - this.currentStats.hp;
		}
		this.currentStats.hp += n;
		if (emit) this.emit("hpIncrease", this, n);
		return this;
	}

	//#endregion stat modifiers

	public startTurn(): this {
		this.statGain();
		this.emit("turnStart", this);
		return this;
	}

	private statGain(): this {
		this.hpIncrease(this.gainStats.hp);
		this.shieldIncrease(this.gainStats.shield);
		this.weaponIncrease(this.gainStats.weapon);
		this.engineIncrease(this.gainStats.engine);
		this.cpuIncrease(this.gainStats.cpu);
		return this;
	}

	public showInvocable(): Attachment[] {
		const invocable: Attachment[] = [];
		this.Ship.copyAttachments().forEach((attachment, idx) => {
			if (attachment.isInvocable() && this.cooldownArray[idx] <= 0) {
				invocable.push(attachment);
			}
		});
		return invocable;
	}

	public reduceCooldown(n: number = 1): void {
		for (let i = 0; i < this.cooldownArray.length; i++) {
			this.cooldownArray[i] -= n;
			if (this.cooldownArray[i] < 0) this.cooldownArray[i] = 0;
		}
	}

	public standardDamage(n: number): this {
		if (n <= this.currentStats.shield) this.currentStats.shield -= n;
		else {
			n -= this.currentStats.shield;
			this.currentStats.shield = 0;
			this.currentStats.hp -= n;
		}
		this.fireDamageTaken(n);
		return this;
	}

	public hullDamage(n: number): this {
		this.currentStats.hp -= n;
		this.fireDamageTaken(n);
		return this;
	}

	private fireDamageTaken(dmg: number): void {
		if (this.currentStats.hp < 0 && !this.criticalDamage) {
			this.criticalDamage = true;
			this.emit("criticalDamage", this, dmg);
		}

		this.emit("damageTaken", dmg, this);
	}

	//#region Init

	public constructor(playerShip: ShipWrapper) {
		super();
		this.playerShip = playerShip;
		this.cooldownArray = new Array(playerShip.copyAttachments().length);
		this.init();
	}

	private init(): void {
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
			hp: ~~(maxStats.totalHp / 4),
			shield: ~~(maxStats.totalShield / 4),

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

interface IBattleStats {
	hp: number;
	shield: number;

	weapon: number;
	engine: number;
	cpu: number;
}
interface IBattleStatsEffect {
	hp?: number;
	shield?: number;

	weapon?: number;
	engine?: number;
	cpu?: number;
}

type IBattleStatsNames = "hp" | "shield" | "weapon" | "engine" | "cpu";
