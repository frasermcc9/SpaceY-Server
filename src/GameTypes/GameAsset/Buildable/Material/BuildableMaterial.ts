import { Buildable, GameAsset } from "../../GameAsset.ts";
import { Blueprint } from "../../Blueprint/Blueprint.ts";

export abstract class BuildableMaterial extends GameAsset implements Buildable {
	private Blueprint: Blueprint = new Blueprint();

	public GetBlueprint() {
		return this.Blueprint;
	}
}
