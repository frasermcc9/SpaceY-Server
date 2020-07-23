import { Server } from "../../Server/Server";
import { util } from "../../Util/util";
import { IMaterial, Material } from "../GameAsset/Material/Material";
import { GameCollectionBase, IGenerationOptions, ICompatible } from "./GameCollectionBase";
import { SellableDecorator } from "../GameAsset/AssetDecorators";
import { MapCollection } from "../../Extensions/Collections";

export class MaterialCollection extends GameCollectionBase {
    public static WEIGHTS?: number[] = [];

    public constructor(options?: IMaterialCollectionOptions) {
        super();
        //Create map with all empty material values, but set defined materials to the given value.
        if (options?.data) {
            let data: any;
            if (options.data instanceof Map) data = Object.fromEntries(options.data);
            else data = options.data;

            Server.Get().Registry.MaterialRegistry.forEach((material) => {
                this.set(material.Name, data[material.Name] ?? 0);
            });
        } else {
            Server.Get().Registry.MaterialRegistry.forEach((material) => {
                this.set(material.Name, 0);
            });
        }
    }
    /**@deprecated*/
    public DataFromName(name: string): IMaterialQuantity {
        const material = Server.Get().Registry.MaterialRegistry.get(name);
        if (material == undefined) return { success: false, name: name, quantity: -1, material: null, error: MAT_NOT_FOUND };

        const quantity = this.get(material.Name);
        return { success: true, name: material.Name, quantity: quantity || 0, material: material };
    }
    /**@deprecated*/
    public DataFromNames(names: string[]): IMaterialQuantity[] {
        let data = new Array<IMaterialQuantity>();
        names.forEach((name) => {
            const material = Server.Get().Registry.MaterialRegistry.get(name);
            if (material == undefined) {
                data.push({ success: false, name: name, quantity: -1, material: null, error: MAT_NOT_FOUND });
            } else {
                const quantity = this.get(material.Name);
                data.push({ success: true, name: material.Name, quantity: quantity || 0, material: material });
            }
        });
        return data;
    }
    /**@deprecated*/
    public DataFromMaterial(material: Material): IMaterialQuantity {
        const quantity = this.get(material.Name);
        if (quantity == undefined) {
            return { success: false, name: material.Name, quantity: -1, material: null, error: MAT_NOT_FOUND };
        }
        return { success: true, name: material.Name, quantity: quantity || 0, material: material };
    }

    public GetCollectionValue(): number {
        let total = 0;
        this.forEach((amount, name) => {
            const Material = Server.Get().Registry.MaterialRegistry.get(name)!;
            total += (new SellableDecorator(Material).PriceData.cost || 0) * amount;
        });
        return total;
    }

    public static GenerateMineableCollection(value: number, central = 0): MaterialCollection {
        const Template = Array.from(Server.Get().Registry.MineableMaterialRegistry.values());
        if (Template.length == 0) {
            throw new Error("No Mineable Materials");
        }
        const weights = this.GenerateMiningWeights(Template, central);
        const flatArray: Material[] = [];
        for (let i = 0; i < Template.length; ++i) for (let j = 0; j < weights[i]; ++j) flatArray.push(Template[i]);

        const MineableCollection = new MaterialCollection();
        let currentPrice = 0;
        do {
            const Selected = util.chooseFrom<Material>(Template);
            const Material = new SellableDecorator(Selected.item);
            const ExistingAmount = MineableCollection.get(Selected.item.Name) ?? 0;
            MineableCollection.set(Selected.item.Name, ExistingAmount + 1);
            currentPrice += Material.PriceData.cost ?? 0;
        } while (currentPrice < value);
        return MineableCollection;
    }

    private static GenerateMiningWeights(items: Material[], centralRarity: number): number[] {
        if (this.WEIGHTS?.length == items.length) {
            return this.WEIGHTS;
        }
        const weights = items.map((i) => 10 ** 1.9 - Math.abs(centralRarity - i.GetMaterialRarity() ** 1.8));
        this.WEIGHTS = weights;
        return this.WEIGHTS;
    }

    public static RefreshMiningWeightCache() {
        this.WEIGHTS = [];
    }

    /** @override */
    public GetCompatibleItems({ minRarity, maxRarity, minTech, maxTech }: ICompatible): MapCollection<string, Material> {
        return Server.Reg.MaterialRegistry.filter(
            (val) =>
                val.Cost != undefined &&
                val.TechLevel <= maxTech &&
                val.TechLevel >= minTech &&
                val.GetMaterialRarity() <= maxRarity &&
                val.GetMaterialRarity() >= minRarity
        );
    }

    /** @override */
    public GenerateWeights(items: Material[], centralRarity: number, minRarity: number, maxRarity: number): number[] {
        return items.map((val) => maxRarity - minRarity - Math.abs(centralRarity - val.GetMaterialRarity()) + 1);
    }
}

export interface IMaterialCollectionOptions {
    data?: Map<string, number>;
}

interface IMaterialQuantity {
    success: boolean;
    name: string;
    quantity: number;
    material: Material | null;
    error?: string;
}

const MAT_NOT_FOUND = "This material does not exist in the client collection.";
