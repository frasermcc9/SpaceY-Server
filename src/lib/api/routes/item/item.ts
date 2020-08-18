import { Request, Response } from "express";
import { Client } from "../../../main";
import { BuildableDecorator } from "../../../GameTypes/GameAsset/AssetDecorators";

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

export const item_blueprint_get = (req: Request, res: Response) => {
    const item = req.params.item;

    const result = Client.Reg.AnyResolve(item);
    if (result == undefined) return res.send({ status: "404" });

    const bpCheck = new BuildableDecorator(result).Blueprint.blueprint;
    if (bpCheck == undefined) return res.send({ status: "404" });

    const blueprint = Object.fromEntries(bpCheck.filter((v) => v != 0));
    const yields = bpCheck.Yield;

    res.send({ status: "200", data: { materials: blueprint, yields: yields } });
};
