"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.location_user_asteroids_get = exports.location_user_asteroid_get = void 0;
const main_1 = require("../../../../main");
/**
 * GET if asteroid is available for user. <br />  \
 * Status 404: location not found. <br />  \
 * Status 200: success.
 * @param location the location to get store names
 * @param asteroid the name of the asteroid
 * @param userid the id of the user
 * @returns if the asteroid can be mined
 */
exports.location_user_asteroid_get = (req, res) => {
    const location = req.params.location;
    const asteroidName = req.params.asteroid;
    const user = req.params.userid;
    const result = main_1.Client.Reg.Spacemap.resolveNodeFromName(location)
        ?.Asteroids.find((a) => a.Name == asteroidName)
        ?.isAvailableForUser(user);
    if (result != undefined)
        res.send({ status: "200", available: result });
    else
        res.send({ status: "404" });
};
/**
 * GET all asteroids in the region, including whether they are ready, and if
 * not, the amount of time until they are. <br />  \
 * Status 404: location not found. <br />  \
 * Status 200: success.
 * @param location the location to get store names
 * @param userid the id of the user
 * @returns if the asteroid can be mined
 */
exports.location_user_asteroids_get = (req, res) => {
    const location = req.params.location;
    const user = req.params.userid;
    if (location == undefined)
        res.send({ status: "404" });
    const available = [];
    const unavailable = [];
    main_1.Client.Reg.Spacemap.resolveNodeFromName(location)?.Asteroids.forEach((a) => {
        if (a.isAvailableForUser(user)) {
            available.push(a.Name);
        }
        else {
            unavailable.push({ name: a.Name, cooldown: a.remainingCooldown(user) });
        }
    });
    const returnValue = { status: "200", asteroids: { available: available, unavailable: unavailable } };
    res.send(returnValue);
};
//# sourceMappingURL=location.asteroid.user.js.map