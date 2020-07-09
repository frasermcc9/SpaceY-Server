"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FactionGenerator = void 0;
const Faction_1 = require("../lib/GameTypes/GameAsset/Faction/Faction");
const main_1 = require("../lib/main");
exports.FactionGenerator = () => {
    return [
        new Faction_1.FactionBuilder({
            name: "Kalen",
            description: "A large but rather low tech group of systems on the edge of the galaxy.",
            techLevel: 2,
        })
            .addSoldShips([main_1.Client.Reg.ResolveShipFromName("Kalen Tradeship")])
            .Build(),
        new Faction_1.FactionBuilder({
            name: "Lumissa",
            description: "Lumissa is the largest alliance of the galaxy, with 8 systems giving their allegiance. Their central location means that almost all trade is " +
                "conducted along its routes, leading to the technological and economic powerhouse it is today.",
            techLevel: 8,
        }).Build(),
        new Faction_1.FactionBuilder({
            name: "Arisna",
            description: "Galaxies that belong to the Arisna alliance were all fully dominated by the technocratic Arisnian race. Technology and advancement is seen as the " +
                "peak goal for all Arisnians, and as such, this alliance often produces some of the most technologically impressive equipment in the galaxy.",
            techLevel: 10,
        }).Build(),
    ];
};