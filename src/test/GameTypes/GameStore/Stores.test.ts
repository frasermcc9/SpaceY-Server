import { Client, connect, disconnect } from "../../../lib/main";
import { BaseStore } from "../../../lib/GameTypes/GameStore/BaseStore";
import { MaterialStore } from "../../../lib/GameTypes/GameStore/MaterialStore";
import { PlayerModel } from "../../../lib/GameApi/Database/Player/PlayerModel";
import { default as must } from "must";
import { Material } from "../../../lib/GameTypes/GameAsset/Material/Material";
import { GameCollectionBase } from "../../../lib/GameTypes/GameCollections/GameCollectionBase";
import { MaterialCollection } from "../../../lib/GameTypes/GameCollections/MaterialCollection";
import { StorePublisher } from "../../../lib/GameTypes/GameStore/StorePublisher";
import { SellableDecorator } from "../../../lib/GameTypes/GameAsset/AssetDecorators";
import { GenerateClientSet } from "../../TestUtil";
require("must/register");

const DEFAULT_CREDITS = 10000;

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
			store.AddToInventory(setInventory);
			const cost =
				new SellableDecorator(Client.Get().Registry.ResolveMaterialFromName("Iron")).PriceData.cost * 23 +
				new SellableDecorator(Client.Get().Registry.ResolveMaterialFromName("Gold")).PriceData.cost * 3;
			store.GetCollectionValue().must.equal(cost);
		});
		it("Should be set with the given inventory, no items of greater rarity", async () => {
			const store: BaseStore<Material> = new MaterialStore({ value: 15000, maxRarity: 10, rarity: true });
			store.Update();
			store.GetCollectionValue().must.be.gte(15000);
		});
		it("Should successfully buy item from store", async () => {
			//Setup
			const Player = await PlayerModel.findOneOrCreate({ uId: "1" });
			const store = new MaterialStore({ credits: 100 });
			const setInventory: GameCollectionBase = new MaterialCollection().set("Iron", 10).set("Gold", 5);
			store.AddToInventory(setInventory);
			//Assert intermediate tests
			Player.Credits.must.equal(DEFAULT_CREDITS);
			store.get("Iron").must.equal(10);
			store.get("Gold").must.equal(5);
			store.Credits.must.equal(100);
			//Main method call
			const BuyResult = await store.Buy({ buyer: Player, item: "Iron", quantity: 5 });
			const cost = Client.Get().Registry.ResolveMaterialFromName("Iron").Cost;
			//Assert memory tests
			BuyResult.success.must.be.true();
			cost.must.equal(25);
			Player.Credits.must.equal(DEFAULT_CREDITS - 25 * 5);
			Player.Inventory.Materials.DataFromName("Iron").quantity.must.equal(5);
			store.get("Iron").must.equal(5);
			store.get("Gold").must.equal(5);
			store.Credits.must.equal(25 * 5 + 100);
			//Confirm database save
			const PlayerInDb = await PlayerModel.findOneOrCreate({ uId: "1" });
			//Assert database save
			PlayerInDb.Inventory.Materials.DataFromName("Iron").quantity.must.equal(5);
			PlayerInDb.Credits.must.equal(DEFAULT_CREDITS - 25 * 5);
		});
		it("Should successfully buy item from store", async () => {
			//Setup
			const Player = await PlayerModel.findOneOrCreate({ uId: "1" });
			await Player.CreditsDecrement({ amount: DEFAULT_CREDITS - 25 });
			const store = new MaterialStore({ credits: 100 });
			const setInventory: GameCollectionBase = new MaterialCollection().set("Iron", 10).set("Gold", 5);
			store.AddToInventory(setInventory);
			//Assert intermediate tests
			Player.Credits.must.equal(25);
			store.get("Iron").must.equal(10);
			store.get("Gold").must.equal(5);
			store.Credits.must.equal(100);
			//Main method call
			const BuyResult = await store.Buy({ buyer: Player, item: "Iron", quantity: 1 });
			const cost = Client.Get().Registry.ResolveMaterialFromName("Iron").Cost;
			//Assert memory tests
			BuyResult.success.must.be.true();
			cost.must.equal(25);
			Player.Credits.must.equal(0);
			Player.Inventory.Materials.DataFromName("Iron").quantity.must.equal(1);
			store.get("Iron").must.equal(9);
			store.get("Gold").must.equal(5);
			store.Credits.must.equal(25 * 1 + 100);
			//Confirm database save
			const PlayerInDb = await PlayerModel.findOneOrCreate({ uId: "1" });
			//Assert database save
			PlayerInDb.Inventory.Materials.DataFromName("Iron").quantity.must.equal(1);
			PlayerInDb.Credits.must.equal(0);
		});
		it("Should fail because the player has insufficient credits", async () => {
			//Setup
			const Player = await PlayerModel.findOneOrCreate({ uId: "1" });
			Player.CreditsDecrement({ amount: 9900 });
			const store = new MaterialStore({ credits: 100 });
			const setInventory: GameCollectionBase = new MaterialCollection().set("Tech", 100);
			store.AddToInventory(setInventory);
			//Assert intermediate tests
			Player.Credits.must.equal(DEFAULT_CREDITS - 9900);
			store.get("Tech").must.equal(100);
			store.Credits.must.equal(100);
			//Main method call
			const BuyResult = await store.Buy({ buyer: Player, item: "Tech", quantity: 3 });
			const cost = Client.Get().Registry.ResolveMaterialFromName("Tech").Cost;
			//Assert memory tests
			BuyResult.success.must.be.false();
			BuyResult.code.must.equal(4);
			cost.must.equal(50);
			Player.Credits.must.equal(DEFAULT_CREDITS - 9900);
			Player.Inventory.Materials.DataFromName("Tech").quantity.must.equal(0);
			store.get("Tech").must.equal(100);
			store.Credits.must.equal(100);
			//Confirm no database save
			const PlayerInDb = await PlayerModel.findOneOrCreate({ uId: "1" });
			//Assert no database save
			PlayerInDb.Inventory.Materials.DataFromName("Tech").quantity.must.equal(0);
			PlayerInDb.Credits.must.equal(DEFAULT_CREDITS - 9900);
		});
		it("Should fail because the store has insufficient items", async () => {
			//Setup
			const Player = await PlayerModel.findOneOrCreate({ uId: "1" });
			const store = new MaterialStore({ credits: 100 });
			const setInventory: GameCollectionBase = new MaterialCollection().set("Food", 1);
			store.AddToInventory(setInventory);
			//Assert intermediate tests
			Player.Credits.must.equal(DEFAULT_CREDITS);
			store.get("Food").must.equal(1);
			store.Credits.must.equal(100);
			//Main method call
			const BuyResult = await store.Buy({ buyer: Player, item: "Food", quantity: 2 });
			const cost = Client.Get().Registry.ResolveMaterialFromName("Food").Cost;
			//Assert memory tests
			BuyResult.success.must.be.false();
			BuyResult.code.must.equal(3);
			cost.must.equal(5);
			Player.Credits.must.equal(DEFAULT_CREDITS);
			Player.Inventory.Materials.DataFromName("Food").quantity.must.equal(0);
			store.get("Food").must.equal(1);
			store.Credits.must.equal(100);
			//Confirm no database save
			const PlayerInDb = await PlayerModel.findOneOrCreate({ uId: "1" });
			//Assert no database save
			PlayerInDb.Inventory.Materials.DataFromName("Food").quantity.must.equal(0);
			PlayerInDb.Credits.must.equal(DEFAULT_CREDITS);
		});
		it("Should pass test where store becomes empty", async () => {
			//Setup
			const Player = await PlayerModel.findOneOrCreate({ uId: "1" });
			const store = new MaterialStore({ credits: 100 });
			const setInventory: GameCollectionBase = new MaterialCollection().set("Food", 1);
			store.AddToInventory(setInventory);
			//Assert intermediate tests
			Player.Credits.must.equal(DEFAULT_CREDITS);
			store.get("Food").must.equal(1);
			store.Credits.must.equal(100);
			//Main method call
			const BuyResult = await store.Buy({ buyer: Player, item: "Food", quantity: 1 });
			const cost = Client.Get().Registry.ResolveMaterialFromName("Food").Cost;
			//Assert memory tests
			BuyResult.success.must.be.true();
			BuyResult.code.must.equal(1);
			cost.must.equal(5);
			Player.Credits.must.equal(DEFAULT_CREDITS - 5);
			Player.Inventory.Materials.DataFromName("Food").quantity.must.equal(1);
			store.get("Food").must.equal(0);
			store.Credits.must.equal(105);
			//Confirm no database save
			const PlayerInDb = await PlayerModel.findOneOrCreate({ uId: "1" });
			//Assert no database save
			PlayerInDb.Inventory.Materials.DataFromName("Food").quantity.must.equal(1);
			PlayerInDb.Credits.must.equal(DEFAULT_CREDITS - 5);
		});
	});
});
