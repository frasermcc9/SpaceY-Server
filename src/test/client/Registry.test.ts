import * as test from "https://deno.land/std/testing/asserts.ts";
import { Client } from "../../lib/Client/Client.ts";
import { BaseMaterial } from "../../lib/GameTypes/GameAsset/Buildable/Material/BaseMaterial.ts";

Deno.test({
	name: "Test adding game assets to client registry",
	fn: (): void => {
		Client.Create({});
		const Registry = Client.Get().Registry;
		//Create material and add it to copy registry
		const M1 = new BaseMaterial({ name: "Iron", description: "A small amount of iron." });
		const M2 = new BaseMaterial({ name: "Gold", description: "A valuable but rare metal." });
		Registry.RegisterMaterials({ materials: [M1, M2] });

		//Request the material from the copy and main registry
		const M1Retrieved = Registry.MaterialRegistry.get("Iron");
		const M2Retrieved = Registry.MaterialRegistry.get("Gold");

		//Should be defined for copy, but not main.
		test.assertEquals(M1Retrieved, M1);
		test.assertEquals(M2Retrieved, M2);
		Client.Destroy();
	},
});
