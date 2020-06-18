import { Collection } from "../../Extensions/Collection.ts";
import { Ship } from "../GameAsset/Buildable/Ship/Ship.ts";
import { Client } from "../../Client/Client.ts";

export class ShipCollection extends Collection<Ship, number> {
	private shipSet: Map<string, Ship> = Client.Get().Registry.ShipRegistry;

	public constructor(options: IAttachmentCollectionOptions) {
		super();
		//Create map with all empty attachment values, but set defined attachments to the given value.
		if (options?.data) {
			this.shipSet.forEach((ship) => {
				this.set(ship, options.data?.get(ship) || 0);
			});
		} else {
			this.shipSet.forEach((ship) => {
				this.set(ship, 0);
			});
		}
	}
}
export interface IShipCollectionOptions {
	data?: Map<Ship, number>;
}
