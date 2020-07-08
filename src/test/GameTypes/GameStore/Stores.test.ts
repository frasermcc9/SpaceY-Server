import { PlayerModel } from "../../../lib/GameApi/Database/Player/PlayerModel";
import { SellableDecorator } from "../../../lib/GameTypes/GameAsset/AssetDecorators";
import { FactionBuilder } from "../../../lib/GameTypes/GameAsset/Faction/Faction";
import { GameCollectionBase } from "../../../lib/GameTypes/GameCollections/GameCollectionBase";
import { MaterialCollection } from "../../../lib/GameTypes/GameCollections/MaterialCollection";
import { BaseStore, StoreType } from "../../../lib/GameTypes/GameStore/BaseStore";
import { MaterialStore } from "../../../lib/GameTypes/GameStore/MaterialStore";
import { Client } from "../../../lib/main";
import { default as must } from "must";
import { throws } from "assert";
import { SpacemapNodeBuilder, WarpPower } from "../../../lib/GameTypes/GameSpacemap/SpacemapNode";

require("must/register");

const DEFAULT_CREDITS = 10000;

describe("Store Testing", async () => {
	describe("Material Store Tests", async () => {
		it("Should generate an inventory", async () => {
			const store: BaseStore = new MaterialStore({
				initialCredits: Infinity,
				type: StoreType.MATERIAL_STORE,
				generationValue: 10000,
				storeName: "MaterialStoreS1",
			});
			store.update();
			store.GetCollectionValue().must.be.gte(10000);
		});
		it("Should generate an inventory with rarity", async () => {
			const store: BaseStore = new MaterialStore({
				initialCredits: Infinity,
				type: StoreType.MATERIAL_STORE,
				generationValue: 10000,
				storeName: "MaterialStoreS1",
				centralRarity: 2,
			});
			store.update();
			store.GetCollectionValue().must.be.gte(10000);
		});
		it("Should be set with the given inventory", async () => {
			const store: BaseStore = new MaterialStore({
				initialCredits: Infinity,
				type: StoreType.MATERIAL_STORE,
				generationValue: 10000,
				storeName: "MaterialStoreS1",
			});
			const setInventory: GameCollectionBase = new MaterialCollection().set("Iron", 23).set("Gold", 3);
			store.setInventory(setInventory);

			const cost =
				new SellableDecorator(Client.Get().Registry.ResolveMaterialFromName("Iron")).PriceData.cost * 23 +
				new SellableDecorator(Client.Get().Registry.ResolveMaterialFromName("Gold")).PriceData.cost * 3;
			store.GetCollectionValue().must.equal(cost);
		});
		it("Should be set with the given inventory, no items of greater rarity", async () => {
			const store: BaseStore = new MaterialStore({
				initialCredits: Infinity,
				type: StoreType.MATERIAL_STORE,
				generationValue: 15000,
				storeName: "MaterialStoreS1",
				maxRarity: 8,
			});
			store.update();
			store.getCollectionValue().must.be.gte(15000);
			store.StoreItems.get("Gold").must.eql(0);
		});
		it("Should successfully buy item from store", async () => {
			//Setup
			const Player = await PlayerModel.findOneOrCreate({ uId: "1" });
			const store: BaseStore = new MaterialStore({
				initialCredits: 100,
				type: StoreType.MATERIAL_STORE,
				storeName: "MaterialStoreS1",
				marketForces: false,
			});
			const setInventory: GameCollectionBase = new MaterialCollection().set("Iron", 10).set("Gold", 5);
			store.setInventory(setInventory);
			//Assert intermediate tests
			Player.Credits.must.equal(DEFAULT_CREDITS);
			store.StoreItems.get("Iron").must.equal(10);
			store.StoreItems.get("Gold").must.equal(5);
			store.Credits.must.equal(100);
			//Main method call
			const BuyResult = await store.buyFromStore({ trader: Player, item: "Iron", quantity: 5 });
			const cost = Client.Get().Registry.ResolveMaterialFromName("Iron").Cost;
			//Assert memory tests
			cost.must.equal(25);
			BuyResult.code.must.eql(200);
			Player.Credits.must.equal(DEFAULT_CREDITS - 25 * 5);
			Player.Inventory.Materials.DataFromName("Iron").quantity.must.equal(5);
			store.StoreItems.get("Iron").must.equal(5);
			store.StoreItems.get("Gold").must.equal(5);
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
			const store: BaseStore = new MaterialStore({
				initialCredits: 100,
				type: StoreType.MATERIAL_STORE,
				storeName: "MaterialStoreS1",
				marketForces: false,
			});
			const setInventory: GameCollectionBase = new MaterialCollection().set("Iron", 10).set("Gold", 5);
			store.setInventory(setInventory);
			//Assert intermediate tests
			Player.Credits.must.equal(25);
			store.StoreItems.get("Iron").must.equal(10);
			store.StoreItems.get("Gold").must.equal(5);
			store.Credits.must.equal(100);
			//Main method call
			const BuyResult = await store.buyFromStore({ trader: Player, item: "Iron", quantity: 1 });
			const cost = Client.Get().Registry.ResolveMaterialFromName("Iron").Cost;
			//Assert memory tests
			BuyResult.code.must.eql(200);
			cost.must.equal(25);
			Player.Credits.must.equal(0);
			Player.Inventory.Materials.DataFromName("Iron").quantity.must.equal(1);
			store.StoreItems.get("Iron").must.equal(9);
			store.StoreItems.get("Gold").must.equal(5);
			store.Credits.must.equal(25 + 100);
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
			const store: BaseStore = new MaterialStore({
				initialCredits: 100,
				type: StoreType.MATERIAL_STORE,
				storeName: "MaterialStoreS1",
				marketForces: false,
			});
			const setInventory: GameCollectionBase = new MaterialCollection().set("Tech", 100);
			store.setInventory(setInventory);
			//Assert intermediate tests
			Player.Credits.must.equal(DEFAULT_CREDITS - 9900);
			store.StoreItems.get("Tech").must.equal(100);
			store.Credits.must.equal(100);
			//Main method call
			const BuyResult = await store.buyFromStore({ trader: Player, item: "Tech", quantity: 3 });
			const cost = Client.Get().Registry.ResolveMaterialFromName("Tech").Cost;
			//Assert memory tests
			BuyResult.code.must.eql(403);
			cost.must.equal(50);
			Player.Credits.must.equal(DEFAULT_CREDITS - 9900);
			Player.Inventory.Materials.DataFromName("Tech").quantity.must.equal(0);
			store.StoreItems.get("Tech").must.equal(100);
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
			const store: BaseStore = new MaterialStore({
				initialCredits: 100,
				type: StoreType.MATERIAL_STORE,
				storeName: "MaterialStoreS1",
				marketForces: false,
			});
			const setInventory: GameCollectionBase = new MaterialCollection().set("Food", 1);
			store.setInventory(setInventory);
			//Assert intermediate tests
			Player.Credits.must.equal(DEFAULT_CREDITS);
			store.StoreItems.get("Food").must.equal(1);
			store.Credits.must.equal(100);
			//Main method call
			const BuyResult = await store.buyFromStore({ trader: Player, item: "Food", quantity: 2 });
			const cost = Client.Get().Registry.ResolveMaterialFromName("Food").Cost;
			//Assert memory tests
			BuyResult.code.must.eql(403);
			cost.must.equal(5);
			Player.Credits.must.equal(DEFAULT_CREDITS);
			Player.Inventory.Materials.DataFromName("Food").quantity.must.equal(0);
			store.StoreItems.get("Food").must.equal(1);
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
			const store: BaseStore = new MaterialStore({
				initialCredits: 100,
				type: StoreType.MATERIAL_STORE,
				storeName: "MaterialStoreS1",
				marketForces: false,
			});
			const setInventory: GameCollectionBase = new MaterialCollection().set("Food", 1);
			store.setInventory(setInventory);
			//Assert intermediate tests
			Player.Credits.must.equal(DEFAULT_CREDITS);
			store.StoreItems.get("Food").must.equal(1);
			store.Credits.must.equal(100);
			//Main method call
			const BuyResult = await store.buyFromStore({ trader: Player, item: "Food", quantity: 1 });
			const cost = Client.Get().Registry.ResolveMaterialFromName("Food").Cost;
			//Assert memory tests
			BuyResult.code.must.eql(200);
			cost.must.equal(5);
			Player.Credits.must.equal(DEFAULT_CREDITS - 5);
			Player.Inventory.Materials.DataFromName("Food").quantity.must.equal(1);
			store.StoreItems.get("Food").must.equal(0);
			store.Credits.must.equal(105);
			//Confirm no database save
			const PlayerInDb = await PlayerModel.findOneOrCreate({ uId: "1" });
			//Assert no database save
			PlayerInDb.Inventory.Materials.DataFromName("Food").quantity.must.equal(1);
			PlayerInDb.Credits.must.equal(DEFAULT_CREDITS - 5);
		});

		it("Market forces should alter prices", async () => {
			const S1: BaseStore = new MaterialStore({
				initialCredits: 100,
				generationValue: 1000,
				type: StoreType.MATERIAL_STORE,
				storeName: "MaterialStoreS1",
				marketForces: true,
			});
			const S2: BaseStore = new MaterialStore({
				initialCredits: 100,
				generationValue: 1000,
				type: StoreType.MATERIAL_STORE,
				storeName: "MaterialStoreS2",
				marketForces: false,
			});
			Client.Reg.Spacemap.resolveNodeFromName("Default").addStore(S1);
			Client.Reg.Spacemap.resolveNodeFromName("Default").addStore(S2);
			S1.MarketForceSettings = { randEffect: 0, hiTechEffect: 50 };
			S1.update();
			S2.update();
			S1.StoreItemCosts.get("Tech").must.not.eql(S2.StoreItemCosts.get("Tech"));
		});
		it("Market forces should alter prices, work for buying", async () => {
			const Player = await PlayerModel.findOneOrCreate({ uId: "1" });
			const S1: BaseStore = new MaterialStore({
				initialCredits: 100,
				generationValue: 1000,
				type: StoreType.MATERIAL_STORE,
				storeName: "MaterialStoreS1",
				marketForces: true,
			});
			const S2: BaseStore = new MaterialStore({
				initialCredits: 100,
				generationValue: 1000,
				type: StoreType.MATERIAL_STORE,
				storeName: "MaterialStoreS2",
				marketForces: false,
			});
			Client.Reg.Spacemap.resolveNodeFromName("Default").addStore(S1);
			Client.Reg.Spacemap.resolveNodeFromName("Default").addStore(S2);
			S1.MarketForceSettings = { randEffect: 0, hiTechEffect: 50 };
			S1.update();
			S2.update();
			const cost = S1.getCostPerItem("Tech");

			const purchase = await S1.buyFromStore({ trader: Player, item: "Tech", quantity: 1 });
			purchase.code.must.eql(200);
			purchase.itemAmount.must.eql(1);
			Player.Credits.must.eql(DEFAULT_CREDITS - cost);
			const purchase2 = await S2.buyFromStore({ trader: Player, item: "Tech", quantity: 1 });
			purchase2.code.must.eql(200);
			purchase2.itemAmount.must.eql(2);
			Player.Credits.must.eql(DEFAULT_CREDITS - cost - 50);
		});
		it("Should update differently based on generation or manual set", async () => {
			const MS1 = new MaterialStore({
				initialCredits: 5000,
				storeName: "Default Material Store",
				type: StoreType.MATERIAL_STORE,
			});
			Client.Reg.Spacemap.resolveNodeFromName("Default").addStore(MS1);
			const MS1_Collection = new Map().set("Iron", 15).set("Gold", 10);
			MS1.setInventory(MS1_Collection);
			MS1.INTERNAL_GetCollection().get("Iron").must.eql(15);
			MS1.update();
			throws(() => {
				MS1.generateInventory();
			});
			MS1.INTERNAL_GetCollection().get("Iron").must.eql(15);
			MS1.editGenSettings({ generationValue: 10000 });
			MS1.generateInventory();
			MS1.getCollectionValue().must.be.gte(10000);
			MS1.setInventory(MS1_Collection);
			MS1.INTERNAL_GetCollection().get("Iron").must.eql(15);
			MS1.INTERNAL_AlterItem("Iron", -10);
			MS1.INTERNAL_GetCollection().get("Iron").must.eql(5);
			MS1.update();
			MS1.INTERNAL_GetCollection().get("Iron").must.eql(15);
		});

		it("Should update all stores", () => {
			const MS1 = new MaterialStore({
				initialCredits: 5000,
				storeName: "MsOne",
				type: StoreType.MATERIAL_STORE,
				generationValue: 250,
			});
			const MS2 = new MaterialStore({
				initialCredits: 5000,
				storeName: "MsTwo",
				type: StoreType.MATERIAL_STORE,
				generationValue: 450,
			});
			const MS3 = new MaterialStore({
				initialCredits: 5000,
				storeName: "MsThree",
				type: StoreType.MATERIAL_STORE,
				generationValue: 1250,
			});

			const FN1 = new FactionBuilder({ name: "G", techLevel: 4, description: "Test" }).Build();

			const SN1 = new SpacemapNodeBuilder({
				name: "TestNodeOne",
				requiredWarp: WarpPower.NONE,
				faction: FN1,
			})
				.addStore(MS1)
				.addStore(MS2)
				.build();
			const SN2 = new SpacemapNodeBuilder({
				name: "TestNodeTwo",
				requiredWarp: WarpPower.NONE,
				faction: FN1,
			})
				.addStore(MS3)
				.build();

			Client.Reg.Spacemap.addNodes([SN1, SN2]);

			MS1.INTERNAL_AlterItem("Gold", -8);
			MS1.getCollectionValue().must.be.lt(250);
			MS2.INTERNAL_AlterItem("Iron", -15);
			MS2.getCollectionValue().must.be.lt(450);
			MS3.INTERNAL_AlterItem("Tech", -10);
			MS3.getCollectionValue().must.be.lt(1250);

			Client.Reg.Spacemap.updateMap();

			MS1.getCollectionValue().must.be.gte(250);
			MS2.getCollectionValue().must.be.gte(450);
			MS3.getCollectionValue().must.be.gte(1250);
		});
	});
});
