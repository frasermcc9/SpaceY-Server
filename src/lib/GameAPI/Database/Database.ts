import Mongoose = require("mongoose");
import { Client } from "../../Client/Client";

let database: Mongoose.Connection;

export const connect = () => {
	//const uri = "mongodb://localhost:27017";
	const uri = Client.Get().Uri;
	//const dbName = "stocksim";
	const dbName = Client.Get().DbName;

	if (database) {
		return;
	}

	Mongoose.connect(uri, {
		useNewUrlParser: true,
		useFindAndModify: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		dbName: dbName,
	});
	database = Mongoose.connection;

	database.once("open", async () => {
		if (Client.Get().ConsoleLogging) console.log("Connected to database");
	});

	database.on("error", () => {
		console.warn("Error connecting to database");
	});

	return;
};

export const disconnect = () => {
	if (!database) {
		return;
	}
	Mongoose.disconnect();
	if (Client.Get().ConsoleLogging) console.log("Closed database");
};
