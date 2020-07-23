import { SpacemapNode, WarpPower, SpacemapNodeBuilder } from "../../../lib/GameTypes/GameSpacemap/SpacemapNode";
import { Spacemap, ISpacemap, ISpacemapPrivileged } from "../../../lib/GameTypes/GameSpacemap/Spacemap";
import { throws } from "assert";
import { default as must } from "must";
import { FactionBuilder } from "../../../lib/GameTypes/GameAsset/Faction/Faction";
require("must/register");

describe("Spacemap Tests", async () => {
    const FN1 = new FactionBuilder({
        name: "Kalen",
        description: "The fragile Kalen alliance",
        techLevel: 2,
    }).Build();

    describe("SpacemapNode tests", async () => {
        it("Should return the proper data", async () => {
            const MN1 = new SpacemapNodeBuilder({ name: "Gemini", faction: FN1, requiredWarp: 0 }).build();
            MN1.Name.must.eql("Gemini");
            MN1.Faction.Name.must.eql("Kalen");
            MN1.RequiredWarp.must.eql(WarpPower.NONE);
        });
        it("Should return the formatted data", async () => {
            const MN1 = new SpacemapNodeBuilder({ name: "Orion", faction: FN1, requiredWarp: 0 }).build();
            MN1.toString().must.eql("Kalen: Orion");
        });
    });

    describe("Spacemap tests", async () => {
        it("Should add two nodes to the spacemap", async () => {
            const SM: ISpacemapPrivileged = new Spacemap();

            const MN1 = new SpacemapNodeBuilder({ name: "Gemini", faction: FN1, requiredWarp: 0 }).build();
            const MN2 = new SpacemapNodeBuilder({ name: "Orion", faction: FN1, requiredWarp: 0 }).build();

            SM.addNode(MN1).addNode(MN2);
            SM.Graph.size.must.eql(2);
        });
        it("Adding two of the same node must fail", async () => {
            const SM: ISpacemapPrivileged = new Spacemap();
            const MN1 = new SpacemapNodeBuilder({ name: "Gemini", faction: FN1, requiredWarp: 0 }).build();
            throws(() => {
                SM.addNode(MN1).addNode(MN1);
            });
        });
        it("Adding a link creates a link between the two nodes", async () => {
            const SM: ISpacemapPrivileged = new Spacemap();
            const MN1 = new SpacemapNodeBuilder({ name: "Gemini", faction: FN1, requiredWarp: 0 }).build();
            const MN2 = new SpacemapNodeBuilder({ name: "Orion", faction: FN1, requiredWarp: 0 }).build();

            SM.addNode(MN1).addNode(MN2);
            SM.addLink(MN1, MN2);

            SM.Graph.get("Gemini").has("Orion").must.be.true();
            SM.Graph.get("Orion").has("Gemini").must.be.true();
        });
        it("Should get the connected nodes of the passed node", async () => {
            const SM: ISpacemapPrivileged = new Spacemap();
            const MN1 = new SpacemapNodeBuilder({ name: "Kalen", faction: FN1, requiredWarp: 0 }).build();
            const MN2 = new SpacemapNodeBuilder({ name: "Orion", faction: FN1, requiredWarp: 0 }).build();
            const MN3 = new SpacemapNodeBuilder({ name: "Lyra", faction: FN1, requiredWarp: 0 }).build();
            SM.addNode(MN1).addNode(MN2).addNode(MN3);
            SM.addLink("Kalen", "Orion").addLink("Lyra", "Kalen");

            SM.getConnectedNodes("Kalen").must.have.length(2);
        });
        it("Should properly allow/not allow travel based on warp strength", async () => {
            const SM: ISpacemapPrivileged = new Spacemap();

            const FN2 = new FactionBuilder({
                name: "Arisna",
                description: "The technocrat alliance of the galaxy",
                techLevel: 10,
            }).Build();
            const FN1 = new FactionBuilder({
                name: "Lumissa",
                description: "The forward thinking but turmoiled alliance",
                techLevel: 8,
            }).Build();

            const MN1 = new SpacemapNodeBuilder({ name: "Lumix", faction: FN1, requiredWarp: WarpPower.LOW }).build();
            const MN2 = new SpacemapNodeBuilder({ name: "Octans", faction: FN2, requiredWarp: WarpPower.HIGH }).build();
            SM.addNode(MN1).addNode(MN2);

            SM.canTravel("Lumix", WarpPower.LOW).must.be.true();
            SM.canTravel("Octans", WarpPower.MODERATE).must.be.false();
        });
    });
});
