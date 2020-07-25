export declare function battleStat(start: number, max: number, gain: number): IBattleshipStat;
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
