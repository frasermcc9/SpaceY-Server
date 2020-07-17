"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Setup = void 0;
const Server_1 = require("./Server");
const Spacemap_1 = require("../GameTypes/GameSpacemap/Spacemap");
const util_1 = require("../Util/util");
const Database_1 = require("../Database/Database");
class Setup {
    setupClient(settings) {
        Server_1.Server.Create(settings);
        return new MaterialsAdder();
    }
    static begin() {
        return new Setup();
    }
}
exports.Setup = Setup;
class MaterialsAdder {
    addMaterials(materials) {
        Server_1.Server.Reg.RegisterMaterials({ materials: materials });
        return new ShipAdder();
    }
}
class ShipAdder {
    addShips(ships) {
        Server_1.Server.Reg.RegisterShips({ ships: ships });
        return new AttachmentAdder();
    }
}
class AttachmentAdder {
    addAttachments(attachments) {
        Server_1.Server.Reg.RegisterAttachments({ attachments: attachments });
        return new FactionAdder();
    }
}
class FactionAdder {
    addFactions(factions) {
        Server_1.Server.Reg.RegisterFactions({ factions: factions });
        return new LocationAdder();
    }
}
class LocationAdder {
    addLocations(locations) {
        Server_1.Server.Reg.registerSpacemap(new Spacemap_1.Spacemap());
        Server_1.Server.Reg.Spacemap.addNodes(locations);
        return new LinkAdder();
    }
}
class LinkAdder {
    addLink(a, b) {
        Server_1.Server.Reg.Spacemap.addLink(a, b);
        return this;
    }
    finishMap() {
        Server_1.Server.Reg.Spacemap.updateMap();
        return new Defaults();
    }
}
class Defaults {
    defaultCredits(n) {
        Server_1.Server.Reg.DefaultCredits = n;
        return this;
    }
    maxMaterialRarity(n) {
        Server_1.Server.Reg.MaxRarity = n;
        return this;
    }
    maxTechLevel(n) {
        Server_1.Server.Reg.MaxTech = n;
        return this;
    }
    defaultShip(n) {
        const ship = Server_1.Server.Reg.ResolveShipFromName(n);
        Server_1.Server.Reg.DefaultShip = util_1.util.throwUndefined(ship, "Default ship used is invalid");
        return this;
    }
    defaultLocation(n) {
        const location = Server_1.Server.Reg.Spacemap.resolveNodeFromName(n);
        Server_1.Server.Reg.DefaultLocation = util_1.util.throwUndefined(location, "Default location used is invalid.");
        return this;
    }
    defaultAsteroidCooldown(seconds) {
        Server_1.Server.Reg.DefaultAsteroidCooldown = seconds;
        return this;
    }
    finish() {
        Database_1.connect();
        return;
    }
}
