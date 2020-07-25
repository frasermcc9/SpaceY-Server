import { Battleship, IBattleship } from "./Battleship";
export declare class Battle implements IBattleData {
    private playerShip;
    private aiShip;
    private battleTurn;
    private activeShip;
    private inactiveShip;
    private turnLog;
    get TurnNumber(): number;
    get Friendly(): IBattleship;
    get Enemy(): IBattleship;
    notify(info: string): void;
    getEnemyOf(player: IBattleship): IBattleship;
    constructor(player: Battleship);
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
    /**
     * Given the player, gives the opposing player
     * @param player
     */
    private getEnemy;
    private victory;
    private generateOpponentShip;
}
export interface IBattleData {
    TurnNumber: number;
    Friendly: IBattleship;
    Enemy: IBattleship;
    notify(info: string): void;
    getEnemyOf(player: IBattleship): IBattleship;
}
