import { SpacemapNodeBuilder, WarpPower } from "../lib/GameTypes/GameSpacemap/SpacemapNode";
import { Client } from "../lib/main";
import { AsteroidBuilder } from "../lib/GameTypes/GameMechanics/Asteroid";
import { MaterialStore } from "../lib/GameTypes/GameStore/MaterialStore";
import { StoreType } from "../lib/GameTypes/GameStore/BaseStore";
import { ShipStore } from "../lib/GameTypes/GameStore/ShipStore";

export const NodeGenerator = () => {
	return [
		new SpacemapNodeBuilder({
			name: "Gemini",
			requiredWarp: WarpPower.NONE,
			faction: Client.Reg.ResolveFactionFromName("Kalen")!,
		})
			.addAsteroid(new AsteroidBuilder().BuildRandom({ value: 500 }))
			.addAsteroid(new AsteroidBuilder().BuildRandom({ value: 500 }))
			.addAsteroid(new AsteroidBuilder().BuildRandom({ value: 500 }))
			.addStore(
				new MaterialStore({
					initialCredits: 1250,
					storeName: "Gemini Scrapshop",
					type: StoreType.MATERIAL_STORE,
					generationValue: 500,
					marketForces: true,
					centralRarity: 1,
					minRarity: 0,
					maxRarity: 6,
					enableRarityEffects: true,
					minTech: 0,
					maxTech: 4,
				})
			)
			.build(),
		new SpacemapNodeBuilder({
			name: "Kalen",
			requiredWarp: WarpPower.NONE,
			faction: Client.Reg.ResolveFactionFromName("Kalen")!,
		})
			.addAsteroid(new AsteroidBuilder().BuildRandom({ value: 750 }))
			.addStore(
				new MaterialStore({
					initialCredits: 1550,
					storeName: "Kalen Resource Distribution",
					type: StoreType.MATERIAL_STORE,
					generationValue: 1275,
					marketForces: true,
					centralRarity: 1,
					minRarity: 0,
					maxRarity: 7,
					enableRarityEffects: true,
					minTech: 0,
					maxTech: 5,
				})
			)
			.build(),
		new SpacemapNodeBuilder({
			name: "Lyra",
			requiredWarp: WarpPower.NONE,
			faction: Client.Reg.ResolveFactionFromName("Kalen")!,
		})
			.addStore(
				new ShipStore({
					initialCredits: 25000,
					storeName: "Kalen Logistics",
					type: StoreType.SHIP_STORE,
					maxToSell: 2,
					storeFaction: Client.Reg.ResolveFactionFromName("Kalen")!,
				})
			)
			.build(),
	];
};
