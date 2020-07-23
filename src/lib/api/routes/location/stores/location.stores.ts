import { Client } from "../../../../main";
import { Request, Response } from "express";

/**
 * GET stores for locations. <br />  \
 * Status 404: location not found. <br />  \
 * Status 200: success.
 * @param location the location to get store names
 * @returns stores: array of store names
 */
export const location_stores_get = (req: Request, res: Response) => {
    const location = req.params.location;

    const stores = Client.Reg.Spacemap.resolveNodeFromName(location)
        ?.nodeAllStores()
        .map((s) => s.Name);

    if (stores == undefined) res.send({ status: "404" });
    else res.send({ status: "200", stores: stores });
};
