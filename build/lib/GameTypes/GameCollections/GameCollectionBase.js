"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameCollectionBase = void 0;
const Collections_1 = require("../../Extensions/Collections");
const main_1 = require("../../main");
const AssetDecorators_1 = require("../GameAsset/AssetDecorators");
const GameAsset_1 = require("../GameAsset/GameAsset");
class GameCollectionBase extends Collections_1.MapCollection {
    /**
     * Reduces a given item by the given amount. Cannot reduce below zero.
     * @param itemName
     * @param quantity
     * @returns codes: 1-Success, 2-Item Not Found, 3-Not Enough Resources
     */
    ReduceToNonNegative(itemName, quantity) {
        if (quantity < 0) throw new TypeError("A negative number has been passed when " + this.ReduceToNonNegative.name + " was called");
        const amountOwned = this.get(itemName);
        if (amountOwned == undefined) {
            return { success: false, code: 2, error: "The given item could not be found.", amount: 0 };
        }
        if (amountOwned < quantity) {
            return {
                success: false,
                code: 3,
                error: "The user has an insufficient amount of this item.",
                amount: amountOwned,
            };
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
        if (quantity < 0) throw new TypeError("A negative number has been passed when " + this.Increase.name + " was called");
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
        if (quantity > 0) return true;
        const amountOwned = this.get(itemName);
        if (amountOwned != undefined && amountOwned >= Math.abs(quantity)) return true;
        return false;
    }
    StrictSumCollection(gameCollection) {
        if (Array.isArray(gameCollection)) {
            gameCollection.forEach((el) => {
                if (this.get(el) == undefined)
                    throw new Error(`Item with name ${el} does not exist when used in StrictSumCollection function.`);
            });
            gameCollection.forEach((el) => {
                const StartValue = this.get(el);
                this.set(el, StartValue + 1);
            });
            return;
        }
        gameCollection.forEach((val, key) => {
            if (val < 0) throw new Error(`Negative number '${val}' used in SumCollection function.`);
            if (this.get(key) == undefined)
                throw new Error(`Item with name ${key} does not exist when used in StrictSumCollection function.`);
        });
        gameCollection.forEach((val, key) => {
            const StartValue = this.get(key);
            this.set(key, val + StartValue);
        });
    }
    SumCollection(gameCollection) {
        if (Array.isArray(gameCollection)) {
            gameCollection.forEach((el) => {
                const StartValue = this.get(el);
                this.set(el, (StartValue ?? 0) + 1);
            });
            return;
        }
        gameCollection.forEach((val, key) => {
            if (val < 0) throw new Error(`Negative number '${val}' used in SumCollection function for ${key}.`);
            if (this.get(key) == undefined) this.set(key, 0);
        });
        gameCollection.forEach((val, key) => {
            const StartValue = this.get(key);
            this.set(key, val + StartValue);
        });
    }
    /**
     * @param gameCollection
     * @returns codes: 200-Success, 403-Insufficient resources
     */
    StrictSubtractCollection(gameCollection) {
        const Failed = new Array();
        gameCollection.forEach((val, key) => {
            if (val < 0) throw new Error(`Negative number '${val}' used in SubtractCollection function for ${key}.`);
            if (this.get(key) == undefined) throw new Error(`Item with name ${key} does not exist when used in SumCollection function.`);
            if (this.get(key) < val) Failed.push(key);
        });
        if (Failed.length > 0) return { code: 403, failures: Failed };
        gameCollection.forEach((val, key) => {
            const InputValue = this.get(key);
            this.set(key, InputValue - val);
        });
        return { code: 200, failures: Failed };
    }
    /**
     * @param gameCollection
     * @returns codes: 200-Success, 403-Insufficient resources
     */
    SubtractCollection(gameCollection) {
        const Failed = new Array();
        gameCollection.forEach((val, key) => {
            if (val < 0) throw new Error(`Negative number '${val}' used in SubtractCollection function for ${key}.`);
            if (this.get(key) == undefined) this.set(key, 0);
            if (this.get(key) < val) Failed.push(key);
        });
        if (Failed.length > 0) return { code: 403, failures: Failed };
        gameCollection.forEach((val, key) => {
            const InputValue = this.get(key);
            this.set(key, InputValue - val);
        });
        return { code: 200, failures: Failed };
    }
    /** @virtual */
    GetCollectionValue() {
        let total = 0;
        this.forEach((amount, name) => {
            const Item = main_1.Client.Get().Registry.AnyResolve(name);
            if (Item != undefined) total += (new AssetDecorators_1.SellableDecorator(Item).PriceData.cost || 0) * amount;
        });
        return total;
    }
    DetailedGet(name) {
        if (name instanceof GameAsset_1.GameAsset) return this.DetailGetHelper([name.Name])[0];
        else if (typeof name == "string") return this.DetailGetHelper([name])[0];
        else if (name.every((el) => typeof el == "string")) return this.DetailGetHelper(name);
        else return this.DetailGetHelper(name.map((el) => el.Name));
    }
    DetailGetHelper(names) {
        let data = new Array();
        names.forEach((name) => {
            const Item = main_1.Client.Reg.AnyResolve(name);
            if (Item == undefined) {
                data.push({ success: false, code: 404 });
            } else {
                const Quantity = this.get(Item.Name);
                data.push({ success: true, quantity: Quantity ?? 0, item: Item, code: 200 });
            }
        });
        return data;
    }
    /**
     * Generate a random collection for this class. Template method.
     */
    GenerateCollection(options) {
        let intermediatePrice = this.GetCollectionValue();
        const CompatibleItems = this.GetCompatibleItems({
            minRarity: options.minRarity,
            maxRarity: options.maxRarity,
            minTech: options.minTech,
            maxTech: options.maxTech,
        });
        const ItemNames = CompatibleItems.array();
        const Weights = this.GenerateWeights(ItemNames, options.centralRarity, options.minRarity, options.maxRarity);
        let FlatArray = new Array();
        //Generates the flat array of probabilities. See benchmarks for why this method was used
        if (options.rarity) for (let i = 0; i < ItemNames.length; ++i) for (let j = 0; j < Weights[i]; ++j) FlatArray.push(ItemNames[i]);
        else FlatArray = CompatibleItems.array();
        //Generate the collection
        do {
            const Selected = FlatArray[~~(this.RandomNumber() * FlatArray.length)];
            const Material = new AssetDecorators_1.SellableDecorator(Selected);
            const ExistingAmount = this.get(Selected.Name) ?? 0;
            this.set(Selected.Name, ExistingAmount + 1);
            intermediatePrice += Material.PriceData.cost ?? 0;
        } while (intermediatePrice < options.value);
        return this;
    }
    /**
     * Gets the size of the collection (the sum of all the values)
     */
    get CollectionSize() {
        return [...this.values()].reduce((acc, cur) => acc + cur, 0);
    }
    /**
     * Optional method for GenerateCollection. Can be overridden if different behaviour is desired
     */
    RandomNumber() {
        return Math.random();
    }
}
exports.GameCollectionBase = GameCollectionBase;
