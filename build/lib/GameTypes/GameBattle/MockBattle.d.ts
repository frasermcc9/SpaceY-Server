import { Battleship } from "../GameAsset/Ship/Battleship";
import { IBattleData } from "./Battle";
export declare class MockBattle implements IBattleData {
    private playerShip;
    private aiShip;
    private battleTurn;
    private activeShip;
    private inactiveShip;
    /**
     * Additional listeners that are dynamically added during the battle by
     * attachments. This allows for attachments of type 'do x for y turns',
     * where x can be something simple (do 5 damage), or more complex things
     * (listen for the enemy to increase in shield, and deny it).
     *
     * The key of the array is the event (the event, its callback function), the
     * value is the number of turns the listener is to remain on for. Note that
     * 1 turn counts as each time another player gets control, so a sequence of
     * [player 1 turn, player 2 turn, player 1 turn] counts as 3 turns.
     *
     * @example
     * const fn = (params)=>{console.log("shield damaged!")}
     * Enemy.on("shieldIncrease", fn);
     * activatedListeners.set(["shieldIncrease",fn], 4)
     * @description
     * will add fn to activated listeners. It will be removed after 4
     * half-turns.
     */
    private activatedListeners;
    get TurnNumber(): number;
    get Friendly(): Battleship;
    get Enemy(): Battleship;
    constructor(player: Battleship, enemy: Battleship);
    nextTurn(): void;
    /**
     * Fires all damage taken events on the attachments of the players ship.
     * @listens damageTaken
     * @param damage - the amount of damage that was taken
     * @param player - the player that received the damage
     */
    private handleDamageTakenEvent;
    /**
     * Fires all damage taken events on the attachments of the players ship.
     * @listens damageTaken
     * @param damage - the amount of damage that was taken
     * @param player - the player that received the damage
     */
    private handleCriticalDamageTaken;
    /**
     * Fires to all attachments that the players turn has begun
     * @listens turnStart
     * @param player - the player that just started its turn
     */
    private handleTurnStart;
    private victory;
    /**
     * Given the player, gives the opposing player
     * @param player
     */
    private getEnemy;
    private generateOpponentShip;
}
