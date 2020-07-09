"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarpPower = exports.SpacemapNodeBuilder = exports.SpacemapNode = void 0;
const BaseStore_1 = require("../GameStore/BaseStore");
class SpacemapNode {
    constructor({ name, faction, requiredWarp, stores, techLevel, asteroids }) {
        this.name = name;
        this.faction = faction;
        this.requiredWarp = requiredWarp;
        this.stores = stores;
        this.techLevel = techLevel ?? 0;
        this.asteroids = asteroids;
    }
    toString() {
        return `${this.faction.Name}: ${this.name}`;
    }
    //#region - Gets
    get Name() {
        return this.name;
    }
    get Faction() {
        return this.faction;
    }
    get RequiredWarp() {
        return this.requiredWarp;
    }
    get TechLevel() {
        return this.techLevel;
    }
    //#endregion - Gets
    //#region - Asteroids
    get Asteroids() {
        return this.asteroids;
    }
    availableAsteroids(player) {
        return this.asteroids.filter((val) => val.isAvailableForUser(player));
    }
    //#endregion - Asteroids
    //#region - Stores
    addStore(store) {
        store.setFaction(this.faction);
        this.stores.push(store);
    }
    addAsteroid(asteroid) {
        this.asteroids.push(asteroid);
    }
    storeDisplayNames() {
        return this.stores.map((el) => el.identity());
    }
    nodeAllStores() {
        return this.stores;
    }
    nodeMaterialStores() {
        return this.stores.filter((el) => el.isType(BaseStore_1.StoreType.MATERIAL_STORE));
    }
    nodeShipStores() {
        return this.stores.filter((el) => el.isType(BaseStore_1.StoreType.SHIP_STORE));
    }
    nodeAttachmentStores() {
        return this.stores.filter((el) => el.isType(BaseStore_1.StoreType.ATTACHMENT_STORE));
    }
}
exports.SpacemapNode = SpacemapNode;
class SpacemapNodeBuilder {
    constructor({ name, faction, requiredWarp }) {
        this.stores = [];
        this.asteroids = [];
        this.name = name;
        this.faction = faction;
        this.requiredWarp = requiredWarp;
    }
    addStore(store) {
        store.setFaction(this.faction);
        this.stores.push(store);
        return this;
    }
    addAsteroid(asteroid) {
        this.asteroids.push(asteroid);
        return this;
    }
    build() {
        return new SpacemapNode({
            name: this.name,
            faction: this.faction,
            requiredWarp: this.requiredWarp,
            stores: this.stores,
            techLevel: this.techLevel,
            asteroids: this.asteroids,
        });
    }
}
exports.SpacemapNodeBuilder = SpacemapNodeBuilder;
var WarpPower;
(function (WarpPower) {
    WarpPower[WarpPower["NONE"] = 0] = "NONE";
    WarpPower[WarpPower["LOW"] = 1] = "LOW";
    WarpPower[WarpPower["MODERATE"] = 2] = "MODERATE";
    WarpPower[WarpPower["HIGH"] = 3] = "HIGH";
})(WarpPower = exports.WarpPower || (exports.WarpPower = {}));
