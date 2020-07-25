import { SpacemapNodeBuilder, WarpPower } from "../lib/GameTypes/GameSpacemap/SpacemapNode";
import { Client } from "../lib/main";
import { AsteroidBuilder } from "../lib/GameTypes/GameMechanics/Asteroid";
import { MaterialStore } from "../lib/GameTypes/GameStore/MaterialStore";
import { StoreType } from "../lib/GameTypes/GameStore/BaseStore";
import { ShipStore } from "../lib/GameTypes/GameStore/ShipStore";
import { AttachmentStore } from "../lib/GameTypes/GameStore/AttachmentStore";

export const NodeGenerator = () => {
    return [...KalenGen(), ...ErisnaGen()];
};

const KalenGen = () => {
    return [
        new SpacemapNodeBuilder({
            name: "Gemini",
            requiredWarp: WarpPower.NONE,
            faction: Client.Reg.ResolveFactionFromName("Kalen")!,
            img: "https://cdn.discordapp.com/attachments/732459193545523261/732462067436617778/unknown.png",
            tech: 1,
        })
            .addAsteroid(new AsteroidBuilder("GEM01").BuildRandom({ value: 500 }))
            .addAsteroid(new AsteroidBuilder("GEM02").BuildRandom({ value: 500 }))
            .addAsteroid(new AsteroidBuilder("GEM03").BuildRandom({ value: 500 }))
            .addStore(
                new MaterialStore({
                    initialCredits: 1250,
                    storeName: "Gemini Scrapshop",
                    type: StoreType.MATERIAL_STORE,
                    generationValue: 500,
                    marketForces: true,
                    centralRarity: 1,
                    minRarity: 0,
                    maxRarity: 4,
                    enableRarityEffects: true,
                    minTech: 0,
                    maxTech: 3,
                })
            )
            .build(),
        new SpacemapNodeBuilder({
            name: "Kalen",
            requiredWarp: WarpPower.NONE,
            faction: Client.Reg.ResolveFactionFromName("Kalen")!,
            img: "https://cdn.discordapp.com/attachments/732459193545523261/732462067436617778/unknown.png",
            tech: 1,
        })
            .addAsteroid(new AsteroidBuilder("KAL01").BuildRandom({ value: 750 }))
            .addStore(
                new MaterialStore({
                    initialCredits: 1550,
                    storeName: "Kalen Resource Distribution",
                    type: StoreType.MATERIAL_STORE,
                    generationValue: 1275,
                    marketForces: true,
                    centralRarity: 1,
                    minRarity: 0,
                    maxRarity: 4,
                    enableRarityEffects: true,
                    minTech: 0,
                    maxTech: 3,
                })
            )
            .build(),
        new SpacemapNodeBuilder({
            name: "Lyra",
            requiredWarp: WarpPower.NONE,
            faction: Client.Reg.ResolveFactionFromName("Kalen")!,
            img: "https://cdn.discordapp.com/attachments/732459193545523261/732462067436617778/unknown.png",
            tech: 3,
        })
            .addStore(
                new ShipStore({
                    initialCredits: 25000,
                    storeName: "Lyra Logistics",
                    type: StoreType.SHIP_STORE,
                    maxToSell: 2,
                    storeFaction: Client.Reg.ResolveFactionFromName("Kalen")!,
                    marketForces: true,
                })
            )
            .build(),
        new SpacemapNodeBuilder({
            name: "Aries",
            requiredWarp: WarpPower.NONE,
            faction: Client.Reg.ResolveFactionFromName("Kalen")!,
            img: "https://cdn.discordapp.com/attachments/732459193545523261/732462067436617778/unknown.png",
            tech: 1,
        })
            .addAsteroid(new AsteroidBuilder("ARI01").BuildRandom({ value: 450 }))
            .addAsteroid(new AsteroidBuilder("ARI02").setCooldown(60 * 30).BuildRandom({ value: 1250 }))
            .addStore(
                new MaterialStore({
                    initialCredits: 1900,
                    storeName: "Aries Emporium",
                    type: StoreType.MATERIAL_STORE,
                    generationValue: 1700,
                    marketForces: true,
                    centralRarity: 3,
                    minRarity: 0,
                    maxRarity: 5,
                    enableRarityEffects: true,
                    minTech: 1,
                    maxTech: 4,
                })
            )

            .build(),

        new SpacemapNodeBuilder({
            name: "Auriga",
            requiredWarp: WarpPower.NONE,
            faction: Client.Reg.ResolveFactionFromName("Kalen")!,
            img: "https://cdn.discordapp.com/attachments/732459193545523261/732462067436617778/unknown.png",
            tech: 1,
        })
            .addAsteroid(new AsteroidBuilder("AGA01").BuildRandom({ value: 500 }))
            .addAsteroid(new AsteroidBuilder("AGA02").BuildRandom({ value: 500 }))
            .addAsteroid(new AsteroidBuilder("AGA03").BuildRandom({ value: 500 }))
            .addAsteroid(new AsteroidBuilder("AGA04").BuildRandom({ value: 500 }))
            .build(),

        new SpacemapNodeBuilder({
            name: "Orion",
            requiredWarp: WarpPower.NONE,
            faction: Client.Reg.ResolveFactionFromName("Kalen")!,
            img: "https://cdn.discordapp.com/attachments/732459193545523261/732462067436617778/unknown.png",
            tech: 2,
        })
            .addStore(
                new AttachmentStore({
                    initialCredits: 2650,
                    storeName: "Orion Ordinance",
                    maxToSell: 3,
                    storeFaction: Client.Reg.ResolveFactionFromName("Kalen")!,
                    type: StoreType.ATTACHMENT_STORE,
                    marketForces: true,
                })
            )
            .build(),
    ];
};

const ErisnaGen = () => {
    return [
        new SpacemapNodeBuilder({
            name: "Erisna",
            requiredWarp: WarpPower.NONE,
            faction: Client.Reg.ResolveFactionFromName("Erisna")!,
            img: "https://cdn.discordapp.com/attachments/732459193545523261/732463349345943662/unknown.png",
            tech: 4,
        })
            .addAsteroid(new AsteroidBuilder("ERI01").BuildRandom({ value: 875 }))
            .addStore(
                new ShipStore({
                    storeName: "Erisna Fabrications",
                    type: StoreType.SHIP_STORE,
                    initialCredits: 35000,
                    maxToSell: 1,
                    storeFaction: Client.Reg.ResolveFactionFromName("Erisna")!,
                    marketForces: true,
                })
            )
            .addStore(
                new MaterialStore({
                    initialCredits: 2750,
                    storeName: "Odds and Ends",
                    type: StoreType.MATERIAL_STORE,
                    generationValue: 2975,
                    marketForces: true,
                    centralRarity: 2,
                    minRarity: 0,
                    maxRarity: 6,
                    enableRarityEffects: true,
                    minTech: 0,
                    maxTech: 5,
                })
            )
            .build(),

        new SpacemapNodeBuilder({
            name: "Aquarius",
            requiredWarp: WarpPower.LOW,
            faction: Client.Reg.ResolveFactionFromName("Erisna")!,
            img: "https://cdn.discordapp.com/attachments/732459193545523261/732463349345943662/unknown.png",
            tech: 3,
        })
            .addAsteroid(new AsteroidBuilder("AQR01").BuildRandom({ value: 915 }))
            .addAsteroid(new AsteroidBuilder("AQR02").BuildRandom({ value: 825 }))
            .addAsteroid(new AsteroidBuilder("AQR03").BuildRandom({ value: 780 }))
            .addAsteroid(new AsteroidBuilder("AQR04").BuildRandom({ value: 900 }))
            .build(),

        new SpacemapNodeBuilder({
            name: "Ceti",
            requiredWarp: WarpPower.LOW,
            faction: Client.Reg.ResolveFactionFromName("Erisna")!,
            img: "https://cdn.discordapp.com/attachments/732459193545523261/732463349345943662/unknown.png",
            tech: 4,
        })
            .addAsteroid(new AsteroidBuilder("CET01").BuildRandom({ value: 1025 }))
            .addAsteroid(new AsteroidBuilder("CET02").BuildRandom({ value: 985 }))
            .addStore(
                new AttachmentStore({
                    initialCredits: 15000,
                    storeName: "Ceti Military Distributions",
                    maxToSell: 3,
                    storeFaction: Client.Reg.ResolveFactionFromName("Erisna")!,
                    type: StoreType.ATTACHMENT_STORE,
                    marketForces: true,
                })
            )
            .build(),

        new SpacemapNodeBuilder({
            name: "Delphinus",
            requiredWarp: WarpPower.LOW,
            faction: Client.Reg.ResolveFactionFromName("Erisna")!,
            img: "https://cdn.discordapp.com/attachments/732459193545523261/732463349345943662/unknown.png",
            tech: 4,
        })
            .addAsteroid(new AsteroidBuilder("DPH01").BuildRandom({ value: 980 }))
            .addAsteroid(new AsteroidBuilder("DPH01").BuildRandom({ value: 950 }))
            .addStore(
                new MaterialStore({
                    initialCredits: 350,
                    storeName: "Erisnian Rarities",
                    type: StoreType.MATERIAL_STORE,
                    generationValue: 3100,
                    marketForces: true,
                    centralRarity: 6,
                    minRarity: 6,
                    maxRarity: 10,
                    enableRarityEffects: true,
                    minTech: 0,
                    maxTech: 5,
                })
            )
            .build(),
    ];
};
