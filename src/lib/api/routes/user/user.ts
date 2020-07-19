import { Request, Response } from "express";
import { PlayerModel } from "../../../main";
import stringify from "json-stringify-safe";
import { Player } from "../../../GameTypes/GameAsset/Player/Player";
import { IPlayer } from "../../../Database/Models/Player/PlayerModel";

/**
 * GET user. Cannot fail.
 */
export const user_get = async (req: Request, res: Response) => {
    const param = req.params.id;
    const player = await PlayerModel.findOneOrCreateRaw({ uId: param });
    const ship = new Player(player).getShipWrapper().raw();

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

export const user_adjacent_get = async (req: Request, res: Response) => {
    const param = req.params.id;
    const player = await PlayerModel.findOneOrCreate({ uId: param });
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
