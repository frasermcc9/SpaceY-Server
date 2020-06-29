import { Client } from "../../Client/Client";
import { Faction } from "../GameAsset/Faction/Faction";
import { GameCollectionBase } from "./GameCollectionBase";

export class ReputationCollection extends GameCollectionBase {
	private factionSet: Map<string, Faction> = Client.Get().Registry.FactionRegistry;
	constructor(options?: IReputationCollectionOptions) {
		super();
		if (options?.data) {
			this.factionSet.forEach((faction) => {
				this.set(faction.Name, options.data?.get(faction.Name) || 0);
			});
		} else {
            this.factionSet.forEach((faction) => {
				this.set(faction.Name, 0);
			});
		}
	}
}

export interface IReputationCollectionOptions {
	data?: Map<string, number>;
}
