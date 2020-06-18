import { Ship } from "../Buildable/Ship/Ship.ts"
import { ReputationCollection } from "../../GameCollections/ReputationCollection.ts";
import { PlayerInventory } from "./PlayerInventory.ts";
import { Skin } from "./Skin.ts";

export class Player {
    private id: string

    private ship: Ship
    private skin: Skin

    private reputation: ReputationCollection
    private inventory: PlayerInventory
    //private location:


}
