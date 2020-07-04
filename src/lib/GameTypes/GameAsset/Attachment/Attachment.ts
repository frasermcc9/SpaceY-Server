import { GameAsset } from "../GameAsset";
import { Blueprint } from "../Blueprint/Blueprint";
import { Ship } from "../Ship/Ship";
import { ShipWrapper } from "../Ship/ShipWrapper";

export class Attachment extends GameAsset implements IBattleObserver, IPlayerObserver, IAttachment {
	private techLevel: number;
	public get TechLevel(): number {
		return this.techLevel;
	}

	private type: AttachmentType;

	private onBattleStart?: BattleFunction;
	private onBattlePreTurn?: BattleFunction;
	private onBattlePostTurn?: BattleFunction;
	private onBattleInvoked?: BattleFunction;
	private onBattleEnd?: BattleFunction;

	private onEquip?: PlayerFunction;
	private onUnequip?: PlayerFunction;
	private onMine?: PlayerFunction;
	private onWarp?: PlayerFunction;

	constructor(options: AttachmentOptions) {
		super(options);
		this.type = options.type;
		this.techLevel = options.techLevel ?? 0;

		this.onBattleStart = options.onBattleStart;
		this.onBattlePreTurn = options.onBattlePreTurn;
		this.onBattlePostTurn = options.onBattlePostTurn;
		this.onBattleInvoked = options.onBattleInvoked;
		this.onBattleEnd = options.onBattleEnd;

		this.onEquip = options.onEquip;
		this.onUnequip = options.onUnequip;
		this.onMine = options.onMine;
		this.onWarp = options.onWarp;
	}

	public get Type(): AttachmentType {
		return this.type;
	}

	public Triggers(): (BattleEvent | NonBattleEvent)[] {
		const Catalysts = new Array<BattleEvent | NonBattleEvent>();
		if (this.onBattleStart) Catalysts.push(BattleEvent.BATTLE_START);
		if (this.onBattlePreTurn) Catalysts.push(BattleEvent.BATTLE_PRE_TURN);
		if (this.onBattlePostTurn) Catalysts.push(BattleEvent.BATTLE_POST_TURN);
		if (this.onBattleInvoked) Catalysts.push(BattleEvent.BATTLE_INVOKED);
		if (this.onBattleEnd) Catalysts.push(BattleEvent.BATTLE_END);

		if (this.onEquip) Catalysts.push(NonBattleEvent.EQUIP);
		if (this.onUnequip) Catalysts.push(NonBattleEvent.UNEQUIP);
		if (this.onMine) Catalysts.push(NonBattleEvent.MINE);
		if (this.onWarp) Catalysts.push(NonBattleEvent.WARP);
		return Catalysts;
	}

	public BattleUpdate(event: BattleEvent, { friendly, opponent }: { friendly: ShipWrapper; opponent: ShipWrapper }): AttachmentReport | undefined {
		switch (event) {
			case BattleEvent.BATTLE_START:
				return this.BattleStart(friendly, opponent);
			case BattleEvent.BATTLE_END:
				return this.BattleEnd(friendly, opponent);
			case BattleEvent.BATTLE_INVOKED:
				return this.BattleInvoked(friendly, opponent);
			case BattleEvent.BATTLE_PRE_TURN:
				return this.BattlePreTurn(friendly, opponent);
			case BattleEvent.BATTLE_POST_TURN:
				return this.BattlePostTurn(friendly, opponent);
			default:
				break;
		}
	}
	public NonBattleUpdate(event: NonBattleEvent, { friendly }: { friendly: ShipWrapper }): AttachmentReport | undefined {
		switch (event) {
			case NonBattleEvent.EQUIP:
				return this.Equip(friendly);
			case NonBattleEvent.UNEQUIP:
				return this.UnEquip(friendly);
			case NonBattleEvent.MINE:
				return this.Mine(friendly);
			case NonBattleEvent.WARP:
				return this.Warp(friendly);
			default:
				break;
		}
	}

	private BattleStart(friendly: ShipWrapper, opponent: ShipWrapper): AttachmentReport | undefined {
		if (this.onBattleStart) return this.onBattleStart.apply(this, [friendly, opponent]);
	}
	private BattlePreTurn(friendly: ShipWrapper, opponent: ShipWrapper): AttachmentReport | undefined {
		if (this.onBattlePreTurn) return this.onBattlePreTurn.apply(this, [friendly, opponent]);
	}
	private BattlePostTurn(friendly: ShipWrapper, opponent: ShipWrapper): AttachmentReport | undefined {
		if (this.onBattlePostTurn) return this.onBattlePostTurn.apply(this, [friendly, opponent]);
	}
	private BattleInvoked(friendly: ShipWrapper, opponent: ShipWrapper): AttachmentReport | undefined {
		if (this.onBattleInvoked) return this.onBattleInvoked.apply(this, [friendly, opponent]);
	}
	private BattleEnd(friendly: ShipWrapper, opponent: ShipWrapper): AttachmentReport | undefined {
		if (this.onBattleEnd) return this.onBattleEnd.apply(this, [friendly, opponent]);
	}

	private Equip(friendly: ShipWrapper): AttachmentReport | undefined {
		if (this.onEquip) return this.onEquip.apply(this, [friendly]);
	}
	private UnEquip(friendly: ShipWrapper): AttachmentReport | undefined {
		if (this.onUnequip) return this.onUnequip.apply(this, [friendly]);
	}
	private Mine(friendly: ShipWrapper): AttachmentReport | undefined {
		if (this.onMine) return this.onMine.apply(this, [friendly]);
	}
	private Warp(friendly: ShipWrapper): AttachmentReport | undefined {
		if (this.onWarp) return this.onWarp.apply(this, [friendly]);
	}
}

export interface IBattleObserver {
	/* 	BattleStart?: BattleFunction;
	BattlePreTurn?: BattleFunction;
	BattlePostTurn?: BattleFunction;
	BattleInvoked?: BattleFunction;
    BattleEnd?: BattleFunction; */
	BattleUpdate?: (event: BattleEvent, { friendly, opponent }: { friendly: ShipWrapper; opponent: ShipWrapper }) => AttachmentReport | undefined;
}
export interface IPlayerObserver {
	/* Equip?: PlayerFunction;
	Unequip?: PlayerFunction;
	Mine?: PlayerFunction;
    Warp?: PlayerFunction; */
	NonBattleUpdate?: (event: NonBattleEvent, { friendly }: { friendly: ShipWrapper }) => AttachmentReport | undefined;
}
export interface IAttachment extends IPlayerObserver, IBattleObserver {
	Type: AttachmentType;
	Triggers(): (BattleEvent | NonBattleEvent)[];
}

export class AttachmentBuilder {
	private name: string;
	private description: string;
	private cost?: number;
	private blueprint?: Blueprint;
	private techLevel?: number;
	private type: AttachmentType;

	private onBattleStart?: BattleFunction;
	private onBattlePreTurn?: BattleFunction;
	private onBattlePostTurn?: BattleFunction;
	private onBattleInvoked?: BattleFunction;
	private onBattleEnd?: BattleFunction;

	private onEquip?: PlayerFunction;
	private onUnequip?: PlayerFunction;
	private onMine?: PlayerFunction;
	private onWarp?: PlayerFunction;

	public constructor({ name, description, techLevel, type }: { name: string; description: string; techLevel?: number; type: AttachmentType }) {
		this.name = name;
		this.description = description;
		this.techLevel = techLevel;
		this.type = type;
	}
	public EnableSellable(price: number): AttachmentBuilder {
		this.cost = price;
		return this;
	}
	public EnableBuildable(blueprint: Blueprint): AttachmentBuilder {
		this.blueprint = blueprint;
		return this;
	}
	public BattleStartFn(fn: BattleFunction): AttachmentBuilder {
		this.onBattleStart = fn;
		return this;
	}
	public BattlePreTurnFn(fn: BattleFunction): AttachmentBuilder {
		this.onBattlePreTurn = fn;
		return this;
	}
	public BattlePostTurnFn(fn: BattleFunction): AttachmentBuilder {
		this.onBattlePostTurn = fn;
		return this;
	}
	public BattleInvokeFn(fn: BattleFunction): AttachmentBuilder {
		this.onBattleInvoked = fn;
		return this;
	}
	public BattleEndFn(fn: BattleFunction): AttachmentBuilder {
		this.onBattleEnd = fn;
		return this;
	}
	public EquipFn(fn: PlayerFunction): AttachmentBuilder {
		this.onEquip = fn;
		return this;
	}
	public UnequipFn(fn: PlayerFunction): AttachmentBuilder {
		this.onUnequip = fn;
		return this;
	}
	public MineFn(fn: PlayerFunction): AttachmentBuilder {
		this.onMine = fn;
		return this;
	}
	public WarpFn(fn: PlayerFunction): AttachmentBuilder {
		this.onWarp = fn;
		return this;
	}

	public Build(): Attachment {
		return new Attachment({
			name: this.name,
			description: this.description,
			blueprint: this.blueprint,
			cost: this.cost,
			techLevel: this.techLevel,
			type: this.type,

			onBattleStart: this.onBattleStart,
			onBattlePreTurn: this.onBattlePreTurn,
			onBattlePostTurn: this.onBattlePostTurn,
			onBattleInvoked: this.onBattleInvoked,
			onBattleEnd: this.onBattleEnd,

			onEquip: this.onEquip,
			onUnequip: this.onUnequip,
			onMine: this.onMine,
			onWarp: this.onWarp,
		});
	}
}

type AttachmentOptions = {
	name: string;
	cost?: number;
	description: string;
	techLevel?: number;
	blueprint?: Blueprint;
	type: AttachmentType;

	onBattleStart?: BattleFunction;
	onBattlePreTurn?: BattleFunction;
	onBattlePostTurn?: BattleFunction;
	onBattleInvoked?: BattleFunction;
	onBattleEnd?: BattleFunction;

	onEquip?: PlayerFunction;
	onUnequip?: PlayerFunction;
	onMine?: PlayerFunction;
	onWarp?: PlayerFunction;
};

export type AttachmentReport = {
	message: string;
};

export enum BattleEvent {
	BATTLE_START,
	BATTLE_END,
	BATTLE_INVOKED,
	BATTLE_PRE_TURN,
	BATTLE_POST_TURN,
}
export enum NonBattleEvent {
	EQUIP,
	UNEQUIP,
	MINE,
	WARP,
}
export enum AttachmentType {
	GENERAL,
	PRIMARY,
	HEAVY,
	SHIELD,
	MINER,
}

export type BattleFunction = (friendly: ShipWrapper, opponent: ShipWrapper) => AttachmentReport | undefined;
export type PlayerFunction = (friendly: ShipWrapper) => AttachmentReport | undefined;
