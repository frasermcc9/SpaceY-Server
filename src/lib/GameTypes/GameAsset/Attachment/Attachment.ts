import { GameAsset, IGameAssetOptions, IStrengthOptions } from "../GameAsset";
import { Blueprint } from "../Blueprint/Blueprint";
import { Ship } from "../Ship/Ship";
import { ShipWrapper } from "../Ship/ShipWrapper";
import { MaterialCollection } from "../../GameCollections/MaterialCollection";
import { Asteroid } from "../../GameMechanics/Asteroid";
import { StrengthComparable } from "../AssetDecorators";
import { Battleship } from "../Ship/Battleship";
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

    public emit<K extends keyof EventArgs>(event: K, args: EventArgs[K]): AttachmentReport | undefined {
        const e = this.functions[event];
        //@ts-ignore
        if (e) return e(args);
    }
}

export interface IAttachment {
    Type: AttachmentType;
    emit<K extends keyof EventArgs>(event: K, args: EventArgs[K]): AttachmentReport | undefined;
    isInvocable(): boolean;
    EnergyCost: number[];
    Strength: number;
}

export class AttachmentBuilder {
    public constructor(
        private readonly options: AttachmentOptions,
        private readonly functions: AttachmentFunctions = {}
    ) {}

    public EnableSellable(price: number): AttachmentBuilder {
        this.options.cost = price;
        return this;
    }
    public EnableBuildable(blueprint: Blueprint): AttachmentBuilder {
        this.options.blueprint = blueprint;
        return this;
    }

    /**
     * preferred method to add functions to the attachment
     * @param e
     * @param func
     */
    public addFunction<K extends keyof AttachmentFunctions>(e: K, func: AttachmentFunctions[K]): this {
        this.functions[e] = func;
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

interface FunctionArgs {
    BattleFunction: { battle: IBattleData };
    DamageTakenFunction: { friendly: Battleship; enemy: Battleship; dmg: number };
    ShipFunction: { friendly: ShipWrapper };
    MineFunction: { asteroid: Asteroid };
    WarpFunction: { friendly: ShipWrapper; warp: number };
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

export type AttachmentReport = {
    message: string;
    success: boolean;
    damage?: number;
};

export enum AttachmentType {
    GENERAL,
    PRIMARY,
    HEAVY,
    SHIELD,
    MINER,
}

export type BattleFunction = ({ battle }: FunctionArgs["BattleFunction"]) => AttachmentReport | undefined;
export type DamageTakenFunction = ({
    friendly,
    enemy,
    dmg,
}: FunctionArgs["DamageTakenFunction"]) => AttachmentReport | undefined;
export type ShipFunction = ({ friendly }: FunctionArgs["ShipFunction"]) => AttachmentReport | undefined;
export type MineFunction = ({ asteroid }: FunctionArgs["MineFunction"]) => AttachmentReport | undefined;
export type WarpFunction = ({ friendly, warp }: FunctionArgs["WarpFunction"]) => AttachmentReport | undefined;
