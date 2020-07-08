import { GameAsset, IGameAssetOptions, IStrengthOptions } from "../GameAsset";
import { Blueprint } from "../Blueprint/Blueprint";
import { Ship } from "../Ship/Ship";
import { ShipWrapper } from "../Ship/ShipWrapper";
import { MaterialCollection } from "../../GameCollections/MaterialCollection";
import { Asteroid } from "../../GameMechanics/Asteroid";
import { StrengthComparable } from "../AssetDecorators";
import { Battleship } from "../Ship/BattleShip";
import { IBattleData } from "../../GameBattle/Battle";

export class Attachment extends GameAsset implements IAttachment, StrengthComparable {
	private type: AttachmentType;
	private strength: number;

	private energyCost: number[] = [0, 0, 0];

	constructor(data: AttachmentOptions, private readonly functions: AttachmentFunctions) {
		super(data);
		this.type = data.type;
		this.strength = data.strength;
		this.energyCost = data.energyCost ?? [0, 0, 0];
	}

	public get Type(): AttachmentType {
		return this.type;
	}

	public get Strength(): number {
		return this.strength;
	}

	public get EnergyCost(): number[] {
		return this.energyCost.slice();
	}

	public isInvocable(): boolean {
		return this.functions.onBattleInvoked != undefined;
	}

	public Triggers(): GameEvent[] {
		const Catalysts = new Array<GameEvent>();
		if (this.functions.onBattleStart) Catalysts.push(GameEvent.BATTLE_START);
		if (this.functions.onBattlePreTurn) Catalysts.push(GameEvent.BATTLE_PRE_TURN);
		if (this.functions.onBattlePostTurn) Catalysts.push(GameEvent.BATTLE_POST_TURN);
		if (this.functions.onBattleInvoked) Catalysts.push(GameEvent.BATTLE_INVOKED);
		if (this.functions.onDamageTaken) Catalysts.push(GameEvent.BATTLE_DAMAGE_TAKEN);
		if (this.functions.onBattleEnd) Catalysts.push(GameEvent.BATTLE_END);
		if (this.functions.onCriticalDamageTaken) Catalysts.push(GameEvent.BATTLE_CRITICAL_DAMAGE_TAKEN);

		if (this.functions.onEquip) Catalysts.push(GameEvent.EQUIP);
		if (this.functions.onUnequip) Catalysts.push(GameEvent.UNEQUIP);
		if (this.functions.onWarp) Catalysts.push(GameEvent.WARP);
		if (this.functions.onMine) Catalysts.push(GameEvent.MINE);

		return Catalysts;
	}

	public dispatch(event: GameEvent.BATTLE_END, battle: IBattleData): AttachmentReport | undefined;
	public dispatch(event: GameEvent.BATTLE_INVOKED, battle: IBattleData): AttachmentReport | undefined;
	public dispatch(event: GameEvent.BATTLE_POST_TURN, battle: IBattleData): AttachmentReport | undefined;
	public dispatch(event: GameEvent.BATTLE_PRE_TURN, battle: IBattleData): AttachmentReport | undefined;
	public dispatch(event: GameEvent.BATTLE_START, battle: IBattleData): AttachmentReport | undefined;
	public dispatch(event: GameEvent.BATTLE_CRITICAL_DAMAGE_TAKEN, friend: Battleship, enemy: Battleship): AttachmentReport | undefined;
	public dispatch(event: GameEvent.BATTLE_DAMAGE_TAKEN, friend: Battleship, enemy: Battleship, dmg: number): AttachmentReport | undefined;
	public dispatch(event: GameEvent.EQUIP, friend: ShipWrapper): AttachmentReport | undefined;
	public dispatch(event: GameEvent.MINE, asteroid: Asteroid): AttachmentReport | undefined;
	public dispatch(event: GameEvent.UNEQUIP, friend: ShipWrapper): AttachmentReport | undefined;
	public dispatch(event: GameEvent.WARP, friend: ShipWrapper, ws: number): AttachmentReport | undefined;
	public dispatch(event: GameEvent.WARP_POLL, friend: ShipWrapper, ws: number): AttachmentReport | undefined;
	public dispatch(event: GameEvent, ...args: any[]) {
		switch (event) {
			case GameEvent.BATTLE_DAMAGE_TAKEN:
				if (this.functions.onDamageTaken)
					return this.functions.onDamageTaken.apply(this, args as [Battleship, Battleship, number]) as AttachmentReport;
				break;
			case GameEvent.BATTLE_END:
				if (this.functions.onBattleEnd) return this.functions.onBattleEnd.apply(this, args as [IBattleData]) as AttachmentReport;
				break;
			case GameEvent.BATTLE_INVOKED:
				if (this.functions.onBattleInvoked)
					return this.functions.onBattleInvoked.apply(this, args as [IBattleData]) as AttachmentReport;
				break;
			case GameEvent.BATTLE_POST_TURN:
				if (this.functions.onBattlePostTurn)
					return this.functions.onBattlePostTurn.apply(this, args as [IBattleData]) as AttachmentReport;
				break;
			case GameEvent.BATTLE_PRE_TURN:
				if (this.functions.onBattlePreTurn)
					return this.functions.onBattlePreTurn.apply(this, args as [IBattleData]) as AttachmentReport;
				break;
			case GameEvent.BATTLE_START:
				if (this.functions.onBattleStart)
					return this.functions.onBattleStart.apply(this, args as [IBattleData]) as AttachmentReport;
				break;
			case GameEvent.BATTLE_CRITICAL_DAMAGE_TAKEN:
				if (this.functions.onCriticalDamageTaken)
					return this.functions.onCriticalDamageTaken.apply(this, args as [Battleship, Battleship, number]) as AttachmentReport;
				break;
			case GameEvent.EQUIP:
				if (this.functions.onEquip) {
					return this.functions.onEquip.apply(this, args as [ShipWrapper]) as AttachmentReport;
				}
				break;
			case GameEvent.UNEQUIP:
				if (this.functions.onUnequip) return this.functions.onUnequip.apply(this, args as [ShipWrapper]) as AttachmentReport;
				break;
			case GameEvent.MINE:
				if (this.functions.onMine) return this.functions.onMine.apply(this, args as [Asteroid]) as AttachmentReport;
				break;
			case GameEvent.WARP:
				if (this.functions.onWarp) return this.functions.onWarp.apply(this, args as [ShipWrapper, number]) as AttachmentReport;
				break;
			case GameEvent.WARP_POLL:
				if (this.functions.onWarpPoll)
					return this.functions.onWarpPoll.apply(this, args as [ShipWrapper, number]) as AttachmentReport;
				break;
		}
	}
}

export interface IAttachment {
	Type: AttachmentType;
	Triggers(): GameEvent[];
}

export class AttachmentBuilder {
	public constructor(private readonly options: AttachmentOptions, private readonly functions: AttachmentFunctions = {}) {}

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
	public BattleInvokeFn(fn: BattleFunction, cost: number[]): AttachmentBuilder {
		if (cost.length != 3) throw new Error("Invoked attachments require an explicitly defined energy cost.");
		this.functions.onBattleInvoked = fn;
		this.options.energyCost = cost;
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
	 * Fires to all attachments when the player takes critical damage
	 * @param fn
	 */
	public CriticalDamageFn(fn: DamageTakenFunction): AttachmentBuilder {
		this.functions.onCriticalDamageTaken = fn;
		return this;
	}
	/**
	 * Fires to all attachments when damage is taken
	 * @param fn
	 */
	public DamageTakenFn(fn: DamageTakenFunction): AttachmentBuilder {
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
		return new Attachment(this.options, this.functions);
	}
}

interface AttachmentOptions extends IGameAssetOptions, IStrengthOptions {
	type: AttachmentType;
	energyCost?: number[];
}
export interface AttachmentFunctions {
	onBattleStart?: BattleFunction;
	onBattlePreTurn?: BattleFunction;
	onBattlePostTurn?: BattleFunction;
	onBattleInvoked?: BattleFunction;
	onBattleEnd?: BattleFunction;

	onCriticalDamageTaken?: DamageTakenFunction;
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
	damage?: number;
};

export enum GameEvent {
	BATTLE_START,
	BATTLE_END,
	BATTLE_INVOKED,
	BATTLE_PRE_TURN,
	BATTLE_POST_TURN,
	BATTLE_CRITICAL_DAMAGE_TAKEN,
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

export type BattleFunction = (battle: IBattleData) => AttachmentReport | undefined;
export type DamageTakenFunction = (friendly: Battleship, opponent: Battleship, dmg: number) => AttachmentReport | undefined;
export type ShipFunction = (friendly: ShipWrapper) => AttachmentReport | undefined;
export type MineFunction = (inputCollection: Asteroid) => AttachmentReport | undefined;
export type WarpFunction = (friendly: ShipWrapper, warp: number) => AttachmentReport | undefined;
