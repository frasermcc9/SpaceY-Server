"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.user_adjacent_get = exports.user_get = void 0;
const main_1 = require("../../../main");
const Player_1 = require("../../../GameTypes/GameAsset/Player/Player");
/**
 * GET user. Cannot fail.
 */
exports.user_get = async (req, res) => {
    const param = req.params.id;
    const player = await main_1.PlayerModel.findOneOrCreateRaw({ uId: param });
    const jsonPlayer = {
        blueprints: player.blueprints,
        exp: player.exp,
        location: player.location,
        inventory: {
            attachments: Object.fromEntries(player.inventory.attachments),
            materials: Object.fromEntries(player.inventory.attachments),
            ships: Object.fromEntries(player.inventory.attachments),
            reputation: Object.fromEntries(player.inventory.attachments),
            credits: player.inventory.credits,
            tokens: player.inventory.credits,
        },
        ship: new Player_1.Player(player).getShipWrapper().raw(),
        skills: player.skills,
        uId: player.uId,
        skin: player.skin,
        skins: player.skins,
    };
    return res.send(jsonPlayer);
};
exports.user_adjacent_get = async (req, res) => {
    const param = req.params.id;
    const player = await main_1.PlayerModel.findOneOrCreate({ uId: param });
    const response = player.adjacentLocations().map((l) => {
        return {
            status: "200",
            location: {
                faction: l.Faction,
                imageUri: l.ImageUri,
                name: l.Name,
                requiredWarp: l.RequiredWarp,
                techLevel: l.TechLevel,
            },
        };
    });
    return res.send(response);
};
//# sourceMappingURL=user.js.map