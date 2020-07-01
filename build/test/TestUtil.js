"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GENERATED_ATTACHMENTS = exports.GENERATED_FACTIONS = exports.GENERATED_SHIPS = exports.GENERATED_MATERIALS = exports.GenerateClientSet = exports.GenerateAttachmentsForActiveClient = exports.GenerateFactionsForActiveClient = exports.GenerateShipsForActiveClient = exports.GenerateMaterialsForActiveClient = void 0;
const Client_1 = require("../lib/Client/Client");
const Material_1 = require("../lib/GameTypes/GameAsset/Material/Material");
const Ship_1 = require("../lib/GameTypes/GameAsset/Buildable/Ship/Ship");
const Faction_1 = require("../lib/GameTypes/GameAsset/Faction/Faction");
const Attachment_1 = require("../lib/GameTypes/GameAsset/Buildable/Attachment/Attachment");
function GenerateMaterialsForActiveClient() {
    const client = Client_1.Client.Get();
    client.Registry.RegisterMaterials({ materials: exports.GENERATED_MATERIALS });
}
exports.GenerateMaterialsForActiveClient = GenerateMaterialsForActiveClient;
function GenerateShipsForActiveClient() {
    const client = Client_1.Client.Get();
    client.Registry.RegisterShips({ ships: exports.GENERATED_SHIPS });
}
exports.GenerateShipsForActiveClient = GenerateShipsForActiveClient;
function GenerateFactionsForActiveClient() {
    const client = Client_1.Client.Get();
    client.Registry.RegisterFactions({ factions: exports.GENERATED_FACTIONS });
}
exports.GenerateFactionsForActiveClient = GenerateFactionsForActiveClient;
function GenerateAttachmentsForActiveClient() {
    const client = Client_1.Client.Get();
    client.Registry.RegisterAttachments({ attachments: exports.GENERATED_ATTACHMENTS });
}
exports.GenerateAttachmentsForActiveClient = GenerateAttachmentsForActiveClient;
function GenerateClientSet() {
    GenerateMaterialsForActiveClient();
    GenerateShipsForActiveClient();
    GenerateFactionsForActiveClient();
    GenerateAttachmentsForActiveClient();
}
exports.GenerateClientSet = GenerateClientSet;
/**
 * Iron, Gold, Food, Tech
 */
exports.GENERATED_MATERIALS = [
    new Material_1.MaterialBuilder({ name: "Iron", description: "A small iron nugget." }).EnableSell(25).EnableMine().SetRarity(4).Build(),
    new Material_1.MaterialBuilder({ name: "Gold", description: "A small gold nugget." }).EnableSell(75).EnableMine().SetRarity(10).Build(),
    new Material_1.MaterialBuilder({ name: "Food", description: "Food for one person." }).EnableSell(5).SetRarity(1).Build(),
    new Material_1.MaterialBuilder({ name: "Tech", description: "Pile of tech pieces." }).EnableSell(50).SetRarity(6).Build(),
];
exports.GENERATED_SHIPS = [
    new Ship_1.Ship({ description: "A small but agile ship", name: "Shuttle" }),
    new Ship_1.Ship({ description: "A medium sized vehicle", name: "Warship" }),
    new Ship_1.Ship({ description: "A flagship destroyer", name: "Destroyer" }),
];
exports.GENERATED_FACTIONS = [
    new Faction_1.Faction({ description: "Like you. And me.", name: "Humans" }),
    new Faction_1.Faction({ description: "The great alliance of the galaxy", name: "Alliance" }),
    new Faction_1.Faction({ description: "The sentient robotic race", name: "Cyborgs" }),
];
exports.GENERATED_ATTACHMENTS = [
    new Attachment_1.Attachment({ name: "Blaster", description: "Standard Issue Blaster" }),
    new Attachment_1.Attachment({ name: "Space Sword", description: "Not very practical" }),
    new Attachment_1.Attachment({ name: "Obliterator", description: "Quite scary, really" }),
];
