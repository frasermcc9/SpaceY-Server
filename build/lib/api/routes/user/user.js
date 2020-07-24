"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.user_has_blueprint = exports.user_adjacent_get = exports.user_get = void 0;
const main_1 = require("../../../main");
const Player_1 = require("../../../GameTypes/GameAsset/Player/Player");
/**
 * GET user. Cannot fail.
 */
exports.user_get = async (req, res) => {
    const param = req.params.id;
    const player = await main_1.PlayerModel.findOneOrCreateRaw({ uId: param });
    const objPlayer = new Player_1.Player(player);
    const jsonPlayer = {
        blueprints: player.blueprints,
        exp: player.exp,
        location: player.location,
        inventory: {
            attachments: Object.fromEntries(player.inventory.attachments),
            materials: Object.fromEntries(player.inventory.materials),
            ships: Object.fromEntries(player.inventory.ships),
            reputation: Object.fromEntries(player.inventory.reputation),
            credits: player.inventory.credits,
            tokens: player.inventory.tokens,
            cargoString: objPlayer.cargoString(),
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
exports.user_has_blueprint = async (req, res) => {
    const param = req.params.id;
    const item = req.params.item;
    const player = await main_1.PlayerModel.findOneOrCreate({ uId: param });
    const response = player.hasBlueprintFor(item);
    return res.send(response);
};
//# sourceMappingURL=user.js.map