import { IGenerationOptions } from "../../GameCollections/GameCollectionBase";
import { MaterialCollection } from "../../GameCollections/MaterialCollection";
import { util } from "../../../Util/util";

export class Blueprint extends MaterialCollection {
    private seed: number | undefined;
    private yields: number;
    public constructor({ materials, key, yields }: { materials: Map<string, number>; key?: string; yields?: number }) {
        super({ data: materials });
        if (key) this.seed = util.hashCode(key);
        this.yields = yields ?? 1;
    }

    public RandomNumber(): number {
        return Math.abs(this.predictableRandom(0, 1));
    }

    private predictableRandom(min: number, max: number) {
        if (this.seed == undefined) throw new TypeError("Undefined seed for building defined blueprint.");
        max = max ?? 1;
        min = min ?? 0;
        this.seed = (this.seed * 9301 + 49297) % 233280;
        var rnd = this.seed / 233280;
        return min + rnd * (max - min);
    }

    public get Yield() {
        return this.yields;
    }
}

export class BlueprintBuilder {
    private yields?: number;
    constructor(yields?: number) {
        this.yields = yields;
    }
    public ManualBuild(data: Map<string, number>): Blueprint {
        return new Blueprint({ materials: data, yields: this.yields });
    }
    public AutoBuild(options: IGenerationOptions): Blueprint {
        return new Blueprint({ materials: new MaterialCollection().GenerateCollection(options), yields: this.yields });
    }
    /**
     * Will produce a random blueprint, that can be repeatedly produced with the same key and options.
     * I.e. calling DefinedBuild with the same options and key will always result in the same blueprint.
     * The key is hashed, and then that number is used as a seed in a random generator in order to
     * produce random but repeatable results.
     * @param options the options required to activate the collection generator
     * @param key the unique key for this blueprint
     */
    public DefinedBuild(options: IGenerationOptions, key: string): Blueprint {
        const bp = new Blueprint({ materials: new Map<string, number>(), key: key, yields: this.yields });
        bp.GenerateCollection(options);
        return bp;
    }

    public static SIMPLE_BUILD(val: number): IGenerationOptions {
        return { value: val, rarity: true, minRarity: 0, maxRarity: 6, centralRarity: 3, minTech: 0, maxTech: 5 };
    }
    public static MODERATE_BUILD(val: number): IGenerationOptions {
        return { value: val, rarity: true, minRarity: 0, maxRarity: 8, centralRarity: 5, minTech: 0, maxTech: 8 };
    }
    public static ADVANCED_BUILD(val: number): IGenerationOptions {
        return { value: val, rarity: true, minRarity: 0, maxRarity: 10, centralRarity: 7, minTech: 0, maxTech: 10 };
    }
}
