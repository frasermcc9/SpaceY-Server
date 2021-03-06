import { Document, model, Model } from "mongoose";
import { Skin } from "../../../GameTypes/GameAsset/Player/Skin";
import { PlayerInventory } from "../../../GameTypes/GameAsset/Player/PlayerInventory";
import { Ship } from "../../../GameTypes/GameAsset/Ship/Ship";
import PlayerSchema from "./playerSchema";
import { Player } from "../../../GameTypes/GameAsset/Player/Player";
import { Material } from "../../../GameTypes/GameAsset/Material/Material";

export const PlayerModel = model<IPlayerDocument>("players", PlayerSchema) as IPlayerModel;

export interface IPlayer {
    uId: string;
    ship: { name: string; equipped: string[] };
    skin?: { skinUri: string; skinName: string };
    skins?: { skinUri: string; skinName: string }[];
    inventory: {
        credits: number;
        tokens: number;
        materials: Map<string, number>;
        ships: Map<string, number>;
        attachments: Map<string, number>;
        reputation: Map<string, number>;
    };
    location: string;
    blueprints: string[];
    exp: number;
    skills: [number, number, number];
    dateOfEntry?: Date;
    lastUpdated?: Date;
}
export interface IPlayerDocument extends IPlayer, Document {
    setLastUpdated(this: IPlayerDocument): Promise<void>;
    decrementCredits(this: IPlayerDocument, { amount }: { amount: number }): Promise<boolean>;
    incrementCredits(this: IPlayerDocument, { amount }: { amount: number }): Promise<boolean>;
    getCredits(this: IPlayerDocument): Promise<number>;
}
export interface IPlayerModel extends Model<IPlayerDocument> {
    findOneOrCreate(this: IPlayerModel, { uId }: { uId: string }): Promise<Player>;
    findOneOrCreateRaw(this: IPlayerModel, { uId }: { uId: string }): Promise<IPlayer>;
}
