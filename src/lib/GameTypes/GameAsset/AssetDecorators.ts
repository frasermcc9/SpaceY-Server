import { GameAsset, Sellable, ISellInfo, IGameAsset, IBlueprintInfo, Buildable } from "./GameAsset";
import { Server } from "../../Server/Server";
import { Player } from "./Player/Player";
import { Faction } from "./Faction/Faction";
import { util } from "../../Util/util";

export abstract class GameAssetDecorator implements IGameAsset {
    protected asset: GameAsset;

    public constructor(asset: GameAsset) {
        this.asset = asset;
    }

    public get Name(): string {
        return this.asset.Name;
    }
    public get Description(): string {
        return this.asset.Description;
    }
}

export class SellableDecorator extends GameAssetDecorator implements Sellable {
    public constructor(item: string | GameAsset) {
        if (typeof item == "string") {
            const obj = Server.Reg.AnyResolve(item);
            if (obj == undefined)
                throw new TypeError(`Item named ${item} instantiated as SellableDecorator when item does not exist in registry.`);
            super(obj);
        } else super(item);
    }

    public get PriceData(): ISellInfo {
        return this.asset.Cost == undefined ? { success: false } : { success: true, cost: this.asset.Cost };
    }

    public fluctuatingPriceData({ territory, randEffect, loTechEffect, hiTechEffect, seed }: IMarketForces): ISellInfo {
        let baseCost = this.asset.Cost;
        if (baseCost == undefined) return { success: false };
        if (!territory && (loTechEffect || hiTechEffect)) return { success: false };
        if (!seed) seed = new Date().getFullYear() + new Date().getDate() + new Date().getMonth() + 1;
        //Apply random effects (randomEffect = 0 is same behaviour as undefined)
        if (randEffect) {
            const deviation = (baseCost * randEffect) / 100,
                min = baseCost - deviation,
                max = baseCost + deviation,
                rnd = util.seededGenerator(seed).next().value as number;
            baseCost += rnd * (max - min) - (max - min) / 2;
        }
        if (loTechEffect || hiTechEffect) {
            const maxTechDelta = Server.Reg.MaxTech;
            const delta = Math.abs(territory!.TechLevel - this.asset.TechLevel);
            const percentOfDelta = delta / maxTechDelta;
            //Apply percent change if faction tech level is higher
            if (this.asset.TechLevel < territory!.TechLevel) {
                baseCost += percentOfDelta * (((loTechEffect ?? 0) / 100) * baseCost);
            } else if (this.asset.TechLevel > territory!.TechLevel) {
                baseCost += percentOfDelta * (((hiTechEffect ?? 0) / 100) * baseCost);
            }
        }
        return { success: true, cost: Math.round(baseCost) };
    }
}

export class BuildableDecorator extends GameAssetDecorator implements Buildable {
    public constructor(item: GameAsset) {
        super(item);
    }

    public get Blueprint(): IBlueprintInfo {
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
    public async Build(player: Player): Promise<{ code: number; failures: string[] }> {
        const bp = this.Blueprint.blueprint;
        if (bp == undefined) return { code: 405, failures: [] };

        if (!player.hasBlueprintFor(this.Name)) return { code: 403.2, failures: [] };

        const result = await player.InventorySubtract("materials", bp);
        if (result.code != 200) return { code: 403.1, failures: result.failures };

        const editResult = await player.AutoInventoryEdit(this.asset.Name, 1);
        if (editResult.success) return result;
        else return { code: 500, failures: [] };
    }
}

export interface StrengthComparable {
    Strength: number;
}

export interface IMarketForces {
    /**Enter as a value of max percent change, i.e. *50* would mean a value of
     * 200 could increase up to 50% (300) and decrease down to 50% (100).
     * Requires a seed to work. Max 100.*/
    randEffect?: number;
    /**Seed for randomEffect. Default changes every day. */
    seed?: number;
    /**Enter the maximum percent increase in price that an item will have if its
     * tech level is above the faction's tech level. The max occurs when the
     * material is *n* points greater than the faction tech level, where n is
     * the value in the registry MaxTech.
     *
     * A negative number will reduce the price by up to that percent change.  */
    hiTechEffect?: number;
    /**See highTechEffect, but this will increase the price as a percentage for
     * when the material is below tech compared to the faction. The max
     * reduction occurs when the material is 0 and the faction is at the
     * registry max tech value.
     *
     * Negative numbers will instead reduce the price by a percent.*/
    loTechEffect?: number;
    /**The faction to get the compared tech values for. Required for
     * highTechEffect and lowTechEffect. */
    territory?: Faction;
}
