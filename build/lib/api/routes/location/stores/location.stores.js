"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.location_stores_get = void 0;
const main_1 = require("../../../../main");
/**
 * GET stores for locations. <br />  \
 * Status 404: location not found. <br />  \
 * Status 200: success.
 * @param location the location to get store names
 * @returns stores: array of store names
 */
exports.location_stores_get = (req, res) => {
    const location = req.params.location;
    const stores = main_1.Client.Reg.Spacemap.resolveNodeFromName(location)
        ?.nodeAllStores()
        .map((s) => s.Name);
    if (stores == undefined)
        res.send({ status: "404" });
    else
        res.send({ status: "200", stores: stores });
};
//# sourceMappingURL=location.stores.js.map