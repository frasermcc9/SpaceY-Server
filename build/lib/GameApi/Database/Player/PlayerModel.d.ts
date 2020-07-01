import { Document, Model } from "mongoose";
import { Skin } from "../../../GameTypes/GameAsset/Player/Skin";
import { Ship } from "../../../GameTypes/GameAsset/Buildable/Ship/Ship";
import { Player } from "../../../GameTypes/GameAsset/Player/Player";
export declare const PlayerModel: IPlayerModel;
export interface IPlayer {
    uId: string;
    ship: Ship;
    skin: Skin;
    inventory: {
        credits: number;
        tokens: number;
        materials: Map<string, number>;
        ships: Map<string, number>;
        attachments: Map<string, number>;
        reputation: Map<string, number>;
    };
    dateOfEntry?: Date;
    lastUpdated?: Date;
}
export interface IPlayerDocument extends IPlayer, Document {
    setLastUpdated(this: IPlayerDocument): Promise<void>;
    decrementCredits(this: IPlayerDocument, { amount }: {
        amount: number;
    }): Promise<boolean>;
    incrementCredits(this: IPlayerDocument, { amount }: {
        amount: number;
    }): Promise<boolean>;
    getCredits(this: IPlayerDocument): Promise<number>;
}
export interface IPlayerModel extends Model<IPlayerDocument> {
    findOneOrCreate(this: IPlayerModel, { uId }: {
        uId: string;
    }): Promise<Player>;
}
