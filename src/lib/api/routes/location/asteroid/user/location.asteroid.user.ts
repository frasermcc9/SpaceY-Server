import { Client } from "../../../../../main";
import { Request, Response } from "express";

/**
 * GET if asteroid is available for user. <br />  \
 * Status 404: location not found. <br />  \
 * Status 200: success.
 * @param location the location to get store names
 * @param asteroid the name of the asteroid
 * @param userid the id of the user
 * @returns if the asteroid can be mined
 */
export const location_asteroid_user_get = (req: Request, res: Response) => {
    const location = req.params.location;
    const asteroidName = req.params.asteroid;
    const user = req.params.userid;

    const result = Client.Reg.Spacemap.resolveNodeFromName(location)
        ?.Asteroids.find((a) => a.Name == asteroidName)
        ?.isAvailableForUser(user);
    if (result != undefined) res.send({ status: "200", available: result });
    else res.send({ status: "404" });
};
