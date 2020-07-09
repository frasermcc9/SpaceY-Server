"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const playerFunctions_1 = require("./playerFunctions");
const PlayerSchema = new mongoose_1.Schema({
    uId: String,
    ship: {
        name: String,
        equipped: [String],
    },
    skin: {},
    inventory: {
        credits: Number,
        tokens: Number,
        materials: Map,
        ships: Map,
        attachments: Map,
        reputation: Map,
    },
    location: String,
    blueprints: [String],
    exp: Number,
    skills: [Number],
    dateOfEntry: {
        type: Date,
        default: new Date(),
    },
    lastUpdated: {
        type: Date,
        default: new Date(),
    },
});
PlayerSchema.statics.findOneOrCreate = playerFunctions_1.findOneOrCreate;
PlayerSchema.methods.setLastUpdated = playerFunctions_1.setLastUpdated;
PlayerSchema.methods.incrementCredits = playerFunctions_1.incrementCredits;
PlayerSchema.methods.decrementCredits = playerFunctions_1.decrementCredits;
PlayerSchema.methods.getCredits = playerFunctions_1.getCredits;
exports.default = PlayerSchema;
