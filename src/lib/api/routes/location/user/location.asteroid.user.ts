import { Client } from "../../../../main";
import { Request, Response } from "express";
import { Asteroid } from "../../../../GameTypes/GameMechanics/Asteroid";

/**
 * GET if asteroid is available for user. <br />  \
 * Status 404: location not found. <br />  \
 * Status 200: success.
 * @param location the location to get store names
 * @param asteroid the name of the asteroid
 * @param userid the id of the user
 * @returns if the asteroid can be mined
 */
export const location_user_asteroid_get = (req: Request, res: Response) => {
    const location = req.params.location;
    const asteroidName = req.params.asteroid;
    const user = req.params.userid;

    const result = Client.Reg.Spacemap.resolveNodeFromName(location)
        ?.Asteroids.find((a) => a.Name == asteroidName)
        ?.isAvailableForUser(user);
    if (result != undefined) res.send({ status: "200", available: result });
    else res.send({ status: "404" });
};

/**
 * GET all asteroids in the region, including whether they are ready, and if
 * not, the amount of time until they are. <br />  \
 * Status 404: location not found. <br />  \
 * Status 200: success.
 * @param location the location to get store names
 * @param userid the id of the user
 * @returns if the asteroid can be mined
 */
export const location_user_asteroids_get = (req: Request, res: Response) => {
    const location = req.params.location;
    const user = req.params.userid;

    if (location == undefined) res.send({ status: "404" });

    const available: string[] = [];
    const unavailable: { name: string; cooldown: number }[] = [];

    Client.Reg.Spacemap.resolveNodeFromName(location)?.Asteroids.forEach((a) => {
        if (a.isAvailableForUser(user)) {
            available.push(a.Name);
        } else {
            unavailable.push({ name: a.Name, cooldown: a.remainingCooldown(user) });
        }
    });

    const returnValue: LocationAsteroids = { status: "200", asteroids: { available: available, unavailable: unavailable } };

    res.send(returnValue);
};

interface LocationAsteroids {
    status: string;
    asteroids: {
        available: string[];
        unavailable: { name: string; cooldown: number }[];
    };
}
