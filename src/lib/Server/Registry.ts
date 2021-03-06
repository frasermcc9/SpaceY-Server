import { Ship, ShipBuilder } from "../GameTypes/GameAsset/Ship/Ship";
import { Attachment } from "../GameTypes/GameAsset/Attachment/Attachment";
import { Faction } from "../GameTypes/GameAsset/Faction/Faction";
import { Material } from "../GameTypes/GameAsset/Material/Material";
import { MapCollection } from "../Extensions/Collections";
import { GameAsset } from "../GameTypes/GameAsset/GameAsset";
import { BlueprintBuilder } from "../GameTypes/GameAsset/Blueprint/Blueprint";
import { Spacemap } from "../GameTypes/GameSpacemap/Spacemap";
import { util } from "../Util/util";
import { SpacemapNode } from "../GameTypes/GameSpacemap/SpacemapNode";

export class Registry {
    public constructor(copyReg?: Registry) {
        if (copyReg) {
            this.shipRegistry = new MapCollection(copyReg.shipRegistry);
            this.attachmentRegistry = new MapCollection(copyReg.attachmentRegistry);
            this.factionRegistry = new MapCollection(copyReg.factionRegistry);
            this.materialRegistry = new MapCollection(copyReg.materialRegistry);
        }
        this.RegisterShips({ ships: [BlankShip] });
        this.defaultShip = BlankShip;
    }
    private maxRarity: number = 10;
    public get MaxRarity() {
        return this.maxRarity;
    }
    public set MaxRarity(v: number) {
        this.maxRarity = v;
    }
    private maxTechLevel: number = 10;
    public get MaxTech() {
        return this.maxTechLevel;
    }
    public set MaxTech(v: number) {
        this.maxTechLevel = v;
    }

    //#region - Spacemap

    private spacemap?: Spacemap;
    public get Spacemap() {
        return util.throwUndefined(
            this.spacemap,
            "The spacemap has not been registered. Register a spacemap with registerSpacemap."
        );
    }
    public registerSpacemap(spacemap: Spacemap) {
        this.spacemap = spacemap;
    }

    //#region - Defaults

    private defaultShip: Ship;
    public get DefaultShip(): Ship {
        return this.defaultShip;
    }
    public set DefaultShip(value: Ship) {
        if (this.defaultShip != BlankShip)
            throw new Error(
                "Default ship has already been set. It can only be set once. If this was intentional, use the 'ForceChangeDefaultShip()' method."
            );
        this.defaultShip = value;
    }
    public set ForceChangeDefaultShip(value: Ship) {
        this.defaultShip = value;
    }

    private defaultCredits = 0;
    public get DefaultCredits(): number {
        return this.defaultCredits;
    }
    public set DefaultCredits(value: number) {
        if (this.defaultCredits != 0)
            throw new Error(
                "Default credits has already been set. It can only be set once. If this was intentional, use the 'ForceChangeDefaultCredits()' method."
            );
        this.defaultCredits = value;
    }
    public set ForceChangeDefaultCredits(value: number) {
        this.defaultCredits = value;
    }

    private defaultAsteroidCooldown: number = 0;
    public get DefaultAsteroidCooldown(): number {
        return this.defaultAsteroidCooldown;
    }
    public set DefaultAsteroidCooldown(seconds: number) {
        this.defaultAsteroidCooldown = seconds;
    }

    private defaultLocation?: SpacemapNode;
    public get DefaultLocation(): SpacemapNode {
        return util.throwUndefined(this.defaultLocation);
    }
    public set DefaultLocation(node: SpacemapNode) {
        this.defaultLocation = node;
    }

    //#endregion - Defaults

    //#region - Registries

    private readonly shipRegistry = new MapCollection<string, Ship>();
    public get ShipRegistry() {
        return this.shipRegistry;
    }
    private readonly attachmentRegistry = new MapCollection<string, Attachment>();
    public get AttachmentRegistry() {
        return this.attachmentRegistry;
    }
    private readonly factionRegistry = new MapCollection<string, Faction>();
    public get FactionRegistry() {
        return this.factionRegistry;
    }
    private readonly materialRegistry = new MapCollection<string, Material>();
    public get MaterialRegistry() {
        return this.materialRegistry;
    }
    private readonly mineableMaterialRegistry = new MapCollection<string, Material>();
    public get MineableMaterialRegistry() {
        return this.mineableMaterialRegistry;
    }
    private readonly sellableMaterialRegistry = new MapCollection<string, Material>();
    public get SellableMaterialRegistry() {
        return this.sellableMaterialRegistry;
    }

    //#endregion - Registries

    //#region - Register Methods

    public RegisterShips(data: IShips): Registry {
        data.ships.forEach((ship) => {
            this.shipRegistry.set(ship.Name, ship);
        });
        return this;
    }
    public RegisterAttachments(data: IAttachments): Registry {
        data.attachments.forEach((attachment) => {
            this.attachmentRegistry.set(attachment.Name, attachment);
        });
        return this;
    }
    public RegisterFactions(data: IFactions): Registry {
        data.factions.forEach((faction) => {
            this.factionRegistry.set(faction.Name, faction);
        });
        return this;
    }
    public RegisterMaterials(data: IMaterials): Registry {
        data.materials.forEach((material) => {
            this.materialRegistry.set(material.Name, material); //add to complete registry
            if (material.IsMineable()) this.mineableMaterialRegistry.set(material.Name, material); //if mineable, add to mineable registry too
        });
        return this;
    }

    //#endregion - Register Methods

    //#region - Resolution Methods

    public ResolveShipFromName(name: string): Ship | undefined {
        const result = this.NameResolver<Ship>(name, this.ShipRegistry);
        if (!result) return undefined;
        return result;
    }
    public ResolveShipsFromName(...names: string[]): Ship[] {
        const returnValue: Ship[] = new Array();
        names.forEach((n) => {
            returnValue.push(util.throwUndefined(this.NameResolver<Ship>(n, this.ShipRegistry)));
        });
        return returnValue;
    }
    public ResolveAttachmentFromName(name: string): Attachment | undefined {
        const result = this.NameResolver<Attachment>(name, this.AttachmentRegistry);
        if (!result) return undefined;
        return result;
    }
    public ResolveAttachmentsFromName(...names: string[]): Attachment[] {
        const returnValue: Attachment[] = new Array();
        names.forEach((n) => {
            returnValue.push(util.throwUndefined(this.NameResolver<Attachment>(n, this.AttachmentRegistry)));
        });
        return returnValue;
    }
    public ResolveMaterialFromName(name: string): Material | undefined {
        const result = this.NameResolver<Material>(name, this.MaterialRegistry);
        if (!result) return undefined;
        return result;
    }
    public ResolveMaterialsFromName(...names: string[]): Material[] {
        const returnValue: Material[] = new Array();
        names.forEach((n) => {
            returnValue.push(util.throwUndefined(this.NameResolver<Material>(n, this.MaterialRegistry)));
        });
        return returnValue;
    }
    public ResolveFactionFromName(name: string): Faction | undefined {
        const result = this.NameResolver<Faction>(name, this.FactionRegistry);
        if (!result) return undefined;
        return result;
    }
    /**
     * @param T the type of object that should be resolved
     * @param name the string name of the object
     * @param registry the registry to search
     */
    private NameResolver<T>(name: string, registry: MapCollection<string, T>): T | undefined {
        return registry.get(name);
    }

    public AnyResolve(name: string): GameAsset | undefined {
        return (
            this.materialRegistry.get(name) ??
            this.attachmentRegistry.get(name) ??
            this.factionRegistry.get(name) ??
            this.shipRegistry.get(name)
        );
    }

    //#endregion - Resolution Methods
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

export const BlankShip = new ShipBuilder({
    name: "Recovered Shuttle",
    description:
        "A small recovered shuttle that was found crashed on some planet. Not worth much but it can fly... a bit.",
    techLevel: 0,
})
    .SetStats({ baseHp: 100, baseShield: 100, baseEnergy: [0, 0, 0], baseCargo: 100, baseHandling: 10 })
    .SetWeapons({ primaryCap: 1, shieldCap: 1, heavyCap: 1, minerCap: 1, generalCap: 1 })
    .EnableSell(59000)
    .SetMisc({ uri: "", subclass: "Shuttle" })
    .Build();

export type RegistryNames = "AttachmentRegistry" | "FactionRegistry" | "MaterialRegistry" | "ShipRegistry";
