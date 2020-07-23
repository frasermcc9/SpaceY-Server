import { Request, Response } from "express";
import { Client } from "../../../main";

/**
 * GET if asteroid is available for user. <br />  \
 * Status 404: location not found. <br />  \
 * Status 200: success.
 * @param location the location to get store names
 * @param asteroid the name of the asteroid
 * @param userid the id of the user
 * @returns if the asteroid can be mined
 */
export const location_get = (req: Request, res: Response) => {
    const location = req.params.location;

    const result = Client.Reg.Spacemap.resolveNodeFromName(location);

    if (result == undefined) return res.send({ status: "404" });

    const response = {
        status: "200",
        location: {
            faction: result?.Faction,
            imageUri: result.ImageUri,
            name: result.Name,
            requiredWarp: result.RequiredWarp,
            techLevel: result.TechLevel,
        },
    };

    res.send(response);
};
