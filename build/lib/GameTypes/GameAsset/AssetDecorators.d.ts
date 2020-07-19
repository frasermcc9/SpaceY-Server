import { GameAsset, Sellable, ISellInfo, IGameAsset, IBlueprintInfo, Buildable } from "./GameAsset";
import { Player } from "./Player/Player";
import { Faction } from "./Faction/Faction";
export declare abstract class GameAssetDecorator implements IGameAsset {
    protected asset: GameAsset;
    constructor(asset: GameAsset);
    get Name(): string;
    get Description(): string;
}
export declare class SellableDecorator extends GameAssetDecorator implements Sellable {
    constructor(item: string | GameAsset);
    get PriceData(): ISellInfo;
    fluctuatingPriceData({ territory, randEffect, loTechEffect, hiTechEffect, seed }: IMarketForces): ISellInfo;
}
export declare class BuildableDecorator extends GameAssetDecorator implements Buildable {
    constructor(item: GameAsset);
    get Blueprint(): IBlueprintInfo;
    /**
     * @param player
     * @returns codes:<br />  \
     * 200 - Success<br />  \
     * 403.1 - Insufficient resources<br />  \
     * 403.2 - User doesn't have blueprint<br />  \
     * 405 - Item not buildable<br />  \
     * 500 - Internal Error
     */
    Build(player: Player): Promise<{
        code: number;
        failures: string[];
    }>;
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
