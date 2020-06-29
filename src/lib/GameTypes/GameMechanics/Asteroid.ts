import { MaterialCollection, IMaterialCollectionOptions } from "../GameCollections/MaterialCollection";

class Asteroid {
	private content: MaterialCollection;
	constructor(options: IAsteroidOptions) {
		if (options.customContents) {
			this.content = new MaterialCollection(options.customContents);
		} else {
			this.content = MaterialCollection.GenerateMineableCollection(options.maxWorth || 0);
		}
	}
}

export class AsteroidBuilder {
	private content!: IMaterialCollectionOptions;
	private totalValue: number = 0;
	private randomized: boolean = true;

	public MakeRandom({ value }: { value: number }): AsteroidBuilder {
		this.randomized = true;
		this.totalValue = value;
		return this;
	}

	public CustomContent(MaterialCollection: IMaterialCollectionOptions): AsteroidBuilder {
		this.randomized = false;
		this.content = MaterialCollection;
		return this;
	}

	public Build(): Asteroid {
		if (this.randomized) return new Asteroid({ maxWorth: this.totalValue });
		else return new Asteroid({ customContents: this.content });
	}
}

interface IAsteroidOptions {
	customContents?: IMaterialCollectionOptions;
	maxWorth?: number;
}
