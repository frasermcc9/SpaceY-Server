import { FactionBuilder } from "../lib/GameTypes/GameAsset/Faction/Faction";
import { Client } from "../lib/main";

export const FactionGenerator = () => {
	return [
		new FactionBuilder({
			name: "Kalen",
			description: "A large but rather low tech group of systems on the edge of the galaxy.",
			techLevel: 2,
		})
			.addSoldShips([Client.Reg.ResolveShipFromName("Kalen Tradeship")!])
			.Build(),
		new FactionBuilder({
			name: "Lumissa",
			description:
				"Lumissa is the largest alliance of the galaxy, with 8 systems giving their allegiance. Their central location means that almost all trade is " +
				"conducted along its routes, leading to the technological and economic powerhouse it is today.",
			techLevel: 8,
		}).Build(),
		new FactionBuilder({
			name: "Arisna",
			description:
				"Galaxies that belong to the Arisna alliance were all fully dominated by the technocratic Arisnian race. Technology and advancement is seen as the " +
				"peak goal for all Arisnians, and as such, this alliance often produces some of the most technologically impressive equipment in the galaxy.",
			techLevel: 10,
		}).Build(),
	];
};