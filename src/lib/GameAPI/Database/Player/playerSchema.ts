import { Schema } from "mongoose";
import { findOneOrCreate, setLastUpdated, incrementCredits, decrementCredits, getCredits } from "./playerFunctions";

const PlayerSchema = new Schema({
	uId: String,
	ship: {},
	skin: {},
	inventory: {
		credits: Number,
		tokens: Number,
		materials: Map,
		ships: Map,
		attachments: Map,
		reputation: Map,
	},
	dateOfEntry: {
		type: Date,
		default: new Date(),
	},
	lastUpdated: {
		type: Date,
		default: new Date(),
	},
});

PlayerSchema.statics.findOneOrCreate = findOneOrCreate;

PlayerSchema.methods.setLastUpdated = setLastUpdated;
PlayerSchema.methods.incrementCredits = incrementCredits;
PlayerSchema.methods.decrementCredits = decrementCredits;
PlayerSchema.methods.getCredits = getCredits;

export default PlayerSchema;
