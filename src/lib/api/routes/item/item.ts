import { Request, Response } from "express";
import { Client } from "../../../main";
import stringify from "json-stringify-safe";

/**
 * GET data for give item. <br />  \
 * Status 404: item not found. <br />  \
 * Status 200: success.
 * @param item the item name
 * @returns JSON string of item
 */
export const item_get = (req: Request, res: Response) => {
    const item = req.params.item;

    const result = Client.Reg.AnyResolve(item);

    if (result != undefined) res.send({ status: "200", item: result });
    else res.send({ status: "404" });
};
