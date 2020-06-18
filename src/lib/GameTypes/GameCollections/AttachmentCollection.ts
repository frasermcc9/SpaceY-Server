import { Collection } from "../../Extensions/Collection.ts";
import { Attachment } from "../GameAsset/Buildable/Attachment/Attachment.ts";
import { Client } from "../../Client/Client.ts";

export class AttachmentCollection extends Collection<Attachment, number> {
	private attachmentSet: Map<string, Attachment> = Client.Get().Registry.AttachmentRegistry;

	public constructor(options: IAttachmentCollectionOptions) {
		super();
		//Create map with all empty attachment values, but set defined attachments to the given value.
		if (options?.data) {
			this.attachmentSet.forEach((attachment) => {
				this.set(attachment, options.data?.get(attachment) || 0);
			});
		} else {
			this.attachmentSet.forEach((attachment) => {
				this.set(attachment, 0);
			});
		}
	}
}

export interface IAttachmentCollectionOptions {
	data?: Map<Attachment, number>;
}
