"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarpPower = exports.SpacemapNodeBuilder = exports.SpacemapNode = void 0;
const BaseStore_1 = require("../GameStore/BaseStore");
const util_1 = require("../../Util/util");
class SpacemapNode {
    constructor({ name, faction, requiredWarp, stores, techLevel, asteroids, imageUri }) {
        this.name = name;
        this.faction = faction;
        this.requiredWarp = requiredWarp;
        this.stores = stores;
        this.techLevel = techLevel ?? 0;
        this.asteroids = asteroids;
        this.imageUri = imageUri;
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
    get ImageUri() {
        return this.imageUri;
    }
    //#endregion - Gets
    //#region - Asteroids
    get Asteroids() {
        return this.asteroids;
    }
    asteroidDisplayNames() {
        return this.asteroids.map((A) => A.Name);
    }
    availableAsteroids(player) {
        return this.asteroids.filter((val) => val.isAvailableForUser(player));
    }
    unavailableAsteroids(player) {
        return this.asteroids.filter((val) => !val.isAvailableForUser(player));
    }
    addAsteroid(asteroid) {
        this.asteroids.push(asteroid);
    }
    async mineAsteroid(player, asteroidName) {
        const asteroid = util_1.util.throwUndefined(this.asteroids.find((A) => A.Name == asteroidName));
        const success = await asteroid.mine(player, 30);
        return success.code == 200;
    }
    //#endregion - Asteroids
    //#region - Stores
    addStore(store) {
        store.setFaction(this.faction);
        this.stores.push(store);
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
    constructor({ name, faction, requiredWarp, img, tech, }) {
        this.stores = [];
        this.asteroids = [];
        this.name = name;
        this.faction = faction;
        this.requiredWarp = requiredWarp;
        this.imageUri = img;
        this.techLevel = tech;
    }
    setImage(uri) {
        this.imageUri = uri;
        return this;
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
            imageUri: this.imageUri,
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
//# sourceMappingURL=SpacemapNode.js.map