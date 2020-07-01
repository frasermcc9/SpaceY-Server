"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerModel = void 0;
const mongoose_1 = require("mongoose");
const playerSchema_1 = __importDefault(require("./playerSchema"));
exports.PlayerModel = mongoose_1.model("players", playerSchema_1.default);
