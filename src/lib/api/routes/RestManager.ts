import express, { Application } from "express";
import { PlayerModel } from "../../Database/Models/Player/PlayerModel";

export class RestManager {
	private app: Application;

	constructor() {
		this.app = express();
		express.json();
		this.app.get("/user/:id", async (req, res) => {
			const param = req.params.id;
			const player = await PlayerModel.findOneOrCreateRaw({ uId: param });
			res.send(player);
		});

		this.app.listen(3000, () => console.log("REST API listening on port 3000."));
	}
}
