"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Battle = void 0;
class Battle {
    //#endregion IBattleData
    constructor(player) {
        this.battleTurn = 0;
        this.turnLog = [];
        //#region  - listeners
        /**
         * Fires all damage taken events on the attachments of the players ship.
         * @listens damageTaken
         * @param damage - the amount of damage that was taken
         * @param player - the player that received the damage
         */
        this.handleDamageTakenEvent = (player, damage) => {
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
        this.handleCriticalDamageTaken = (player, damage) => {
            player.Ship.copyAttachments().forEach((attachment) => {
                player.Ship.emit("onCriticalDamageTaken", { friendly: player, enemy: this.getEnemy(player), dmg: damage });
            });
        };
        /**
         * Fires to all attachments that the players turn has begun
         * @listens turnStart
         * @param player - the player that just started its turn
         */
        this.handleTurnStart = (player) => {
            this.activeShip.typedEmit("turnEnd", this.activeShip);
            this.inactiveShip = this.activeShip;
            this.activeShip = player;
            player.Ship.emit("onBattlePreTurn", { battle: this });
        };
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
    //#region IBattleData
    get TurnNumber() {
        return ~~(this.battleTurn / 2);
    }
    get Friendly() {
        return this.activeShip;
    }
    get Enemy() {
        return this.inactiveShip;
    }
    notify(info) {
        this.turnLog.push(info);
    }
    getEnemyOf(player) {
        return this.getEnemy(player);
    }
    nextTurn() {
        this.battleTurn++;
        this.inactiveShip.startTurn();
    }
    //#endregion listeners
    /**
     * Given the player, gives the opposing player
     * @param player
     */
    getEnemy(player) {
        return this.aiShip == player ? this.playerShip : this.aiShip;
    }
    victory(victor) { }
    //TODO write logic for generating enemy battleship
    generateOpponentShip() {
        const faction = this.playerShip.Ship.Owner.Location.Faction;
        const pool = faction.UsableShips;
        const playerStrength = this.playerShip.Ship.Strength;
        return 1;
    }
}
exports.Battle = Battle;
//# sourceMappingURL=Battle.js.map