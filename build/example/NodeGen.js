"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeGenerator = void 0;
const SpacemapNode_1 = require("../lib/GameTypes/GameSpacemap/SpacemapNode");
const main_1 = require("../lib/main");
const Asteroid_1 = require("../lib/GameTypes/GameMechanics/Asteroid");
const MaterialStore_1 = require("../lib/GameTypes/GameStore/MaterialStore");
const BaseStore_1 = require("../lib/GameTypes/GameStore/BaseStore");
const ShipStore_1 = require("../lib/GameTypes/GameStore/ShipStore");
exports.NodeGenerator = () => {
    return [
        new SpacemapNode_1.SpacemapNodeBuilder({
            name: "Gemini",
            requiredWarp: SpacemapNode_1.WarpPower.NONE,
            faction: main_1.Client.Reg.ResolveFactionFromName("Kalen"),
        })
            .addAsteroid(new Asteroid_1.AsteroidBuilder("GEM01").BuildRandom({ value: 500 }))
            .addAsteroid(new Asteroid_1.AsteroidBuilder("GEM02").BuildRandom({ value: 500 }))
            .addAsteroid(new Asteroid_1.AsteroidBuilder("GEM03").BuildRandom({ value: 500 }))
            .addStore(new MaterialStore_1.MaterialStore({
            initialCredits: 1250,
            storeName: "Gemini Scrapshop",
            type: BaseStore_1.StoreType.MATERIAL_STORE,
            generationValue: 500,
            marketForces: true,
            centralRarity: 1,
            minRarity: 0,
            maxRarity: 6,
            enableRarityEffects: true,
            minTech: 0,
            maxTech: 4,
        }))
            .build(),
        new SpacemapNode_1.SpacemapNodeBuilder({
            name: "Kalen",
            requiredWarp: SpacemapNode_1.WarpPower.NONE,
            faction: main_1.Client.Reg.ResolveFactionFromName("Kalen"),
        })
            .addAsteroid(new Asteroid_1.AsteroidBuilder("KAL01").BuildRandom({ value: 750 }))
            .addStore(new MaterialStore_1.MaterialStore({
            initialCredits: 1550,
            storeName: "Kalen Resource Distribution",
            type: BaseStore_1.StoreType.MATERIAL_STORE,
            generationValue: 1275,
            marketForces: true,
            centralRarity: 1,
            minRarity: 0,
            maxRarity: 7,
            enableRarityEffects: true,
            minTech: 0,
            maxTech: 5,
        }))
            .build(),
        new SpacemapNode_1.SpacemapNodeBuilder({
            name: "Lyra",
            requiredWarp: SpacemapNode_1.WarpPower.NONE,
            faction: main_1.Client.Reg.ResolveFactionFromName("Kalen"),
        })
            .addStore(new ShipStore_1.ShipStore({
            initialCredits: 25000,
            storeName: "Lyra Logistics",
            type: BaseStore_1.StoreType.SHIP_STORE,
            maxToSell: 2,
            storeFaction: main_1.Client.Reg.ResolveFactionFromName("Kalen"),
        }))
            .build(),
    ];
};
