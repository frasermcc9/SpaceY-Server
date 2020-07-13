import { Battleship } from "../GameAsset/Ship/Battleship";
import { GameEvent } from "../GameAsset/Attachment/Attachment";

export class Battle implements IBattleData {
	private playerShip: Battleship;
	private aiShip: Battleship;

	private battleTurn: number = 0;

	private activeShip: Battleship;
	private inactiveShip: Battleship;

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
	private activatedListeners: Map<[string, any], number> = new Map();

	//#region IBattleData

	public get TurnNumber(): number {
		return ~~(this.battleTurn / 2);
	}
	public get Friendly(): Battleship {
		return this.activeShip;
	}
	public get Enemy(): Battleship {
		return this.inactiveShip;
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

		//decrease the turns left for all activated listeners
		this.activatedListeners.forEach((duration, event) => {
			this.activatedListeners.set(event, duration - 1);
			if (duration - 1 == -1) {
				this.aiShip.removeListener(event[0], event[1]);
			}
		});

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
		if (player.Hp <= 0) {
			this.victory(enemy);
		}
		player.Ship.copyAttachments().forEach((attachment) => {
			attachment.dispatch(GameEvent.BATTLE_DAMAGE_TAKEN, player, this.getEnemy(player), damage);
		});
	};

	/**
	 * Fires all damage taken events on the attachments of the players ship.
	 * @listens damageTaken
	 * @param damage - the amount of damage that was taken
	 * @param player - the player that received the damage
	 */
	private handleCriticalDamageTaken = (player: Battleship, _damage: number) => {
		player.Ship.copyAttachments().forEach((attachment) => {
			attachment.dispatch(GameEvent.BATTLE_CRITICAL_DAMAGE_TAKEN, player, this.getEnemy(player));
		});
	};

	/**
	 * Fires to all attachments that the players turn has begun
	 * @listens turnStart
	 * @param player - the player that just started its turn
	 */
	private handleTurnStart = (player: Battleship) => {
		this.inactiveShip = this.activeShip;
		this.activeShip = player;

		player.Ship.copyAttachments().forEach((attachment) => {
			attachment.dispatch(GameEvent.BATTLE_PRE_TURN, this);
		});
	};

	//#endregion listeners

	private victory(victor: Battleship): void {}

	/**
	 * Given the player, gives the opposing player
	 * @param player
	 */
	private getEnemy(player: Battleship): Battleship {
		return this.aiShip == player ? this.playerShip : this.aiShip;
	}

	private generateOpponentShip(): Battleship {
		const faction = this.playerShip.Ship.Owner.Location.Faction;
		const pool = faction.UsableShips;
		const playerStrength = this.playerShip.Ship.Strength;
		return (1 as any) as Battleship;
	}
}

export interface IBattleData {
	TurnNumber: number;
	Friendly: Battleship;
	Enemy: Battleship;
}
