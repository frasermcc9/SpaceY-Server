import { GameAsset, Buildable, Sellable, ISellInfo } from "../../GameAsset.ts";
import { Blueprint } from "../../Blueprint/Blueprint.ts";

export class Ship extends GameAsset implements Buildable, Sellable {
	private Blueprint: Blueprint = new Blueprint();

	public GetBlueprint = (): Blueprint => this.Blueprint;

	GetCost(): ISellInfo {
		return { cost: 0, success: true };
	}
}
