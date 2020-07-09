"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttachmentType = exports.GameEvent = exports.AttachmentBuilder = exports.Attachment = void 0;
const GameAsset_1 = require("../GameAsset");
class Attachment extends GameAsset_1.GameAsset {
    constructor(data, functions) {
        super(data);
        this.functions = functions;
        this.energyCost = [0, 0, 0];
        this.type = data.type;
        this.strength = data.strength;
        this.energyCost = data.energyCost ?? [0, 0, 0];
    }
    get Type() {
        return this.type;
    }
    get Strength() {
        return this.strength;
    }
    get EnergyCost() {
        return this.energyCost.slice();
    }
    isInvocable() {
        return this.functions.onBattleInvoked != undefined;
    }
    Triggers() {
        const Catalysts = new Array();
        if (this.functions.onBattleStart)
            Catalysts.push(GameEvent.BATTLE_START);
        if (this.functions.onBattlePreTurn)
            Catalysts.push(GameEvent.BATTLE_PRE_TURN);
        if (this.functions.onBattlePostTurn)
            Catalysts.push(GameEvent.BATTLE_POST_TURN);
        if (this.functions.onBattleInvoked)
            Catalysts.push(GameEvent.BATTLE_INVOKED);
        if (this.functions.onDamageTaken)
            Catalysts.push(GameEvent.BATTLE_DAMAGE_TAKEN);
        if (this.functions.onBattleEnd)
            Catalysts.push(GameEvent.BATTLE_END);
        if (this.functions.onCriticalDamageTaken)
            Catalysts.push(GameEvent.BATTLE_CRITICAL_DAMAGE_TAKEN);
        if (this.functions.onEquip)
            Catalysts.push(GameEvent.EQUIP);
        if (this.functions.onUnequip)
            Catalysts.push(GameEvent.UNEQUIP);
        if (this.functions.onWarp)
            Catalysts.push(GameEvent.WARP);
        if (this.functions.onMine)
            Catalysts.push(GameEvent.MINE);
        return Catalysts;
    }
    dispatch(event, ...args) {
        switch (event) {
            case GameEvent.BATTLE_DAMAGE_TAKEN:
                if (this.functions.onDamageTaken)
                    return this.functions.onDamageTaken.apply(this, args);
                break;
            case GameEvent.BATTLE_END:
                if (this.functions.onBattleEnd)
                    return this.functions.onBattleEnd.apply(this, args);
                break;
            case GameEvent.BATTLE_INVOKED:
                if (this.functions.onBattleInvoked)
                    return this.functions.onBattleInvoked.apply(this, args);
                break;
            case GameEvent.BATTLE_POST_TURN:
                if (this.functions.onBattlePostTurn)
                    return this.functions.onBattlePostTurn.apply(this, args);
                break;
            case GameEvent.BATTLE_PRE_TURN:
                if (this.functions.onBattlePreTurn)
                    return this.functions.onBattlePreTurn.apply(this, args);
                break;
            case GameEvent.BATTLE_START:
                if (this.functions.onBattleStart)
                    return this.functions.onBattleStart.apply(this, args);
                break;
            case GameEvent.BATTLE_CRITICAL_DAMAGE_TAKEN:
                if (this.functions.onCriticalDamageTaken)
                    return this.functions.onCriticalDamageTaken.apply(this, args);
                break;
            case GameEvent.EQUIP:
                if (this.functions.onEquip) {
                    return this.functions.onEquip.apply(this, args);
                }
                break;
            case GameEvent.UNEQUIP:
                if (this.functions.onUnequip)
                    return this.functions.onUnequip.apply(this, args);
                break;
            case GameEvent.MINE:
                if (this.functions.onMine)
                    return this.functions.onMine.apply(this, args);
                break;
            case GameEvent.WARP:
                if (this.functions.onWarp)
                    return this.functions.onWarp.apply(this, args);
                break;
            case GameEvent.WARP_POLL:
                if (this.functions.onWarpPoll)
                    return this.functions.onWarpPoll.apply(this, args);
                break;
        }
    }
}
exports.Attachment = Attachment;
class AttachmentBuilder {
    constructor(options, functions = {}) {
        this.options = options;
        this.functions = functions;
    }
    EnableSellable(price) {
        this.options.cost = price;
        return this;
    }
    EnableBuildable(blueprint) {
        this.options.blueprint = blueprint;
        return this;
    }
    /**
     * Fires to all attachments when a battle starts.
     * @param fn
     */
    BattleStartFn(fn) {
        this.functions.onBattleStart = fn;
        return this;
    }
    /**
     * Fires to all attachments at the start of a turn
     * @param fn
     */
    BattlePreTurnFn(fn) {
        this.functions.onBattlePreTurn = fn;
        return this;
    }
    /**
     * Fires to all attachments at the end of a turn
     * @param fn
     */
    BattlePostTurnFn(fn) {
        this.functions.onBattlePostTurn = fn;
        return this;
    }
    /**
     * Fires when the attachment is ran
     * @param fn
     */
    BattleInvokeFn(fn, cost) {
        if (cost.length != 3)
            throw new Error("Invoked attachments require an explicitly defined energy cost.");
        this.functions.onBattleInvoked = fn;
        this.options.energyCost = cost;
        return this;
    }
    /**
     * Fires to all attachments when the battle is completed
     * @param fn
     */
    BattleEndFn(fn) {
        this.functions.onBattleEnd = fn;
        return this;
    }
    /**
     * Fires to all attachments when the player takes critical damage
     * @param fn
     */
    CriticalDamageFn(fn) {
        this.functions.onCriticalDamageTaken = fn;
        return this;
    }
    /**
     * Fires to all attachments when damage is taken
     * @param fn
     */
    DamageTakenFn(fn) {
        this.functions.onDamageTaken = fn;
        return this;
    }
    /**
     * Fires to the attachment when it is equipped
     * @param fn
     */
    EquipFn(fn) {
        this.functions.onEquip = fn;
        return this;
    }
    /**
     * Fires to the attachment when it is unequipped.
     * @param fn
     */
    UnequipFn(fn) {
        this.functions.onUnequip = fn;
        return this;
    }
    /**
     * Fires to all attachments when mining occurs
     * @param fn
     */
    MineFn(fn) {
        this.functions.onMine = fn;
        return this;
    }
    /**
     * Fires to all attachments when a warp occurs
     * @param fn
     */
    WarpFn(fn) {
        this.functions.onWarp = fn;
        return this;
    }
    /**
     * Fires to all attachments to indicate a warp is going to try occur
     * @param fn
     */
    WarpPollFn(fn) {
        this.functions.onWarpPoll = fn;
        return this;
    }
    Build() {
        return new Attachment(this.options, this.functions);
    }
}
exports.AttachmentBuilder = AttachmentBuilder;
var GameEvent;
(function (GameEvent) {
    GameEvent[GameEvent["BATTLE_START"] = 0] = "BATTLE_START";
    GameEvent[GameEvent["BATTLE_END"] = 1] = "BATTLE_END";
    GameEvent[GameEvent["BATTLE_INVOKED"] = 2] = "BATTLE_INVOKED";
    GameEvent[GameEvent["BATTLE_PRE_TURN"] = 3] = "BATTLE_PRE_TURN";
    GameEvent[GameEvent["BATTLE_POST_TURN"] = 4] = "BATTLE_POST_TURN";
    GameEvent[GameEvent["BATTLE_CRITICAL_DAMAGE_TAKEN"] = 5] = "BATTLE_CRITICAL_DAMAGE_TAKEN";
    GameEvent[GameEvent["BATTLE_DAMAGE_TAKEN"] = 6] = "BATTLE_DAMAGE_TAKEN";
    GameEvent[GameEvent["EQUIP"] = 7] = "EQUIP";
    GameEvent[GameEvent["UNEQUIP"] = 8] = "UNEQUIP";
    GameEvent[GameEvent["MINE"] = 9] = "MINE";
    GameEvent[GameEvent["WARP"] = 10] = "WARP";
    GameEvent[GameEvent["WARP_POLL"] = 11] = "WARP_POLL";
})(GameEvent = exports.GameEvent || (exports.GameEvent = {}));
var AttachmentType;
(function (AttachmentType) {
    AttachmentType[AttachmentType["GENERAL"] = 0] = "GENERAL";
    AttachmentType[AttachmentType["PRIMARY"] = 1] = "PRIMARY";
    AttachmentType[AttachmentType["HEAVY"] = 2] = "HEAVY";
    AttachmentType[AttachmentType["SHIELD"] = 3] = "SHIELD";
    AttachmentType[AttachmentType["MINER"] = 4] = "MINER";
})(AttachmentType = exports.AttachmentType || (exports.AttachmentType = {}));
