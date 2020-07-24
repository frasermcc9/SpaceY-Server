"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.location_get = void 0;
const main_1 = require("../../../main");
/**
 * GET if asteroid is available for user. <br />  \
 * Status 404: location not found. <br />  \
 * Status 200: success.
 * @param location the location to get store names
 * @param asteroid the name of the asteroid
 * @param userid the id of the user
 * @returns if the asteroid can be mined
 */
exports.location_get = (req, res) => {
    const location = req.params.location;
    const result = main_1.Client.Reg.Spacemap.resolveNodeFromName(location);
    if (result == undefined)
        return res.send({ status: "404" });
    const nodeAdjacent = main_1.Client.Reg.Spacemap.getConnectedNodes(result);
    const nodeStores = result.nodeAllStores().map((s) => s.Name);
    const nodeAsteroids = result.Asteroids.map((a) => ({ name: a.Name, value: a.GetCollectionValue() }));
    const response = {
        status: "200",
        data: {
            faction: result.Faction,
            imageUri: result.ImageUri,
            name: result.Name,
            requiredWarp: result.RequiredWarp,
            techLevel: result.TechLevel,
            adjacent: nodeAdjacent,
            stores: nodeStores,
            asteroids: nodeAsteroids,
        },
    };
    res.send(response);
};
//# sourceMappingURL=location.js.map