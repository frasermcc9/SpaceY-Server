import { Client } from "../../../Client/Client";
import { Asteroid } from "../../GameMechanics/Asteroid";
import { Attachment, AttachmentReport, AttachmentType, GameEvent } from "../Attachment/Attachment";
import { Player } from "../Player/Player";
import { Ship } from "./Ship";

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

	public get WeaponCapacities(): Map<AttachmentType, number> {
		return this.ship.WeaponCapacities;
	}
	public get ShipStatistics(): {
		totalHp: number;
		totalShield: number;
		totalEnergy: number[];
		totalCargo: number;
		totalHandling: number;
	} {
		const Base = this.ship.ShipStatistics;
		return {
			totalHp: Base.baseHp + this.bonusHp,
			totalShield: Base.baseShield + this.bonusShield,
			totalEnergy: Base.baseEnergy.map((el, idx) => el + this.bonusEnergy[idx]),
			totalCargo: Base.baseCargo + this.bonusCargo,
			totalHandling: Base.baseHandling + this.bonusHandling,
		};
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
		this.attachments = [];
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
	 *  403: not enough room to add item
	 */
	public addAttachment(attachment: Attachment | string): { code: 200 | 403 | 404 } {
		if (typeof attachment == "string") {
			const candidate = Client.Reg.ResolveAttachmentFromName(attachment);
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
		this.Slots.set(Type, NumEquipped + 1);
		this.attachments.push(attachment);
		attachment.dispatch(GameEvent.EQUIP, this);
		return { code: 200 };
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

	public dispatch(
		event: GameEvent.BATTLE_DAMAGE_TAKEN,
		{ friend, enemy, dmg }: IBattleDamageTakenDispatch
	): AttachmentReport[] | undefined;
	public dispatch(event: GameEvent.BATTLE_END, { friend, enemy }: ITwoPlayerDispatch): AttachmentReport[] | undefined;
	public dispatch(event: GameEvent.BATTLE_INVOKED, { friend, enemy }: ITwoPlayerDispatch): AttachmentReport[] | undefined;
	public dispatch(event: GameEvent.BATTLE_POST_TURN, { friend, enemy }: ITwoPlayerDispatch): AttachmentReport[] | undefined;
	public dispatch(event: GameEvent.BATTLE_PRE_TURN, { friend, enemy }: ITwoPlayerDispatch): AttachmentReport[] | undefined;
	public dispatch(event: GameEvent.BATTLE_START, { friend, enemy }: ITwoPlayerDispatch): AttachmentReport[] | undefined;
	public dispatch(event: GameEvent.EQUIP, { friend }: IOnePlayerDispatch): AttachmentReport[] | undefined;
	public dispatch(event: GameEvent.MINE, { asteroid }: IAsteroidDispatch): AttachmentReport[] | undefined;
	public dispatch(event: GameEvent.UNEQUIP, { friend }: IOnePlayerDispatch): AttachmentReport[] | undefined;
    public dispatch(event: GameEvent.WARP_POLL, { friend, ws }: IWarpDispatch): AttachmentReport[] | undefined;
    public dispatch(event: GameEvent.WARP, { friend, ws }: IWarpDispatch): AttachmentReport[] | undefined;
	public dispatch(event: GameEvent, { friend, enemy, asteroid, dmg, ws }: IFullDispatch): AttachmentReport[] {
		const reports: AttachmentReport[] = [];
		let report;
		this.attachments.forEach((attachment) => {
			switch (event) {
				case GameEvent.BATTLE_DAMAGE_TAKEN:
					report = attachment.dispatch(GameEvent.BATTLE_DAMAGE_TAKEN, friend!, enemy!, dmg!);
					if (report?.length == 1) reports.push(report[0]);
					break;
				case GameEvent.BATTLE_END:
					report = attachment.dispatch(GameEvent.BATTLE_END, friend!, enemy!);
					if (report?.length == 1) reports.push(report[0]);
					break;
				case GameEvent.BATTLE_INVOKED:
					report = attachment.dispatch(GameEvent.BATTLE_INVOKED, friend!, enemy!);
					if (report?.length == 1) reports.push(report[0]);
					break;
				case GameEvent.BATTLE_POST_TURN:
					report = attachment.dispatch(GameEvent.BATTLE_POST_TURN, friend!, enemy!);
					if (report?.length == 1) reports.push(report[0]);
					break;
				case GameEvent.BATTLE_PRE_TURN:
					report = attachment.dispatch(GameEvent.BATTLE_PRE_TURN, friend!, enemy!);
					if (report?.length == 1) reports.push(report[0]);
					break;
				case GameEvent.BATTLE_START:
					report = attachment.dispatch(GameEvent.BATTLE_START, friend!, enemy!);
					if (report?.length == 1) reports.push(report[0]);
					break;
				case GameEvent.EQUIP:
					report = attachment.dispatch(GameEvent.EQUIP, friend!);
					if (report?.length == 1) reports.push(report[0]);
					break;
				case GameEvent.UNEQUIP:
					report = attachment.dispatch(GameEvent.UNEQUIP, friend!);
					if (report?.length == 1) reports.push(report[0]);
					break;
				case GameEvent.MINE:
					report = attachment.dispatch(GameEvent.MINE, asteroid!);
					if (report?.length == 1) reports.push(report[0]);
					break;
				case GameEvent.WARP:
					report = attachment.dispatch(GameEvent.WARP, friend!, ws!);
					if (report?.length == 1) reports.push(report[0]);
					break;
				case GameEvent.WARP_POLL:
					report = attachment.dispatch(GameEvent.WARP_POLL, friend!, ws!);
					if (report?.length == 1) reports.push(report[0]);
					break;
			}
		});
		return reports;
	}

	public pollWarp(warpRequired: number): boolean {
		if (warpRequired == 0) return true;
		const result = this.dispatch(GameEvent.WARP_POLL, { friend: this, ws: warpRequired });
		if (result == undefined) return false;
		if (result.length > 1) return false;
		return result[0].success;
	}
}

type BonusStatChanger = {
	hp?: number;
	shield?: number;
	energy?: number[];
	cargo?: number;
	handling?: number;
};

interface IBattleDamageTakenDispatch {
	friend?: ShipWrapper;
	enemy?: ShipWrapper;
	dmg?: number;
}
interface ITwoPlayerDispatch {
	friend?: ShipWrapper;
	enemy?: ShipWrapper;
}
interface IOnePlayerDispatch {
	friend?: ShipWrapper;
}
interface IAsteroidDispatch {
	asteroid?: Asteroid;
}
interface IWarpDispatch {
	friend?: ShipWrapper;
	ws?: number;
}

interface IFullDispatch
	extends IBattleDamageTakenDispatch,
		ITwoPlayerDispatch,
		IOnePlayerDispatch,
		IWarpDispatch,
		IAsteroidDispatch {}
