"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaterialCollection = void 0;
const Client_1 = require("../../Client/Client");
const util_1 = require("../../Util/util");
const DecoratorSellable_1 = require("../GameAsset/Material/DecoratorSellable");
const GameCollectionBase_1 = require("./GameCollectionBase");
class MaterialCollection extends GameCollectionBase_1.GameCollectionBase {
    constructor(options) {
        super();
        //Create map with all empty material values, but set defined materials to the given value.
        if (options === null || options === void 0 ? void 0 : options.data) {
            Client_1.Client.Get().Registry.MaterialRegistry.forEach((material) => {
                var _a;
                this.set(material.Name, ((_a = options.data) === null || _a === void 0 ? void 0 : _a.get(material.Name)) || 0);
            });
        }
        else {
            Client_1.Client.Get().Registry.MaterialRegistry.forEach((material) => {
                this.set(material.Name, 0);
            });
        }
    }
    DataFromName(name) {
        const material = Client_1.Client.Get().Registry.MaterialRegistry.get(name);
        if (material == undefined)
            return { success: false, name: name, quantity: -1, material: null, error: MAT_NOT_FOUND };
        const quantity = this.get(material.Name);
        return { success: true, name: material.Name, quantity: quantity || 0, material: material };
    }
    DataFromNames(names) {
        let data = new Array();
        names.forEach((name) => {
            const material = Client_1.Client.Get().Registry.MaterialRegistry.get(name);
            if (material == undefined) {
                data.push({ success: false, name: name, quantity: -1, material: null, error: MAT_NOT_FOUND });
            }
            else {
                const quantity = this.get(material.Name);
                data.push({ success: true, name: material.Name, quantity: quantity || 0, material: material });
            }
        });
        return data;
    }
    DataFromMaterial(material) {
        const quantity = this.get(material.Name);
        if (quantity == undefined) {
            return { success: false, name: material.Name, quantity: -1, material: null, error: MAT_NOT_FOUND };
        }
        return { success: true, name: material.Name, quantity: quantity || 0, material: material };
    }
    GetCollectionValue() {
        let total = 0;
        this.forEach((amount, name) => {
            const Material = Client_1.Client.Get().Registry.MaterialRegistry.get(name);
            total += (new DecoratorSellable_1.MaterialDecoratorSellable(Material).GetCost().cost || 0) * amount;
        });
        return total;
    }
    static GenerateMineableCollection(value) {
        const Template = Array.from(Client_1.Client.Get().Registry.MineableMaterialRegistry.values());
        if (Template.length == 0) {
            throw new Error("No Mineable Materials");
        }
        const MineableCollection = new MaterialCollection();
        let currentPrice = 0;
        do {
            const Selected = util_1.util.chooseFrom(Template);
            const Material = new DecoratorSellable_1.MaterialDecoratorSellable(Selected.item);
            const ExistingAmount = MineableCollection.get(Selected.item.Name) || 0;
            MineableCollection.set(Selected.item.Name, ExistingAmount + 1);
            currentPrice += Material.GetMaterialCost() || 0;
        } while (currentPrice < value);
        return MineableCollection;
    }
}
exports.MaterialCollection = MaterialCollection;
const MAT_NOT_FOUND = "This material does not exist in the client collection.";
