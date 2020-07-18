"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShipBuilder = exports.Ship = void 0;
const GameAsset_1 = require("../GameAsset");
const Attachment_1 = require("../Attachment/Attachment");
const Collections_1 = require("../../../Extensions/Collections");
class Ship extends GameAsset_1.GameAsset {
    constructor(options) {
        super(options);
        this.AttachmentCaps = new Collections_1.MapCollection();
        this.subclass = options.subclass ?? "";
        this.baseHp = options.baseHp ?? 0;
        this.baseShield = options.baseShield ?? 0;
        this.baseEnergy = options.baseEnergy ?? [0, 0, 0];
        this.baseCargo = options.baseCargo ?? 0;
        this.baseHandling = options.baseHandling ?? 0;
        this.AttachmentCaps.set(Attachment_1.AttachmentType.GENERAL, options.generalCap ?? 0)
            .set(Attachment_1.AttachmentType.HEAVY, options.heavyCap ?? 0)
            .set(Attachment_1.AttachmentType.MINER, options.minerCap ?? 0)
            .set(Attachment_1.AttachmentType.PRIMARY, options.primaryCap ?? 0)
            .set(Attachment_1.AttachmentType.SHIELD, options.shieldCap ?? 0);
        this.imageUri = options.imageUri ?? "";
        this.maxTech = [...this.AttachmentCaps.values()].reduce((acc, cur) => acc + cur, 0) * this.TechLevel + 3;
        this.strength = Math.round(
            (16000 * this.TechLevel +
                575 * this.baseHp +
                450 * this.baseShield +
                1500 * this.baseEnergy[0] +
                1500 * this.baseEnergy[1] +
                1500 * this.baseEnergy[2] +
                50 * this.baseCargo +
                12000 * this.baseHandling +
                25000 * (options.primaryCap ?? 0) +
                20000 * (options.shieldCap ?? 0) +
                15000 * (options.heavyCap ?? 0) +
                7000 * (options.minerCap ?? 0) +
                15000 * (options.generalCap ?? 0) +
                1000 * ([...this.AttachmentCaps.values()].reduce((acc, cur) => acc + cur, 0) * this.TechLevel + 3)) /
                1000
        );
    }
    stringify() {
        return JSON.stringify(this);
    }
    get Strength() {
        return this.strength;
    }
    get MaxTech() {
        return this.maxTech;
    }
    get ImageUri() {
        return this.imageUri;
    }
    get Subclass() {
        return this.subclass;
    }
    get WeaponCapacities() {
        return new Map(this.AttachmentCaps);
    }
    get ShipStatistics() {
        return {
            baseHp: this.baseHp,
            baseShield: this.baseShield,
            baseEnergy: this.baseEnergy.slice(),
            baseCargo: this.baseCargo,
            baseHandling: this.baseHandling,
        };
    }
}
exports.Ship = Ship;
class ShipBuilder {
    constructor(options) {
        this.options = options;
    }
    EnableSell(price) {
        this.options.cost = price;
        return this;
    }
    SetMisc({ uri, subclass }) {
        this.options.imageUri = uri;
        this.options.subclass = subclass;
        return this;
    }
    EnableBuildable(blueprint) {
        this.options.blueprint = blueprint;
        return this;
    }
    /* 	public SetTechLevel(techLevel: number): ShipBuilder {
        this.options.techLevel = techLevel;
        return this;
    } */
    SetStats(stats) {
        this.options.baseHp = stats.baseHp;
        this.options.baseShield = stats.baseShield;
        this.options.baseEnergy = stats.baseEnergy;
        this.options.baseCargo = stats.baseCargo;
        this.options.baseHandling = stats.baseHandling;
        return this;
    }
    SetWeapons(weapons) {
        this.options.primaryCap = weapons.primaryCap;
        this.options.shieldCap = weapons.shieldCap;
        this.options.heavyCap = weapons.heavyCap;
        this.options.minerCap = weapons.minerCap;
        this.options.generalCap = weapons.generalCap;
        return this;
    }
    Build() {
        return new Ship(this.options);
    }
}
exports.ShipBuilder = ShipBuilder;
