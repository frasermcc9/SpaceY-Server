import { GameAsset, IGameAssetOptions, IGameAsset } from "../GameAsset";
import { Blueprint } from "../Blueprint/Blueprint";

export class Material extends GameAsset implements IMaterial {
    private mineable: boolean;
    private rarity: number;

    public constructor(materialOptions: IMaterialOptions) {
        super(materialOptions);

        this.mineable = materialOptions.mineable ?? false;
        this.rarity = materialOptions.rarity || 1;
    }

    public IsMineable(): boolean {
        return this.mineable;
    }

    public GetMaterialRarity(): number {
        return this.rarity;
    }
}
export interface IMaterial extends IGameAsset {
    IsMineable(): boolean;
    GetMaterialRarity(): number;
}

export class MaterialBuilder {
    public constructor(private readonly options: IMaterialOptions) {}

    public EnableSell(price: number): MaterialBuilder {
        this.options.cost = price;
        return this;
    }
    public EnableBuild(blueprint: Blueprint): MaterialBuilder {
        this.options.blueprint = blueprint;
        return this;
    }
    public EnableMine(): MaterialBuilder {
        this.options.mineable = true;
        return this;
    }
    public SetRarity(level: number): MaterialBuilder {
        this.options.rarity = level;
        return this;
    }
    public Build(): Material {
        return new Material({
            description: this.options.description,
            mineable: this.options.mineable,
            name: this.options.name,
            techLevel: this.options.techLevel,
            rarity: this.options.rarity,
            blueprint: this.options.blueprint,
            cost: this.options.cost,
        });
    }
}

interface IMaterialOptions extends IGameAssetOptions {
    /**If the material can be mined. Default: false */
    mineable?: boolean;
    /**The rarity of the material. Default: 1 */
    rarity?: number;
}
