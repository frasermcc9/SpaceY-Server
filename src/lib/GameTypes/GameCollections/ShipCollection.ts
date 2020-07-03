import { Client } from "../../Client/Client";
import { GameCollectionBase } from "./GameCollectionBase";
import { MapCollection } from "../../Extensions/Collections";
import { Ship } from "../GameAsset/Ship/Ship";

export class ShipCollection extends GameCollectionBase {
	public constructor(options?: IShipCollectionOptions) {
		super();
		//Create map with all empty attachment values, but set defined attachments to the given value.
		if (options?.data) {
			Client.Get().Registry.ShipRegistry.forEach((ship) => {
				this.set(ship.Name, options.data?.get(ship.Name) || 0);
			});
		} else {
			Client.Get().Registry.ShipRegistry.forEach((ship) => {
				this.set(ship.Name, 0);
			});
		}
	}

	/** @override */
	public GetCompatibleItems(minRarity: number, maxRarity: number): MapCollection<string, Ship> {
		return Client.Reg.ShipRegistry.filter((val) => val.Cost != undefined && val.TechLevel <= maxRarity && val.TechLevel >= minRarity);
	}

	/** @override */
	public GenerateWeights(items: Ship[], centralRarity: number, minRarity: number, maxRarity: number): number[] {
		return items.map((val) => maxRarity - minRarity - Math.abs(centralRarity - val.TechLevel) + 1);
	}
}
export interface IShipCollectionOptions {
	data?: Map<string, number>;
}
