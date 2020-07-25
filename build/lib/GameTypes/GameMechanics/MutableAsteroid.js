"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMutable = void 0;
const Asteroid_1 = require("./Asteroid");
class MutableAsteroid extends Asteroid_1.Asteroid {
    constructor(asteroid, tags) {
        super({ data: asteroid }, 0, false, "", tags);
    }
    /**
     * Modifies the collection, applying a random percent change to the values
     * of the collection. Makes the collection more dynamic.
     * @param percent should be entered as '20' for 20%, not 0.2.
     */
    applyDeviation(percent) {
        let mean = ~~(this.CollectionSize / this.size), deviation = Math.ceil(mean * (percent / 100)), max = mean + deviation, min = mean - deviation > 0 ? mean - deviation : 0;
        this.forEach((el, key) => {
            const NewAmount = el + Math.ceil(Math.random() * (max - min) - (max - min) / 2);
            if (el != 0)
                this.set(key, NewAmount);
        });
    }
    /**
     * modifies the collection by a certain factor
     * @param multiplier the factor to multiply by. Enter a number like **1.2** to
     * increase the asteroid by a factor of 1.2.
     */
    buffCollection(multiplier) {
        this.forEach((val, key) => {
            this.set(key, val * multiplier);
        });
    }
}
function CreateMutable(asteroid, tags) {
    return new MutableAsteroid(asteroid, tags);
}
exports.CreateMutable = CreateMutable;
//# sourceMappingURL=MutableAsteroid.js.map