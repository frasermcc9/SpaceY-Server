import { GameAsset, IGameAssetOptions, IStrengthOptions } from "../GameAsset";
import { Blueprint } from "../Blueprint/Blueprint";
import { Ship } from "../Ship/Ship";
import { ShipWrapper } from "../Ship/ShipWrapper";
import { MaterialCollection } from "../../GameCollections/MaterialCollection";
import { Asteroid } from "../../GameMechanics/Asteroid";
import { StrengthComparable } from "../AssetDecorators";

export class Attachment extends GameAsset implements IBattleObserver, IPlayerObserver, IAttachment, StrengthComparable {
	private type: AttachmentType;
	private strength: number;

	private onBattleStart?: BattleFunction;
	private onBattlePreTurn?: BattleFunction;
	private onBattlePostTurn?: BattleFunction;
	private onBattleInvoked?: BattleFunction;
	private onBattleEnd?: BattleFunction;

	private onEquip?: ShipFunction;
	private onUnequip?: ShipFunction;
	private onMine?: MineFunction;
	private onWarp?: ShipFunction;

	constructor(options: AttachmentOptions) {
		super(options);
		this.type = options.type;
		this.strength = options.strength;

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
    
	public get Strength(): number {
		return this.strength;
	}

	public Triggers(): (BattleEvent | ShipEvent | MineEvent)[] {
		const Catalysts = new Array<BattleEvent | ShipEvent | MineEvent>();
		if (this.onBattleStart) Catalysts.push(BattleEvent.BATTLE_START);
		if (this.onBattlePreTurn) Catalysts.push(BattleEvent.BATTLE_PRE_TURN);
		if (this.onBattlePostTurn) Catalysts.push(BattleEvent.BATTLE_POST_TURN);
		if (this.onBattleInvoked) Catalysts.push(BattleEvent.BATTLE_INVOKED);
		if (this.onBattleEnd) Catalysts.push(BattleEvent.BATTLE_END);

		if (this.onEquip) Catalysts.push(ShipEvent.EQUIP);
		if (this.onUnequip) Catalysts.push(ShipEvent.UNEQUIP);
		if (this.onWarp) Catalysts.push(ShipEvent.WARP);

		if (this.onMine) Catalysts.push(MineEvent.MINE);

		return Catalysts;
	}

	public BattleUpdate(
		event: BattleEvent,
		{ friendly, opponent }: { friendly: ShipWrapper; opponent: ShipWrapper }
	): AttachmentReport | undefined {
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
	public NonBattleUpdate(event: ShipEvent, { friendly }: { friendly: ShipWrapper }): AttachmentReport | undefined {
		switch (event) {
			case ShipEvent.EQUIP:
				return this.Equip(friendly);
			case ShipEvent.UNEQUIP:
				return this.UnEquip(friendly);
			case ShipEvent.WARP:
				return this.Warp(friendly);
			default:
				break;
		}
	}

	public MineEvent({ collection }: { collection: Asteroid }) {
		return this.Mine(collection);
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
	private Mine(collection: Asteroid): AttachmentReport | undefined {
		if (this.onMine) return this.onMine.apply(this, [collection]);
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
	BattleUpdate?: (
		event: BattleEvent,
		{ friendly, opponent }: { friendly: ShipWrapper; opponent: ShipWrapper }
	) => AttachmentReport | undefined;
}
export interface IPlayerObserver {
	/* Equip?: PlayerFunction;
	Unequip?: PlayerFunction;
	Mine?: PlayerFunction;
    Warp?: PlayerFunction; */
	NonBattleUpdate?: (event: ShipEvent, { friendly }: { friendly: ShipWrapper }) => AttachmentReport | undefined;
}
export interface IAttachment extends IPlayerObserver, IBattleObserver {
	Type: AttachmentType;
	Triggers(): (BattleEvent | ShipEvent | MineEvent)[];
}

export class AttachmentBuilder {
	private onBattleStart?: BattleFunction;
	private onBattlePreTurn?: BattleFunction;
	private onBattlePostTurn?: BattleFunction;
	private onBattleInvoked?: BattleFunction;
	private onBattleEnd?: BattleFunction;

	private onEquip?: ShipFunction;
	private onUnequip?: ShipFunction;
	private onMine?: MineFunction;
	private onWarp?: ShipFunction;

	public constructor(private readonly options: AttachmentOptions) {}

	public EnableSellable(price: number): AttachmentBuilder {
		this.options.cost = price;
		return this;
	}
	public EnableBuildable(blueprint: Blueprint): AttachmentBuilder {
		this.options.blueprint = blueprint;
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
	public EquipFn(fn: ShipFunction): AttachmentBuilder {
		this.onEquip = fn;
		return this;
	}
	public UnequipFn(fn: ShipFunction): AttachmentBuilder {
		this.onUnequip = fn;
		return this;
	}
	public MineFn(fn: MineFunction): AttachmentBuilder {
		this.onMine = fn;
		return this;
	}
	public WarpFn(fn: ShipFunction): AttachmentBuilder {
		this.onWarp = fn;
		return this;
	}

	public Build(): Attachment {
		return new Attachment({
			name: this.options.name,
			description: this.options.description,
			blueprint: this.options.blueprint,
			cost: this.options.cost,
			techLevel: this.options.techLevel,
			type: this.options.type,
			strength: this.options.strength,

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

interface AttachmentOptions extends IGameAssetOptions, IStrengthOptions {
	type: AttachmentType;

	onBattleStart?: BattleFunction;
	onBattlePreTurn?: BattleFunction;
	onBattlePostTurn?: BattleFunction;
	onBattleInvoked?: BattleFunction;
	onBattleEnd?: BattleFunction;

	onEquip?: ShipFunction;
	onUnequip?: ShipFunction;
	onMine?: MineFunction;
	onWarp?: ShipFunction;
}

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
export enum ShipEvent {
	EQUIP,
	UNEQUIP,
	WARP,
}
export enum MineEvent {
	MINE,
}
export enum AttachmentType {
	GENERAL,
	PRIMARY,
	HEAVY,
	SHIELD,
	MINER,
}

export type BattleFunction = (friendly: ShipWrapper, opponent: ShipWrapper) => AttachmentReport | undefined;
export type ShipFunction = (friendly: ShipWrapper) => AttachmentReport | undefined;
export type MineFunction = (inputCollection: Asteroid) => AttachmentReport | undefined;
