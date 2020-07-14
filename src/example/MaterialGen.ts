import { MaterialBuilder, Material } from "../lib/GameTypes/GameAsset/Material/Material";

export const MaterialGenerator = (): Material[] => {
	return [
		new MaterialBuilder({
			name: "Basic Food",
			description: "A portion of basic food. It isn't the greatest but it'll keep you alive.",
			techLevel: 1,
			rarity: 1,
			cost: 30,
		}).Build(),
		new MaterialBuilder({
			name: "Cheap Alcohol",
			description: "Good at getting you drunk but not much else.",
			techLevel: 1,
			rarity: 2,
			cost: 44,
		}).Build(),
		new MaterialBuilder({
			name: "Water",
			description: "For drinking, manufacturing, agriculture... pretty much everything.",
			techLevel: 1,
			rarity: 1,
			cost: 23,
		}).Build(),
		new MaterialBuilder({
			name: "Medicine",
			description: "A first aid kid with many general and advanced treatments.",
			techLevel: 4,
			rarity: 4,
			cost: 435,
		}).Build(),
		new MaterialBuilder({
			name: "Space Waste",
			description: "Random debris of little use, collected from battles, asteroids, anything really.",
			techLevel: 1,
			rarity: 1,
			cost: 8,
		}).Build(),
		new MaterialBuilder({
			name: "Drugs",
			description: "Highly functional medical drugs.",
			techLevel: 3,
			rarity: 4,
			cost: 76,
		}).Build(),
		new MaterialBuilder({
			name: "Oil",
			description: "The black gold still has its uses well into the space-age.",
			techLevel: 3,
			rarity: 4,
			cost: 45,
		}).Build(),
		new MaterialBuilder({
			name: "Electronics",
			description: "A package of various electrical parts.",
			techLevel: 5,
			rarity: 4,
			cost: 95,
		}).Build(),
		new MaterialBuilder({
			name: "Mechanical Parts",
			description: "Parts such as gears, shafts and screws.",
			techLevel: 5,
			rarity: 5,
			cost: 135,
		}).Build(),
		new MaterialBuilder({
			name: "Explosives",
			description: "Not the most elegant form of weapons, but effective.",
			techLevel: 4,
			rarity: 6,
			cost: 630,
		}).Build(),
		new MaterialBuilder({
			name: "Plastics",
			description: "A widespread and versatile material.",
			techLevel: 2,
			rarity: 2,
			cost: 50,
		}).Build(),
		new MaterialBuilder({
			name: "Optics",
			description: "Materials with useful optical properties.",
			techLevel: 6,
			rarity: 6,
			cost: 470,
		}).Build(),
		new MaterialBuilder({
			name: "Noble Gas",
			description: "Useful inert gasses.",
			techLevel: 2,
			rarity: 4,
			cost: 220,
		}).Build(),
		new MaterialBuilder({
			name: "Energy Cell",
			description: "The standard form of energy storage within the galaxy. Used for enhanced space-system warping.",
			techLevel: 8,
			rarity: 7,
			cost: 4350,
		}).Build(),
		new MaterialBuilder({
			name: "Processors",
			description: "Space-age quantum based processors.",
			techLevel: 9,
			rarity: 6,
			cost: 3240,
		}).Build(),

		new MaterialBuilder({
			name: "Nanotech",
			description: "Highly engineered and highly versatile and strong nanotech.",
			techLevel: 9,
			rarity: 8,
			cost: 5100,
		}).Build(),
		new MaterialBuilder({
			name: "Armoured Plating",
			description: "An advanced plating for ships that provides incredible resistance whilst remaining relatively lightweight.",
			techLevel: 10,
			rarity: 8,
			cost: 3700,
		}).Build(),
		new MaterialBuilder({
			name: "Chemicals",
			description: "Various chemicals that are useful for many applications",
			techLevel: 4,
			rarity: 5,
			cost: 155,
		})
			.EnableMine()
			.Build(),
		new MaterialBuilder({
			name: "Iron Ore",
			description: "The industrial-age metal proves its use well into the future.",
			techLevel: 2,
			rarity: 4,
			cost: 240,
		})
			.EnableMine()
			.Build(),
		new MaterialBuilder({
			name: "Titanium Ore",
			description:
				"A valuable metal with very high strength and resistance to corrosion. Heavily used in the manufacturing of armoured plating.",
			techLevel: 2,
			rarity: 6,
			cost: 715,
		})
			.EnableMine()
			.Build(),

		new MaterialBuilder({
			name: "Gold Ore",
			description: "A rare and precious metal with niche applications.",
			techLevel: 2,
			rarity: 6,
			cost: 625,
		})
			.EnableMine()
			.Build(),
		new MaterialBuilder({
			name: "Uranium Ore",
			description: "Highly sought after for its nuclear properties.",
			techLevel: 5,
			rarity: 8,
			cost: 765,
		})
			.EnableMine()
			.Build(),
		new MaterialBuilder({
			name: "Aluminium Ore",
			description: "Cheaper and more lightweight than iron, aluminium is widely used in ship and attachment manufacturing.",
			techLevel: 2,
			rarity: 3,
			cost: 125,
		})
			.EnableMine()
			.Build(),

		new MaterialBuilder({
			name: "Copper Ore",
			description: "Copper remains useful for its electrical and heat properties.",
			techLevel: 3,
			rarity: 3,
			cost: 355,
		})
			.EnableMine()
			.Build(),
		new MaterialBuilder({
			name: "Tin Ore",
			description: "A soft and silvery metal.",
			techLevel: 3,
			rarity: 3,
			cost: 355,
		})
			.EnableMine()
			.Build(),
		new MaterialBuilder({
			name: "Iridium Ore",
			description: "A highly precious, brittle metal.",
			techLevel: 4,
			rarity: 7,
			cost: 1260,
		})
			.EnableMine()
			.Build(),
		new MaterialBuilder({
			name: "Luxuries",
			description: "Expensive and luxuries goods. They do not serve much purpose.",
			techLevel: 2,
			rarity: 7,
			cost: 1010,
		}).Build(),
		new MaterialBuilder({
			name: "Organs",
			description: "Organs of alien species. Highly valuable.",
			techLevel: 4,
			rarity: 8,
			cost: 4600,
		}).Build(),
		new MaterialBuilder({
			name: "Contraband",
			description: "Extremely illegal, but also extremely valuable if sold.",
			techLevel: 1,
			rarity: 9,
			cost: 7100,
		}).Build(),
		new MaterialBuilder({
			name: "Fancy Alcohol",
			description: "Finely aged wine and spirits.",
			techLevel: 2,
			rarity: 6,
			cost: 800,
		}).Build(),
		new MaterialBuilder({
			name: "Relics",
			description: "Rare relics from a previous age.",
			techLevel: 2,
			rarity: 10,
			cost: 450,
		}).Build(),
		new MaterialBuilder({
			name: "Prosthetics",
			description: "Advanced prosthetics that almost fully mimic the real parts they were designed to replace.",
			techLevel: 7,
			rarity: 6,
			cost: 3200,
		}).Build(),
	];
};
