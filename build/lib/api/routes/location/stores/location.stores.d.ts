import { Request, Response } from "express";
/**
 * GET stores for locations. <br />  \
 * Status 404: location not found. <br />  \
 * Status 200: success.
 * @param location the location to get store names
 * @returns stores: array of store names
 */
export declare const location_stores_get: (req: Request, res: Response) => void;
