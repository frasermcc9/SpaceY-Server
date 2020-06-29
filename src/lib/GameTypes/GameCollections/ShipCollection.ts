import { Client } from "../../Client/Client";
import { GameCollectionBase } from "./GameCollectionBase";

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
}
export interface IShipCollectionOptions {
	data?: Map<string, number>;
}
