import { MaterialCollection } from "../GameCollections/MaterialCollection.ts";

export class Asteroid {
	private content: MaterialCollection;
	constructor() {
		this.content = new MaterialCollection({});
	}
}
