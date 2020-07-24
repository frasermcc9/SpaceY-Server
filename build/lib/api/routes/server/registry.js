"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reg_ships = exports.reg_factions = exports.reg_materials = exports.reg_attachments = void 0;
const main_1 = require("../../../main");
exports.reg_attachments = (req, res) => {
    res.send(Object.fromEntries(main_1.Client.Reg.AttachmentRegistry));
};
exports.reg_materials = (req, res) => {
    res.send(Object.fromEntries(main_1.Client.Reg.MaterialRegistry));
};
exports.reg_factions = (req, res) => {
    res.send(Object.fromEntries(main_1.Client.Reg.FactionRegistry));
};
exports.reg_ships = (req, res) => {
    res.send(Object.fromEntries(main_1.Client.Reg.ShipRegistry));
};
//# sourceMappingURL=registry.js.map