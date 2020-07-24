import { Request, Response } from "express";
import { Client } from "../../../main";
import { Faction } from "../../../GameTypes/GameAsset/Faction/Faction";
import { WarpPower, SpacemapNode } from "../../../GameTypes/GameSpacemap/SpacemapNode";
import stringify from "json-stringify-safe";

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

    const nodeAdjacent = Client.Reg.Spacemap.getConnectedNodes(result);
    const nodeStores = result.nodeAllStores().map((s) => s.Name);
    const nodeAsteroids = result.Asteroids.map((a) => ({ name: a.Name, value: a.GetCollectionValue() }));

    const response: ILocationResponse = {
        status: "200",
        data: {
            faction: result.Faction,
            imageUri: result.ImageUri,
            name: result.Name,
            requiredWarp: result.RequiredWarp,
            techLevel: result.TechLevel,
            adjacent: nodeAdjacent,
            stores: nodeStores,
            asteroids: nodeAsteroids,
        },
    };

    res.send(response);
};

interface ILocationResponse {
    status: string;
    data: {
        faction: Faction;
        imageUri?: string;
        name: string;
        requiredWarp: WarpPower;
        techLevel: number;
        adjacent: SpacemapNode[];
        stores: string[];
        asteroids: { name: string; value: number }[];
    };
}
