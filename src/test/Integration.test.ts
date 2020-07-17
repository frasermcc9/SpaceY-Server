import { Client } from "../lib/main";
import { connect, disconnect } from "../lib/Database/Database";
import { PlayerModel } from "../lib/Database/Models/Player/PlayerModel";
import { GenerateClientSet, generateIntegrationSet } from "./TestUtil";
import { throws } from "assert";
import { default as must } from "must";
import { SpacemapNodeBuilder, WarpPower } from "../lib/GameTypes/GameSpacemap/SpacemapNode";
import { Faction, FactionBuilder } from "../lib/GameTypes/GameAsset/Faction/Faction";
import { Spacemap } from "../lib/GameTypes/GameSpacemap/Spacemap";
require("must/register");

xit("Should run the integration test", () => {
	Client.Destroy();
	Client.Create({
		databaseName: "testSpaceY",
		databaseUri: "mongodb://localhost:27017",
		defaultCredits: DEFAULT_CREDITS,
		consoleLogging: false,
		maximumRarity: 10,
		maximumTechLevel: 10,
	});
	generateIntegrationSet();

	//Client.Reg.ShipRegistry.forEach((el) => console.log(el));
});
