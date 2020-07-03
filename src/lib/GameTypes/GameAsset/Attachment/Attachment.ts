import { GameAsset } from "../GameAsset";
import { Blueprint } from "../Blueprint/Blueprint";
import { Ship } from "../Ship/Ship";

export class Attachment extends GameAsset implements IAttachment {
	protected techLevel: number;

	private onBattleStart?: BattleFunction;
	private onBattlePreTurn?: BattleFunction;
	private onBattlePostTurn?: BattleFunction;
	private onBattleInvoked?: BattleFunction;

	constructor(options: AttachmentOptions) {
		super(options);
		this.techLevel = options.techLevel ?? 0;
		this.onBattleStart = options.onBattleStart;
		this.onBattlePreTurn = options.onBattlePreTurn;
		this.onBattlePostTurn = options.onBattlePostTurn;
		this.onBattleInvoked = options.onBattleInvoked;
	}

	public BattleStart(friendly: Ship, opponent: Ship): AttachmentReport | undefined {
		if (this.onBattleStart) return this.onBattleStart.apply(this, [friendly, opponent]);
	}
	public BattlePreTurn(friendly: Ship, opponent: Ship): AttachmentReport | undefined {
		if (this.onBattlePreTurn) return this.onBattlePreTurn.apply(this, [friendly, opponent]);
	}
	public BattlePostTurn(friendly: Ship, opponent: Ship): AttachmentReport | undefined {
		if (this.onBattlePostTurn) return this.onBattlePostTurn.apply(this, [friendly, opponent]);
	}
	public BattleInvoked(friendly: Ship, opponent: Ship): AttachmentReport | undefined {
		if (this.onBattleInvoked) return this.onBattleInvoked.apply(this, [friendly, opponent]);
	}
}

export interface IAttachment {
	BattleStart(friendly: Ship, opponent: Ship): AttachmentReport | undefined;
	BattlePreTurn(friendly: Ship, opponent: Ship): AttachmentReport | undefined;
	BattlePostTurn(friendly: Ship, opponent: Ship): AttachmentReport | undefined;
	BattleInvoked(friendly: Ship, opponent: Ship): AttachmentReport | undefined;
}

export class AttachmentBuilder {
	private name: string;
	private description: string;
	private cost?: number;
	private blueprint?: Blueprint;
	private techLevel?: number;

	private onBattleStart?: BattleFunction;
	private onBattlePreTurn?: BattleFunction;
	private onBattlePostTurn?: BattleFunction;
	private onBattleInvoked?: BattleFunction;

	public constructor({ name, description, techLevel }: { name: string; description: string; techLevel?: number }) {
		this.name = name;
		this.description = description;
		this.techLevel = techLevel;
	}
	public EnableSellable(price: number): AttachmentBuilder {
		this.cost = price;
		return this;
	}
	public EnableBuildable(blueprint: Blueprint): AttachmentBuilder {
		this.blueprint = blueprint;
		return this;
	}
	public BattleStartFn(fn: BattleFunction): AttachmentBuilder {
		this.onBattleStart = fn;
		return this;
    }
    public BattlePreTurnFn(fn: BattleFunction): AttachmentBuilder {
		this.onBattlePreTurn = fn;
		return this;
    }
    public BattlePostTurnFn(fn: BattleFunction): AttachmentBuilder {
		this.onBattlePostTurn = fn;
		return this;
    }
    public BattleInvokeFn(fn: BattleFunction): AttachmentBuilder {
		this.onBattleInvoked = fn;
		return this;
	}
	public Build(): Attachment {
		return new Attachment({
			name: this.name,
			description: this.description,
			blueprint: this.blueprint,
			cost: this.cost,
			techLevel: this.techLevel,

			onBattleStart: this.onBattleStart,
			onBattlePreTurn: this.onBattlePreTurn,
			onBattlePostTurn: this.onBattlePostTurn,
			onBattleInvoked: this.onBattleInvoked,
		});
	}
}

type AttachmentOptions = {
	name: string;
	cost?: number;
	description: string;
	techLevel?: number;
	blueprint?: Blueprint;

	onBattleStart?: BattleFunction;
	onBattlePreTurn?: BattleFunction;
	onBattlePostTurn?: BattleFunction;
	onBattleInvoked?: BattleFunction;
};

export type AttachmentReport = {
	message: string;
};

export type BattleFunction = (friendly: Ship, opponent: Ship) => AttachmentReport;
