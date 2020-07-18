import { IPlayerDocument, IPlayerModel, IPlayer } from "./PlayerModel";
import { Player } from "../../../GameTypes/GameAsset/Player/Player";
export declare function setLastUpdated(this: IPlayerDocument): Promise<void>;
/** @deprecated */
export declare function incrementCredits(
    this: IPlayerDocument,
    {
        amount,
    }: {
        amount: number;
    }
): Promise<boolean>;
/** @deprecated */
export declare function decrementCredits(
    this: IPlayerDocument,
    {
        amount,
    }: {
        amount: number;
    }
): Promise<boolean>;
/** @deprecated */
export declare function getCredits(this: IPlayerDocument): Promise<Number>;
export declare function findOneOrCreate(
    this: IPlayerModel,
    {
        uId,
    }: {
        uId: string;
    }
): Promise<Player>;
export declare function findOneOrCreateRaw(
    this: IPlayerModel,
    {
        uId,
    }: {
        uId: string;
    }
): Promise<IPlayer>;
