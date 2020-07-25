import { EventEmitter } from "events";

class BattleshipStat extends EventEmitter implements IBattleshipStat {
    private value: number;
    private maxValue: number;
    private gain: number;

    constructor(start: number, max: number, gain: number) {
        super();
        this.value = start;
        this.maxValue = max;
        this.gain = gain;
    }
    public minimise(): number {
        const n = this.value;
        this.value = 0;
        this.emit("reduced", n);
        return n;
    }

    public maximise(): number {
        const n = this.maxValue - this.value;
        this.value = this.maxValue;
        this.emit("increased", n);
        return n;
    }

    public increase(n: number): number {
        if (n < 0) throw new Error("Negative value passed into weaponIncrease method");
        n = ~~n;
        if (this.value + n > this.maxValue) {
            n = this.maxValue - this.value;
        }
        this.value += n;
        this.emit("increased", n);
        return n;
    }

    public decrease(n: number): number {
        if (n < 0) throw new Error("Negative value passed into weaponDecrease method");
        n = ~~n;
        if (this.value - n < 0) {
            n = this.value;
        }
        this.value -= n;
        this.emit("reduced", n);
        return n;
    }

    public increaseMax(n: number) {
        n = ~~n;
        this.maxValue += n;
        this.emit("maxIncreased", n);
    }

    public decreaseMax(n: number) {
        n = ~~n;
        const reducedAmount = Math.max(0, this.maxValue - n);
        this.maxValue -= n;
        if (this.maxValue < 0) this.maxValue = 0;
        if (this.value > this.maxValue) this.value = this.maxValue;
        this.emit("maxIncreased", reducedAmount);
    }

    public applyGain(): number {
        return this.increase(this.gain);
    }

    public get Value(): number {
        return this.value;
    }
    public get MaxValue(): number {
        return this.maxValue;
    }
    public get Gain(): number {
        return this.gain;
    }
}

export function battleStat(start: number, max: number, gain: number): IBattleshipStat {
    return new BattleshipStat(start, max, gain);
}

export interface IBattleshipStat {
    maximise(): number;
    minimise(): number;
    increase(n: number): number;
    decrease(n: number): number;
    increaseMax(n: number): void;
    decreaseMax(n: number): void;

    applyGain(): number;

    Value: number;
    MaxValue: number;

    on(event: "increased", listener: (value: number) => void): void;
    on(event: "decreased", listener: (value: number) => void): void;
    on(event: "maxIncreased", listener: (value: number) => void): void;
    on(event: "maxDecreased", listener: (value: number) => void): void;
}
