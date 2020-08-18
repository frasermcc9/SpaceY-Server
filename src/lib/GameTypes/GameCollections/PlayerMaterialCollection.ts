import { MaterialCollection, IMaterialCollectionOptions } from "./MaterialCollection";
import { Player } from "../GameAsset/Player/Player";
import { Client } from "../../main";
import { Server } from "../../Server/Server";

/** Collection of materials for a player. Adds more restrictions, due to cargo
 * space. Set override ensures that materials are not added if cargo is full.
 * Players can exceed cargo limit if they reduce their cargo size below their
 * current amount. In this case, the excess cargo is not lost, but no more can
 * be added (just as if it were full). */
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
            return super.set(key, Math.max(value + diff, current ?? 0));
        }
    }

    /**
     * same as normal set, but does not check for cargo changes. Used for
     * construction from database since these values do not need to be checked
     * for overcapacity.
     * @param key
     * @param value
     */
    private quickSet(key: string, value: number): this {
        return super.set(key, value);
    }

    public constructor(options?: IMaterialCollectionOptions) {
        super();
        if (options == undefined) return;
        let data: any;
        if (options.data instanceof Map) data = Object.fromEntries(options.data);
        else data = options.data;

        Server.Get().Registry.MaterialRegistry.forEach((material) => {
            this.quickSet(material.Name, data[material.Name] ?? 0);
        });
    }

    public set Owner(player: Player) {
        this.owner = player;
    }
}
