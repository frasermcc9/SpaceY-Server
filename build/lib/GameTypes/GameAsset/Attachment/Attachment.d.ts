import { GameAsset, IGameAssetOptions, IStrengthOptions } from "../GameAsset";
import { Blueprint } from "../Blueprint/Blueprint";
import { ShipWrapper } from "../Ship/ShipWrapper";
import { Asteroid } from "../../GameMechanics/Asteroid";
import { StrengthComparable } from "../AssetDecorators";
import { Battleship } from "../Ship/Battleship";
import { IBattleData } from "../../GameBattle/Battle";
export declare class Attachment extends GameAsset implements IAttachment, StrengthComparable {
    private readonly functions;
    private type;
    private strength;
    private energyCost;
    constructor(data: AttachmentOptions, functions: AttachmentFunctions);
    get Type(): AttachmentType;
    get Strength(): number;
    get EnergyCost(): number[];
    isInvocable(): boolean;
    Triggers(): GameEvent[];
    dispatch(event: GameEvent.BATTLE_END, battle: IBattleData): AttachmentReport | undefined;
    dispatch(event: GameEvent.BATTLE_INVOKED, battle: IBattleData): AttachmentReport | undefined;
    dispatch(event: GameEvent.BATTLE_POST_TURN, battle: IBattleData): AttachmentReport | undefined;
    dispatch(event: GameEvent.BATTLE_PRE_TURN, battle: IBattleData): AttachmentReport | undefined;
    dispatch(event: GameEvent.BATTLE_START, battle: IBattleData): AttachmentReport | undefined;
    dispatch(event: GameEvent.BATTLE_CRITICAL_DAMAGE_TAKEN, friend: Battleship, enemy: Battleship): AttachmentReport | undefined;
    dispatch(event: GameEvent.BATTLE_DAMAGE_TAKEN, friend: Battleship, enemy: Battleship, dmg: number): AttachmentReport | undefined;
    dispatch(event: GameEvent.EQUIP, friend: ShipWrapper): AttachmentReport | undefined;
    dispatch(event: GameEvent.MINE, asteroid: Asteroid): AttachmentReport | undefined;
    dispatch(event: GameEvent.UNEQUIP, friend: ShipWrapper): AttachmentReport | undefined;
    dispatch(event: GameEvent.WARP, friend: ShipWrapper, ws: number): AttachmentReport | undefined;
    dispatch(event: GameEvent.WARP_POLL, friend: ShipWrapper, ws: number): AttachmentReport | undefined;
}
export interface IAttachment {
    Type: AttachmentType;
    Triggers(): GameEvent[];
}
export declare class AttachmentBuilder {
    private readonly options;
    private readonly functions;
    constructor(options: AttachmentOptions, functions?: AttachmentFunctions);
    EnableSellable(price: number): AttachmentBuilder;
    EnableBuildable(blueprint: Blueprint): AttachmentBuilder;
    /**
     * Fires to all attachments when a battle starts.
     * @param fn
     */
    BattleStartFn(fn: BattleFunction): AttachmentBuilder;
    /**
     * Fires to all attachments at the start of a turn
     * @param fn
     */
    BattlePreTurnFn(fn: BattleFunction): AttachmentBuilder;
    /**
     * Fires to all attachments at the end of a turn
     * @param fn
     */
    BattlePostTurnFn(fn: BattleFunction): AttachmentBuilder;
    /**
     * Fires when the attachment is ran
     * @param fn
     */
    BattleInvokeFn(fn: BattleFunction, cost: number[]): AttachmentBuilder;
    /**
     * Fires to all attachments when the battle is completed
     * @param fn
     */
    BattleEndFn(fn: BattleFunction): AttachmentBuilder;
    /**
     * Fires to all attachments when the player takes critical damage
     * @param fn
     */
    CriticalDamageFn(fn: DamageTakenFunction): AttachmentBuilder;
    /**
     * Fires to all attachments when damage is taken
     * @param fn
     */
    DamageTakenFn(fn: DamageTakenFunction): AttachmentBuilder;
    /**
     * Fires to the attachment when it is equipped
     * @param fn
     */
    EquipFn(fn: ShipFunction): AttachmentBuilder;
    /**
     * Fires to the attachment when it is unequipped.
     * @param fn
     */
    UnequipFn(fn: ShipFunction): AttachmentBuilder;
    /**
     * Fires to all attachments when mining occurs
     * @param fn
     */
    MineFn(fn: MineFunction): AttachmentBuilder;
    /**
     * Fires to all attachments when a warp occurs
     * @param fn
     */
    WarpFn(fn: WarpFunction): AttachmentBuilder;
    /**
     * Fires to all attachments to indicate a warp is going to try occur
     * @param fn
     */
    WarpPollFn(fn: WarpFunction): AttachmentBuilder;
    Build(): Attachment;
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
export declare type AttachmentReport = {
    message: string;
    success: boolean;
    damage?: number;
};
export declare enum GameEvent {
    BATTLE_START = 0,
    BATTLE_END = 1,
    BATTLE_INVOKED = 2,
    BATTLE_PRE_TURN = 3,
    BATTLE_POST_TURN = 4,
    BATTLE_CRITICAL_DAMAGE_TAKEN = 5,
    BATTLE_DAMAGE_TAKEN = 6,
    EQUIP = 7,
    UNEQUIP = 8,
    MINE = 9,
    WARP = 10,
    WARP_POLL = 11
}
export declare enum AttachmentType {
    GENERAL = 0,
    PRIMARY = 1,
    HEAVY = 2,
    SHIELD = 3,
    MINER = 4
}
export declare type BattleFunction = (battle: IBattleData) => AttachmentReport | undefined;
export declare type DamageTakenFunction = (friendly: Battleship, opponent: Battleship, dmg: number) => AttachmentReport | undefined;
export declare type ShipFunction = (friendly: ShipWrapper) => AttachmentReport | undefined;
export declare type MineFunction = (inputCollection: Asteroid) => AttachmentReport | undefined;
export declare type WarpFunction = (friendly: ShipWrapper, warp: number) => AttachmentReport | undefined;
export {};
