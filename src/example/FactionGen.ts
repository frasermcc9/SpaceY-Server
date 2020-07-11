import { FactionBuilder, Faction } from "../lib/GameTypes/GameAsset/Faction/Faction";
import { Client } from "../lib/main";

export const FactionGenerator = (): Faction[] => {
	return [
		new FactionBuilder({
			name: "Primitive",
			description: "The large yet technologically inept populations which have no means of space travel.",
			techLevel: 0,
		})
			.setImageUri("https://cdn.discordapp.com/attachments/730728698478854275/730728738907619348/primitive.png")
			.Build(),

		new FactionBuilder({
			name: "Kalen",
			description: "A large but rather low tech group of systems on the edge of the galaxy.",
			techLevel: 2,
		})
			.addSoldShips([Client.Reg.ResolveShipFromName("Kalen Tradeship")!])
			.setImageUri("https://cdn.discordapp.com/attachments/730728698478854275/730728735631867944/kalen.png")
			.Build(),

		new FactionBuilder({
			name: "Erisna",
			description:
				"The newest formed galactic alliance, made from many systems which have only had space travel for a small amount of time. Despite this, they are quickly beginning to invest heavily in their technological developments.",
			techLevel: 3,
		})
			.setImageUri("https://cdn.discordapp.com/attachments/730728698478854275/730728737447870464/erisna.png")
			.Build(),

		new FactionBuilder({
			name: "Ty'Lin",
			description:
				"An alliance built from various non-humanoid species, with particularly exotic looking ships. The individual systems are rather tribalistic. Often the only common belief shared is the desire for withholding threats from the several surrounding alliances.",
			techLevel: 4,
		})
			.setImageUri("https://cdn.discordapp.com/attachments/730728698478854275/730728744393900112/Tylin.png")
			.Build(),

		new FactionBuilder({
			name: "Terra",
			description:
				"The alliance that humans developed, alongside neighboring systems. Once seen as a fairly non-influential group, the development of a capital ship has given Terrans a much higher standing on the galactic stage.",
			techLevel: 5,
		})
			.setImageUri("https://cdn.discordapp.com/attachments/730728698478854275/730728742745276507/terran.png")
			.Build(),

		new FactionBuilder({
			name: "Volog",
			description:
				"Volians have few systems to their name, but they more than make up for it due to the shear number of ships they produce. This natural ship-building talent has led to the extreme wealth that Volian systems have.",
			techLevel: 6,
		})
			.setImageUri("https://cdn.discordapp.com/attachments/730728698478854275/730728787884638328/volog.png")
			.Build(),

		new FactionBuilder({
			name: "Quarg",
			description:
				"The Quargic alliance is built on imperialism and destruction. Their ships are often heavily armed, or in the cases of their larger ships, the whole vessel is build around their super-weapon - the Prismatic Death Ray.",
			techLevel: 7,
		})
			.setImageUri("https://cdn.discordapp.com/attachments/730728698478854275/730728741252366366/quarg.png")
			.Build(),

		new FactionBuilder({
			name: "Lumissa",
			description:
				"Lumissa is the largest alliance of the galaxy, with 8 systems giving their allegiance. Their central location means that almost all trade is " +
				"conducted along its routes, leading to the technological and economic powerhouse it is today.",
			techLevel: 8,
		})
			.setImageUri("https://cdn.discordapp.com/attachments/730728698478854275/730728737850785812/lumissa.png")
			.Build(),

		new FactionBuilder({
			name: "Alaira",
			description:
				"Galaxies that belong to the Alairan alliance were all fully dominated by the technocratic Alairan race. Technology and advancement is seen as the " +
				"peak goal for all Alairans, and as such, the alliance often produces some of the most technologically impressive equipment in the galaxy.",
			techLevel: 10,
		})
			.setImageUri("https://cdn.discordapp.com/attachments/730728698478854275/730728734419714058/asaria.png")
			.Build(),

		new FactionBuilder({
			name: "Anarchy",
			description:
				"Many systems, especially those around the outer edge, have very low amounts of civilised populations, with many falling to anarchy. These systems are often avoided due to the high amount of danger they possess.",
			techLevel: 4,
		})
			.setImageUri("https://cdn.discordapp.com/attachments/730728698478854275/730728732355985498/anarchy.png")
			.Build(),

		new FactionBuilder({
			name: "Unknown",
			description:
				"Almost nothing is known about the nature of these systems. No successful exploratory voyage has ever occurred, with all vessels warping never coming back. The only information known is from a ship that was promptly destroyed " +
				"after warping into an anarchic system. A galactic-wide analysis on the technology revealed technology so advanced it was even foreign to the advanced Alairan ",
			techLevel: 11,
		})
			.setImageUri("https://cdn.discordapp.com/attachments/730728698478854275/730728745643802664/unknown.png")
			.Build(),
	];
};
