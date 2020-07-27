import { MaterialBuilder } from "../lib/GameTypes/GameAsset/Material/Material";
import { BlueprintBuilder } from "../lib/GameTypes/GameAsset/Blueprint/Blueprint";

export const layerOneMaterials = () => {
    return [
        new MaterialBuilder({
            name: "Iron Ore",
            description: "The industrial-age metal proves its use well into the future.",
            techLevel: 2,
            rarity: 4,
            cost: 24,
            weight: 0.2,
        })
            .EnableMine()
            .Build(),
        new MaterialBuilder({
            name: "Titanium Ore",
            description:
                "A valuable metal with very high strength and resistance to corrosion. Heavily used in the manufacturing of armoured plating.",
            techLevel: 2,
            rarity: 6,
            cost: 68,
            weight: 0.2,
        })
            .EnableMine()
            .Build(),

        new MaterialBuilder({
            name: "Gold Ore",
            description: "A rare and precious metal with niche applications.",
            techLevel: 2,
            rarity: 6,
            cost: 59,
            weight: 0.2,
        })
            .EnableMine()
            .Build(),
        new MaterialBuilder({
            name: "Uranium Ore",
            description: "Highly sought after for its nuclear properties.",
            techLevel: 5,
            rarity: 8,
            cost: 51,
            weight: 0.2,
        })
            .EnableMine()
            .Build(),
        new MaterialBuilder({
            name: "Aluminium Ore",
            description:
                "Cheaper and more lightweight than iron, aluminium is widely used in ship and attachment manufacturing.",
            techLevel: 2,
            rarity: 3,
            cost: 14,
            weight: 0.2,
        })
            .EnableMine()
            .Build(),

        new MaterialBuilder({
            name: "Copper Ore",
            description: "Copper remains useful for its electrical and heat properties.",
            techLevel: 3,
            rarity: 3,
            cost: 33,
            weight: 0.2,
        })
            .EnableMine()
            .Build(),
        new MaterialBuilder({
            name: "Tin Ore",
            description: "A soft and silvery metal.",
            techLevel: 3,
            rarity: 3,
            cost: 34,
            weight: 0.2,
        })
            .EnableMine()
            .Build(),
        new MaterialBuilder({
            name: "Iridium Ore",
            description: "A highly precious, brittle metal.",
            techLevel: 4,
            rarity: 7,
            cost: 97,
            weight: 0.2,
        })
            .EnableMine()
            .Build(),
        new MaterialBuilder({
            name: "Carbon",
            description: "Fundamental for the construction of more advanced materials.",
            techLevel: 1,
            rarity: 2,
            cost: 11,
            weight: 0.1,
        })
            .EnableMine()
            .Build(),

        new MaterialBuilder({
            name: "Oil",
            description: "The black gold still has its uses well into the space-age.",
            techLevel: 3,
            rarity: 4,
            cost: 5,
            weight: 0.1,
        }).Build(),
        new MaterialBuilder({
            name: "Chemicals",
            description: "Various chemicals that are useful for many applications",
            techLevel: 4,
            rarity: 5,
            cost: 16,
            weight: 0.05,
        })
            .EnableMine()
            .Build(),
        new MaterialBuilder({
            name: "Noble Gas",
            description: "Useful inert gasses.",
            techLevel: 2,
            rarity: 4,
            cost: 22,
            weight: 0.01,
        }).Build(),
        new MaterialBuilder({
            name: "Silica",
            description: "A quartz material with useful optical properties. Frequently found in space debris.",
            techLevel: 1,
            rarity: 1,
            cost: 9,
            weight: 0.01,
        })
            .EnableMine()
            .Build(),
        new MaterialBuilder({
            name: "Water",
            description: "For drinking, manufacturing, agriculture... pretty much everything.",
            techLevel: 1,
            rarity: 1,
            cost: 2,
            weight: 0.05,
        }).Build(),
        new MaterialBuilder({
            name: "Basic Food",
            description: "A portion of basic food. It isn't the greatest but it'll keep you alive.",
            techLevel: 1,
            rarity: 1,
            cost: 3,
            weight: 0.05,
        }).Build(),
        new MaterialBuilder({
            name: "Cheap Alcohol",
            description: "Good at getting you drunk but not much else.",
            techLevel: 1,
            rarity: 2,
            cost: 4,
            weight: 0.05,
        }).Build(),
        new MaterialBuilder({
            name: "Organs",
            description: "Organs of alien species. Highly valuable.",
            techLevel: 4,
            rarity: 8,
            cost: 4900,
            weight: 0.05,
        }).Build(),
        new MaterialBuilder({
            name: "Contraband",
            description: "Extremely illegal, but also extremely valuable if sold.",
            techLevel: 1,
            rarity: 9,
            cost: 8250,
            weight: 0.1,
        }).Build(),
        new MaterialBuilder({
            name: "Fancy Alcohol",
            description: "Finely aged wine and spirits.",
            techLevel: 2,
            rarity: 6,
            cost: 84,
            weight: 0.05,
        }).Build(),
        new MaterialBuilder({
            name: "Relics",
            description: "Rare relics from a previous age.",
            techLevel: 2,
            rarity: 10,
            cost: 3900,
            weight: 0.1,
        }).Build(),
    ];
};

export const layerTwoMaterials = () => {
    return [
        new MaterialBuilder({
            name: "Electronics",
            description: "A package of various electrical parts.",
            techLevel: 5,
            rarity: 4,
            cost: 10,
            weight: 0.1,
        })
            .EnableBuild(new BlueprintBuilder(10).ManualBuild(new Map().set("Copper Ore", 1).set("Chemicals", 1)))
            .Build(),
        new MaterialBuilder({
            name: "Mechanical Parts",
            description: "Parts such as gears, shafts and screws.",
            techLevel: 5,
            rarity: 5,
            cost: 14,
            weight: 0.1,
        })
            .EnableBuild(
                new BlueprintBuilder(6).ManualBuild(
                    new Map().set("Iron Ore", 1).set("Chemicals", 1).set("Aluminium Ore", 1)
                )
            )
            .Build(),
        new MaterialBuilder({
            name: "Plastics",
            description: "A widespread and versatile material.",
            techLevel: 2,
            rarity: 2,
            cost: 5,
            weight: 0.05,
        })
            .EnableBuild(new BlueprintBuilder(10).ManualBuild(new Map().set("Oil", 1).set("Chemicals", 1)))
            .Build(),
        new MaterialBuilder({
            name: "Optics",
            description: "Materials with useful optical properties.",
            techLevel: 4,
            rarity: 6,
            cost: 47,
            weight: 0.05,
        })
            .EnableBuild(new BlueprintBuilder(10).ManualBuild(new Map().set("Silica", 25).set("Chemicals", 4)))
            .Build(),
        new MaterialBuilder({
            name: "Carbon Fibre",
            description: "Refined carbon that makes a high-strength material.",
            techLevel: 5,
            rarity: 6,
            cost: 79,
            weight: 0.05,
        })
            .EnableBuild(new BlueprintBuilder(30).ManualBuild(new Map().set("Carbon", 60).set("Oil", 10)))
            .Build(),

        new MaterialBuilder({
            name: "Luxuries",
            description: "Expensive and luxurious goods. They do not serve much purpose.",
            techLevel: 2,
            rarity: 7,
            cost: 3140,
            weight: 0.1,
        })
            .EnableBuild(new BlueprintBuilder(1).ManualBuild(new Map().set("Gold", 25)))
            .Build(),
    ];
};

export const layerThreeMaterials = () => {
    return [
        new MaterialBuilder({
            name: "Small Energy Cell",
            description: "Small energy storage for use with smaller applications.",
            techLevel: 2,
            rarity: 7,
            cost: 120,
            weight: 0.05,
        })
            .EnableBuild(
                new BlueprintBuilder(32).ManualBuild(
                    new Map().set("Oil", 32).set("Optics", 32).set("Electronics", 64).set("Chemicals", 16)
                )
            )
            .Build(),
        new MaterialBuilder({
            name: "Drugs",
            description: "Highly functional medical drugs.",
            techLevel: 3,
            rarity: 4,
            cost: 8,
            weight: 0.01,
        })
            .EnableBuild(new BlueprintBuilder(12).ManualBuild(new Map().set("Plastic", 5).set("Chemicals", 2)))
            .Build(),

        new MaterialBuilder({
            name: "Advanced Alloy",
            description: "A mixture of various materials to make a strong alloy with many applications.",
            techLevel: 6,
            rarity: 6,
            cost: 375,
            weight: 0.5,
        })
            .EnableBuild(
                new BlueprintBuilder(2).ManualBuild(
                    new Map().set("Iron Ore", 4).set("Carbon Fibre", 3).set("Titanium Ore", 4)
                )
            )
            .Build(),
        new MaterialBuilder({
            name: "Explosives",
            description: "Not the most elegant form of weapons, but effective.",
            techLevel: 4,
            rarity: 6,
            cost: 195,
            weight: 0.1,
        })
            .EnableBuild(
                new BlueprintBuilder(2).ManualBuild(
                    new Map().set("Plastic", 15).set("Chemicals", 10).set("Uranium Ore", 1)
                )
            )
            .Build(),
        new MaterialBuilder({
            name: "Nanotech",
            description: "Highly engineered and highly versatile and strong nanotech.",
            techLevel: 9,
            rarity: 8,
            cost: 4300,
            weight: 0.01,
        })
            .EnableBuild(
                new BlueprintBuilder(1).ManualBuild(
                    new Map().set("Optics", 25).set("Gold Ore", 12).set("Titanium Ore", 10)
                )
            )
            .Build(),
    ];
};

export const layerFourMaterials = () => {
    return [
        new MaterialBuilder({
            name: "Energy Cell",
            description:
                "The standard form of energy storage within the galaxy. Used for enhanced space-system warping.",
            techLevel: 8,
            rarity: 7,
            cost: 2960,
            weight: 0.1,
        })
            .EnableBuild(
                new BlueprintBuilder(4).ManualBuild(new Map().set("Small Energy Cell", 64).set("Uranium Ore", 32))
            )
            .Build(),
        new MaterialBuilder({
            name: "Medicine Kits",
            description: "A first aid kid with many general and advanced treatments.",
            techLevel: 4,
            rarity: 4,
            cost: 42,
            weight: 0.05,
        })
            .EnableBuild(
                new BlueprintBuilder(5).ManualBuild(
                    new Map().set("Drugs", 8).set("Basic Food", 8).set("Cheap Alcohol", 8)
                )
            )
            .Build(),

        new MaterialBuilder({
            name: "Armoured Plating",
            description:
                "An advanced plating for ships that provides incredible resistance whilst remaining relatively lightweight.",
            techLevel: 10,
            rarity: 8,
            cost: 3700,
            weight: 1,
        })
            .EnableBuild(
                new BlueprintBuilder(16).ManualBuild(
                    new Map().set("Advanced Alloy", 96).set("Carbon Fibres", 64).set("Mechanical Parts", 128)
                )
            )
            .Build(),
        new MaterialBuilder({
            name: "Prosthetics",
            description: "Advanced prosthetics that almost fully mimic the real parts they were designed to replace.",
            techLevel: 7,
            rarity: 6,
            cost: 3200,
            weight: 0.05,
        })
            .EnableBuild(
                new BlueprintBuilder(4).ManualBuild(
                    new Map()
                        .set("Advanced Alloy", 4)
                        .set("Carbon Fibres", 10)
                        .set("Mechanical Parts", 30)
                        .set("Nanotech", 2)
                )
            )
            .Build(),
        new MaterialBuilder({
            name: "Processors",
            description: "Space-age quantum based processors.",
            techLevel: 9,
            rarity: 6,
            cost: 3340,
            weight: 0.01,
        })
            .EnableBuild(
                new BlueprintBuilder(8).ManualBuild(
                    new Map().set("Silica", 256).set("Nanotech", 4).set("Electronics", 96)
                )
            )
            .Build(),
    ];
};
