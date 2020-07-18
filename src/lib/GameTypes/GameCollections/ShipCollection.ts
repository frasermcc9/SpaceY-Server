import { Server } from "../../Server/Server";
import { GameCollectionBase, ICompatible } from "./GameCollectionBase";
import { MapCollection } from "../../Extensions/Collections";
import { Ship } from "../GameAsset/Ship/Ship";

export class ShipCollection extends GameCollectionBase {
	public constructor(options?: IShipCollectionOptions) {
		super();
		//Create map with all empty attachment values, but set defined attachments to the given value.
		if (options?.data) {
			let data: any;
			if (options.data instanceof Map) data = Object.fromEntries(options.data);
			else data = options.data;

			Server.Get().Registry.ShipRegistry.forEach((ship) => {
				this.set(ship.Name, data[ship.Name] || 0);
			});
		} else {
			Server.Get().Registry.ShipRegistry.forEach((ship) => {
				this.set(ship.Name, 0);
			});
		}
	}

	/** @override */
	public GetCompatibleItems({ minTech, maxTech }: ICompatible): MapCollection<string, Ship> {
		return Server.Reg.ShipRegistry.filter((val) => val.Cost != undefined && val.TechLevel <= maxTech && val.TechLevel >= minTech);
	}

	/** @override */
	public GenerateWeights(items: Ship[], centralRarity: number, minRarity: number, maxRarity: number): number[] {
		return items.map((val) => maxRarity - minRarity - Math.abs(centralRarity - val.TechLevel) + 1);
	}
}
export interface IShipCollectionOptions {
	data?: Map<string, number>;
}
