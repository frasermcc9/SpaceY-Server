import { Attachment } from "../GameAsset/Attachment/Attachment";
import { GameCollectionBase, ICompatible } from "./GameCollectionBase";
import { MapCollection } from "../../Extensions/Collections";
export declare class AttachmentCollection extends GameCollectionBase {
    constructor(options?: IAttachmentCollectionOptions);
    /** @override */
    GetCompatibleItems({ minTech, maxTech }: ICompatible): MapCollection<string, Attachment>;
    /** @override */
    GenerateWeights(items: Attachment[], centralRarity: number, minRarity: number, maxRarity: number): number[];
}
export interface IAttachmentCollectionOptions {
    data?: Map<string, number>;
}
