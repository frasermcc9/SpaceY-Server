import { Client } from "../../lib/main";
import { connect, disconnect } from "../../lib/GameApi/Database/Database";
import { PlayerModel } from "../../lib/GameApi/Database/Player/PlayerModel";
import { GenerateClientSet } from "../TestUtil";
import { default as must } from "must";
import { throws } from "assert";
import { Material, MaterialBuilder } from "../../lib/GameTypes/GameAsset/Material/Material";
require("must/register");

const DEFAULT_CREDITS = 10000;

before(async () => {
	Client.Create({
		databaseName: "testSpaceY",
		databaseUri: "mongodb://localhost:27017",
		defaultCredits: DEFAULT_CREDITS,
	});
	GenerateClientSet();
	connect();
});

beforeEach(async () => {
	await PlayerModel.deleteMany({});
});

after(async () => {
	disconnect();
});

describe("Player Database", () => {
	describe("Creating Players", () => {
		it("Should add three users to the database", async () => {
			await Promise.all([PlayerModel.findOneOrCreate({ uId: "5" }), PlayerModel.findOneOrCreate({ uId: "6" }), PlayerModel.findOneOrCreate({ uId: "7" })]);
			PlayerModel.find().must.eventually.have.length(3);
		});

		it("Should add a new player, then be able to find that player", async () => {
			await PlayerModel.findOneOrCreate({ uId: "123" });
			const Found2 = await PlayerModel.findOne({ uId: "123" });
			Found2!.uId.must.equal("123");
		});

		it("Should find an existing player, not create", async () => {
			await PlayerModel.findOneOrCreate({ uId: "73" });
			PlayerModel.find().must.eventually.have.length(1);

			const found = await PlayerModel.findOneOrCreate({ uId: "73" });
			found.must.exist();
			PlayerModel.find().must.eventually.have.length(1);
		});
	});

	describe("Player Credits Data", () => {
		it("Player should have default number of credits", async () => {
			const Player = await PlayerModel.findOneOrCreate({ uId: "100" });
			//ASSERT
			Player.Credits.must.equal(DEFAULT_CREDITS);
		});

		it("Adding credits should save the new credit amount", async () => {
			const Player = await PlayerModel.findOneOrCreate({ uId: "100" });
			await Player.AddCredits({ amount: 1000 });
			const Found = await PlayerModel.findOneOrCreate({ uId: "100" });
			//ASSERT
			Found.Credits.must.equal(DEFAULT_CREDITS + 1000);
		});

		it("Adding credits should save the new credit amount (fractional)", async () => {
			await PlayerModel.findOneOrCreate({ uId: "100" });
			const Found = await PlayerModel.findOneOrCreate({ uId: "100" });
			await Found.AddCredits({ amount: 2.5 });
			//Assert
			Found.Credits.must.equal(DEFAULT_CREDITS + 2.5);
		});

		it("Removing credits should save the new credit amount", async () => {
			const Player = await PlayerModel.findOneOrCreate({ uId: "125" });
			await Player.RemoveCredits({ amount: 1000 });
			const Found = await PlayerModel.findOneOrCreate({ uId: "125" });
			//Assert
			Found.Credits.must.equal(DEFAULT_CREDITS - 1000);
		});

		it("Removing too many credits returns false", async () => {
			const Player = await PlayerModel.findOneOrCreate({ uId: "125" });
			const Success = await Player.RemoveCredits({ amount: DEFAULT_CREDITS + 1 });
			const Found = await PlayerModel.findOneOrCreate({ uId: "125" });
			//Assert
			Success.must.be.false();
			Found.Credits.must.equal(DEFAULT_CREDITS);
		});

		it("getCredits shortcut method returns correct amount of credits", async () => {
			const Player = await PlayerModel.findOneOrCreate({ uId: "125" });
			//Assert
			Player.Credits.must.equal(DEFAULT_CREDITS);
		});

		it("Negative credit increment fails", async () => {
			const Player = await PlayerModel.findOneOrCreate({ uId: "125" });
			Player.RemoveCredits({ amount: -100 }).must.reject.with.error();
		});

		it("Negative credit decrement fails", async () => {
			const Player = await PlayerModel.findOneOrCreate({ uId: "125" });
			Player.AddCredits({ amount: -100 }).must.reject.with.error();
		});
	});

	describe("In Memory, Direct Inventory Manipulation", () => {
		it("Should get the player inventory", async () => {
			await PlayerModel.findOneOrCreate({ uId: "1" });
			const Player = await PlayerModel.findOneOrCreate({ uId: "1" });
			Player.Inventory.Materials.must.exist();
		});
		it("Should be able to get a material from a new player's inventory and confirm it is 0", async () => {
			const Player = await PlayerModel.findOneOrCreate({ uId: "1" });
			const Material = Client.Get().Registry.ResolveMaterialFromName("Iron");
			//Assert
			Player.Inventory.Materials.DataFromName("Iron").quantity.must.equal(0);
			Player.Inventory.Materials.DataFromMaterial(Material).quantity.must.equal(0);
		});
		it("Should add to a players inventory", async () => {
			const Player = await PlayerModel.findOneOrCreate({ uId: "1" });
			const Material = Client.Get().Registry.ResolveMaterialFromName("Tech");
			//Assert
			const result = Player.Inventory.Materials.Increase("Tech", 10);
			result.amount.must.equal(10);
		});
		it("Should try to remove more than the player has, failing.", async () => {
			const Player = await PlayerModel.findOneOrCreate({ uId: "1" });
			Player.Inventory.Materials.DataFromName("Iron").quantity.must.equal(0);
			const result = Player.Inventory.Materials.ReduceToNonNegative("Iron", 10);
			//Assert
			result.success.must.equal(false);
			result.code.must.equal(3);
		});
		it("Should remove from the player inventory.", async () => {
			const Player = await PlayerModel.findOneOrCreate({ uId: "1" });
			Player.Inventory.Materials.DataFromName("Iron").quantity.must.equal(0);
			Player.Inventory.Materials.Increase("Iron", 30);
			const result = Player.Inventory.Materials.ReduceToNonNegative("Iron", 10);
			//Assert
			result.success.must.equal(true);
			result.amount.must.equal(20);
		});
		it("Should return false when accessing undefined item.", async () => {
			const Player = await PlayerModel.findOneOrCreate({ uId: "1" });
			const result = Player.Inventory.Materials.Increase("Unknown Material", 30);
			//Assert
			result.code.must.equal(2);
			result.success.must.be.false();
		});
		it("Should throw when negative numbers are passed to inventory altering functions", async () => {
			const Player = await PlayerModel.findOneOrCreate({ uId: "1" });
			throws(() => {
				Player.Inventory.Materials.Increase("Iron", -30);
			});
			throws(() => {
				Player.Inventory.Materials.ReduceToNonNegative("Iron", -30);
			});
		});
	});

	describe("Inventory Saving in Database", () => {
		it("Should save changes to the player inventory (increases).", async () => {
			const Player = await PlayerModel.findOneOrCreate({ uId: "1" });
			const result = await Player.MaterialIncrement("Iron", 10);
			//Assert
			result.success.must.equal(true);
			result.amount.must.equal(10);
			const FindInDB = await PlayerModel.findOneOrCreate({ uId: "1" });
			FindInDB.Inventory.Materials.DataFromName("Iron").quantity.must.equal(10);
		});
		it("Should save changes to the player inventory (decreases).", async () => {
			const Player = await PlayerModel.findOneOrCreate({ uId: "1" });
			const result = await Player.MaterialIncrement("Iron", 25);
			result.amount.must.equal(25);
			const FindInDB = await PlayerModel.findOneOrCreate({ uId: "1" });
			FindInDB.Inventory.Materials.DataFromName("Iron").quantity.must.equal(25);
			await FindInDB.MaterialDecrement("Iron", 5);
			const FindInDB2 = await PlayerModel.findOneOrCreate({ uId: "1" });
			//Assert
			FindInDB2.Inventory.Materials.DataFromName("Iron").quantity.must.equal(20);
		});

	});
});
