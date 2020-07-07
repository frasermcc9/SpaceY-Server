import { Client } from "../lib/main";
import { connect, disconnect } from "../lib/GameApi/Database/Database";
import { PlayerModel } from "../lib/GameApi/Database/Player/PlayerModel";
import { GenerateClientSet, generateIntegrationSet } from "./TestUtil";
import { throws } from "assert";
import { default as must } from "must";
require("must/register");

const DEFAULT_CREDITS = 10000;

/* before(async () => {
	Client.Create({
		databaseName: "testSpaceY",
		databaseUri: "mongodb://localhost:27017",
		defaultCredits: DEFAULT_CREDITS,
		consoleLogging: false,
		maximumRarity: 10,
		maximumTechLevel: 10,
	});
	GenerateClientSet();
	connect();
}); */

beforeEach(async () => {
	await PlayerModel.deleteMany({});
});

after(async () => {
	disconnect();
});

it.only("Should run the integration test", () => {
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

	Client.Reg.ShipRegistry.forEach((el) => console.log(el));
});
