import { Client, connect, disconnect } from "../../../lib/main";
import { GenerateClientSet } from "../../TestUtil";
import { PlayerModel } from "../../../lib/GameApi/Database/Player/PlayerModel";
import { AsteroidBuilder } from "../../../lib/GameTypes/GameMechanics/Asteroid";
import { default as must } from "must";
require("must/register");

const DEFAULT_CREDITS = 10000;

describe("Asteroid Tests (in memory)", async () => {
	describe("Asteroid Tests", async () => {
		it("Should add the asteroid collection to the player that mines it", async () => {
			const Player = await PlayerModel.findOneOrCreate({ uId: "1" });
			const asteroid1 = new AsteroidBuilder().BuildRandom({ value: 1000 });
			asteroid1.PlayerMine(Player);
			Player.Inventory.Materials.GetCollectionValue().must.be.gte(1000);
		});
		it("Should add the asteroid collection and save to the player that mines it in DB", async () => {
			const Player = await PlayerModel.findOneOrCreate({ uId: "1" });
			const asteroid1 = new AsteroidBuilder().BuildRandom({ value: 1000 });
			asteroid1.PlayerMineAndSave(Player);
			const FindInDb = await PlayerModel.findOneOrCreate({ uId: "1" });
			FindInDb.Inventory.Materials.GetCollectionValue().must.be.gte(1000);
		});
		it("Should not save the asteroid collection to the database", async () => {
			const Player = await PlayerModel.findOneOrCreate({ uId: "1" });
			const asteroid1 = new AsteroidBuilder().BuildRandom({ value: 1000 });
			asteroid1.PlayerMine(Player);
			Player.Inventory.Materials.GetCollectionValue().must.be.gte(1000);
			const PlayerInDb1 = await PlayerModel.findOneOrCreate({ uId: "1" });
			PlayerInDb1.Inventory.Materials.GetCollectionValue().must.equal(0);
		});
	});
	describe("Asteroid Tests (in database)", async () => {
		it("Should add two asteroids properly to same player.", async () => {
			const Player = await PlayerModel.findOneOrCreate({ uId: "1" });
			const asteroid1 = new AsteroidBuilder().BuildRandom({ value: 1000 });
			const asteroid2 = new AsteroidBuilder().BuildRandom({ value: 1500 });
			asteroid1.PlayerMineAndSave(Player);
			const PlayerInDb1 = await PlayerModel.findOneOrCreate({ uId: "1" });
			PlayerInDb1.Inventory.Materials.GetCollectionValue().must.be.gte(1000);
			asteroid2.PlayerMineAndSave(PlayerInDb1);
			PlayerInDb1.Inventory.Materials.GetCollectionValue().must.be.gte(2500);
			const PlayerInDb2 = await PlayerModel.findOneOrCreate({ uId: "1" });
			PlayerInDb2.Inventory.Materials.GetCollectionValue().must.be.gte(2500);
		});
	});
});
