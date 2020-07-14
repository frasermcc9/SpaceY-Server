"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsteroidBuilder = exports.Asteroid = void 0;
const MaterialCollection_1 = require("../GameCollections/MaterialCollection");
const Client_1 = require("../../Client/Client");
class Asteroid extends MaterialCollection_1.MaterialCollection {
    constructor(options, cooldown = Client_1.Client.Reg.DefaultAsteroidCooldown, autoCd, name, tags) {
        super(options);
        this.timeoutMap = new Map();
        this.timeoutIntervals = new Set();
        this.tags = new Set();
        this.cooldown = cooldown;
        this.autoCd = autoCd;
        this.name = name;
        this.tags = tags;
    }
    /**
     * Asynchronously adds and then removes players from the cooldown map after
     * the duration provided. Stores the player uid for the timeout, and keeps
     * track of the time it was added.
     * @param player the player to add to the timeout
     * @param cooldown the duration (in seconds) of the cooldown (optional)
     */
    cooldownManager(player, cooldown = this.cooldown) {
        this.timeoutMap.set(player.UId, Date.now());
        this.timeoutIntervals.add(setTimeout(() => {
            this.timeoutMap.delete(player.UId);
        }, 1000 * cooldown));
    }
    /**
     * Finds the time remaining for a given player's cooldown, in seconds. Will
     * return 0 if they are not in the timeout map/
     * @param player the player to query.
     * @returns time in seconds (rounded to nearest second) remaining.
     */
    remainingCooldown(player) {
        const now = Date.now(), started = this.timeoutMap.get(player.UId) ?? now, inMap = (started - now) / 1000;
        if (started == now)
            return 0;
        return Math.floor(this.cooldown + inMap);
    }
    isAvailableForUser(player) {
        return this.remainingCooldown(player) == 0;
    }
    /**
     *
     * @param player
     * @param percent
     * @param cooldownOverride
     * @returns codes:<br />  \
     * 200 - success<br />  \
     * 403 - on cooldown
     */
    async mine(player, percent, cooldownOverride) {
        if (this.autoCd)
            this.cooldown = Client_1.Client.Reg.DefaultAsteroidCooldown;
        //check cooldown
        const cd = this.remainingCooldown(player);
        if (cd > 0 && !cooldownOverride)
            return { code: 403, cooldown: cd };
        //apply probabilities
        if (percent != undefined)
            this.applyDeviation(percent);
        //apply mining laser
        player.getShipWrapper().mineEvent(this);
        //set cooldown
        this.cooldownManager(player, this.cooldown);
        //add to player
        await player.InventorySum("materials", this);
        return { code: 200 };
    }
    clearCooldowns() {
        this.timeoutMap.clear();
        this.timeoutIntervals.forEach((el) => clearTimeout(el));
    }
    /**
     * Mines the collection without saving it to the database. The save method
     * must be called manually in order to save the materials.
     * @param player the player that mined the collection
     * @internal
     */
    PlayerMine(player) {
        player.Inventory.Materials.SumCollection(this);
    }
    /**
     * Mines the collection and saves its contents to the players inventory.
     * @param player the player that mined the collection
     * @internal
     */
    PlayerMineAndSave(player) {
        player.InventorySum("materials", this);
    }
    /**
     * Modifies the collection, applying a random percent change to the values
     * of the collection. Makes the collection more dynamic.
     * @param percent should be entered as '20' for 20%, not 0.2.
     * @internal
     */
    applyDeviation(percent) {
        let mean = ~~(this.CollectionSize / this.size), deviation = Math.ceil(mean * (percent / 100)), max = mean + deviation, min = mean - deviation > 0 ? mean - deviation : 0;
        this.forEach((el, key) => {
            const NewAmount = el + Math.ceil(Math.random() * (max - min) - (max - min) / 2);
            if (el != 0)
                this.set(key, NewAmount);
        });
    }
    get Name() {
        return this.name;
    }
    hasTag(tag) {
        return this.tags.has(tag);
    }
}
exports.Asteroid = Asteroid;
class AsteroidBuilder {
    constructor(name) {
        this.autoCooldown = true;
        /**Tags are for use with attachments, if you want to make certain
         * attachments give bonuses to asteroids with particular tags. */
        this.tags = new Set();
        this.name = name;
    }
    setCooldown(seconds) {
        this.autoCooldown = false;
        this.cooldown = seconds;
        return this;
    }
    addTag(tag) {
        this.tags.add(tag);
    }
    BuildRandom({ value }) {
        if (value < 0 && Client_1.Client.Get().ConsoleLogging)
            console.warn("Negative asteroid value passed.");
        const collection = MaterialCollection_1.MaterialCollection.GenerateMineableCollection(value);
        return new Asteroid({ data: collection }, this.cooldown, this.autoCooldown, this.name, this.tags);
    }
    BuildCustom(materialCollection) {
        return new Asteroid(materialCollection, this.cooldown, this.autoCooldown, this.name, this.tags);
    }
}
exports.AsteroidBuilder = AsteroidBuilder;
