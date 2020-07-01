"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Registry = void 0;
const Ship_1 = require("../GameTypes/GameAsset/Buildable/Ship/Ship");
const Collections_1 = require("../Extensions/Collections");
class Registry {
    constructor(copyReg) {
        this.maxRarity = 1;
        //#region - Defaults
        this.defaultShip = BlankShip;
        this.defaultCredits = 0;
        //#endregion - Defaults
        //#region - Registries
        this.shipRegistry = new Collections_1.MapCollection();
        this.attachmentRegistry = new Collections_1.MapCollection();
        this.factionRegistry = new Collections_1.MapCollection();
        this.materialRegistry = new Collections_1.MapCollection();
        this.mineableMaterialRegistry = new Collections_1.MapCollection();
        this.sellableMaterialRegistry = new Collections_1.MapCollection();
        if (copyReg) {
            this.shipRegistry = new Collections_1.MapCollection(copyReg.shipRegistry);
            this.attachmentRegistry = new Collections_1.MapCollection(copyReg.attachmentRegistry);
            this.factionRegistry = new Collections_1.MapCollection(copyReg.factionRegistry);
            this.materialRegistry = new Collections_1.MapCollection(copyReg.materialRegistry);
        }
    }
    get MaxRarity() {
        return this.maxRarity;
    }
    set MaxRarity(v) {
        this.maxRarity = v;
    }
    get DefaultShip() {
        return this.defaultShip;
    }
    set DefaultShip(value) {
        if (this.defaultShip == BlankShip)
            throw new Error("Default ship has already been set. It can only be set once. If this was intentional, use the 'ForceChangeDefaultShip()' method.");
        this.defaultShip = value;
    }
    set ForceChangeDefaultShip(value) {
        this.defaultShip = value;
    }
    get DefaultCredits() {
        return this.defaultCredits;
    }
    set DefaultCredits(value) {
        if (this.defaultCredits != 0)
            throw new Error("Default credits has already been set. It can only be set once. If this was intentional, use the 'ForceChangeDefaultCredits()' method.");
        this.defaultCredits = value;
    }
    set ForceChangeDefaultCredits(value) {
        this.defaultCredits = value;
    }
    get ShipRegistry() {
        return this.shipRegistry;
    }
    get AttachmentRegistry() {
        return this.attachmentRegistry;
    }
    get FactionRegistry() {
        return this.factionRegistry;
    }
    get MaterialRegistry() {
        return this.materialRegistry;
    }
    get MineableMaterialRegistry() {
        return this.mineableMaterialRegistry;
    }
    get SellableMaterialRegistry() {
        return this.sellableMaterialRegistry;
    }
    //#endregion - Registries
    //#region - Register Methods
    RegisterShips(data) {
        data.ships.forEach((ship) => {
            this.shipRegistry.set(ship.Name, ship);
        });
        return this;
    }
    RegisterAttachments(data) {
        data.attachments.forEach((attachment) => {
            this.attachmentRegistry.set(attachment.Name, attachment);
        });
        return this;
    }
    RegisterFactions(data) {
        data.factions.forEach((faction) => {
            this.factionRegistry.set(faction.Name, faction);
        });
        return this;
    }
    RegisterMaterials(data) {
        data.materials.forEach((material) => {
            this.materialRegistry.set(material.Name, material); //add to complete registry
            if (material.IsMineable())
                this.mineableMaterialRegistry.set(material.Name, material); //if mineable, add to mineable registry too
        });
        return this;
    }
    //#endregion - Register Methods
    //#region - Resolution Methods
    ResolveShipFromName(name) {
        const result = this.NameResolver(name, this.ShipRegistry);
        if (!result)
            return undefined;
        return result;
    }
    ResolveAttachmentFromName(name) {
        const result = this.NameResolver(name, this.AttachmentRegistry);
        if (!result)
            return undefined;
        return result;
    }
    ResolveMaterialFromName(name) {
        const result = this.NameResolver(name, this.MaterialRegistry);
        if (!result)
            return undefined;
        return result;
    }
    ResolveFactionFromName(name) {
        const result = this.NameResolver(name, this.FactionRegistry);
        if (!result)
            return undefined;
        return result;
    }
    /**
     * @param T the type of object that should be resolved
     * @param name the string name of the object
     * @param registry the registry to search
     */
    NameResolver(name, registry) {
        return registry.get(name);
    }
    AnyResolve(name) {
        return this.materialRegistry.get(name) ?? this.attachmentRegistry.get(name) ?? this.factionRegistry.get(name) ?? this.shipRegistry.get(name);
    }
}
exports.Registry = Registry;
const BlankShip = new Ship_1.Ship({ name: "No default ship", description: "There is no default ship assigned." });
