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

describe("Collection Testing", async () => {
	describe("Base Collection Testing", async () => {
		it("Material collection should have the specified materials.", () => {
			const MC = new MaterialCollection();
			MC.Increase("Iron", 10);
			MC.Increase("Gold", 5);
			Array.from(MC.values())
				.reduce((a, v) => a + v)
				.must.eql(15);
		});
		it("Using base map get should get the correct values", () => {
			const MC = new MaterialCollection();
			MC.Increase("Iron", 10);
			MC.Increase("Gold", 5);
			MC.get("Iron").must.eql(10);
			MC.get("Gold").must.eql(5);
		});
		it("Using DetailedGet should get the correct value for single string", () => {
			const MC = new MaterialCollection();
			MC.Increase("Food", 25);
			const Result = MC.DetailedGet("Food");
			Result.success.must.be.true();
			Result.item.Name.must.eql("Food");
			Result.quantity.must.eql(25);
			Result.code.must.eql(200);
		});
		it("Using DetailedGet should get the correct values for string array", () => {
			const MC = new MaterialCollection();
			MC.Increase("Iron", 10);
			MC.Increase("Gold", 5);
			MC.Increase("Food", 25);
			MC.Increase("Tech", 15);
			const Names = ["Iron", "Gold", "Food", "Tech"];
			const Quantities = [10, 5, 25, 15];
			const Results = MC.DetailedGet(Names);
			Results.forEach((result, idx) => {
				result.success.must.be.true();
				result.code.must.eql(200);
				result.item.Name.must.equal(Names[idx]);
				result.quantity.must.equal(Quantities[idx]);
			});
		});
		it("Using DetailedGet should get the correct value for single item", () => {
			const MC = new MaterialCollection();
			MC.Increase("Food", 25);
			const Item = Client.Reg.AnyResolve("Food");
			const Result = MC.DetailedGet(Item);
			Result.success.must.be.true();
			Result.item.Name.must.eql("Food");
			Result.quantity.must.eql(25);
			Result.code.must.eql(200);
		});
		it("Using DetailedGet should get the correct values for item array", () => {
			const R = Client.Reg;
			const MC = new MaterialCollection();
			MC.Increase("Iron", 10);
			MC.Increase("Gold", 5);
			MC.Increase("Food", 25);
			MC.Increase("Tech", 15);
			const Items = [R.AnyResolve("Iron"), R.AnyResolve("Gold"), R.AnyResolve("Food"), R.AnyResolve("Tech")];
			const Names = ["Iron", "Gold", "Food", "Tech"];
			const Quantities = [10, 5, 25, 15];
			const Results = MC.DetailedGet(Items);
			Results.forEach((result, idx) => {
				result.success.must.be.true();
				result.code.must.eql(200);
				result.item.Name.must.equal(Names[idx]);
				result.quantity.must.equal(Quantities[idx]);
			});
		});
		it("Non-existent material fails with error code 404", () => {
			const MC = new MaterialCollection();
			MC.DetailedGet("This doesn't exist").code.must.eql(404);
		});

		it("Generator function should properly work (low chance to fail)", () => {
			const MC = new MaterialCollection();
			MC.GenerateCollection({ value: 10000, centralRarity: 1, maxRarity: 6, minRarity: 1, rarity: true });
            MC.get("Food").must.be.gt(MC.get("Tech"));                      
		});
	});
});
