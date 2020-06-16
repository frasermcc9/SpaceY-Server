export class Blueprint {
	private requiredMaterials: MaterialCollection;
	constructor() {}

	public blueprintCheck(usersMats: MaterialCollection): boolean {
		return usersMats.compareCollection(this.requiredMaterials);
	}

	public getAmountsAsArray(): number[] {
		return this.requiredMaterials.getAmountsAsArray();
	}

	public accessMaterialCollection(): MaterialCollection {
		return this.requiredMaterials;
	}

	public static generateBlueprint(client: Client, cost: number, gameObject: Buildable): Blueprint {
		let template = client.getMaterialTemplate();
		let quantityArray = new Array(template.size).fill(0);
		let arrayTemplate = Array.from(client.getMaterialTemplate());

		let price = 0;
		do {
			let data = util.chooseFromSeeded<Material>(arrayTemplate, util.hashCode(gameObject.getName() + price));
			quantityArray[data.index]++;
			price += data.item.getCost();
		} while (price < cost);

		return new Blueprint(client, new MaterialCollection(client.getMaterialTemplate(), quantityArray));
	}
}
