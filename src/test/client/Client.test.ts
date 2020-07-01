/*
import * as test from "https://deno.land/std/testing/asserts";

import { Client } from "../../lib/Client/Client";
import { Material, MaterialBuilder } from "../../lib/GameTypes/GameAsset/Material/Material";


Deno.test({
	name: "Test get client before construction throws",
	fn: (): void => {
		test.assertThrows(() => {
			Client.Get();
		});
	},
});

Deno.test({
	name: "Test if getting client after creation returns a client",
	fn: (): void => {
		Client.Create({});
		test.assert(Client.Get());
		Client.Destroy();
	},
});

Deno.test({
	name: "Test if changing a copy registry keeps original intact",
	fn: (): void => {
		Client.Create({});
		//Create material and add it to copy registry
		const M1 = new MaterialBuilder({});
		const R1 = Client.Get()
			.CopyRegistry()
			.RegisterMaterials({ materials: [M1] });

		//Request the material from the copy and main registry
		const MainRetrieved = Client.Get().Registry.MaterialRegistry.get("Iron");
		const AltRegistryRetrieved = R1.MaterialRegistry.get("Iron");

		//Should be defined for copy, but not main.
		test.assertEquals(MainRetrieved, undefined);
		test.assertEquals(AltRegistryRetrieved, M1);
		Client.Destroy();
	},
});
*/