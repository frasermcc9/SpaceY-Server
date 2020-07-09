"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateIntegrationSet = exports.GENERATED_ATTACHMENTS = exports.GENERATED_FACTIONS = exports.GENERATED_SHIPS = exports.GENERATED_MATERIALS = exports.GenerateClientSet = exports.GenerateAttachmentsForActiveClient = exports.GenerateFactionsForActiveClient = exports.GenerateShipsForActiveClient = exports.GenerateMaterialsForActiveClient = void 0;
const Client_1 = require("../lib/Client/Client");
const Material_1 = require("../lib/GameTypes/GameAsset/Material/Material");
const Blueprint_1 = require("../lib/GameTypes/GameAsset/Blueprint/Blueprint");
const Ship_1 = require("../lib/GameTypes/GameAsset/Ship/Ship");
const Faction_1 = require("../lib/GameTypes/GameAsset/Faction/Faction");
const Attachment_1 = require("../lib/GameTypes/GameAsset/Attachment/Attachment");
function GenerateMaterialsForActiveClient() {
    const client = Client_1.Client.Get();
    client.Registry.RegisterMaterials({ materials: GENERATED_MATERIALS() });
}
exports.GenerateMaterialsForActiveClient = GenerateMaterialsForActiveClient;
function GenerateShipsForActiveClient() {
    const client = Client_1.Client.Get();
    client.Registry.RegisterShips({ ships: GENERATED_SHIPS() });
}
exports.GenerateShipsForActiveClient = GenerateShipsForActiveClient;
function GenerateFactionsForActiveClient() {
    const client = Client_1.Client.Get();
    client.Registry.RegisterFactions({ factions: GENERATED_FACTIONS() });
}
exports.GenerateFactionsForActiveClient = GenerateFactionsForActiveClient;
function GenerateAttachmentsForActiveClient() {
    const client = Client_1.Client.Get();
    client.Registry.RegisterAttachments({ attachments: GENERATED_ATTACHMENTS() });
}
exports.GenerateAttachmentsForActiveClient = GenerateAttachmentsForActiveClient;
function GenerateClientSet() {
    GenerateMaterialsForActiveClient();
    GenerateShipsForActiveClient();
    GenerateFactionsForActiveClient();
    GenerateAttachmentsForActiveClient();
}
exports.GenerateClientSet = GenerateClientSet;
/**
 * Iron, Gold, Food, Tech
 */
function GENERATED_MATERIALS() {
    return [
        new Material_1.MaterialBuilder({ name: "Iron", description: "A small iron nugget.", techLevel: 3 })
            .EnableSell(25)
            .EnableMine()
            .SetRarity(4)
            .Build(),
        new Material_1.MaterialBuilder({ name: "Gold", description: "A small gold nugget.", techLevel: 4 })
            .EnableSell(75)
            .EnableMine()
            .SetRarity(10)
            .Build(),
        new Material_1.MaterialBuilder({ name: "Food", description: "Food for one person.", techLevel: 1 })
            .EnableSell(5)
            .SetRarity(1)
            .Build(),
        new Material_1.MaterialBuilder({ name: "Tech", description: "Pile of tech pieces.", techLevel: 7 })
            .EnableSell(50)
            .SetRarity(6)
            .Build(),
    ];
}
exports.GENERATED_MATERIALS = GENERATED_MATERIALS;
function GENERATED_SHIPS() {
    return [
        new Ship_1.ShipBuilder({ name: "Shuttle", description: "A small but agile ship", techLevel: 4 })
            .EnableSell(1500)
            .EnableBuildable(new Blueprint_1.BlueprintBuilder().AutoBuild({
            value: 1000,
            rarity: true,
            minRarity: 0,
            maxRarity: 10,
            centralRarity: 3,
        }))
            .SetStats({ baseHp: 100, baseShield: 50 })
            .SetWeapons({ heavyCap: 3, primaryCap: 3, generalCap: 2 })
            .Build(),
        new Ship_1.ShipBuilder({ name: "Warship", description: "A medium sized vehicle", techLevel: 6 })
            .EnableSell(3000)
            .EnableBuildable(new Blueprint_1.BlueprintBuilder().AutoBuild({
            value: 2550,
            rarity: true,
            minRarity: 0,
            maxRarity: 10,
            centralRarity: 5,
        }))
            .SetStats({ baseHp: 150, baseShield: 90, baseCargo: 750 })
            .Build(),
        new Ship_1.ShipBuilder({ name: "Destroyer", description: "A flagship destroyer", techLevel: 8 })
            .EnableSell(4500)
            .EnableBuildable(new Blueprint_1.BlueprintBuilder().AutoBuild({
            value: 4000,
            rarity: true,
            minRarity: 0,
            maxRarity: 10,
            centralRarity: 7,
        }))
            .SetStats({ baseHp: 200, baseShield: 170, baseCargo: 8000 })
            .SetWeapons({ generalCap: 5, heavyCap: 5, minerCap: 1, primaryCap: 5, shieldCap: 5 })
            .Build(),
    ];
}
exports.GENERATED_SHIPS = GENERATED_SHIPS;
function GENERATED_FACTIONS() {
    return [
        new Faction_1.FactionBuilder({ name: "Humans", description: "Like you and me", techLevel: 4 }).Build(),
        new Faction_1.FactionBuilder({ name: "Alliance", description: "The great alliance of the galaxy", techLevel: 7 }).Build(),
        new Faction_1.FactionBuilder({ name: "Cyborgs", description: "The sentient robotic race", techLevel: 10 }).Build(),
    ];
}
exports.GENERATED_FACTIONS = GENERATED_FACTIONS;
function GENERATED_ATTACHMENTS() {
    const PlatingEquip = (friendly) => {
        friendly.incrementStatistics({ hp: 20 });
        return { message: `New Health: ${friendly.ShipStatistics.totalHp}`, success: true };
    };
    const PlatingUnequip = (friendly) => {
        friendly.decrementStatistics({ hp: 20 });
        return { message: `New Health: ${friendly.ShipStatistics.totalHp}`, success: true };
    };
    const LaserMine = (asteroid) => {
        asteroid.forEach((val, key) => {
            asteroid.set(key, val * 2);
        });
        return { message: "Success", success: true };
    };
    return [
        new Attachment_1.AttachmentBuilder({
            name: "Blaster",
            description: "Standard issue blaster",
            type: Attachment_1.AttachmentType.PRIMARY,
            techLevel: 2,
            strength: 20,
        }).Build(),
        new Attachment_1.AttachmentBuilder({
            name: "Space Sword",
            description: "Not very practical",
            type: Attachment_1.AttachmentType.HEAVY,
            techLevel: 1,
            strength: 20,
        }).Build(),
        new Attachment_1.AttachmentBuilder({
            name: "Obliterator",
            description: "This one will hurt",
            type: Attachment_1.AttachmentType.HEAVY,
            techLevel: 6,
            strength: 20,
        }).Build(),
        new Attachment_1.AttachmentBuilder({
            name: "Iron Plating",
            description: "Tough metal",
            techLevel: 2,
            type: Attachment_1.AttachmentType.GENERAL,
            strength: 20,
        })
            .EquipFn(PlatingEquip)
            .UnequipFn(PlatingUnequip)
            .Build(),
        new Attachment_1.AttachmentBuilder({
            name: "Perfected Mining Laser",
            description: "The pinnacle of mining technology",
            type: Attachment_1.AttachmentType.MINER,
            techLevel: 8,
            strength: 20,
        })
            .MineFn(LaserMine)
            .Build(),
    ];
}
exports.GENERATED_ATTACHMENTS = GENERATED_ATTACHMENTS;
function generateIntegrationSet() {
    //#region Materials
    const M1 = new Material_1.MaterialBuilder({
        name: "Basic Food",
        description: "A portion of basic food. It isn't the greatest but it'll keep you alive.",
        techLevel: 1,
        rarity: 1,
        cost: 30,
    }).Build();
    const M2 = new Material_1.MaterialBuilder({
        name: "Cheap Alcohol",
        description: "Good at getting you drunk but not much else.",
        techLevel: 1,
        rarity: 2,
        cost: 44,
    }).Build();
    const M3 = new Material_1.MaterialBuilder({
        name: "Water",
        description: "For drinking, manufacturing, agriculture... pretty much everything.",
        techLevel: 1,
        rarity: 1,
        cost: 23,
    }).Build();
    const M4 = new Material_1.MaterialBuilder({
        name: "Medicine",
        description: "A first aid kid with many general and advanced treatments.",
        techLevel: 4,
        rarity: 4,
        cost: 435,
    }).Build();
    const M5 = new Material_1.MaterialBuilder({
        name: "Space Waste",
        description: "Random debris of little use, collected from battles, asteroids, anything really.",
        techLevel: 1,
        rarity: 1,
        cost: 8,
    }).Build();
    const M6 = new Material_1.MaterialBuilder({
        name: "Drugs",
        description: "Highly functional medical drugs.",
        techLevel: 3,
        rarity: 4,
        cost: 76,
    }).Build();
    const M7 = new Material_1.MaterialBuilder({
        name: "Oil",
        description: "The black gold still has its uses well into the space-age.",
        techLevel: 3,
        rarity: 4,
        cost: 45,
    }).Build();
    const M8 = new Material_1.MaterialBuilder({
        name: "Armoured Plating",
        description: "Heavily reinforced armour for advanced ships.",
        techLevel: 7,
        rarity: 8,
        cost: 1850,
    }).Build();
    Client_1.Client.Reg.RegisterMaterials({ materials: [M1, M2, M3, M4, M5, M6, M7, M8] });
    //#endregion Materials
    //#region Ships
    /* 	const S1 = new ShipBuilder({
        name: "Recovered Shuttle",
        description:
            "A small recovered shuttle that was found crashed on some planet. Not worth much but it can fly... a bit.",
        techLevel: 0,
    })
        .SetStats({ baseHp: 35, baseShield: 8, baseEnergy: [2, 2, 6], baseCargo: 30, baseHandling: 4 })
        .SetWeapons({ primaryCap: 0, shieldCap: 0, heavyCap: 1, minerCap: 0, generalCap: 1 })
        .EnableSell(59000)
        .EnableBuildable(new BlueprintBuilder().DefinedBuild(BlueprintBuilder.SIMPLE_BUILD(40000), "Recovered Shuttle"))
        .SetMisc({ uri: "", subclass: "Shuttle" })
        .Build(); */
    const S1 = new Ship_1.ShipBuilder({
        name: "Kalen Tradeship",
        description: "A ship that is prevalent within the Kalen alliance. It was designed for traders, often used by rural farmers for getting to and from markets.",
        techLevel: 2,
    })
        .SetStats({ baseHp: 75, baseShield: 8, baseEnergy: [9, 7, 13], baseCargo: 950, baseHandling: 6 })
        .SetWeapons({ primaryCap: 1, shieldCap: 1, heavyCap: 3, minerCap: 1, generalCap: 1 })
        .EnableSell(349000)
        .EnableBuildable(new Blueprint_1.BlueprintBuilder().DefinedBuild(Blueprint_1.BlueprintBuilder.SIMPLE_BUILD(280000), "Kalen Transport"))
        .SetMisc({ uri: "", subclass: "Frigate" })
        .Build();
    const S2 = new Ship_1.ShipBuilder({
        name: "Terrian Homeship",
        description: "A ship that is used freqently by Terrian civilians. This one has had some modifications to make it a bit more able in battle.",
        techLevel: 4,
    })
        .SetStats({ baseHp: 115, baseShield: 60, baseEnergy: [12, 15, 18], baseCargo: 1200, baseHandling: 6 })
        .SetWeapons({ primaryCap: 1, shieldCap: 1, heavyCap: 4, minerCap: 1, generalCap: 2 })
        .EnableSell(753000)
        .EnableBuildable(new Blueprint_1.BlueprintBuilder().DefinedBuild(Blueprint_1.BlueprintBuilder.SIMPLE_BUILD(640000), "Terrian Homeship"))
        .SetMisc({ uri: "", subclass: "Heavy Frigate" })
        .Build();
    const S3 = new Ship_1.ShipBuilder({
        name: "Quargic Cruiser",
        description: "A well-rounded battleship, these cruisers are well-spread throughout the galaxy due to their high demand during the Quargic war.",
        techLevel: 6,
    })
        .SetStats({ baseHp: 250, baseShield: 90, baseEnergy: [28, 20, 18], baseCargo: 850, baseHandling: 8 })
        .SetWeapons({ primaryCap: 2, shieldCap: 2, heavyCap: 4, minerCap: 1, generalCap: 4 })
        .EnableSell(2121000)
        .EnableBuildable(new Blueprint_1.BlueprintBuilder().DefinedBuild(Blueprint_1.BlueprintBuilder.MODERATE_BUILD(1821000), "Quargic Cruiser"))
        .SetMisc({ uri: "", subclass: "Light Cruiser" })
        .Build();
    const S4 = new Ship_1.ShipBuilder({
        name: "Ty'Linic Crawler",
        description: "A ship whose hull looks like it's been carved from flesh, the Crawler is fast and well kitted.",
        techLevel: 6,
    })
        .SetStats({ baseHp: 340, baseShield: 195, baseEnergy: [28, 24, 26], baseCargo: 1400, baseHandling: 8 })
        .SetWeapons({ primaryCap: 2, shieldCap: 2, heavyCap: 5, minerCap: 1, generalCap: 5 })
        .EnableSell(3307000)
        .EnableBuildable(new Blueprint_1.BlueprintBuilder().DefinedBuild(Blueprint_1.BlueprintBuilder.MODERATE_BUILD(2607000), "Ty'Linic Crawler"))
        .SetMisc({ uri: "", subclass: "Heavy Cruiser" })
        .Build();
    const S5 = new Ship_1.ShipBuilder({
        name: "Asarin Enforcer",
        description: "A beautifully constructed ship, built by only the finest Asarin engineers. The Asarin Enforcer is a no-compromise ship that is essential for any collector.",
        techLevel: 10,
    })
        .SetStats({ baseHp: 290, baseShield: 480, baseEnergy: [32, 28, 29], baseCargo: 1280, baseHandling: 6 })
        .SetWeapons({ primaryCap: 3, shieldCap: 3, heavyCap: 5, minerCap: 1, generalCap: 4 })
        .EnableSell(5134000)
        .EnableBuildable(new Blueprint_1.BlueprintBuilder().DefinedBuild(Blueprint_1.BlueprintBuilder.ADVANCED_BUILD(280000), "Asarin Enforcer"))
        .SetMisc({ uri: "", subclass: "Dreadnought" })
        .Build();
    const S6 = new Ship_1.ShipBuilder({
        name: "The Celestial Destroyer",
        description: "The crusading destroyer minds its own way through the galaxy, undisturbed. The entire ship is built to be a weapon. Its destructive power is unparalleled.",
        techLevel: 11,
    })
        .SetStats({ baseHp: 450, baseShield: 450, baseEnergy: [72, 42, 28], baseCargo: 2400, baseHandling: 6 })
        .SetWeapons({ primaryCap: 4, shieldCap: 2, heavyCap: 7, minerCap: 1, generalCap: 7 })
        .EnableSell(9800000)
        .EnableBuildable(new Blueprint_1.BlueprintBuilder().DefinedBuild(Blueprint_1.BlueprintBuilder.ADVANCED_BUILD(9000000), "The Celestial Destroyer"))
        .SetMisc({ uri: "", subclass: "CAPITAL" })
        .Build();
    Client_1.Client.Reg.RegisterShips({ ships: [S1, S2, S3, S4, S5, S6] });
    //#endregion Ships
    //#region Attachments
    //#endregion Attachments
    //#region Factions
    //#endregion Factions
}
exports.generateIntegrationSet = generateIntegrationSet;
