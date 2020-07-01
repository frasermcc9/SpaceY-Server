"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameCollectionBase = void 0;
const Collections_1 = require("../../Extensions/Collections");
const main_1 = require("../../main");
const AssetDecorators_1 = require("../GameAsset/AssetDecorators");
class GameCollectionBase extends Collections_1.MapCollection {
    /**
     * Reduces a given item by the given amount. Cannot reduce below zero.
     * @param itemName
     * @param quantity
     * @returns codes: 1-Success, 2-Item Not Found, 3-Not Enough Resources
     */
    ReduceToNonNegative(itemName, quantity) {
        if (quantity < 0)
            throw new TypeError("A negative number has been passed when " + this.ReduceToNonNegative.name + " was called");
        const amountOwned = this.get(itemName);
        if (amountOwned == undefined) {
            return { success: false, code: 2, error: "The given item could not be found.", amount: 0 };
        }
        if (amountOwned < quantity) {
            return { success: false, code: 3, error: "The user has an insufficient amount of this item.", amount: amountOwned };
        }
        this.set(itemName, amountOwned - quantity);
        return { success: true, code: 1, amount: amountOwned - quantity };
    }
    /**
     * Increases the given item by the amount.
     * @param itemName
     * @param quantity
     * @returns codes: 1-Success, 2-Item Not Found
     */
    Increase(itemName, quantity) {
        if (quantity < 0)
            throw new TypeError("A negative number has been passed when " + this.Increase.name + " was called");
        const amountOwned = this.get(itemName);
        if (amountOwned == undefined) {
            return { success: false, code: 2, error: "The given item could not be found.", amount: 0 };
        }
        this.set(itemName, amountOwned + quantity);
        return { success: true, code: 1, amount: amountOwned + quantity };
    }
    /**
     * Checks if this inventory can handle the operation without going negative. Input quantity MUST be negative.
     * @param itemName
     * @param quantity amount to see if reduction is possible. **MUST BE NEGATIVE FOR REDUCTION**
     */
    SufficientToDecrease(itemName, quantity) {
        if (quantity > 0)
            return true;
        const amountOwned = this.get(itemName);
        if (amountOwned != undefined && amountOwned >= Math.abs(quantity))
            return true;
        return false;
    }
    StrictSumCollection(gameCollection) {
        gameCollection.forEach((val, key) => {
            if (val < 0)
                throw new Error(`Negative number '${val}' used in SumCollection function.`);
            if (this.get(key) == undefined)
                throw new Error(`Item with name ${key} does not exist when used in SumCollection function.`);
        });
        gameCollection.forEach((val, key) => {
            const InputValue = this.get(key);
            this.set(key, val + InputValue);
        });
    }
    SumCollection(gameCollection) {
        gameCollection.forEach((val, key) => {
            if (val < 0)
                throw new Error(`Negative number '${val}' used in SumCollection function.`);
            if (this.get(key) == undefined)
                this.set(key, 0);
        });
        gameCollection.forEach((val, key) => {
            const InputValue = this.get(key);
            this.set(key, val + InputValue);
        });
    }
    /**
     * @virtual default implementation returns 0.
     */
    GetCollectionValue() {
        let total = 0;
        this.forEach((amount, name) => {
            const Item = main_1.Client.Get().Registry.AnyResolve(name);
            if (Item != undefined)
                total += (new AssetDecorators_1.SellableDecorator(Item).PriceData.cost || 0) * amount;
        });
        return total;
    }
}
exports.GameCollectionBase = GameCollectionBase;
