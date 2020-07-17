"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreType = exports.BaseStore = void 0;
const Collections_1 = require("../../Extensions/Collections");
const AssetDecorators_1 = require("../GameAsset/AssetDecorators");
const util_1 = require("../../Util/util");
const Server_1 = require("../../Server/Server");
class BaseStore {
    constructor(collection, options) {
        this.manualEnabled = false;
        this.marketForceSettings = {
            randEffect: 10,
            hiTechEffect: 25,
            loTechEffect: 15,
        };
        this.collection = collection;
        this.name = options.storeName;
        this.credits = options.initialCredits;
        this.initCredits = options.initialCredits;
        this.storeType = options.type;
        this.marketForces = options.marketForces ?? false;
        this.manualInventory = new Collections_1.MapCollection();
    }
    get Credits() {
        return this.credits;
    }
    set MarketForceSettings(options) {
        this.marketForceSettings.hiTechEffect = options.hiTechEffect ?? 30;
        this.marketForceSettings.loTechEffect = options.loTechEffect ?? 15;
        this.marketForceSettings.randEffect = options.randEffect ?? 20;
    }
    setFaction(faction) {
        this.marketForceSettings.territory = faction;
    }
    //#region Trading
    /**
     * Buys from the store, removing it from the store collection and into the
     * player.
     * @param TradeOptions type
     * @returns codes <br />  \
     * 200: Success<br />  \
     * 400: Invalid input, check quantity signs<br />  \
     * 404: Not found, no item could be found for the given name<br />  \
     * 405: Cannot buy item, the item provided cannot be bought<br />  \
     * 403: Not allowed, the store or player has insufficient resource<br />  \
     * 500: Unknown server error
     */
    async buyFromStore({ trader, item, quantity }) {
        //Check valid quantity
        if (quantity < 0)
            return { code: 400 };
        //Check if material exists in game
        if (this.collection.has(item) == undefined)
            return { code: 404 };
        //Check if material is sellable, get cost per item
        const cpi = this.getCostPerItem(item);
        if (cpi == undefined)
            return { code: 405 };
        //Check if this store has enough resources to sell
        if (!this.collection.SufficientToDecrease(item, -quantity))
            return { code: 403 };
        //Check if the user has enough credits
        if (trader.Credits < cpi * quantity)
            return { code: 403 };
        const storeResult = this.collection.ReduceToNonNegative(item, quantity);
        if (!storeResult.success)
            return { code: 500 };
        trader.CreditsDecrement({ amount: cpi * quantity });
        this.credits += cpi * quantity;
        const m = await trader.AutoInventoryEdit(item, quantity);
        trader.save();
        return { itemAmount: m.amount, playerCredits: trader.Credits, code: 200 };
    }
    /**
     * Sells from the store, removing it from the player into the store.
     * @param TradeOptions type
     * @returns codes <br />  \
     * 200: Success<br />  \
     * 400: Invalid input, check quantity signs<br />  \
     * 404: Not found, no item could be found for the given name<br />  \
     * 405: Cannot buy item, the item provided cannot be bought<br />  \
     * 403: Not allowed, the store or player has insufficient resource<br />  \
     * 500: Unknown server error
     */
    async sellToStore({ trader, item, quantity }) {
        if (quantity < 0)
            return { code: 400 };
        if (this.collection.has(item) == undefined)
            return { code: 404 };
        const cpi = this.getCostPerItem(item);
        if (cpi == undefined)
            return { code: 405 };
        //Check if the player and store can afford to sell
        const inPlayerInventory = trader.AutoInventoryRetrieve(item).amount;
        if (inPlayerInventory == undefined)
            return { code: 500 };
        if (inPlayerInventory < quantity)
            return { code: 403 };
        if (this.credits < cpi * quantity)
            return { code: 403 };
        this.credits -= cpi * quantity;
        this.collection.Increase(item, quantity);
        trader.CreditsIncrement({ amount: cpi * quantity });
        const playerNew = (await trader.AutoInventoryEdit(item, -quantity)).amount;
        if (playerNew == undefined)
            return { code: 500 };
        trader.save();
        return { itemAmount: playerNew, playerCredits: trader.Credits, code: 200 };
    }
    /**
     * Sells from the store, removing it from the player into the store. **Will
     * execute even if the store has insufficient credits to buy. The player
     * will only be compensated for the credits held by the store.**
     * @param TradeOptions type
     * @returns codes <br />  \
     * 200: Success<br />  \
     * 400: Invalid input, check quantity signs<br />  \
     * 404: Not found, no item could be found for the given name<br />  \
     * 405: Cannot buy item, the item provided cannot be bought<br />  \
     * 403: Not allowed, the store or player has insufficient resource<br />  \
     * 500: Unknown server error
     */
    async sellToStoreForce({ trader, item, quantity }) {
        if (quantity < 0)
            return { code: 400 };
        if (this.collection.has(item) == undefined)
            return { code: 404 };
        const cpi = this.getCostPerItem(item);
        if (cpi == undefined)
            return { code: 405 };
        //Check if the player and store can afford to sell
        const inPlayerInventory = trader.AutoInventoryRetrieve(item).amount;
        if (inPlayerInventory == undefined)
            return { code: 500 };
        if (inPlayerInventory < quantity)
            return { code: 403 };
        let storeCreditsToSpend = cpi * quantity;
        if (this.credits < storeCreditsToSpend)
            storeCreditsToSpend = this.credits;
        this.credits -= storeCreditsToSpend;
        this.collection.Increase(item, quantity);
        trader.CreditsIncrement({ amount: storeCreditsToSpend });
        const playerNew = (await trader.AutoInventoryEdit(item, -quantity)).amount;
        if (playerNew == undefined)
            return { code: 500 };
        trader.save();
        return { itemAmount: playerNew, playerCredits: trader.Credits, code: 200 };
    }
    getCostPerItem(item) {
        if (this.marketForces) {
            return new AssetDecorators_1.SellableDecorator(item).fluctuatingPriceData(this.marketForceSettings).cost;
        }
        return new AssetDecorators_1.SellableDecorator(item).PriceData.cost;
    }
    //#endregion - Trading
    getCollectionValue() {
        return this.collection.GetCollectionValue();
    }
    /**@deprecated */
    GetCollectionValue() {
        return this.getCollectionValue();
    }
    /**
     * Gets items in the store
     * @returns Map<item name, amount available>
     */
    getStoreItems(includeEmpty = false) {
        const full = new Collections_1.MapCollection(this.collection);
        if (includeEmpty)
            return full;
        const reduced = new Collections_1.MapCollection();
        full.forEach((q, n) => {
            if (q != 0)
                reduced.set(n, q);
        });
        return reduced;
    }
    /**
     * Gets costs of items in the store
     * @returns Map<item name, cost>
     */
    get StoreItemCosts() {
        const output = new Collections_1.MapCollection();
        this.collection.forEach((_, item) => {
            output.set(item, util_1.util.throwUndefined(this.getCostPerItem(item)));
        });
        return output;
    }
    isType(type) {
        return type == this.storeType;
    }
    //Refresh the store with new stock
    update() {
        if (this.credits < this.initCredits) {
            this.credits = this.initCredits;
        }
        if (this.manualEnabled) {
            return this.setInventory(this.manualInventory);
        }
        return this.populateInventory();
    }
    generateInventory() {
        this.manualEnabled = true;
        this.populateInventory();
    }
    get Name() {
        return this.name;
    }
    get Faction() {
        return this.marketForceSettings.territory;
    }
    /**
     * Clears the current inventory, and sets it to what is given in the input parameter.
     * @param data
     */
    setInventory(data) {
        this.manualEnabled = true;
        this.collection.forEach((_el, key) => {
            this.collection.set(key, 0);
        });
        this.manualInventory = new Collections_1.MapCollection(data);
        return this.collection.StrictSumCollection(data);
    }
    identity() {
        return this.name;
    }
    //#region TESTING METHODS
    INTERNAL_AlterItem(item, n) {
        if (!Server_1.Server.TEST)
            throw new Error("Internal prefix functions can only be used in test mode.");
        const currentAmount = this.collection.get(item);
        this.collection.set(item, (currentAmount ?? 0) + n);
    }
    INTERNAL_GetCollection() {
        return this.collection;
    }
}
exports.BaseStore = BaseStore;
var StoreType;
(function (StoreType) {
    StoreType[StoreType["BASE"] = 0] = "BASE";
    StoreType[StoreType["MATERIAL_STORE"] = 1] = "MATERIAL_STORE";
    StoreType[StoreType["SHIP_STORE"] = 2] = "SHIP_STORE";
    StoreType[StoreType["ATTACHMENT_STORE"] = 3] = "ATTACHMENT_STORE";
})(StoreType = exports.StoreType || (exports.StoreType = {}));
