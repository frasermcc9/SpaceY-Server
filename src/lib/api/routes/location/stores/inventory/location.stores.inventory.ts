import { Client } from "../../../../../main";
import { Request, Response } from "express";

/**
 * GET store inventory. <br />  \
 * Status 404: location or store not found. <br />  \
 * Status 200: success
 * @param location the location to search in
 * @param store the store to search in
 * @returns JSON <br />  \
 * inventory: Store items and amount owned <br />  \
 * costs: Cost of each item for this store
 */
export const location_stores_inventory_get = (req: Request, res: Response) => {
    const location = req.params.location;
    const store = req.params.store;
    const storeObj = Client.Reg.Spacemap.resolveNodeFromName(location)
        ?.nodeAllStores()
        .find((s) => s.Name == store);
    if (storeObj == undefined) return { status: "404" };

    const storeItems = Object.fromEntries(storeObj.getStoreItems(true));
    const storeCosts = Object.fromEntries(storeObj.StoreItemCosts);

    const returnValue: StoreStock = {
        status: "200",
        data: {
            identity: storeObj.identity(),
            credits: storeObj.Credits,
            inventory: storeItems,
            costs: storeCosts,
        },
    };

    res.send(returnValue);
};

interface StoreStock {
    status: string;
    data: {
        identity: string;
        credits: number;
        inventory: { [k: string]: number };
        costs: { [k: string]: number };
    };
}
