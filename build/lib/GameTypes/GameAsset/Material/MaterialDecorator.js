"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaterialDecorator = void 0;
class MaterialDecorator {
    constructor(material) {
        this.material = material;
    }
    get Name() {
        return this.material.Name;
    }
    get Description() {
        return this.material.Description;
    }
    IsSellable() {
        return this.material.IsSellable();
    }
    IsMineable() {
        return this.material.IsMineable();
    }
    IsBuildable() {
        return this.material.IsBuildable();
    }
    GetMaterialCost() {
        return this.material.GetMaterialCost();
    }
    GetMaterialBlueprint() {
        return this.material.GetMaterialBlueprint();
    }
    GetMaterialRarity() {
        return this.material.GetMaterialRarity();
    }
}
exports.MaterialDecorator = MaterialDecorator;
