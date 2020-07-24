import { Request, Response } from "express";
import { Client } from "../../../main";

export const reg_attachments = (req: Request, res: Response) => {
    res.send(Object.fromEntries(Client.Reg.AttachmentRegistry));
};

export const reg_materials = (req: Request, res: Response) => {
    res.send(Object.fromEntries(Client.Reg.MaterialRegistry));
};

export const reg_factions = (req: Request, res: Response) => {
    res.send(Object.fromEntries(Client.Reg.FactionRegistry));
};

export const reg_ships = (req: Request, res: Response) => {
    res.send(Object.fromEntries(Client.Reg.ShipRegistry));
};
