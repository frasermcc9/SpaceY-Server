import { GameAsset, Buildable, Sellable } from "../../GameAsset.ts";
import { Blueprint } from "../../Blueprint/Blueprint.ts";

export class Ship extends GameAsset implements Buildable, Sellable {
	private Blueprint: Blueprint = new Blueprint();

	public GetBlueprint = (): Blueprint => this.Blueprint;

	public GetCost(): number {
		return 0;
	}
}
