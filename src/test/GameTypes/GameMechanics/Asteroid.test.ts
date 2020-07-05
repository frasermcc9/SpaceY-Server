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
		it("Should apply the cooldown, then not work because on cooldown", async () => {
			const Player = await PlayerModel.findOneOrCreate({ uId: "6" });
			const asteroid1 = new AsteroidBuilder().setCooldown(5).BuildRandom({ value: 1000 });
			(await asteroid1.mine(Player)).code.must.eql(200);
			const failed = await asteroid1.mine(Player);
			failed.code.must.eql(403);
			failed.cooldown.must.eql(5);
			asteroid1.clearCooldowns();
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

describe("Integration tests between player, laser and attachment", async () => {
	it("Should have altered numbers from attachment", async () => {
		const Player = await PlayerModel.findOneOrCreate({ uId: "1" });
		Player.setShip("Destroyer");
		(await Player.addAttachmentToShip("Perfected Mining Laser")).code.must.eql(200);
		const asteroidMaterials = new Map<string, number>().set("Iron", 100).set("Gold", 100).set("Tech", 100);
		const asteroid = new AsteroidBuilder().BuildCustom({ data: asteroidMaterials });
		(await asteroid.mine(Player, 0)).code.must.eql(200);
		asteroid.CollectionSize.must.eql(600);
	});
	it("Should alter numbers from deviation (could fail despite being right)", async () => {
		const Player = await PlayerModel.findOneOrCreate({ uId: "1" });
		Player.setShip("Destroyer");
		const asteroidMaterials = new Map<string, number>().set("Iron", 100).set("Gold", 100).set("Tech", 100);
		const asteroid = new AsteroidBuilder().BuildCustom({ data: asteroidMaterials });
		(await asteroid.mine(Player, 100)).code.must.eql(200);
		Player.Inventory.Materials.CollectionSize.must.not.eql(300);
	});
	it("Should use the mining laser and alter from deviation", async () => {
		const Player = await PlayerModel.findOneOrCreate({ uId: "1" });
		Player.setShip("Destroyer");
		(await Player.addAttachmentToShip("Perfected Mining Laser")).code.must.eql(200);
		const asteroidMaterials = new Map<string, number>().set("Iron", 100).set("Gold", 100).set("Tech", 100);
		const asteroid = new AsteroidBuilder().BuildCustom({ data: asteroidMaterials });
		(await asteroid.mine(Player, 100)).code.must.eql(200);
	});
});
