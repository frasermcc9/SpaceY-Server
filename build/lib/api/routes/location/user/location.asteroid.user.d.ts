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
export declare const location_user_asteroid_get: (req: Request, res: Response) => void;
/**
 * GET all asteroids in the region, including whether they are ready, and if
 * not, the amount of time until they are. <br />  \
 * Status 404: location not found. <br />  \
 * Status 200: success.
 * @param location the location to get store names
 * @param userid the id of the user
 * @returns if the asteroid can be mined
 */
export declare const location_user_asteroids_get: (req: Request, res: Response) => void;
