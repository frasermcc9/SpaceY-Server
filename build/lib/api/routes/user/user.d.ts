import { Request, Response } from "express";
/**
 * GET user. Cannot fail.
 */
export declare const user_get: (req: Request, res: Response) => Promise<Response<any>>;
export declare const user_adjacent_get: (req: Request, res: Response) => Promise<Response<any>>;
export declare const user_has_blueprint: (req: Request, res: Response) => Promise<Response<any>>;
