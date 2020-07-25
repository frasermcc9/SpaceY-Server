"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.battleStat = void 0;
const events_1 = require("events");
class BattleshipStat extends events_1.EventEmitter {
    constructor(start, max, gain) {
        super();
        this.value = start;
        this.maxValue = max;
        this.gain = gain;
    }
    minimise() {
        const n = this.value;
        this.value = 0;
        this.emit("reduced", n);
        return n;
    }
    maximise() {
        const n = this.maxValue - this.value;
        this.value = this.maxValue;
        this.emit("increased", n);
        return n;
    }
    increase(n) {
        if (n < 0)
            throw new Error("Negative value passed into weaponIncrease method");
        n = ~~n;
        if (this.value + n > this.maxValue) {
            n = this.maxValue - this.value;
        }
        this.value += n;
        this.emit("increased", n);
        return n;
    }
    decrease(n) {
        if (n < 0)
            throw new Error("Negative value passed into weaponDecrease method");
        n = ~~n;
        if (this.value - n < 0) {
            n = this.value;
        }
        this.value -= n;
        this.emit("reduced", n);
        return n;
    }
    increaseMax(n) {
        n = ~~n;
        this.maxValue += n;
        this.emit("maxIncreased", n);
    }
    decreaseMax(n) {
        n = ~~n;
        const reducedAmount = Math.max(0, this.maxValue - n);
        this.maxValue -= n;
        if (this.maxValue < 0)
            this.maxValue = 0;
        if (this.value > this.maxValue)
            this.value = this.maxValue;
        this.emit("maxIncreased", reducedAmount);
    }
    applyGain() {
        return this.increase(this.gain);
    }
    get Value() {
        return this.value;
    }
    get MaxValue() {
        return this.maxValue;
    }
    get Gain() {
        return this.gain;
    }
}
function battleStat(start, max, gain) {
    return new BattleshipStat(start, max, gain);
}
exports.battleStat = battleStat;
//# sourceMappingURL=BattleshipStat.js.map