import { IGenerationOptions } from "../../GameCollections/GameCollectionBase";
import { MaterialCollection } from "../../GameCollections/MaterialCollection";

export class Blueprint extends MaterialCollection {
	public constructor(materials: Map<string, number>) {
		super({ data: materials });
	}
}

export class BlueprintBuilder {
	public ManualBuild(data: Map<string, number>): Blueprint {
		return new Blueprint(data);
	}
	public AutoBuild(options: IGenerationOptions) {
		return new Blueprint(new MaterialCollection().GenerateCollection(options));
	}
}
