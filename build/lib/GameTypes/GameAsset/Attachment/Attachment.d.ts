import { GameAsset, IGameAssetOptions, IStrengthOptions } from "../GameAsset";
import { Blueprint } from "../Blueprint/Blueprint";
import { ShipWrapper } from "../Ship/ShipWrapper";
import { StrengthComparable } from "../AssetDecorators";
import { IBattleship } from "../../GameBattle/Battleship";
import { IBattleData } from "../../GameBattle/Battle";
import { AttachmentAsteroid } from "../../GameMechanics/MutableAsteroid";
export declare class Attachment extends GameAsset implements IAttachment, StrengthComparable {
    private readonly functions;
    private type;
    private strength;
    private energyCost;
    private cooldown;
    constructor(data: AttachmentOptions, functions: AttachmentFunctions);
    get Type(): AttachmentType;
    get Strength(): number;
    get EnergyCost(): number[];
    isInvocable(): boolean;
    emit<K extends keyof EventArgs>(event: K, args: EventArgs[K]): AttachmentReport | undefined;
}
export interface IAttachment {
    Type: AttachmentType;
    emit<K extends keyof EventArgs>(event: K, args: EventArgs[K]): AttachmentReport | undefined;
    isInvocable(): boolean;
    EnergyCost: number[];
    Strength: number;
}
export declare class AttachmentBuilder {
    private readonly options;
    private readonly functions;
    constructor(options: AttachmentOptions, functions?: AttachmentFunctions);
    EnableSellable(price: number): AttachmentBuilder;
    EnableBuildable(blueprint: Blueprint): AttachmentBuilder;
    /**
     * preferred method to add functions to the attachment
     * @param e
     * @param func
     */
    addFunction<K extends keyof AttachmentFunctions>(e: K, func: AttachmentFunctions[K]): this;
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
    cooldown?: number;
}
interface FunctionArgs {
    BattleFunction: {
        battle: IBattleData;
    };
    DamageTakenFunction: {
        friendly: IBattleship;
        enemy: IBattleship;
        dmg: number;
    };
    ShipFunction: {
        friendly: ShipWrapper;
    };
    MineFunction: {
        asteroid: AttachmentAsteroid;
    };
    WarpFunction: {
        friendly: ShipWrapper;
        warp: number;
    };
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
export interface EventArgs {
    onBattleStart: FunctionArgs["BattleFunction"];
    onBattlePreTurn: FunctionArgs["BattleFunction"];
    onBattlePostTurn: FunctionArgs["BattleFunction"];
    onBattleInvoked: FunctionArgs["BattleFunction"];
    onBattleEnd: FunctionArgs["BattleFunction"];
    onCriticalDamageTaken: FunctionArgs["DamageTakenFunction"];
    onDamageTaken: FunctionArgs["DamageTakenFunction"];
    onEquip: FunctionArgs["ShipFunction"];
    onUnequip: FunctionArgs["ShipFunction"];
    onMine: FunctionArgs["MineFunction"];
    onWarp: FunctionArgs["WarpFunction"];
    onWarpPoll: FunctionArgs["WarpFunction"];
}
export declare type AttachmentReport = {
    message: string;
    success: boolean;
    damage?: number;
    keepTurn?: boolean;
};
export declare enum AttachmentType {
    GENERAL = 0,
    PRIMARY = 1,
    HEAVY = 2,
    SHIELD = 3,
    MINER = 4
}
export declare type BattleFunction = ({ battle }: FunctionArgs["BattleFunction"]) => AttachmentReport | undefined;
export declare type DamageTakenFunction = ({ friendly, enemy, dmg, }: FunctionArgs["DamageTakenFunction"]) => AttachmentReport | undefined;
export declare type ShipFunction = ({ friendly }: FunctionArgs["ShipFunction"]) => AttachmentReport | undefined;
export declare type MineFunction = ({ asteroid }: FunctionArgs["MineFunction"]) => AttachmentReport | undefined;
export declare type WarpFunction = ({ friendly, warp }: FunctionArgs["WarpFunction"]) => AttachmentReport | undefined;
export {};
