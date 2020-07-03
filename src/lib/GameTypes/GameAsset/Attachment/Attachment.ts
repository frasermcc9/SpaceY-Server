import { GameAsset } from "../GameAsset";
import { Blueprint } from "../Blueprint/Blueprint";
import { Ship } from "../Ship/Ship";

export class Attachment extends GameAsset implements IAttachment {
	protected techLevel: number;

	public onBattleStart?: (friendly: Ship, opponent: Ship) => AttachmentReport;

	constructor(options: AttachmentOptions) {
		super(options);
		this.techLevel = options.techLevel ?? 0;
		this.onBattleStart = options.onBattleStart;
	}

	public BattleStart(friendly: Ship, opponent: Ship): AttachmentReport | undefined {
		if (this.onBattleStart) return this.onBattleStart?.apply(this, [friendly, opponent]);
	}
}

export interface IAttachment {
	BattleStart(friendly: Ship, opponent: Ship): void;
}

export class AttachmentBuilder {
	private name: string;
	private description: string;
	private cost?: number;
	private blueprint?: Blueprint;
	private techLevel?: number;

	private onBattleStart?: (friendly: Ship, opponent: Ship) => AttachmentReport;

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
	public BattleStartFn(fn: (friendly: Ship, opponent: Ship) => AttachmentReport): AttachmentBuilder {
		this.onBattleStart = fn;
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
		});
	}
}

type AttachmentOptions = {
	name: string;
	cost?: number;
	description: string;
	techLevel?: number;
	blueprint?: Blueprint;

	onBattleStart?: (friendly: Ship, opponent: Ship) => AttachmentReport;
};

export type AttachmentReport = {
	message: string;
};
