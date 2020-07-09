import { IGenerationOptions } from "../../GameCollections/GameCollectionBase";
import { MaterialCollection } from "../../GameCollections/MaterialCollection";
export declare class Blueprint extends MaterialCollection {
    private seed;
    constructor(materials: Map<string, number>, key?: string);
    RandomNumber(): number;
    private predictableRandom;
}
export declare class BlueprintBuilder {
    ManualBuild(data: Map<string, number>): Blueprint;
    AutoBuild(options: IGenerationOptions): Blueprint;
    /**
     * Will produce a random blueprint, that can be repeatedly produced with the same key and options.
     * I.e. calling DefinedBuild with the same options and key will always result in the same blueprint.
     * The key is hashed, and then that number is used as a seed in a random generator in order to
     * produce random but repeatable results.
     * @param options the options required to activate the collection generator
     * @param key the unique key for this blueprint
     */
    DefinedBuild(options: IGenerationOptions, key: string): Blueprint;
    static SIMPLE_BUILD(val: number): IGenerationOptions;
    static MODERATE_BUILD(val: number): IGenerationOptions;
    static ADVANCED_BUILD(val: number): IGenerationOptions;
}
