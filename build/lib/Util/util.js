"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.util = void 0;
class util {
    static hashCode(str) {
        var hash = 0, i, chr;
        for (i = 0; i < str.length; i++) {
            chr = str.charCodeAt(i);
            hash = (hash << 5) - hash + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }
    static seededRandom(min, max, seed) {
        max = max || 1;
        min = min || 0;
        seed = (seed * 9301 + 49297) % 233280;
        var rnd = seed / 233280;
        return min + rnd * (max - min);
    }
    static *seededGenerator(seed) {
        for (;;) {
            if (seed != undefined)
                util.currentSeed = seed;
            util.currentSeed = (util.currentSeed * 9301 + 49297) % 233280;
            yield util.currentSeed / 233280;
        }
    }
    /**
     * Generates a random number between min and max (inclusive)
     * @param min minimum number
     * @param max maximum number
     */
    static randBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    static chooseFrom(arr) {
        let i = Math.floor(Math.random() * arr.length);
        var a = {
            item: arr[i],
            index: i,
        };
        return a;
    }
    static chooseFromSeeded(arr, seed) {
        seed = Math.abs(seed);
        let i = Math.round(this.seededRandom(0, arr.length - 1, seed));
        var a = {
            item: arr[i],
            index: i,
        };
        return a;
    }
    static throwUndefined(variable, message) {
        if (variable == undefined)
            throw new Error(message ?? `Variable ${variable} is undefined`);
        return variable;
    }
}
exports.util = util;
util.currentSeed = 0;
//# sourceMappingURL=util.js.map