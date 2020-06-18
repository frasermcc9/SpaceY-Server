import * as test from "https://deno.land/std/testing/asserts.ts";
import { Client } from "../../../lib/Client/Client.ts";
import { MaterialCollection } from "../../../lib/GameTypes/GameCollections/MaterialCollection.ts";
import { BaseMaterial } from "../../../lib/GameTypes/GameAsset/Buildable/Material/BaseMaterial.ts";
import { GenerateMaterialsForActiveClient, GENERATED_MATERIALS } from "../../TestUtil.ts";

Deno.test({
	name: "Test empty constructor",
	fn: (): void => {
		Client.Create({});
		GenerateMaterialsForActiveClient();
		const MC1 = new MaterialCollection();

		const quantity = MC1.DataFromName("Iron");

		test.assertEquals(quantity.quantity, 0);
		Client.Destroy();
	},
});

Deno.test({
	name: "Test non-empty constructor",
	fn: (): void => {
		Client.Create({});
		GenerateMaterialsForActiveClient();
		const Materials = GENERATED_MATERIALS;
		const MaterialValues = new Map<BaseMaterial, number>();
		MaterialValues.set(Materials[0], 10).set(Materials[3], 15);

		const MC1 = new MaterialCollection({ data: MaterialValues });

		const Quantities = MC1.DataFromNames(["Iron", "Gold", "Food", "Tech"]);
		test.assertEquals(Quantities[0].quantity, 10);
		test.assertEquals(Quantities[1].quantity, 0);
		test.assertEquals(Quantities[2].quantity, 0);
		test.assertEquals(Quantities[3].quantity, 15);
		Client.Destroy();
	},
});
