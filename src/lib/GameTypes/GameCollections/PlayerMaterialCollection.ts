import { MaterialCollection, IMaterialCollectionOptions } from "./MaterialCollection";
import { Player } from "../GameAsset/Player/Player";
import { Client } from "../../main";

export class PlayerMaterialCollection extends MaterialCollection {
    private owner?: Player;

    public maxCollectionSize(): number {
        if (this.owner == undefined) return Infinity;
        //console.log(this.owner.getShipWrapper());
        return this.owner.getShipWrapper().ShipStatistics.totalCargo;
    }

    /**@override */
    public set(key: string, value: number): this {
        const current = this.get(key);
        const diff = this.maxCollectionSize() - (this.CollectionSize - (current ?? 0) + value);
        if (diff >= 0) {
            return super.set(key, value);
        } else {
            return super.set(key, value + diff);
        }
    }

    public constructor(options?: IMaterialCollectionOptions) {
        super(options);
    }

    public set Owner(player: Player) {
        this.owner = player;
    }
}
