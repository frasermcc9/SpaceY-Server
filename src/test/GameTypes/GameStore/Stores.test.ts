import { Client, connect, disconnect } from "../../../lib/main";
import { BaseStore } from "../../../lib/GameTypes/GameStore/BaseStore";
import { MaterialStore } from "../../../lib/GameTypes/GameStore/MaterialStore";
import { PlayerModel } from "../../../lib/GameApi/Database/Player/PlayerModel";
import { default as must } from "must";
import { Material } from "../../../lib/GameTypes/GameAsset/Material/Material";
import { GameCollectionBase } from "../../../lib/GameTypes/GameCollections/GameCollectionBase";
import { MaterialCollection } from "../../../lib/GameTypes/GameCollections/MaterialCollection";
import { MaterialDecoratorSellable } from "../../../lib/GameTypes/GameAsset/Material/DecoratorSellable";
import { StorePublisher } from "../../../lib/GameTypes/GameStore/StorePublisher";
require("must/register");

const DEFAULT_CREDITS = 10000;

before(async () => {
	Client.Create({
		databaseName: "testSpaceY",
		databaseUri: "mongodb://localhost:27017",
		defaultCredits: DEFAULT_CREDITS,
		consoleLogging: true,
		maximumRarity: 12,
	});
	connect();
});

beforeEach(async () => {
	await PlayerModel.deleteMany({});
});

after(async () => {
	disconnect();
});

describe("Store Testing", async () => {
	describe("Store Updater Testing", async () => {
		xit("Should run the events", () => {
			const store: BaseStore<Material> = new MaterialStore({ value: 1000 });
			const publisher = new StorePublisher().RegisterStore(store, 5, "StoreA");
			setInterval(() => {
				console.log(store);
			}, 5 * 1000);
			setTimeout(() => {
				publisher.DeregisterStore("StoreA");
			}, 15 * 1000);
		});
	});

	describe("Material Store Tests", async () => {
		it("Should generate an inventory", async () => {
			const store: BaseStore<Material> = new MaterialStore({ value: 10000, rarity: false });
			store.Update();
			store.GetCollectionValue().must.be.gte(10000);
		});
		it("Should generate an inventory with rarity", async () => {
			const store: BaseStore<Material> = new MaterialStore({ value: 10000, rarity: true });
			store.Update();
			store.GetCollectionValue().must.be.gte(10000);
		});
		it("Should be set with the given inventory", async () => {
			const store: BaseStore<Material> = new MaterialStore({});
			const setInventory: GameCollectionBase = new MaterialCollection().set("Iron", 23).set("Gold", 3);
			store.SetInventory(setInventory);
			const cost =
				new MaterialDecoratorSellable(Client.Get().Registry.ResolveMaterialFromName("Iron")).GetCost().cost * 23 +
				new MaterialDecoratorSellable(Client.Get().Registry.ResolveMaterialFromName("Gold")).GetCost().cost * 3;
			store.GetCollectionValue().must.equal(cost);
		});
		it("Should be set with the given inventory, no items of greater rarity", async () => {
			const store: BaseStore<Material> = new MaterialStore({ value: 15000, maxRarity: 10, rarity: true });
			store.Update();
			store.GetCollectionValue().must.be.gte(15000);
		});
	});
});
