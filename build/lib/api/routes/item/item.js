"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.item_get = void 0;
const main_1 = require("../../../main");
/**
 * GET data for give item. <br />  \
 * Status 404: item not found. <br />  \
 * Status 200: success.
 * @param item the item name
 * @returns JSON string of item
 */
exports.item_get = (req, res) => {
    const item = req.params.item;
    const result = main_1.Client.Reg.AnyResolve(item);
    if (result != undefined)
        res.send({ status: "200", item: result });
    else
        res.send({ status: "404" });
};
//# sourceMappingURL=item.js.map