import { Battleship, IBattleship } from "./Battleship";
import { IBattleshipStat } from "./BattleshipStat";

export class Battle implements IBattleData {
    private playerShip: Battleship;
    private aiShip: Battleship;

    private battleTurn: number = 0;

    private activeShip: Battleship;
    private inactiveShip: Battleship;

    private turnLog: string[] = [];

    //#region IBattleData

    public get TurnNumber(): number {
        return ~~(this.battleTurn / 2);
    }
    public get Friendly(): IBattleship {
        return this.activeShip;
    }
    public get Enemy(): IBattleship {
        return this.inactiveShip;
    }
    public notify(info: string) {
        this.turnLog.push(info);
    }
    public getEnemyOf(player: IBattleship): IBattleship {
        return this.getEnemy(player);
    }

    //#endregion IBattleData

    public constructor(player: Battleship) {
        this.playerShip = player;
        this.aiShip = this.generateOpponentShip();

        this.activeShip = player;
        this.inactiveShip = this.aiShip;

        this.playerShip.on("damageTaken", this.handleDamageTakenEvent);
        this.aiShip.on("damageTaken", this.handleDamageTakenEvent);

        this.playerShip.on("criticalDamage", this.handleCriticalDamageTaken);
        this.aiShip.on("criticalDamage", this.handleCriticalDamageTaken);

        this.playerShip.on("turnStart", this.handleTurnStart);
        this.aiShip.on("turnStart", this.handleTurnStart);
    }

    public nextTurn() {
        this.battleTurn++;

        this.inactiveShip.startTurn();
    }

    //#region  - listeners

    /**
     * Fires all damage taken events on the attachments of the players ship.
     * @listens damageTaken
     * @param damage - the amount of damage that was taken
     * @param player - the player that received the damage
     */
    private handleDamageTakenEvent = (player: Battleship, damage: number) => {
        const enemy = this.getEnemy(player);
        if (player.getStat("hp") <= 0) {
            this.victory(enemy);
        }
        player.Ship.emit("onDamageTaken", { friendly: player, enemy: this.getEnemy(player), dmg: damage });
    };

    /**
     * Fires all damage taken events on the attachments of the players ship.
     * @listens damageTaken
     * @param damage - the amount of damage that was taken
     * @param player - the player that received the damage
     */
    private handleCriticalDamageTaken = (player: Battleship, damage: number) => {
        player.Ship.copyAttachments().forEach((attachment) => {
            player.Ship.emit("onCriticalDamageTaken", { friendly: player, enemy: this.getEnemy(player), dmg: damage });
        });
    };

    /**
     * Fires to all attachments that the players turn has begun
     * @listens turnStart
     * @param player - the player that just started its turn
     */
    private handleTurnStart = (player: Battleship) => {
        this.activeShip.typedEmit("turnEnd", this.activeShip);
        this.inactiveShip = this.activeShip;
        this.activeShip = player;
        player.Ship.emit("onBattlePreTurn", { battle: this });
    };

    //#endregion listeners

    /**
     * Given the player, gives the opposing player
     * @param player
     */
    private getEnemy(player: IBattleship): IBattleship {
        return this.aiShip == player ? this.playerShip : this.aiShip;
    }

    private victory(victor: IBattleship): void {}

    //TODO write logic for generating enemy battleship
    private generateOpponentShip(): Battleship {
        const faction = this.playerShip.Ship.Owner.Location.Faction;
        const pool = faction.UsableShips;
        const playerStrength = this.playerShip.Ship.Strength;
        return (1 as any) as Battleship;
    }
}

export interface IBattleData {
    TurnNumber: number;
    Friendly: IBattleship;
    Enemy: IBattleship;
    notify(info: string): void;
    getEnemyOf(player: IBattleship): IBattleship;
}
