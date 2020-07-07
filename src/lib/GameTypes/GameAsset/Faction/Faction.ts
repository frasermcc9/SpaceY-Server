import { GameAsset, IGameAssetOptions } from "../GameAsset";
import { Ship } from "../Ship/Ship";
import { Attachment } from "../Attachment/Attachment";

export class Faction extends GameAsset {
	public constructor(private readonly options: IFactionOptions) {
		super(options);
		this.options.soldShips = options.soldShips ?? [];
		this.options.usedShips = options.usedShips ?? [];
		this.options.soldAttachments = options.soldAttachments ?? [];
		this.options.usedAttachments = options.usedAttachments ?? [];
	}

	public get SellableShips(): Ship[] {
		return this.options.soldShips.slice();
	}
	public get SellableAttachments(): Attachment[] {
		return this.options.soldAttachments.slice();
	}

	public get UsableShips(): Ship[] {
		return this.options.soldShips.slice();
	}
	public get UsableAttachments(): Attachment[] {
		return this.options.soldAttachments.slice();
	}
}

export class FactionBuilder {
	/**Non-optional must be declared in constructor. Other options can be, but
	using the builder methods is suggested.*/
	public constructor(private readonly options: IFactionBuilderOptions) {
		if (options.cost != undefined || options.blueprint != undefined) throw new TypeError("");
		this.options.soldShips = options.soldShips ?? [];
		this.options.usedShips = options.usedShips ?? [];
		this.options.soldAttachments = options.soldAttachments ?? [];
		this.options.usedAttachments = options.usedAttachments ?? [];
	}

	public addSoldShips(ship: Ship[] | Ship): this {
		if (!Array.isArray(ship)) ship = [ship];
		this.options.soldShips?.push(...ship);
		return this;
	}

	public addUsedShips(ship: Ship[] | Ship): this {
		if (!Array.isArray(ship)) ship = [ship];
		this.options.usedShips?.push(...ship);
		return this;
	}

	public addSoldAttachments(attachment: Attachment[] | Attachment): this {
		if (!Array.isArray(attachment)) attachment = [attachment];
		this.options.soldAttachments?.push(...attachment);
		return this;
	}

	public addUsedAttachments(attachment: Attachment[] | Attachment): this {
		if (!Array.isArray(attachment)) attachment = [attachment];
		this.options.usedAttachments?.push(...attachment);
		return this;
	}

	public Build(): Faction {
		return new Faction({
			name: this.options.name,
			description: this.options.description,
			techLevel: this.options.techLevel,
			soldAttachments: this.options.soldAttachments ?? [],
			usedAttachments: this.options.usedAttachments ?? [],
			soldShips: this.options.soldShips ?? [],
			usedShips: this.options.usedShips ?? [],
		});
	}
}

interface IFactionBuilderOptions extends IGameAssetOptions {
	/**The ships that are sold by this faction */
	soldShips?: Ship[];
	/**The attachments that are sold by this faction */
	soldAttachments?: Attachment[];
	/**The ships that are used by this faction. Sold ships are used implicitly,
	 *  so this is for additional ships that aren't sold, but are to be used */
	usedShips?: Ship[];
	/**The attachments that are used by this faction. Sold attachments are used
	 * implicitly, so this is for attachments that aren't sold, but are to be
	 * used. */
	usedAttachments?: Attachment[];

	cost?: never;
	blueprint?: never;
}
interface IFactionOptions extends IGameAssetOptions {
	/**The ships that are sold by this faction */
	soldShips: Ship[];
	/**The attachments that are sold by this faction */
	soldAttachments: Attachment[];
	/**The ships that are used by this faction. Sold ships are used implicitly,
	 *  so this is for additional ships that aren't sold, but are to be used */
	usedShips: Ship[];
	/**The attachments that are used by this faction. Sold attachments are used
	 * implicitly, so this is for attachments that aren't sold, but are to be
	 * used. */
	usedAttachments: Attachment[];

	cost?: never;
	blueprint?: never;
}
