"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Setup = void 0;
const Client_1 = require("./Client");
const Spacemap_1 = require("../GameTypes/GameSpacemap/Spacemap");
const util_1 = require("../Util/util");
const Database_1 = require("../GameApi/Database/Database");
class Setup {
    setupClient(settings) {
        Client_1.Client.Create(settings);
        return new MaterialsAdder();
    }
    static begin() {
        return new Setup();
    }
}
exports.Setup = Setup;
class MaterialsAdder {
    addMaterials(materials) {
        Client_1.Client.Reg.RegisterMaterials({ materials: materials });
        return new ShipAdder();
    }
}
class ShipAdder {
    addShips(ships) {
        Client_1.Client.Reg.RegisterShips({ ships: ships });
        return new AttachmentAdder();
    }
}
class AttachmentAdder {
    addAttachments(attachments) {
        Client_1.Client.Reg.RegisterAttachments({ attachments: attachments });
        return new FactionAdder();
    }
}
class FactionAdder {
    addFactions(factions) {
        Client_1.Client.Reg.RegisterFactions({ factions: factions });
        return new LocationAdder();
    }
}
class LocationAdder {
    addLocations(locations) {
        Client_1.Client.Reg.registerSpacemap(new Spacemap_1.Spacemap());
        Client_1.Client.Reg.Spacemap.addNodes(locations);
        return new LinkAdder();
    }
}
class LinkAdder {
    addLink(a, b) {
        Client_1.Client.Reg.Spacemap.addLink(a, b);
        return this;
    }
    finishMap() {
        return new Defaults();
    }
}
class Defaults {
    defaultCredits(n) {
        Client_1.Client.Reg.DefaultCredits = n;
        return this;
    }
    maxMaterialRarity(n) {
        Client_1.Client.Reg.MaxRarity = n;
        return this;
    }
    maxTechLevel(n) {
        Client_1.Client.Reg.MaxTech = n;
        return this;
    }
    defaultShip(n) {
        const ship = Client_1.Client.Reg.ResolveShipFromName(n);
        Client_1.Client.Reg.DefaultShip = util_1.util.throwUndefined(ship, "Default ship used is invalid");
        return this;
    }
    defaultLocation(n) {
        const location = Client_1.Client.Reg.Spacemap.resolveNodeFromName(n);
        Client_1.Client.Reg.DefaultLocation = util_1.util.throwUndefined(location, "Default location used is invalid.");
        return this;
    }
    defaultAsteroidCooldown(seconds) {
        Client_1.Client.Reg.DefaultAsteroidCooldown = seconds;
        return this;
    }
    finish() {
        Database_1.connect();
        return;
    }
}
