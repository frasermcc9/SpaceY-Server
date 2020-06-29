import { GameAsset, Buildable, Sellable, ISellInfo } from "../../GameAsset";
import { Blueprint } from "../../Blueprint/Blueprint";

export class Ship extends GameAsset implements Buildable, Sellable {
	private Blueprint: Blueprint = new Blueprint();

	public GetBlueprint = (): Blueprint => this.Blueprint;

	GetCost(): ISellInfo {
		return { cost: 0, success: true };
	}
}
