import { GameCollectionBase } from "./GameCollectionBase";
export declare class AttachmentCollection extends GameCollectionBase {
    private attachmentSet;
    constructor(options?: IAttachmentCollectionOptions);
}
export interface IAttachmentCollectionOptions {
    data?: Map<string, number>;
}
