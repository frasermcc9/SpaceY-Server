import { MaterialCollection, IMaterialCollectionOptions } from "../GameCollections/MaterialCollection";
import { Player } from "../GameAsset/Player/Player";
declare class Asteroid extends MaterialCollection {
    constructor(options: IMaterialCollectionOptions);
    PlayerMine(player: Player): void;
    PlayerMineAndSave(player: Player): void;
}
export declare class AsteroidBuilder {
    BuildRandom({ value }: {
        value: number;
    }): Asteroid;
    BuildCustom(materialCollection: IMaterialCollectionOptions): Asteroid;
}
export {};
