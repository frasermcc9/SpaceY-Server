"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaterialGenerator = void 0;
const Material_1 = require("../lib/GameTypes/GameAsset/Material/Material");
exports.MaterialGenerator = () => {
    return [
        new Material_1.MaterialBuilder({
            name: "Basic Food",
            description: "A portion of basic food. It isn't the greatest but it'll keep you alive.",
            techLevel: 1,
            rarity: 1,
            cost: 30,
        }).Build(),
        new Material_1.MaterialBuilder({
            name: "Cheap Alcohol",
            description: "Good at getting you drunk but not much else.",
            techLevel: 1,
            rarity: 2,
            cost: 44,
        }).Build(),
        new Material_1.MaterialBuilder({
            name: "Water",
            description: "For drinking, manufacturing, agriculture... pretty much everything.",
            techLevel: 1,
            rarity: 1,
            cost: 23,
        }).Build(),
        new Material_1.MaterialBuilder({
            name: "Medicine",
            description: "A first aid kid with many general and advanced treatments.",
            techLevel: 4,
            rarity: 4,
            cost: 435,
        }).Build(),
        new Material_1.MaterialBuilder({
            name: "Space Waste",
            description: "Random debris of little use, collected from battles, asteroids, anything really.",
            techLevel: 1,
            rarity: 1,
            cost: 8,
        }).Build(),
        new Material_1.MaterialBuilder({
            name: "Drugs",
            description: "Highly functional medical drugs.",
            techLevel: 3,
            rarity: 4,
            cost: 76,
        }).Build(),
        new Material_1.MaterialBuilder({
            name: "Oil",
            description: "The black gold still has its uses well into the space-age.",
            techLevel: 3,
            rarity: 4,
            cost: 45,
        }).Build(),
        new Material_1.MaterialBuilder({
            name: "Iron Ore",
            description: "The industrial-age metal proves its use well into the future.",
            techLevel: 2,
            rarity: 4,
            cost: 240,
        })
            .EnableMine()
            .Build(),
        new Material_1.MaterialBuilder({
            name: "Aluminium Ore",
            description: "Cheaper and more lightweight than iron, aluminium is widely used in ship and attachment manufacturing.",
            techLevel: 2,
            rarity: 3,
            cost: 125,
        })
            .EnableMine()
            .Build(),
        new Material_1.MaterialBuilder({
            name: "Gold Ore",
            description: "A rare and precious metal with niche applications.",
            techLevel: 2,
            rarity: 6,
            cost: 625,
        })
            .EnableMine()
            .Build(),
        new Material_1.MaterialBuilder({
            name: "Armoured Plating",
            description: "Heavily reinforced armour for advanced ships.",
            techLevel: 7,
            rarity: 8,
            cost: 1850,
        }).Build(),
    ];
};
