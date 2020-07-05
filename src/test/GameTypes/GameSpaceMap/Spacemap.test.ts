import { SpacemapNode, WarpPower } from "../../../lib/GameTypes/GameSpacemap/SpacemapNode";
import { Spacemap, ISpacemap, ISpacemapPrivileged } from "../../../lib/GameTypes/GameSpacemap/Spacemap";
import { throws } from "assert";
import { default as must } from "must";
import { FactionBuilder } from "../../../lib/GameTypes/GameAsset/Faction/Faction";
require("must/register");

describe("Spacemap Tests", async () => {
	describe("SpacemapNode tests", async () => {
		it("Should return the proper data", async () => {
			const FN1 = new FactionBuilder("Kalen", "The fragile Kalen alliance", 2).Build();
			const MN1 = new SpacemapNode({ name: "Gemini", faction: FN1, requiredWarp: 0 });
			MN1.Name.must.eql("Gemini");
			MN1.Faction.Name.must.eql("Kalen");
			MN1.RequiredWarp.must.eql(WarpPower.NONE);
		});
		it("Should return the formatted data", async () => {
			const FN1 = new FactionBuilder("Kalen", "The fragile Kalen alliance", 2).Build();
			const MN1 = new SpacemapNode({ name: "Orion", faction: FN1, requiredWarp: 0 });
			MN1.toString().must.eql("Kalen: Orion");
		});
	});

	describe("Spacemap tests", async () => {
		it("Should add two nodes to the spacemap", async () => {
			const SM: ISpacemapPrivileged = new Spacemap();
			const FN1 = new FactionBuilder("Kalen", "The fragile Kalen alliance", 2).Build();

			const MN1 = new SpacemapNode({ name: "Gemini", faction: FN1, requiredWarp: 0 });
			const MN2 = new SpacemapNode({ name: "Orion", faction: FN1, requiredWarp: 0 });

			SM.addNode(MN1).addNode(MN2);
			SM.Graph.size.must.eql(2);
		});
		it("Adding two of the same node must fail", async () => {
			const SM: ISpacemapPrivileged = new Spacemap();
			const FN1 = new FactionBuilder("Kalen", "The fragile Kalen alliance", 2).Build();
			const MN1 = new SpacemapNode({ name: "Gemini", faction: FN1, requiredWarp: 0 });
			throws(() => {
				SM.addNode(MN1).addNode(MN1);
			});
		});
		it("Adding a link creates a link between the two nodes", async () => {
			const SM: ISpacemapPrivileged = new Spacemap();
			const FN1 = new FactionBuilder("Kalen", "The fragile Kalen alliance", 2).Build();
			const MN1 = new SpacemapNode({ name: "Gemini", faction: FN1, requiredWarp: 0 });
			const MN2 = new SpacemapNode({ name: "Orion", faction: FN1, requiredWarp: 0 });

			SM.addNode(MN1).addNode(MN2);
			SM.addLink(MN1, MN2);

			SM.Graph.get("Gemini").has("Orion").must.be.true();
			SM.Graph.get("Orion").has("Gemini").must.be.true();
		});
		it("Should get the connected nodes of the passed node", async () => {
			const SM: ISpacemapPrivileged = new Spacemap();
			const FN1 = new FactionBuilder("Kalen", "The fragile Kalen alliance", 2).Build();
			const MN1 = new SpacemapNode({ name: "Kalen", faction: FN1, requiredWarp: 0 });
			const MN2 = new SpacemapNode({ name: "Orion", faction: FN1, requiredWarp: 0 });
			const MN3 = new SpacemapNode({ name: "Lyra", faction: FN1, requiredWarp: 0 });
			SM.addNode(MN1).addNode(MN2).addNode(MN3);
			SM.addLink("Kalen", "Orion").addLink("Lyra", "Kalen");

			SM.getConnectedNodes("Kalen").must.have.length(2);
		});
		it("Should properly allow/not allow travel based on warp strength", async () => {
			const SM: ISpacemapPrivileged = new Spacemap();
			const FN1 = new FactionBuilder("Lumissa", "The forward thinking but turmoiled alliance", 8).Build();
			const FN2 = new FactionBuilder("Arisna", "The technocrat alliance of the galaxy", 10).Build();
			const MN1 = new SpacemapNode({ name: "Lumix", faction: FN1, requiredWarp: WarpPower.LOW });
			const MN2 = new SpacemapNode({ name: "Octans", faction: FN2, requiredWarp: WarpPower.HIGH });
			SM.addNode(MN1).addNode(MN2);

			SM.canTravel("Lumix", WarpPower.LOW).must.be.true();
			SM.canTravel("Octans", WarpPower.MODERATE).must.be.false();
		});
	});
});
