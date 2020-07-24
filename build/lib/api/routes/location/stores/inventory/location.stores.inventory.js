"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.location_stores_inventory_get = void 0;
const main_1 = require("../../../../../main");
/**
 * GET store inventory. <br />  \
 * Status 404: location or store not found. <br />  \
 * Status 200: success
 * @param location the location to search in
 * @param store the store to search in
 * @returns JSON <br />  \
 * inventory: Store items and amount owned <br />  \
 * costs: Cost of each item for this store
 */
exports.location_stores_inventory_get = (req, res) => {
    const location = req.params.location;
    const store = req.params.store;
    const storeObj = main_1.Client.Reg.Spacemap.resolveNodeFromName(location)
        ?.nodeAllStores()
        .find((s) => s.Name == store);
    if (storeObj == undefined)
        return { status: "404" };
    const storeItems = Object.fromEntries(storeObj.getStoreItems(true));
    const storeCosts = Object.fromEntries(storeObj.StoreItemCosts);
    const returnValue = {
        status: "200",
        data: {
            identity: storeObj.identity(),
            credits: storeObj.Credits,
            inventory: storeItems,
            costs: storeCosts,
        },
    };
    res.send(returnValue);
};
//# sourceMappingURL=location.stores.inventory.js.map