import { MaterialCollection, IMaterialCollectionOptions } from "../GameCollections/MaterialCollection";
import { Player } from "../GameAsset/Player/Player";
import { Client } from "../../Client/Client";

class Asteroid extends MaterialCollection {
	constructor(options: IMaterialCollectionOptions) {
		super(options);
	}

	public PlayerMine(player: Player): void {
		player.Inventory.Materials.SumCollection(this);
	}
	public PlayerMineAndSave(player: Player): void {
		player.InventorySum("materials", this);
	}
}

export class AsteroidBuilder {
	public BuildRandom({ value }: { value: number }): Asteroid {
		if (value < 0 && Client.Get().ConsoleLogging) console.warn("Negative asteroid value passed.");
		const collection = MaterialCollection.GenerateMineableCollection(value);
		return new Asteroid({ data: collection });
	}

	public BuildCustom(materialCollection: IMaterialCollectionOptions): Asteroid {
		return new Asteroid(materialCollection);
	}
}
