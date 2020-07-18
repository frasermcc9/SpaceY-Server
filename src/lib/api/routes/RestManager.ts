import express, { Application } from "express";
import { PlayerModel } from "../../Database/Models/Player/PlayerModel";
import { Client } from "../../main";

export class RestManager {
    private app: Application;

    constructor() {
        this.app = express();
        express.json();

        this.user();
        this.storeNames();
        this.storeInventory();
        this.asteroidAvailable();

        this.app.listen(3000, () => console.log("REST API listening on port 3000."));
    }

    /**
     * GET user. Cannot fail.
     */
    private user() {
        this.app.get("/user/:id", async (req, res) => {
            const param = req.params.id;
            const player = await PlayerModel.findOneOrCreateRaw({ uId: param });
            res.send(player);
        });
    }
    /**
     * GET stores for locations. <br />  \
     * Status 404: location not found. <br />  \
     * Status 200: success.
     * @param location the location to get store names
     * @returns stores: array of store names
     */
    private storeNames() {
        this.app.get("/:location/stores", (req, res) => {
            const location = req.params.location;

            const stores = Client.Reg.Spacemap.resolveNodeFromName(location)
                ?.nodeAllStores()
                .map((s) => s.Name);

            if (stores == undefined) res.send({ status: "404" });
            else res.send({ status: "200", stores: stores });
        });
    }

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
    private storeInventory() {
        this.app.get("/:location/:store/inventory", (req, res) => {
            const location = req.params.location;
            const store = req.params.store;
            const storeObj = Client.Reg.Spacemap.resolveNodeFromName(location)
                ?.nodeAllStores()
                .find((s) => s.Name == store);
            if (storeObj == undefined) return { status: "404" };

            const storeItems = storeObj.getStoreItems();
            const storeCosts = storeObj.StoreItemCosts;

            return {
                status: "200",
                inventory: JSON.stringify(Object.fromEntries(storeItems)),
                costs: JSON.stringify(Object.fromEntries(storeCosts)),
            };
        });
    }
    /**
     * GET if asteroid is available for user. <br />  \
     * Status 404: location not found. <br />  \
     * Status 200: success.
     * @param location the location to get store names
     * @param asteroid the name of the asteroid
     * @param userid the id of the user
     * @returns if the asteroid can be mined
     */
    private asteroidAvailable() {
        this.app.get("/:location/:asteroid/:userid", (req, res) => {
            const location = req.params.location;
            const asteroidName = req.params.asteroid;
            const user = req.params.userid;

            const result = Client.Reg.Spacemap.resolveNodeFromName(location)
                ?.Asteroids.find((a) => a.Name == asteroidName)
                ?.isAvailableForUser(user);
            if (result != undefined) res.send({ status: "200", available: result });
            else res.send({ status: "404" });
        });
    }
}
