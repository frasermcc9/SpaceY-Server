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
    const ship = new Player_1.Player(player).getShipWrapper().raw();
    const returnPlayer = {
        uId: player.uId,
        blueprints: player.blueprints,
        exp: player.exp,
        inventory: player.inventory,
        location: player.location,
        ship: ship,
        skills: player.skills,
        skin: player.skin,
        skins: player.skins,
    };
    return res.send(returnPlayer);
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