"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestManager = void 0;
const express_1 = __importDefault(require("express"));
const PlayerModel_1 = require("../../Database/Models/Player/PlayerModel");
class RestManager {
    constructor() {
        this.app = express_1.default();
        express_1.default.json();
        this.app.get("/user/:id", async (req, res) => {
            const param = req.params.id;
            const player = await PlayerModel_1.PlayerModel.findOneOrCreateRaw({ uId: param });
            res.send(player);
        });
        this.app.listen(3000, () => console.log("REST API listening on port 3000."));
    }
}
exports.RestManager = RestManager;
