import { Client } from "../../Client/Client";
import { Faction } from "../GameAsset/Faction/Faction";
import { GameCollectionBase, ICompatible } from "./GameCollectionBase";
import { MapCollection } from "../../Extensions/Collections";

export class ReputationCollection extends GameCollectionBase {
	public constructor(options?: IReputationCollectionOptions) {
		super();
		if (options?.data) {
			Client.Reg.FactionRegistry.forEach((faction) => {
				this.set(faction.Name, options.data?.get(faction.Name) ?? 0);
			});
		} else {
			Client.Reg.FactionRegistry.forEach((faction) => {
				this.set(faction.Name, 0);
			});
		}
	}

	/** @override */
	public GetCompatibleItems({ minTech, maxTech }: ICompatible): MapCollection<string, Faction> {
		return Client.Reg.FactionRegistry.filter((val) => val.Cost != undefined && val.TechLevel <= maxTech && val.TechLevel >= minTech);
	}

	/** @override */
	public GenerateWeights(items: Faction[], centralRarity: number, minRarity: number, maxRarity: number): number[] {
		return items.map((val) => maxRarity - minRarity - Math.abs(centralRarity - val.TechLevel) + 1);
	}
}

export interface IReputationCollectionOptions {
	data?: Map<string, number>;
}
