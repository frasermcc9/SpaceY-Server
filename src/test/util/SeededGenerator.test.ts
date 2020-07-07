import { Client, connect, disconnect } from "../../lib/main";
import { GenerateClientSet, GENERATED_SHIPS } from "../TestUtil";
import { PlayerModel } from "../../lib/GameApi/Database/Player/PlayerModel";
import { AsteroidBuilder } from "../../lib/GameTypes/GameMechanics/Asteroid";
import { default as must } from "must";
import { Ship } from "../../lib/GameTypes/GameAsset/Ship/Ship";
import { BlueprintBuilder } from "../../lib/GameTypes/GameAsset/Blueprint/Blueprint";
import { BuildableDecorator } from "../../lib/GameTypes/GameAsset/AssetDecorators";
import { util } from "../../lib/Util/util";
require("must/register");

describe("Seeded Generator Test", async () => {
	it("Should produce a stream of the same numbers", async () => {
		const A = util.seededGenerator(100).next().value as number;
		const B = util.seededGenerator(100).next().value as number;
		const C = util.seededGenerator(100).next().value as number;
		A.must.eql(B);
		B.must.eql(C);
	});
	it("Should produce a stream of different numbers(manual seeding)", async () => {
		const A = util.seededGenerator(100).next().value as number;
		const B = util.seededGenerator(101).next().value as number;
		const C = util.seededGenerator(102).next().value as number;
		A.must.not.eql(B);
		B.must.not.eql(C);
	});
	it("Should produce a stream of different numbers (initial seeding)", async () => {
		const A = util.seededGenerator().next().value as number;
		const B = util.seededGenerator().next().value as number;
		const C = util.seededGenerator().next().value as number;
		A.must.not.eql(B);
		B.must.not.eql(C);
	});
	it("Should produce a stream of different numbers (no manual seeding)", async () => {
		const A = util.seededGenerator().next().value as number;
		const B = util.seededGenerator().next().value as number;
		const C = util.seededGenerator().next().value as number;
		A.must.not.eql(B);
		B.must.not.eql(C);
	});
});
