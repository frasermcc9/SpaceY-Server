import { Material } from "../lib/GameTypes/GameAsset/Material/Material";
import { Ship } from "../lib/GameTypes/GameAsset/Buildable/Ship/Ship";
import { Faction } from "../lib/GameTypes/GameAsset/Faction/Faction";
import { Attachment } from "../lib/GameTypes/GameAsset/Buildable/Attachment/Attachment";
export declare function GenerateMaterialsForActiveClient(): void;
export declare function GenerateShipsForActiveClient(): void;
export declare function GenerateFactionsForActiveClient(): void;
export declare function GenerateAttachmentsForActiveClient(): void;
export declare function GenerateClientSet(): void;
/**
 * Iron, Gold, Food, Tech
 */
export declare const GENERATED_MATERIALS: Material[];
export declare const GENERATED_SHIPS: Ship[];
export declare const GENERATED_FACTIONS: Faction[];
export declare const GENERATED_ATTACHMENTS: Attachment[];
