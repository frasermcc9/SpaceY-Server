import { IClientSettings } from "./Client";
import { Material } from "../GameTypes/GameAsset/Material/Material";
import { Ship } from "../GameTypes/GameAsset/Ship/Ship";
import { Attachment } from "../GameTypes/GameAsset/Attachment/Attachment";
import { Faction } from "../GameTypes/GameAsset/Faction/Faction";
import { SpacemapNode } from "../GameTypes/GameSpacemap/SpacemapNode";
export declare class Setup {
    setupClient(settings: IClientSettings): MaterialsAdder;
    static begin(): Setup;
}
declare class MaterialsAdder {
    addMaterials(materials: Material[]): ShipAdder;
}
declare class ShipAdder {
    addShips(ships: Ship[]): AttachmentAdder;
}
declare class AttachmentAdder {
    addAttachments(attachments: Attachment[]): FactionAdder;
}
declare class FactionAdder {
    addFactions(factions: Faction[]): LocationAdder;
}
declare class LocationAdder {
    addLocations(locations: SpacemapNode[]): LinkAdder;
}
declare class LinkAdder {
    addLink(a: SpacemapNode | string, b: SpacemapNode | string): this;
    finishMap(): Defaults;
}
declare class Defaults {
    defaultCredits(n: number): this;
    maxMaterialRarity(n: number): this;
    maxTechLevel(n: number): this;
    defaultShip(n: string): this;
    defaultLocation(n: string | SpacemapNode): this;
    defaultAsteroidCooldown(seconds: number): this;
    finish(): void;
}
export {};
