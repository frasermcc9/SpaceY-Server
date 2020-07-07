import { GameAsset, IGameAssetOptions, IStrengthOptions } from "../GameAsset";
import { Blueprint } from "../Blueprint/Blueprint";
import { Ship } from "../Ship/Ship";
import { ShipWrapper } from "../Ship/ShipWrapper";
import { MaterialCollection } from "../../GameCollections/MaterialCollection";
import { Asteroid } from "../../GameMechanics/Asteroid";
import { StrengthComparable } from "../AssetDecorators";

export class Attachment extends GameAsset implements IAttachment, StrengthComparable {
	private type: AttachmentType;
	private strength: number;

	constructor(data: AttachmentOptions, private readonly functions: AttachmentFunctions) {
		super(data);
		this.type = data.type;
		this.strength = data.strength;
	}

	public get Type(): AttachmentType {
		return this.type;
	}

	public get Strength(): number {
		return this.strength;
	}

	public Triggers(): GameEvent[] {
		const Catalysts = new Array<GameEvent>();
		if (this.functions.onBattleStart) Catalysts.push(GameEvent.BATTLE_START);
		if (this.functions.onBattlePreTurn) Catalysts.push(GameEvent.BATTLE_PRE_TURN);
		if (this.functions.onBattlePostTurn) Catalysts.push(GameEvent.BATTLE_POST_TURN);
		if (this.functions.onBattleInvoked) Catalysts.push(GameEvent.BATTLE_INVOKED);
		if (this.functions.onDamageTaken) Catalysts.push(GameEvent.BATTLE_DAMAGE_TAKEN);
		if (this.functions.onBattleEnd) Catalysts.push(GameEvent.BATTLE_END);

		if (this.functions.onEquip) Catalysts.push(GameEvent.EQUIP);
		if (this.functions.onUnequip) Catalysts.push(GameEvent.UNEQUIP);
		if (this.functions.onWarp) Catalysts.push(GameEvent.WARP);
		if (this.functions.onMine) Catalysts.push(GameEvent.MINE);

		return Catalysts;
	}

    public dispatch(event: GameEvent.BATTLE_END, friend: ShipWrapper, enemy: ShipWrapper): AttachmentReport[] | undefined;
	public dispatch(event: GameEvent.BATTLE_INVOKED, friend: ShipWrapper, enemy: ShipWrapper): AttachmentReport[] | undefined;
	public dispatch(event: GameEvent.BATTLE_POST_TURN, friend: ShipWrapper, enemy: ShipWrapper): AttachmentReport[] | undefined;
	public dispatch(event: GameEvent.BATTLE_PRE_TURN, friend: ShipWrapper, enemy: ShipWrapper): AttachmentReport[] | undefined;
	public dispatch(event: GameEvent.BATTLE_START, friend: ShipWrapper, enemy: ShipWrapper): AttachmentReport[] | undefined;
	public dispatch(event: GameEvent.EQUIP, friend: ShipWrapper): AttachmentReport[] | undefined;
	public dispatch(event: GameEvent.MINE, asteroid: Asteroid): AttachmentReport[] | undefined;
	public dispatch(event: GameEvent.UNEQUIP, friend: ShipWrapper): AttachmentReport[] | undefined;
	public dispatch(event: GameEvent.WARP, friend: ShipWrapper, ws: number): AttachmentReport[] | undefined;
    public dispatch(event: GameEvent.WARP_POLL, friend: ShipWrapper, ws: number): AttachmentReport[] | undefined;
	public dispatch(
		event: GameEvent.BATTLE_DAMAGE_TAKEN,
		f: ShipWrapper,
		o: ShipWrapper,
		dmg: number
	): AttachmentReport[] | undefined;
	public dispatch(event: GameEvent, ...args: any[]) {
		switch (event) {
			case GameEvent.BATTLE_DAMAGE_TAKEN:
				if (this.functions.onDamageTaken)
					return [
						this.functions.onDamageTaken.apply(
							this,
							args as [ShipWrapper, ShipWrapper, number]
						) as AttachmentReport,
					];
			case GameEvent.BATTLE_END:
				if (this.functions.onBattleEnd)
					return [this.functions.onBattleEnd.apply(this, args as [ShipWrapper, ShipWrapper]) as AttachmentReport];
			case GameEvent.BATTLE_INVOKED:
				if (this.functions.onBattleInvoked)
					return [this.functions.onBattleInvoked.apply(this, args as [ShipWrapper, ShipWrapper]) as AttachmentReport];
			case GameEvent.BATTLE_POST_TURN:
				if (this.functions.onBattlePostTurn)
					return [
						this.functions.onBattlePostTurn.apply(this, args as [ShipWrapper, ShipWrapper]) as AttachmentReport,
					];
			case GameEvent.BATTLE_PRE_TURN:
				if (this.functions.onBattlePreTurn)
					return [this.functions.onBattlePreTurn.apply(this, args as [ShipWrapper, ShipWrapper]) as AttachmentReport];
			case GameEvent.BATTLE_START:
				if (this.functions.onBattleStart)
					return [this.functions.onBattleStart.apply(this, args as [ShipWrapper, ShipWrapper]) as AttachmentReport];
			case GameEvent.EQUIP:
				if (this.functions.onEquip)
					return [this.functions.onEquip.apply(this, args as [ShipWrapper]) as AttachmentReport];
			case GameEvent.UNEQUIP:
				if (this.functions.onUnequip)
					return [this.functions.onUnequip.apply(this, args as [ShipWrapper]) as AttachmentReport];
			case GameEvent.MINE:
				if (this.functions.onMine) return [this.functions.onMine.apply(this, args as [Asteroid]) as AttachmentReport];
			case GameEvent.WARP:
				if (this.functions.onWarp)
					return [this.functions.onWarp.apply(this, args as [ShipWrapper, number]) as AttachmentReport];
			case GameEvent.WARP_POLL:
				if (this.functions.onWarpPoll)
					return [this.functions.onWarpPoll.apply(this, args as [ShipWrapper, number]) as AttachmentReport];
		}
	}
}

export interface IAttachment {
	Type: AttachmentType;
	Triggers(): GameEvent[];
}

export class AttachmentBuilder {
	public constructor(private readonly options: AttachmentOptions, private readonly functions: AttachmentFunctions) {}

	public EnableSellable(price: number): AttachmentBuilder {
		this.options.cost = price;
		return this;
	}
	public EnableBuildable(blueprint: Blueprint): AttachmentBuilder {
		this.options.blueprint = blueprint;
		return this;
	}
	/**
	 * Fires to all attachments when a battle starts.
	 * @param fn
	 */
	public BattleStartFn(fn: BattleFunction): AttachmentBuilder {
		this.functions.onBattleStart = fn;
		return this;
	}
	/**
	 * Fires to all attachments at the start of a turn
	 * @param fn
	 */
	public BattlePreTurnFn(fn: BattleFunction): AttachmentBuilder {
		this.functions.onBattlePreTurn = fn;
		return this;
	}
	/**
	 * Fires to all attachments at the end of a turn
	 * @param fn
	 */
	public BattlePostTurnFn(fn: BattleFunction): AttachmentBuilder {
		this.functions.onBattlePostTurn = fn;
		return this;
	}
	/**
	 * Fires when the attachment is ran
	 * @param fn
	 */
	public BattleInvokeFn(fn: BattleFunction): AttachmentBuilder {
		this.functions.onBattleInvoked = fn;
		return this;
	}
	/**
	 * Fires to all attachments when the battle is completed
	 * @param fn
	 */
	public BattleEndFn(fn: BattleFunction): AttachmentBuilder {
		this.functions.onBattleEnd = fn;
		return this;
	}
	/**
	 * Fires to all attachments when damage is taken
	 * @param fn
	 */
	public DamageTakenFn(fn: BattleFunction): AttachmentBuilder {
		this.functions.onDamageTaken = fn;
		return this;
	}
	/**
	 * Fires to the attachment when it is equipped
	 * @param fn
	 */
	public EquipFn(fn: ShipFunction): AttachmentBuilder {
		this.functions.onEquip = fn;
		return this;
	}
	/**
	 * Fires to the attachment when it is unequipped.
	 * @param fn
	 */
	public UnequipFn(fn: ShipFunction): AttachmentBuilder {
		this.functions.onUnequip = fn;
		return this;
	}
	/**
	 * Fires to all attachments when mining occurs
	 * @param fn
	 */
	public MineFn(fn: MineFunction): AttachmentBuilder {
		this.functions.onMine = fn;
		return this;
	}
	/**
	 * Fires to all attachments when a warp occurs
	 * @param fn
	 */
	public WarpFn(fn: WarpFunction): AttachmentBuilder {
		this.functions.onWarp = fn;
		return this;
	}
	/**
	 * Fires to all attachments to indicate a warp is going to try occur
	 * @param fn
	 */
	public WarpPollFn(fn: WarpFunction): AttachmentBuilder {
		this.functions.onWarpPoll = fn;
		return this;
	}

	public Build(): Attachment {
		return new Attachment(
			{
				name: this.options.name,
				description: this.options.description,
				blueprint: this.options.blueprint,
				cost: this.options.cost,
				techLevel: this.options.techLevel,
				type: this.options.type,
				strength: this.options.strength,
			},
			this.functions
		);
	}
}

interface AttachmentOptions extends IGameAssetOptions, IStrengthOptions {
	type: AttachmentType;
}
export interface AttachmentFunctions {
	onBattleStart?: BattleFunction;
	onBattlePreTurn?: BattleFunction;
	onBattlePostTurn?: BattleFunction;
	onBattleInvoked?: BattleFunction;
	onBattleEnd?: BattleFunction;

	onDamageTaken?: DamageTakenFunction;

	onEquip?: ShipFunction;
	onUnequip?: ShipFunction;

	onMine?: MineFunction;

	onWarp?: WarpFunction;
	onWarpPoll?: WarpFunction;
}

export type AttachmentReport = {
	message: string;
	success: boolean;
};

export enum GameEvent {
	BATTLE_START,
	BATTLE_END,
	BATTLE_INVOKED,
	BATTLE_PRE_TURN,
	BATTLE_POST_TURN,
	BATTLE_DAMAGE_TAKEN,
	EQUIP,
	UNEQUIP,
	MINE,

	WARP,
	WARP_POLL,
}

export enum AttachmentType {
	GENERAL,
	PRIMARY,
	HEAVY,
	SHIELD,
	MINER,
}

export type BattleFunction = (friendly: ShipWrapper, opponent: ShipWrapper) => AttachmentReport | undefined;
export type DamageTakenFunction = (friendly: ShipWrapper, opponent: ShipWrapper, dmg: number) => AttachmentReport | undefined;
export type ShipFunction = (friendly: ShipWrapper) => AttachmentReport | undefined;
export type MineFunction = (inputCollection: Asteroid) => AttachmentReport | undefined;
export type WarpFunction = (friendly: ShipWrapper, warp: number) => AttachmentReport | undefined;
