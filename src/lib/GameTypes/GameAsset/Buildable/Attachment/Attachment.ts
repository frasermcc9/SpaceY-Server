import { GameAsset, Buildable, Sellable, ISellInfo } from "../../GameAsset";
import { Blueprint } from "../../Blueprint/Blueprint";

export class Attachment extends GameAsset implements Buildable, Sellable {
	private Blueprint: Blueprint = new Blueprint();

	public GetBlueprint(): Blueprint {
		return this.Blueprint;
	}

	public GetCost(): ISellInfo {
		return { cost: 0, success: true };
	}
}
