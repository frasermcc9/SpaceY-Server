import { Asteroid } from "./Asteroid";
import { MaterialCollection } from "../GameCollections/MaterialCollection";

class MutableAsteroid implements IMutableAsteroid {
    constructor(asteroid: Asteroid, tags: Set<string>) {
        this.asteroid = new MaterialCollection({ data: asteroid });
        this.tags = tags;
    }
    private tags: Set<string>;
    private asteroid: MaterialCollection;

    /**
     * Modifies the collection, applying a random percent change to the values
     * of the collection. Makes the collection more dynamic.
     * @param percent should be entered as '20' for 20%, not 0.2.
     */
    public applyDeviation(percent: number): void {
        let mean = ~~(this.asteroid.CollectionSize / this.asteroid.size),
            deviation = Math.ceil(mean * (percent / 100)),
            max = mean + deviation,
            min = mean - deviation > 0 ? mean - deviation : 0;
        this.asteroid.forEach((el, key) => {
            const NewAmount = el + Math.ceil(Math.random() * (max - min) - (max - min) / 2);
            if (el != 0) this.asteroid.set(key, NewAmount);
        });
    }

    /**
     * modifies the collection by a certain factor
     * @param multiplier the factor to multiply by. Enter a number like **1.2** to
     * increase the asteroid by a factor of 1.2.
     */
    public buffCollection(multiplier: number) {
        this.asteroid.forEach((val, key) => {
            this.asteroid.set(key, val * multiplier);
        });
    }

    getCollection() {
        return this.asteroid;
    }
    getSize() {
        return this.asteroid.CollectionSize;
    }

    public hasTag(tag: string): boolean {
        return this.tags.has(tag);
    }
}

export function CreateMutable(asteroid: Asteroid, tags: Set<string>): IMutableAsteroid {
    return new MutableAsteroid(asteroid, tags);
}

export interface AttachmentAsteroid {
    buffCollection(multiplier: number): void;
    hasTag(tag: string): boolean;
}

export interface IMutableAsteroid extends AttachmentAsteroid {
    applyDeviation(percent: number): void;
    getCollection(): MaterialCollection;
    getSize(): number;
}
