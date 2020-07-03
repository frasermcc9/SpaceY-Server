import { Client } from "../../Client/Client";
import { Attachment } from "../GameAsset/Attachment/Attachment";
import { GameCollectionBase } from "./GameCollectionBase";

export class AttachmentCollection extends GameCollectionBase {
	private attachmentSet: Map<string, Attachment> = Client.Get().Registry.AttachmentRegistry;

	public constructor(options?: IAttachmentCollectionOptions) {
		super();
		//Create map with all empty attachment values, but set defined attachments to the given value.
		if (options?.data) {
			this.attachmentSet.forEach((attachment) => {
				this.set(attachment.Name, options.data?.get(attachment.Name) || 0);
			});
		} else {
			this.attachmentSet.forEach((attachment) => {
				this.set(attachment.Name, 0);
			});
		}
	}
}

export interface IAttachmentCollectionOptions {
	data?: Map<string, number>;
}
