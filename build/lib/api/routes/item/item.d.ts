import { Request, Response } from "express";
/**
 * GET data for give item. <br />  \
 * Status 404: item not found. <br />  \
 * Status 200: success.
 * @param item the item name
 * @returns JSON string of item
 */
export declare const item_get: (req: Request, res: Response) => void;
