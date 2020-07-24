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
    const objPlayer = new Player(player);

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
        ship: new Player(player).getShipWrapper().raw(),
        skills: player.skills,
        uId: player.uId,
        skin: player.skin,
        skins: player.skins,
    };

    return res.send(jsonPlayer);
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

export const user_has_blueprint = async (req: Request, res: Response) => {
    const param = req.params.id;
    const item = req.params.item;

    const player = await PlayerModel.findOneOrCreate({ uId: param });

    const response = player.hasBlueprintFor(item);

    return res.send(response);
};
