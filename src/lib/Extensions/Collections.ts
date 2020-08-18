import { util } from "../Util/util";

export class MapCollection<K, V> extends Map<K, V> {
    private _array!: V[] | null;
    private _keyArray!: K[] | null;

    public set(key: K, value: V): this {
        this._array = null;
        this._keyArray = null;
        return super.set(key, value);
    }
    public delete(key: K): boolean {
        this._array = null;
        this._keyArray = null;
        return super.delete(key);
    }

    /**
     * Obtains unique random value(s) from this collection. This relies on {@link Collection#array}, and thus the caching
     * mechanism applies here as well.
     * @param {number} [amount] Amount of values to obtain randomly
     * @returns {*|Array<*>} A single value if no amount is provided or an array of values
     */
    public random(): V;
    public random(amount: number): V[];
    public random(amount?: number): V | V[] {
        let arr = this.array();
        if (typeof amount === "undefined") return arr[Math.floor(Math.random() * arr.length)];
        if (arr.length === 0 || !amount) return [];
        arr = arr.slice();
        return Array.from({ length: amount }, (): V => arr.splice(Math.floor(Math.random() * arr.length), 1)[0]);
    }

    public seededRandom(seed: number): V;
    public seededRandom(seed: number, amount: number): V[];
    public seededRandom(seed: number, amount?: number): V | V[] {
        let arr = this.array();
        if (typeof amount === "undefined") return util.chooseFromSeeded<V>(arr, seed).item;
        if (arr.length === 0 || !amount) return [];
        arr = arr.slice();
        return Array.from(
            { length: amount },
            (): V => arr.splice(Math.floor(util.seededRandom(0, 1, seed) * arr.length), 1)[0]
        );
    }

    /**
     * Obtains unique random key(s) from this collection. This relies on {@link Collection#keyArray}, and thus the caching
     * mechanism applies here as well.
     * @param {number} [amount] Amount of keys to obtain randomly
     * @returns {*|Array<*>} A single key if no amount is provided or an array
     */
    public randomKey(): K;
    public randomKey(amount: number): K[];
    public randomKey(amount?: number): K | K[] {
        let arr = this.keyArray();
        if (typeof amount === "undefined") return arr[Math.floor(Math.random() * arr.length)];
        if (arr.length === 0 || !amount) return [];
        arr = arr.slice();
        return Array.from({ length: amount }, (): K => arr.splice(Math.floor(Math.random() * arr.length), 1)[0]);
    }

    /**
     * Creates an ordered array of the values of this collection, and caches it internally. The array will only be
     * reconstructed if an item is added to or removed from the collection, or if you change the length of the array
     * itself. If you don't want this caching behavior, use `[...collection.values()]` or
     * `Array.from(collection.values())` instead.
     * @returns {Array}
     */
    public array(): V[] {
        if (!this._array || this._array.length !== this.size) this._array = [...this.values()];
        return this._array;
    }

    /**
     * Creates an ordered array of the keys of this collection, and caches it internally. The array will only be
     * reconstructed if an item is added to or removed from the collection, or if you change the length of the array
     * itself. If you don't want this caching behavior, use `[...collection.keys()]` or
     * `Array.from(collection.keys())` instead.
     * @returns {Array}
     */
    public keyArray(): K[] {
        if (!this._keyArray || this._keyArray.length !== this.size) this._keyArray = [...this.keys()];
        return this._keyArray;
    }

    /**
     * Maps each item to another value into an array. Identical in behavior to
     * [Array.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map).
     * @param {Function} fn Function that produces an element of the new array, taking three arguments
     * @param {*} [thisArg] Value to use as `this` when executing function
     * @returns {Array}
     * @example collection.map(user => user.tag);
     */
    public map<T>(fn: (value: V, key: K, collection: this) => T): T[];
    public map<This, T>(fn: (this: This, value: V, key: K, collection: this) => T, thisArg: This): T[];
    public map<T>(fn: (value: V, key: K, collection: this) => T, thisArg?: unknown): T[] {
        if (typeof thisArg !== "undefined") fn = fn.bind(thisArg);
        const iter = this.entries();
        return Array.from(
            { length: this.size },
            (): T => {
                const [key, value] = iter.next().value;
                return fn(value, key, this);
            }
        );
    }

    public filter(fn: (value: V, key: K, collection: this) => boolean): this;
    public filter<T>(fn: (this: T, value: V, key: K, collection: this) => boolean, thisArg: T): this;
    public filter(fn: (value: V, key: K, collection: this) => boolean, thisArg?: unknown): this {
        if (typeof thisArg !== "undefined") fn = fn.bind(thisArg);
        const results = new MapCollection<K, V>() as this;
        for (const [key, val] of this) {
            if (fn(val, key, this)) results.set(key, val);
        }
        return results;
    }

    /**
     * Applies a function to produce a single value. Identical in behavior to
     * [Array.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce).
     * @param {Function} fn Function used to reduce, taking four arguments; `accumulator`, `currentValue`, `currentKey`,
     * and `collection`
     * @param {*} [initialValue] Starting value for the accumulator
     * @returns {*}
     * @example collection.reduce((acc, guild) => acc + guild.memberCount, 0);
     */
    public reduce<T>(fn: (accumulator: T, value: V, key: K, collection: this) => T, initialValue?: T): T {
        let accumulator!: T;

        if (typeof initialValue !== "undefined") {
            accumulator = initialValue;
            for (const [key, val] of this) accumulator = fn(accumulator, val, key, this);
            return accumulator;
        }
        let first = true;
        for (const [key, val] of this) {
            if (first) {
                accumulator = (val as unknown) as T;
                first = false;
                continue;
            }
            accumulator = fn(accumulator, val, key, this);
        }

        // No items iterated.
        if (first) {
            throw new TypeError("Reduce of empty collection with no initial value");
        }

        return accumulator;
    }

    /**
     * The sort method sorts the items of a collection in place and returns it.
     * The sort is not necessarily stable. The default sort order is according to string Unicode code points.
     * @param {Function} [compareFunction] Specifies a function that defines the sort order.
     * If omitted, the collection is sorted according to each character's Unicode code point value,
     * according to the string conversion of each element.
     * @returns {Collection}
     * @example collection.sort((userA, userB) => userA.createdTimestamp - userB.createdTimestamp);
     */
    public sort(
        compareFunction: (firstValue: V, secondValue: V, firstKey: K, secondKey: K) => number = (x, y): number =>
            Number(x > y) || Number(x === y) - 1
    ): this {
        const entries = [...this.entries()];
        entries.sort((a, b): number => compareFunction(a[1], b[1], a[0], b[0]));

        // Perform clean-up
        super.clear();
        this._array = null;
        this._keyArray = null;

        // Set the new entries
        for (const [k, v] of entries) {
            super.set(k, v);
        }
        return this;
    }
}
export class UniqueCollection<K> extends Set<K> {}
