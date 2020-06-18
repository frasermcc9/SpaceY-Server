import { GameAsset, Buildable, Sellable, ISellInfo } from "../../GameAsset.ts";
import { Blueprint } from "../../Blueprint/Blueprint.ts";

export class Attachment extends GameAsset implements Buildable, Sellable {
	private Blueprint: Blueprint = new Blueprint();

	public GetBlueprint(): Blueprint {
		return this.Blueprint;
	}

	GetCost(): ISellInfo {
		return { cost: 0, success: true };
	}
}
