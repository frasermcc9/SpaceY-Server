import { Client } from "../../Client/Client";
import { Attachment } from "../GameAsset/Attachment/Attachment";
import { GameCollectionBase, ICompatible } from "./GameCollectionBase";
import { MapCollection } from "../../Extensions/Collections";

export class AttachmentCollection extends GameCollectionBase {
	public constructor(options?: IAttachmentCollectionOptions) {
		super();
		//Create map with all empty attachment values, but set defined attachments to the given value.
		if (options?.data) {
			Client.Reg.AttachmentRegistry.forEach((attachment) => {
				this.set(attachment.Name, options.data?.get(attachment.Name) ?? 0);
			});
		} else {
			Client.Reg.AttachmentRegistry.forEach((attachment) => {
				this.set(attachment.Name, 0);
			});
		}
	}
	/** @override */
	public GetCompatibleItems({ minTech, maxTech }: ICompatible): MapCollection<string, Attachment> {
		return Client.Reg.AttachmentRegistry.filter((val) => val.Cost != undefined && val.TechLevel <= maxTech && val.TechLevel >= minTech);
	}

	/** @override */
	public GenerateWeights(items: Attachment[], centralRarity: number, minRarity: number, maxRarity: number): number[] {
		return items.map((val) => maxRarity - minRarity - Math.abs(centralRarity - val.TechLevel) + 1);
	}
}

export interface IAttachmentCollectionOptions {
	data?: Map<string, number>;
}
