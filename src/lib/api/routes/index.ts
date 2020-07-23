import express, { Application } from "express";
import { location_stores_get } from "./location/stores/location.stores";
import { location_stores_inventory_get } from "./location/stores/inventory/location.stores.inventory";
import { location_user_asteroids_get, location_user_asteroid_get } from "./location/user/location.asteroid.user";
import { user_get, user_adjacent_get } from "./user/user";
import { item_get } from "./item/item";
import { location_get } from "./location/location";

export class RestManager {
    private app: Application;

    constructor() {
        this.app = express();
        express.json();
        this.app.setMaxListeners(20);

        this.app.get("/user/:id", user_get);
        this.app.get("/user/:id/adjacent", user_adjacent_get);

        this.app.get("/location/:location", location_get);
        this.app.get("/location/:location/stores", location_stores_get);
        this.app.get("/location/:location/:store/inventory", location_stores_inventory_get);

        this.app.get("/location/:location/:userid/regionasteroids", location_user_asteroids_get);
        this.app.get("/location/:location/:userid/:asteroid", location_user_asteroid_get);
        

        this.app.get("/item/:item", item_get);

        const server = this.app.listen(3000, () => console.log("REST API listening on port 3000."));
        //server.setTimeout(1000 * 30, () => console.log("Server timeout"));
    }
}
