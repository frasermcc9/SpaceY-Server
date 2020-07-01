"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaterialDecoratorBuildable = void 0;
const MaterialDecorator_1 = require("./MaterialDecorator");
class MaterialDecoratorBuildable extends MaterialDecorator_1.MaterialDecorator {
    constructor(material) {
        super(material);
        if (!material.IsBuildable())
            console.warn("Material that is not buildable is being instantiated as a buildable material.");
    }
    GetBlueprint() {
        const blueprint = this.GetMaterialBlueprint();
        if (blueprint) {
            return { success: true, blueprint: blueprint };
        }
        return { success: false, blueprint: undefined };
    }
}
exports.MaterialDecoratorBuildable = MaterialDecoratorBuildable;
