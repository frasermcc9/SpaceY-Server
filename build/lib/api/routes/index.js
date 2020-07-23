"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestManager = void 0;
const express_1 = __importDefault(require("express"));
const location_stores_1 = require("./location/stores/location.stores");
const location_stores_inventory_1 = require("./location/stores/inventory/location.stores.inventory");
const location_asteroid_user_1 = require("./location/user/location.asteroid.user");
const user_1 = require("./user/user");
const item_1 = require("./item/item");
const location_1 = require("./location/location");
class RestManager {
    constructor() {
        this.app = express_1.default();
        express_1.default.json();
        this.app.setMaxListeners(20);
        this.app.get("/user/:id", user_1.user_get);
        this.app.get("/user/:id/adjacent", user_1.user_adjacent_get);
        this.app.get("/location/:location", location_1.location_get);
        this.app.get("/location/:location/stores", location_stores_1.location_stores_get);
        this.app.get("/location/:location/:store/inventory", location_stores_inventory_1.location_stores_inventory_get);
        this.app.get("/location/:location/:userid/regionasteroids", location_asteroid_user_1.location_user_asteroids_get);
        this.app.get("/location/:location/:userid/:asteroid", location_asteroid_user_1.location_user_asteroid_get);
        this.app.get("/item/:item", item_1.item_get);
        const server = this.app.listen(3000, () => console.log("REST API listening on port 3000."));
        //server.setTimeout(1000 * 30, () => console.log("Server timeout"));
    }
}
exports.RestManager = RestManager;
//# sourceMappingURL=index.js.map