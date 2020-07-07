import { Client } from "../lib/main";
import { connect, disconnect } from "../lib/GameApi/Database/Database";
import { PlayerModel } from "../lib/GameApi/Database/Player/PlayerModel";
import { GenerateClientSet, generateIntegrationSet } from "./TestUtil";
import { throws } from "assert";
import { default as must } from "must";
import { SpacemapNodeBuilder, WarpPower } from "../lib/GameTypes/GameSpacemap/SpacemapNode";
import { Faction, FactionBuilder } from "../lib/GameTypes/GameAsset/Faction/Faction";
import { Spacemap } from "../lib/GameTypes/GameSpacemap/Spacemap";
require("must/register");

const DEFAULT_CREDITS = 10000;

before(async () => {
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
	const SM = new Spacemap();
	const SN = new SpacemapNodeBuilder({
		name: "Default",
		requiredWarp: WarpPower.NONE,
		faction: new FactionBuilder({ name: "G", techLevel: 2, description: "Test" }).Build(),
	}).build();
	SM.addNode(SN);
	Client.Reg.registerSpacemap(SM);
	Client.Reg.DefaultLocation = SN;
});

beforeEach(async () => {
	await PlayerModel.deleteMany({});
});

after(async () => {
	disconnect();
});

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
