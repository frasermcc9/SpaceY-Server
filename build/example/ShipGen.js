"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShipGenerator = void 0;
const Ship_1 = require("../lib/GameTypes/GameAsset/Ship/Ship");
const Blueprint_1 = require("../lib/GameTypes/GameAsset/Blueprint/Blueprint");
exports.ShipGenerator = () => {
    return [
        //#region Shuttle
        new Ship_1.ShipBuilder({
            name: "Recovered Escape Pod",
            description: "An escape pod from a much larger ship. Not great but it can fly... sort of.",
            techLevel: 0,
        })
            .SetStats({ baseHp: 35, baseShield: 8, baseEnergy: [2, 6, 2], baseCargo: 30, baseHandling: 4 })
            .SetWeapons({ primaryCap: 0, shieldCap: 0, heavyCap: 1, minerCap: 0, generalCap: 1 })
            .EnableSell(61000)
            .EnableBuildable(new Blueprint_1.BlueprintBuilder().DefinedBuild(Blueprint_1.BlueprintBuilder.SIMPLE_BUILD(40000), "Recovered Shuttle"))
            .SetMisc({ uri: "https://cdn.discordapp.com/attachments/730728698478854275/730746756135911434/0.jpg", subclass: "Shuttle" })
            .Build(),
        new Ship_1.ShipBuilder({
            name: "Kalen Taxi",
            description: "A small but luxury vehicle usually used for flying around locally in the Kalen systems.",
            techLevel: 2,
        })
            .SetStats({ baseHp: 55, baseShield: 15, baseEnergy: [5, 12, 5], baseCargo: 45, baseHandling: 6 })
            .SetWeapons({ primaryCap: 0, shieldCap: 1, heavyCap: 1, minerCap: 0, generalCap: 1 })
            .EnableSell(118000)
            .EnableBuildable(new Blueprint_1.BlueprintBuilder().DefinedBuild(Blueprint_1.BlueprintBuilder.SIMPLE_BUILD(75000), "Kalen Taxi"))
            .SetMisc({ uri: "https://cdn.discordapp.com/attachments/730728698478854275/731118944320225361/1.jpg", subclass: "Shuttle" })
            .Build(),
        new Ship_1.ShipBuilder({
            name: "Terran Scout",
            description: "A quick and robust ship used by the Terran alliance for quick scouting missions.",
            techLevel: 3,
        })
            .SetStats({ baseHp: 65, baseShield: 35, baseEnergy: [10, 14, 6], baseCargo: 120, baseHandling: 7 })
            .SetWeapons({ primaryCap: 1, shieldCap: 1, heavyCap: 2, minerCap: 1, generalCap: 1 })
            .EnableSell(177000)
            .EnableBuildable(new Blueprint_1.BlueprintBuilder().DefinedBuild(Blueprint_1.BlueprintBuilder.SIMPLE_BUILD(125000), "Terran Scout"))
            .SetMisc({ uri: "https://cdn.discordapp.com/attachments/730728698478854275/731119607339024414/2.jpg", subclass: "Shuttle" })
            .Build(),
        new Ship_1.ShipBuilder({
            name: "Erisnian Transport",
            description: "A unique ship with a high computational abilities. Also useful for those requiring lots of cargo space.",
            techLevel: 3,
        })
            .SetStats({ baseHp: 61, baseShield: 55, baseEnergy: [8, 18, 6], baseCargo: 400, baseHandling: 6 })
            .SetWeapons({ primaryCap: 1, shieldCap: 1, heavyCap: 2, minerCap: 1, generalCap: 1 })
            .EnableSell(183000)
            .EnableBuildable(new Blueprint_1.BlueprintBuilder().DefinedBuild(Blueprint_1.BlueprintBuilder.SIMPLE_BUILD(128000), "Erisnian Transport"))
            .SetMisc({ uri: "https://cdn.discordapp.com/attachments/730728698478854275/731120002945515560/3.jpg", subclass: "Shuttle" })
            .Build(),
        new Ship_1.ShipBuilder({
            name: "Quargic Jet",
            description: "A well rounded and versatile military ship that outperforms many other shuttles in its class.",
            techLevel: 5,
        })
            .SetStats({ baseHp: 65, baseShield: 75, baseEnergy: [13, 14, 10], baseCargo: 320, baseHandling: 8 })
            .SetWeapons({ primaryCap: 2, shieldCap: 2, heavyCap: 4, minerCap: 1, generalCap: 2 })
            .EnableSell(282000)
            .EnableBuildable(new Blueprint_1.BlueprintBuilder().DefinedBuild(Blueprint_1.BlueprintBuilder.SIMPLE_BUILD(200000), "Quargic Jet"))
            .SetMisc({ uri: "https://cdn.discordapp.com/attachments/730728698478854275/731121893058543616/4.jpg", subclass: "Shuttle" })
            .Build(),
        new Ship_1.ShipBuilder({
            name: "Lumissian Needle",
            description: "An incredibly mobile, high tech ship, mass produced by the Lumissian alliance.",
            techLevel: 7,
        })
            .SetStats({ baseHp: 62, baseShield: 125, baseEnergy: [14, 12, 18], baseCargo: 220, baseHandling: 9 })
            .SetWeapons({ primaryCap: 2, shieldCap: 1, heavyCap: 3, minerCap: 1, generalCap: 2 })
            .EnableSell(303000)
            .EnableBuildable(new Blueprint_1.BlueprintBuilder().DefinedBuild(Blueprint_1.BlueprintBuilder.SIMPLE_BUILD(210000), "Lumissian Needle"))
            .SetMisc({ uri: "https://cdn.discordapp.com/attachments/730728698478854275/731121904198484058/5.jpg", subclass: "Shuttle" })
            .Build(),
        //#endregion
        //#region Frigate
        new Ship_1.ShipBuilder({
            name: "Kalen Tradeship",
            description: "A ship that is prevalent within the Kalen alliance. It was designed for traders, often used by rural farmers for getting to and from markets.",
            techLevel: 2,
        })
            .SetStats({ baseHp: 75, baseShield: 45, baseEnergy: [9, 13, 7], baseCargo: 950, baseHandling: 6 })
            .SetWeapons({ primaryCap: 1, shieldCap: 1, heavyCap: 3, minerCap: 1, generalCap: 1 })
            .EnableSell(349000)
            .EnableBuildable(new Blueprint_1.BlueprintBuilder().DefinedBuild(Blueprint_1.BlueprintBuilder.SIMPLE_BUILD(280000), "Kalen Transport"))
            .SetMisc({ uri: "https://cdn.discordapp.com/attachments/730728698478854275/730746802910920754/6.jpg", subclass: "Frigate" })
            .Build(),
        new Ship_1.ShipBuilder({
            name: "Standard Transport",
            description: "A ship thats widely used and manufactured all over the galaxy, particularly because of its strong engine and high cargo capacity.",
            techLevel: 3,
        })
            .SetStats({ baseHp: 82, baseShield: 40, baseEnergy: [8, 15, 8], baseCargo: 2250, baseHandling: 5 })
            .SetWeapons({ primaryCap: 1, shieldCap: 1, heavyCap: 3, minerCap: 1, generalCap: 1 })
            .EnableSell(421000)
            .EnableBuildable(new Blueprint_1.BlueprintBuilder().DefinedBuild(Blueprint_1.BlueprintBuilder.SIMPLE_BUILD(315000), "Standard Transport"))
            .SetMisc({ uri: "https://cdn.discordapp.com/attachments/730728698478854275/731123755463737424/7.png", subclass: "Frigate" })
            .Build(),
        new Ship_1.ShipBuilder({
            name: "Volian Gunship",
            description: "A powerful gunship that comes heavily armed at a fairly inexpensive cost.",
            techLevel: 5,
        })
            .SetStats({ baseHp: 88, baseShield: 60, baseEnergy: [14, 12, 8], baseCargo: 650, baseHandling: 6 })
            .SetWeapons({ primaryCap: 2, shieldCap: 1, heavyCap: 4, minerCap: 0, generalCap: 2 })
            .EnableSell(469000)
            .EnableBuildable(new Blueprint_1.BlueprintBuilder().DefinedBuild(Blueprint_1.BlueprintBuilder.SIMPLE_BUILD(365000), "Volian Gunship"))
            .SetMisc({ uri: "https://cdn.discordapp.com/attachments/730728698478854275/731123753811181598/8.png", subclass: "Frigate" })
            .Build(),
        new Ship_1.ShipBuilder({
            name: "Ty'Linic Warship",
            description: "An agile and menacing ship, used extensively throughout Ty'Linic regions. Often seen as a direct upgrade over the Volian Gunship with little compromise.",
            techLevel: 5,
        })
            .SetStats({ baseHp: 95, baseShield: 64, baseEnergy: [18, 14, 10], baseCargo: 400, baseHandling: 7 })
            .SetWeapons({ primaryCap: 2, shieldCap: 1, heavyCap: 4, minerCap: 0, generalCap: 2 })
            .EnableSell(512000)
            .EnableBuildable(new Blueprint_1.BlueprintBuilder().DefinedBuild(Blueprint_1.BlueprintBuilder.SIMPLE_BUILD(365000), "Ty'linic Warship"))
            .SetMisc({ uri: "https://cdn.discordapp.com/attachments/730728698478854275/731123760366747658/9.png", subclass: "Frigate" })
            .Build(),
        new Ship_1.ShipBuilder({
            name: "Alairan Patroller",
            description: "A beautifully crafted ship, crafted by the Alairan alliance. It is high tech, well equipped, and very expensive.",
            techLevel: 9,
        })
            .SetStats({ baseHp: 104, baseShield: 84, baseEnergy: [14, 14, 20], baseCargo: 350, baseHandling: 7 })
            .SetWeapons({ primaryCap: 2, shieldCap: 2, heavyCap: 4, minerCap: 1, generalCap: 3 })
            .EnableSell(655000)
            .EnableBuildable(new Blueprint_1.BlueprintBuilder().DefinedBuild(Blueprint_1.BlueprintBuilder.MODERATE_BUILD(520000), "Alairan Patroller"))
            .SetMisc({ uri: "https://cdn.discordapp.com/attachments/730728698478854275/731123750803603456/10.jpg", subclass: "Frigate" })
            .Build(),
        //#endregion
        //#region Heavy Frigate
        new Ship_1.ShipBuilder({
            name: "Terran Homeship",
            description: "A ship that is used frequently by Terran civilians. This one has had some modifications to make it a bit more able in battle.",
            techLevel: 4,
        })
            .SetStats({ baseHp: 115, baseShield: 60, baseEnergy: [12, 18, 15], baseCargo: 1200, baseHandling: 6 })
            .SetWeapons({ primaryCap: 1, shieldCap: 1, heavyCap: 4, minerCap: 1, generalCap: 2 })
            .EnableSell(753000)
            .EnableBuildable(new Blueprint_1.BlueprintBuilder().DefinedBuild(Blueprint_1.BlueprintBuilder.SIMPLE_BUILD(640000), "Terran Homeship"))
            .SetMisc({
            uri: "https://cdn.discordapp.com/attachments/730728698478854275/730746832317317141/11.jpg",
            subclass: "Heavy Frigate",
        })
            .Build(),
        new Ship_1.ShipBuilder({
            name: "Volian Warship",
            description: "A ship that is used freqently by Terran civilians. This one has had some modifications to make it a bit more able in battle.",
            techLevel: 4,
        })
            .SetStats({ baseHp: 125, baseShield: 65, baseEnergy: [19, 17, 12], baseCargo: 750, baseHandling: 5 })
            .SetWeapons({ primaryCap: 2, shieldCap: 2, heavyCap: 4, minerCap: 0, generalCap: 3 })
            .EnableSell(905000)
            .EnableBuildable(new Blueprint_1.BlueprintBuilder().DefinedBuild(Blueprint_1.BlueprintBuilder.SIMPLE_BUILD(640000), "Volian Warship"))
            .SetMisc({
            uri: "https://cdn.discordapp.com/attachments/730728698478854275/731128037285822594/12.png",
            subclass: "Heavy Frigate",
        })
            .Build(),
        //#endregion
        //#region Light Cruiser
        new Ship_1.ShipBuilder({
            name: "Quargic Cruiser",
            description: "A well-rounded battleship, these cruisers are well-spread throughout the galaxy due to their high demand during the Quargic war.",
            techLevel: 6,
        })
            .SetStats({ baseHp: 250, baseShield: 90, baseEnergy: [28, 18, 20], baseCargo: 850, baseHandling: 8 })
            .SetWeapons({ primaryCap: 2, shieldCap: 2, heavyCap: 4, minerCap: 1, generalCap: 4 })
            .EnableSell(2121000)
            .EnableBuildable(new Blueprint_1.BlueprintBuilder().DefinedBuild(Blueprint_1.BlueprintBuilder.MODERATE_BUILD(1821000), "Quargic Cruiser"))
            .SetMisc({
            uri: "https://cdn.discordapp.com/attachments/730728698478854275/730746866693701632/16.png",
            subclass: "Light Cruiser",
        })
            .Build(),
        //#endregion
        //#region Heavy Cruiser
        new Ship_1.ShipBuilder({
            name: "Ty'Linic Crawler",
            description: "A ship whose hull looks like it's been carved from flesh, the Crawler is fast and well kitted.",
            techLevel: 6,
        })
            .SetStats({ baseHp: 340, baseShield: 195, baseEnergy: [28, 26, 24], baseCargo: 1400, baseHandling: 8 })
            .SetWeapons({ primaryCap: 2, shieldCap: 2, heavyCap: 5, minerCap: 1, generalCap: 5 })
            .EnableSell(3307000)
            .EnableBuildable(new Blueprint_1.BlueprintBuilder().DefinedBuild(Blueprint_1.BlueprintBuilder.MODERATE_BUILD(2607000), "Ty'Linic Crawler"))
            .SetMisc({
            uri: "https://cdn.discordapp.com/attachments/730728698478854275/730746900873084998/23.jpg",
            subclass: "Heavy Cruiser",
        })
            .Build(),
        //#endregion
        //#region Dreadnought
        new Ship_1.ShipBuilder({
            name: "Alairan Enforcer",
            description: "A beautifully constructed ship, built by only the finest Asarin engineers. The Asarin Enforcer is a no-compromise ship that is essential for any collector.",
            techLevel: 10,
        })
            .SetStats({ baseHp: 290, baseShield: 480, baseEnergy: [32, 29, 28], baseCargo: 1280, baseHandling: 6 })
            .SetWeapons({ primaryCap: 3, shieldCap: 3, heavyCap: 5, minerCap: 1, generalCap: 4 })
            .EnableSell(5134000)
            .EnableBuildable(new Blueprint_1.BlueprintBuilder().DefinedBuild(Blueprint_1.BlueprintBuilder.ADVANCED_BUILD(280000), "Alairan Enforcer"))
            .SetMisc({
            uri: "https://cdn.discordapp.com/attachments/730728698478854275/730746961824579692/31.png",
            subclass: "Dreadnought",
        })
            .Build(),
        //#endregion
        //#region Capital
        new Ship_1.ShipBuilder({
            name: "The Executor",
            description: "The Terran capital ship, although less impressive than some others, does possess some unique technology. One example is the integrated warp gate, allowing for the summoning of an army at a moments notice.",
            techLevel: 11,
        })
            .SetStats({ baseHp: 650, baseShield: 375, baseEnergy: [42, 55, 25], baseCargo: 4200, baseHandling: 6 })
            .SetWeapons({ primaryCap: 4, shieldCap: 4, heavyCap: 7, minerCap: 1, generalCap: 6 })
            .EnableSell(10863000)
            .EnableBuildable(new Blueprint_1.BlueprintBuilder().DefinedBuild(Blueprint_1.BlueprintBuilder.ADVANCED_BUILD(9600000), "The Executor"))
            .SetMisc({ uri: "https://cdn.discordapp.com/attachments/730728698478854275/731131422647124018/36.png", subclass: "CAPITAL" })
            .Build(),
        new Ship_1.ShipBuilder({
            name: "The Revenant",
            description: "The Revenant is colloquially known as the 'Ghostship'. A glance at it would reveal why. It appears to be made of completely non-solid matter and absorb any projectiles that pass through it.",
            techLevel: 11,
        })
            .SetStats({ baseHp: 225, baseShield: 1500, baseEnergy: [45, 25, 70], baseCargo: 550, baseHandling: 10 })
            .SetWeapons({ primaryCap: 4, shieldCap: 5, heavyCap: 6, minerCap: 1, generalCap: 6 })
            .EnableSell(15551000)
            .EnableBuildable(new Blueprint_1.BlueprintBuilder().DefinedBuild(Blueprint_1.BlueprintBuilder.ADVANCED_BUILD(13551000), "The Revenant"))
            .SetMisc({ uri: "https://cdn.discordapp.com/attachments/730728698478854275/731131419967094924/37.jpg", subclass: "CAPITAL" })
            .Build(),
        new Ship_1.ShipBuilder({
            name: "Mind of the Galaxy",
            description: "An incredibly mysterious ship, whose creator and pilot is unknown. From various sightings, it seems the commander pilots the ship from the outside, controlled fully by the mind.",
            techLevel: 11,
        })
            .SetStats({ baseHp: 450, baseShield: 800, baseEnergy: [30, 25, 90], baseCargo: 850, baseHandling: 9 })
            .SetWeapons({ primaryCap: 4, shieldCap: 3, heavyCap: 6, minerCap: 1, generalCap: 6 })
            .EnableSell(12129000)
            .EnableBuildable(new Blueprint_1.BlueprintBuilder().DefinedBuild(Blueprint_1.BlueprintBuilder.ADVANCED_BUILD(10829000), "Mind of the Galaxy"))
            .SetMisc({ uri: "https://cdn.discordapp.com/attachments/730728698478854275/731131419925020722/38.jpg", subclass: "CAPITAL" })
            .Build(),
        new Ship_1.ShipBuilder({
            name: "The Supernova",
            description: "The capital ship of the Lumissian alliance. The supernova often flies around the Vela system, the most central of the galaxy, as a mobile parliament.",
            techLevel: 11,
        })
            .SetStats({ baseHp: 700, baseShield: 400, baseEnergy: [45, 40, 40], baseCargo: 6400, baseHandling: 5 })
            .SetWeapons({ primaryCap: 4, shieldCap: 3, heavyCap: 7, minerCap: 1, generalCap: 6 })
            .EnableSell(11532000)
            .EnableBuildable(new Blueprint_1.BlueprintBuilder().DefinedBuild(Blueprint_1.BlueprintBuilder.ADVANCED_BUILD(10100000), "The Supernova"))
            .SetMisc({ uri: "https://cdn.discordapp.com/attachments/730728698478854275/731131423817334894/39.png", subclass: "CAPITAL" })
            .Build(),
        new Ship_1.ShipBuilder({
            name: "The Celestial Destroyer",
            description: "The Celestial Destroyer minds its own way through the galaxy, undisturbed. The entire ship is built to be a weapon. Its destructive power is unparalleled.",
            techLevel: 11,
        })
            .SetStats({ baseHp: 450, baseShield: 450, baseEnergy: [72, 28, 42], baseCargo: 4600, baseHandling: 6 })
            .SetWeapons({ primaryCap: 4, shieldCap: 2, heavyCap: 7, minerCap: 1, generalCap: 7 })
            .EnableSell(10460000)
            .EnableBuildable(new Blueprint_1.BlueprintBuilder().DefinedBuild(Blueprint_1.BlueprintBuilder.ADVANCED_BUILD(9100000), "The Celestial Destroyer"))
            .SetMisc({ uri: "https://cdn.discordapp.com/attachments/730728698478854275/730746992808165416/40.png", subclass: "CAPITAL" })
            .Build(),
        new Ship_1.ShipBuilder({
            name: "The Icarus",
            description: "A planet sized ship that has gained sentience since it was build by the Volian alliance. It now often does what it decides to do, which can often lead to widespread destruction.",
            techLevel: 11,
        })
            .SetStats({ baseHp: 800, baseShield: 300, baseEnergy: [36, 68, 32], baseCargo: 15000, baseHandling: 5 })
            .SetWeapons({ primaryCap: 5, shieldCap: 2, heavyCap: 7, minerCap: 1, generalCap: 7 })
            .EnableSell(14472000)
            .EnableBuildable(new Blueprint_1.BlueprintBuilder().DefinedBuild(Blueprint_1.BlueprintBuilder.ADVANCED_BUILD(11000000), "The Icarus"))
            .SetMisc({ uri: "https://cdn.discordapp.com/attachments/730728698478854275/731129662201135174/41.png", subclass: "CAPITAL" })
            .Build(),
        new Ship_1.ShipBuilder({
            name: "The Event Horizon",
            description: "The Event Horizon represents the pride of the Alairan alliance. The ship stays at the forefront of any battle, often laying waste to whatever is in its path.",
            techLevel: 11,
        })
            .SetStats({ baseHp: 750, baseShield: 750, baseEnergy: [50, 50, 50], baseCargo: 6200, baseHandling: 4 })
            .SetWeapons({ primaryCap: 4, shieldCap: 4, heavyCap: 8, minerCap: 1, generalCap: 6 })
            .EnableSell(13085000)
            .EnableBuildable(new Blueprint_1.BlueprintBuilder().DefinedBuild(Blueprint_1.BlueprintBuilder.ADVANCED_BUILD(10785000), "The Event Horizon"))
            .SetMisc({ uri: "https://cdn.discordapp.com/attachments/730728698478854275/731130039072194610/42.png", subclass: "CAPITAL" })
            .Build(),
    ];
};
//# sourceMappingURL=ShipGen.js.map