import { GameAsset, Buildable, Sellable } from "../../GameAsset.ts";
import { Blueprint } from "../../Blueprint/Blueprint.ts";

export class Attachment extends GameAsset implements Buildable, Sellable {
	private Blueprint: Blueprint = new Blueprint();

	public GetBlueprint(): Blueprint {
		return this.Blueprint;
	}

	public GetCost(): number {
		return 0;
	}
}
