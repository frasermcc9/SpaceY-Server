"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlueprintBuilder = exports.Blueprint = void 0;
const MaterialCollection_1 = require("../../GameCollections/MaterialCollection");
const util_1 = require("../../../Util/util");
class Blueprint extends MaterialCollection_1.MaterialCollection {
    constructor(materials, key) {
        super({ data: materials });
        if (key)
            this.seed = util_1.util.hashCode(key);
    }
    RandomNumber() {
        return Math.abs(this.predictableRandom(0, 1));
    }
    predictableRandom(min, max) {
        if (this.seed == undefined)
            throw new TypeError("Undefined seed for building defined blueprint.");
        max = max ?? 1;
        min = min ?? 0;
        this.seed = (this.seed * 9301 + 49297) % 233280;
        var rnd = this.seed / 233280;
        return min + rnd * (max - min);
    }
}
exports.Blueprint = Blueprint;
class BlueprintBuilder {
    ManualBuild(data) {
        return new Blueprint(data);
    }
    AutoBuild(options) {
        return new Blueprint(new MaterialCollection_1.MaterialCollection().GenerateCollection(options));
    }
    /**
     * Will produce a random blueprint, that can be repeatedly produced with the same key and options.
     * I.e. calling DefinedBuild with the same options and key will always result in the same blueprint.
     * The key is hashed, and then that number is used as a seed in a random generator in order to
     * produce random but repeatable results.
     * @param options the options required to activate the collection generator
     * @param key the unique key for this blueprint
     */
    DefinedBuild(options, key) {
        const bp = new Blueprint(new Map(), key);
        bp.GenerateCollection(options);
        return bp;
    }
    static SIMPLE_BUILD(val) {
        return { value: val, rarity: true, minRarity: 0, maxRarity: 6, centralRarity: 3 };
    }
    static MODERATE_BUILD(val) {
        return { value: val, rarity: true, minRarity: 0, maxRarity: 8, centralRarity: 5 };
    }
    static ADVANCED_BUILD(val) {
        return { value: val, rarity: true, minRarity: 0, maxRarity: 10, centralRarity: 7 };
    }
}
exports.BlueprintBuilder = BlueprintBuilder;
