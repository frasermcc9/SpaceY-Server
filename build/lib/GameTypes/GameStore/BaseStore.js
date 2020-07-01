"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseStore = void 0;
const GameCollectionBase_1 = require("../GameCollections/GameCollectionBase");
class BaseStore extends GameCollectionBase_1.GameCollectionBase {
    constructor(credits) {
        super();
        this.credits = credits;
    }
    get Credits() {
        return this.credits;
    }
    async Buy({ buyer, item, quantity }) {
        //Check valid quantity
        if (quantity < 0)
            return { success: false, amount: 0, code: 6, error: "Negative quantity" };
        //Check if material exists in game
        const Item = this.GetItem(item);
        if (Item == undefined)
            return { success: false, amount: 0, code: 2, error: "Item not found" };
        //Check if material is sellable, get cost per item
        const cpi = this.GetCostOfItem(Item);
        if (cpi == undefined)
            return { success: false, amount: 0, code: 5, error: "Invalid item" };
        //Check if this store has enough resources to sell
        if (!this.SufficientToDecrease(item, -quantity))
            return { success: false, amount: 0, code: 3, error: "Insufficient amount of item at store" };
        //Check if the user has enough credits
        if (buyer.Credits < cpi * quantity)
            return { success: false, amount: 0, code: 4, error: "Insufficient credits owned by player" };
        const storeResult = this.ReduceToNonNegative(item, quantity);
        if (!storeResult.success)
            return { success: false, amount: 0, code: 7, error: "Unknown error occurred." };
        buyer.CreditsDecrement({ amount: cpi * quantity });
        this.credits += cpi * quantity;
        const m = await buyer.MaterialIncrement(item, quantity);
        return { success: true, amount: m.amount, code: 1 };
    }
}
exports.BaseStore = BaseStore;
