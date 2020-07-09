import { MaterialCollection, IMaterialCollectionOptions } from "../GameCollections/MaterialCollection";
import { Player } from "../GameAsset/Player/Player";
export declare class Asteroid extends MaterialCollection {
    private cooldown;
    private autoCd;
    private timeoutMap;
    private timeoutIntervals;
    private name;
    constructor(options: IMaterialCollectionOptions, cooldown: number | undefined, autoCd: boolean, name: string);
    /**
     * Asynchronously adds and then removes players from the cooldown map after
     * the duration provided. Stores the player uid for the timeout, and keeps
     * track of the time it was added.
     * @param player the player to add to the timeout
     * @param cooldown the duration (in seconds) of the cooldown (optional)
     */
    private cooldownManager;
    /**
     * Finds the time remaining for a given player's cooldown, in seconds. Will
     * return 0 if they are not in the timeout map/
     * @param player the player to query.
     * @returns time in seconds (rounded to nearest second) remaining.
     */
    remainingCooldown(player: Player): number;
    isAvailableForUser(player: Player): boolean;
    /**
     *
     * @param player
     * @param percent
     * @param cooldownOverride
     * @returns codes:<br />  \
     * 200 - success<br />  \
     * 403 - on cooldown
     */
    mine(player: Player, percent?: number, cooldownOverride?: boolean): Promise<{
        code: 200 | 403;
        cooldown?: number;
    }>;
    clearCooldowns(): void;
    /**
     * Mines the collection without saving it to the database. The save method
     * must be called manually in order to save the materials.
     * @param player the player that mined the collection
     * @internal
     */
    PlayerMine(player: Player): void;
    /**
     * Mines the collection and saves its contents to the players inventory.
     * @param player the player that mined the collection
     * @internal
     */
    PlayerMineAndSave(player: Player): void;
    /**
     * Modifies the collection, applying a random percent change to the values
     * of the collection. Makes the collection more dynamic.
     * @param percent should be entered as '20' for 20%, not 0.2.
     * @internal
     */
    private applyDeviation;
    get Name(): string;
}
export declare class AsteroidBuilder {
    autoCooldown: boolean;
    cooldown?: number;
    name: string;
    constructor(name: string);
    setCooldown(seconds: number): this;
    BuildRandom({ value }: {
        value: number;
    }): Asteroid;
    BuildCustom(materialCollection: IMaterialCollectionOptions): Asteroid;
}
