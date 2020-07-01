"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaterialStore = void 0;
const BaseStore_1 = require("./BaseStore");
const MaterialCollection_1 = require("../GameCollections/MaterialCollection");
const main_1 = require("../../main");
const GameCollectionBase_1 = require("../GameCollections/GameCollectionBase");
const AssetDecorators_1 = require("../GameAsset/AssetDecorators");
class MaterialStore extends BaseStore_1.BaseStore {
    constructor({ value, rarity, maxRarity, minRarity, credits }) {
        super(credits ?? 0);
        this.value = value ?? 0;
        this.rarity = rarity ?? false;
        this.maxRarity = maxRarity ?? main_1.Client.Get().Registry.MaxRarity;
        this.minRarity = minRarity ?? 0;
    }
    GenerateInventory(value = this.value, rarity = this.rarity, minRarity = this.minRarity, maxRarity = this.maxRarity) {
        let currentPrice = 0;
        const CompatibleMaterials = main_1.Client.Get().Registry.MaterialRegistry.filter((val) => val.Cost != undefined && val.GetMaterialRarity() <= maxRarity && val.GetMaterialRarity() >= minRarity);
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
            const Material = new AssetDecorators_1.SellableDecorator(Selected);
            const ExistingAmount = this.get(Selected.Name) || 0;
            this.set(Selected.Name, ExistingAmount + 1);
            currentPrice += Material.PriceData.cost ?? 0;
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
    GetItem(itemName) {
        return main_1.Client.Get().Registry.ResolveMaterialFromName(itemName);
    }
    GetCostOfItem(item) {
        return new AssetDecorators_1.SellableDecorator(item).PriceData.cost;
    }
    Sell() { }
    Update() {
        this.clear();
        this.GenerateInventory(this.value, this.rarity, this.minRarity, this.maxRarity);
    }
}
exports.MaterialStore = MaterialStore;
