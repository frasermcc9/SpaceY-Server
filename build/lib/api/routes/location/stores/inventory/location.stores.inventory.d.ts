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
export declare const location_stores_inventory_get: (req: Request, res: Response) => {
    status: string;
} | undefined;
