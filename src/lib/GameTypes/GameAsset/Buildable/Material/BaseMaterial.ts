import { GameAsset, Buildable, Sellable } from "../../GameAsset.ts";

export class BaseMaterial extends GameAsset implements Sellable {
	public GetCost() {
		return 0;
	}
}
