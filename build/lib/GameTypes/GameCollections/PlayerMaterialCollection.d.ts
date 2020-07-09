import { MaterialCollection, IMaterialCollectionOptions } from "./MaterialCollection";
import { Player } from "../GameAsset/Player/Player";
export declare class PlayerMaterialCollection extends MaterialCollection {
    private owner?;
    maxCollectionSize(): number;
    /**@override */
    set(key: string, value: number): this;
    constructor(options?: IMaterialCollectionOptions);
    set Owner(player: Player);
}
