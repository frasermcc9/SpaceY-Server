import { Material } from "../lib/GameTypes/GameAsset/Material/Material";
import { Ship } from "../lib/GameTypes/GameAsset/Ship/Ship";
import { Faction } from "../lib/GameTypes/GameAsset/Faction/Faction";
import { Attachment } from "../lib/GameTypes/GameAsset/Attachment/Attachment";
export declare function GenerateMaterialsForActiveClient(): void;
export declare function GenerateShipsForActiveClient(): void;
export declare function GenerateFactionsForActiveClient(): void;
export declare function GenerateAttachmentsForActiveClient(): void;
export declare function GenerateClientSet(): void;
/**
 * Iron, Gold, Food, Tech
 */
export declare function GENERATED_MATERIALS(): Material[];
export declare function GENERATED_SHIPS(): Ship[];
export declare function GENERATED_FACTIONS(): Faction[];
export declare function GENERATED_ATTACHMENTS(): Attachment[];
export declare function generateIntegrationSet(): void;
