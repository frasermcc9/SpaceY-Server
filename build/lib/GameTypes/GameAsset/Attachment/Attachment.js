"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttachmentType = exports.AttachmentBuilder = exports.Attachment = void 0;
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
    emit(event, args) {
        const e = this.functions[event];
        //@ts-ignore
        if (e)
            return e(args);
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
     * preferred method to add functions to the attachment
     * @param e
     * @param func
     */
    addFunction(e, func) {
        this.functions[e] = func;
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
var AttachmentType;
(function (AttachmentType) {
    AttachmentType[AttachmentType["GENERAL"] = 0] = "GENERAL";
    AttachmentType[AttachmentType["PRIMARY"] = 1] = "PRIMARY";
    AttachmentType[AttachmentType["HEAVY"] = 2] = "HEAVY";
    AttachmentType[AttachmentType["SHIELD"] = 3] = "SHIELD";
    AttachmentType[AttachmentType["MINER"] = 4] = "MINER";
})(AttachmentType = exports.AttachmentType || (exports.AttachmentType = {}));
//# sourceMappingURL=Attachment.js.map