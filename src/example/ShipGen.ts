import { ShipBuilder } from "../lib/GameTypes/GameAsset/Ship/Ship";
import { BlueprintBuilder } from "../lib/GameTypes/GameAsset/Blueprint/Blueprint";

export const ShipGenerator = () => {
	return [
		new ShipBuilder({
			name: "Kalen Tradeship",
			description:
				"A ship that is prevalent within the Kalen alliance. It was designed for traders, often used by rural farmers for getting to and from markets.",
			techLevel: 2,
		})
			.SetStats({ baseHp: 75, baseShield: 8, baseEnergy: [9, 7, 13], baseCargo: 950, baseHandling: 6 })
			.SetWeapons({ primaryCap: 1, shieldCap: 1, heavyCap: 3, minerCap: 1, generalCap: 1 })
			.EnableSell(349000)
			.EnableBuildable(new BlueprintBuilder().DefinedBuild(BlueprintBuilder.SIMPLE_BUILD(280000), "Kalen Transport"))
			.SetMisc({ uri: "", subclass: "Frigate" })
			.Build(),
		new ShipBuilder({
			name: "Terrian Homeship",
			description:
				"A ship that is used freqently by Terrian civilians. This one has had some modifications to make it a bit more able in battle.",
			techLevel: 4,
		})
			.SetStats({ baseHp: 115, baseShield: 60, baseEnergy: [12, 15, 18], baseCargo: 1200, baseHandling: 6 })
			.SetWeapons({ primaryCap: 1, shieldCap: 1, heavyCap: 4, minerCap: 1, generalCap: 2 })
			.EnableSell(753000)
			.EnableBuildable(new BlueprintBuilder().DefinedBuild(BlueprintBuilder.SIMPLE_BUILD(640000), "Terrian Homeship"))
			.SetMisc({ uri: "", subclass: "Heavy Frigate" })
			.Build(),
		new ShipBuilder({
			name: "Quargic Cruiser",
			description:
				"A well-rounded battleship, these cruisers are well-spread throughout the galaxy due to their high demand during the Quargic war.",
			techLevel: 6,
		})
			.SetStats({ baseHp: 250, baseShield: 90, baseEnergy: [28, 20, 18], baseCargo: 850, baseHandling: 8 })
			.SetWeapons({ primaryCap: 2, shieldCap: 2, heavyCap: 4, minerCap: 1, generalCap: 4 })
			.EnableSell(2121000)
			.EnableBuildable(new BlueprintBuilder().DefinedBuild(BlueprintBuilder.MODERATE_BUILD(1821000), "Quargic Cruiser"))
			.SetMisc({ uri: "", subclass: "Light Cruiser" })
			.Build(),
		new ShipBuilder({
			name: "Ty'Linic Crawler",
			description: "A ship whose hull looks like it's been carved from flesh, the Crawler is fast and well kitted.",
			techLevel: 6,
		})
			.SetStats({ baseHp: 340, baseShield: 195, baseEnergy: [28, 24, 26], baseCargo: 1400, baseHandling: 8 })
			.SetWeapons({ primaryCap: 2, shieldCap: 2, heavyCap: 5, minerCap: 1, generalCap: 5 })
			.EnableSell(3307000)
			.EnableBuildable(new BlueprintBuilder().DefinedBuild(BlueprintBuilder.MODERATE_BUILD(2607000), "Ty'Linic Crawler"))
			.SetMisc({ uri: "", subclass: "Heavy Cruiser" })
			.Build(),
		new ShipBuilder({
			name: "Asarin Enforcer",
			description:
				"A beautifully constructed ship, built by only the finest Asarin engineers. The Asarin Enforcer is a no-compromise ship that is essential for any collector.",
			techLevel: 10,
		})
			.SetStats({ baseHp: 290, baseShield: 480, baseEnergy: [32, 28, 29], baseCargo: 1280, baseHandling: 6 })
			.SetWeapons({ primaryCap: 3, shieldCap: 3, heavyCap: 5, minerCap: 1, generalCap: 4 })
			.EnableSell(5134000)
			.EnableBuildable(new BlueprintBuilder().DefinedBuild(BlueprintBuilder.ADVANCED_BUILD(280000), "Asarin Enforcer"))
			.SetMisc({ uri: "", subclass: "Dreadnought" })
			.Build(),
		new ShipBuilder({
			name: "The Celestial Destroyer",
			description:
				"The crusading destroyer minds its own way through the galaxy, undisturbed. The entire ship is built to be a weapon. Its destructive power is unparalleled.",
			techLevel: 11,
		})
			.SetStats({ baseHp: 450, baseShield: 450, baseEnergy: [72, 42, 28], baseCargo: 2400, baseHandling: 6 })
			.SetWeapons({ primaryCap: 4, shieldCap: 2, heavyCap: 7, minerCap: 1, generalCap: 7 })
			.EnableSell(9800000)
			.EnableBuildable(new BlueprintBuilder().DefinedBuild(BlueprintBuilder.ADVANCED_BUILD(9000000), "The Celestial Destroyer"))
			.SetMisc({ uri: "", subclass: "CAPITAL" })
			.Build(),
	];
};
