export declare class util {
    static hashCode(str: string): number;
    static seededRandom(min: number, max: number, seed: number): number;
    private static currentSeed;
    static seededGenerator(seed?: number): Generator<number, void, unknown>;
    /**
     * Generates a random number between min and max (inclusive)
     * @param min minimum number
     * @param max maximum number
     */
    static randBetween(min: number, max: number): number;
    static chooseFrom<T>(arr: T[]): {
        item: T;
        index: number;
    };
    static chooseFromSeeded<T>(arr: T[], seed: number): {
        item: T;
        index: number;
    };
    static throwUndefined<K>(variable: K | undefined, message?: string): K;
}
