import { Asteroid } from "./Asteroid";

class MutableAsteroid extends Asteroid implements IMutableAsteroid {
    constructor(asteroid: Asteroid, tags: Set<string>) {
        super({ data: asteroid }, 0, false, "", tags);
    }

    /**
     * Modifies the collection, applying a random percent change to the values
     * of the collection. Makes the collection more dynamic.
     * @param percent should be entered as '20' for 20%, not 0.2.
     */
    public applyDeviation(percent: number): void {
        let mean = ~~(this.CollectionSize / this.size),
            deviation = Math.ceil(mean * (percent / 100)),
            max = mean + deviation,
            min = mean - deviation > 0 ? mean - deviation : 0;
        this.forEach((el, key) => {
            const NewAmount = el + Math.ceil(Math.random() * (max - min) - (max - min) / 2);
            if (el != 0) this.set(key, NewAmount);
        });
    }

    /**
     * modifies the collection by a certain factor
     * @param multiplier the factor to multiply by. Enter a number like **1.2** to
     * increase the asteroid by a factor of 1.2.
     */
    public buffCollection(multiplier: number) {
        this.forEach((val, key) => {
            this.set(key, val * multiplier);
        });
    }
}

export function CreateMutable(asteroid: Asteroid, tags: Set<string>): IMutableAsteroid {
    return new MutableAsteroid(asteroid, tags);
}

export interface AttachmentAsteroid {
    buffCollection(multiplier: number): void;
    hasTag(tag: string): boolean;
}

export interface IMutableAsteroid extends AttachmentAsteroid, Map<string, number> {
    applyDeviation(percent: number): void;
}
