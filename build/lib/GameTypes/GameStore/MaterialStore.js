"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaterialStore = void 0;
const MaterialCollection_1 = require("../GameCollections/MaterialCollection");
const main_1 = require("../../main");
const DecoratorSellable_1 = require("../GameAsset/Material/DecoratorSellable");
const GameCollectionBase_1 = require("../GameCollections/GameCollectionBase");
class MaterialStore extends MaterialCollection_1.MaterialCollection {
    constructor({ value, rarity, maxRarity, minRarity }) {
        super();
        this.value = value || 0;
        this.rarity = rarity || false;
        this.maxRarity = maxRarity || main_1.Client.Get().Registry.MaxRarity;
        this.minRarity = minRarity || 0;
    }
    GenerateInventory(value = this.value, rarity = this.rarity, minRarity = this.minRarity, maxRarity = this.maxRarity) {
        let currentPrice = 0;
        const CompatibleMaterials = main_1.Client.Get().Registry.MaterialRegistry.filter((val) => val.IsSellable() && val.GetMaterialRarity() <= maxRarity && val.GetMaterialRarity() >= minRarity);
        const MaterialNames = CompatibleMaterials.array();
        const Weights = CompatibleMaterials.array().map((val) => main_1.Client.Get().Registry.MaxRarity + 1 - val.GetMaterialRarity());
        let FlatArray = new Array();
        if (rarity)
            for (let i = 0; i < MaterialNames.length; ++i) {
                for (let j = 0; j < Weights[i]; ++j) {
                    FlatArray.push(MaterialNames[i]);
                }
            }
        else {
            FlatArray = CompatibleMaterials.array();
        }
        do {
            const Selected = FlatArray[~~(Math.random() * FlatArray.length)];
            const Material = new DecoratorSellable_1.MaterialDecoratorSellable(Selected);
            const ExistingAmount = this.get(Selected.Name) || 0;
            this.set(Selected.Name, ExistingAmount + 1);
            currentPrice += Material.GetMaterialCost() || 0;
        } while (currentPrice < value);
    }
    SetInventory(data) {
        if (data instanceof GameCollectionBase_1.GameCollectionBase) {
            return this.SumCollection(data);
        }
        const stringData = new MaterialCollection_1.MaterialCollection();
        data.forEach((val, key) => stringData.set(key.Name, val));
        return this.SumCollection(stringData);
    }
    Buy() { }
    Sell() { }
    Update() {
        this.clear();
        this.GenerateInventory(this.value, this.rarity, this.minRarity, this.maxRarity);
    }
}
exports.MaterialStore = MaterialStore;
