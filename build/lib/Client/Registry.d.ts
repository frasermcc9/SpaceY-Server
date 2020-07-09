import { Ship } from "../GameTypes/GameAsset/Ship/Ship";
import { Attachment } from "../GameTypes/GameAsset/Attachment/Attachment";
import { Faction } from "../GameTypes/GameAsset/Faction/Faction";
import { Material } from "../GameTypes/GameAsset//Material/Material";
import { MapCollection } from "../Extensions/Collections";
import { GameAsset } from "../GameTypes/GameAsset/GameAsset";
import { Spacemap } from "../GameTypes/GameSpacemap/Spacemap";
import { SpacemapNode } from "../GameTypes/GameSpacemap/SpacemapNode";
export declare class Registry {
    constructor(copyReg?: Registry);
    private maxRarity;
    get MaxRarity(): number;
    set MaxRarity(v: number);
    private maxTechLevel;
    get MaxTech(): number;
    set MaxTech(v: number);
    private spacemap?;
    get Spacemap(): Spacemap;
    registerSpacemap(spacemap: Spacemap): void;
    private defaultShip;
    get DefaultShip(): Ship;
    set DefaultShip(value: Ship);
    set ForceChangeDefaultShip(value: Ship);
    private defaultCredits;
    get DefaultCredits(): number;
    set DefaultCredits(value: number);
    set ForceChangeDefaultCredits(value: number);
    private defaultAsteroidCooldown;
    get DefaultAsteroidCooldown(): number;
    set DefaultAsteroidCooldown(seconds: number);
    private defaultLocation?;
    get DefaultLocation(): SpacemapNode;
    set DefaultLocation(node: SpacemapNode);
    private readonly shipRegistry;
    get ShipRegistry(): MapCollection<string, Ship>;
    private readonly attachmentRegistry;
    get AttachmentRegistry(): MapCollection<string, Attachment>;
    private readonly factionRegistry;
    get FactionRegistry(): MapCollection<string, Faction>;
    private readonly materialRegistry;
    get MaterialRegistry(): MapCollection<string, Material>;
    private readonly mineableMaterialRegistry;
    get MineableMaterialRegistry(): MapCollection<string, Material>;
    private readonly sellableMaterialRegistry;
    get SellableMaterialRegistry(): MapCollection<string, Material>;
    RegisterShips(data: IShips): Registry;
    RegisterAttachments(data: IAttachments): Registry;
    RegisterFactions(data: IFactions): Registry;
    RegisterMaterials(data: IMaterials): Registry;
    ResolveShipFromName(name: string): Ship | undefined;
    ResolveAttachmentFromName(name: string): Attachment | undefined;
    ResolveMaterialFromName(name: string): Material | undefined;
    ResolveFactionFromName(name: string): Faction | undefined;
    /**
     * @param T the type of object that should be resolved
     * @param name the string name of the object
     * @param registry the registry to search
     */
    private NameResolver;
    AnyResolve(name: string): GameAsset | undefined;
}
interface IShips {
    ships: Ship[];
}
interface IAttachments {
    attachments: Attachment[];
}
interface IFactions {
    factions: Faction[];
}
interface IMaterials {
    materials: Material[];
}
export declare type RegistryNames = "AttachmentRegistry" | "FactionRegistry" | "MaterialRegistry" | "ShipRegistry";
export {};
