import { GameAsset, Buildable, Sellable, ISellInfo } from "../../GameAsset";
import { Blueprint } from "../../Blueprint/Blueprint";
export declare class Ship extends GameAsset implements Buildable, Sellable {
    private Blueprint;
    GetBlueprint: () => Blueprint;
    GetCost(): ISellInfo;
}
