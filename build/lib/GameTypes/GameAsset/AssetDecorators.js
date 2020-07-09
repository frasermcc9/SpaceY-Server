"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildableDecorator = exports.SellableDecorator = exports.GameAssetDecorator = void 0;
const Client_1 = require("../../Client/Client");
const util_1 = require("../../Util/util");
class GameAssetDecorator {
    constructor(asset) {
        this.asset = asset;
    }
    get Name() {
        return this.asset.Name;
    }
    get Description() {
        return this.asset.Description;
    }
}
exports.GameAssetDecorator = GameAssetDecorator;
class SellableDecorator extends GameAssetDecorator {
    constructor(item) {
        if (typeof item == "string") {
            const obj = Client_1.Client.Reg.AnyResolve(item);
            if (obj == undefined)
                throw new TypeError(`Item named ${item} instantiated as SellableDecorator when item does not exist in registry.`);
            super(obj);
        }
        else
            super(item);
    }
    get PriceData() {
        return this.asset.Cost == undefined ? { success: false } : { success: true, cost: this.asset.Cost };
    }
    fluctuatingPriceData({ territory, randEffect, loTechEffect, hiTechEffect, seed }) {
        let baseCost = this.asset.Cost;
        if (baseCost == undefined)
            return { success: false };
        if (!territory && (loTechEffect || hiTechEffect))
            return { success: false };
        if (!seed)
            seed = new Date().getFullYear() + new Date().getDate() + new Date().getMonth() + 1;
        //Apply random effects (randomEffect = 0 is same behaviour as undefined)
        if (randEffect) {
            const deviation = (baseCost * randEffect) / 100, min = baseCost - deviation, max = baseCost + deviation, rnd = util_1.util.seededGenerator(seed).next().value;
            baseCost += rnd * (max - min) - (max - min) / 2;
        }
        if (loTechEffect || hiTechEffect) {
            const maxTechDelta = Client_1.Client.Reg.MaxTech;
            const delta = Math.abs(territory.TechLevel - this.asset.TechLevel);
            const percentOfDelta = delta / maxTechDelta;
            //Apply percent change if faction tech level is higher
            if (this.asset.TechLevel < territory.TechLevel) {
                baseCost += percentOfDelta * (((loTechEffect ?? 0) / 100) * baseCost);
            }
            else if (this.asset.TechLevel > territory.TechLevel) {
                baseCost += percentOfDelta * (((hiTechEffect ?? 0) / 100) * baseCost);
            }
        }
        return { success: true, cost: Math.round(baseCost) };
    }
}
exports.SellableDecorator = SellableDecorator;
class BuildableDecorator extends GameAssetDecorator {
    constructor(item) {
        super(item);
    }
    get Blueprint() {
        return this.asset.Blueprint;
    }
    /**
     * @param player
     * @returns codes:<br />  \
     * 200 - Success<br />  \
     * 403.1 - Insufficient resources<br />  \
     * 403.2 - User doesn't have blueprint<br />  \
     * 405 - Item not buildable<br />  \
     * 500 - Internal Error
     */
    async Build(player) {
        const bp = this.Blueprint.blueprint;
        if (bp == undefined)
            return { code: 405, failures: [] };
        if (!player.hasBlueprintFor(this.Name))
            return { code: 403.2, failures: [] };
        const result = await player.InventorySubtract("materials", bp);
        if (result.code != 200)
            return { code: 403.1, failures: result.failures };
        const editResult = await player.AutoInventoryEdit(this.asset.Name, 1);
        if (editResult.success)
            return result;
        else
            return { code: 500, failures: [] };
    }
}
exports.BuildableDecorator = BuildableDecorator;
