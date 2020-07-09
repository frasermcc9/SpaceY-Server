"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttachmentGenerator = void 0;
const Attachment_1 = require("../lib/GameTypes/GameAsset/Attachment/Attachment");
exports.AttachmentGenerator = () => {
    return [
        new Attachment_1.AttachmentBuilder({
            name: "Iron Plating",
            description: "Not particularity impressive, but its a simple plating that provides some protection.",
            type: Attachment_1.AttachmentType.GENERAL,
            techLevel: 1,
            strength: 20,
            cost: 24000,
        })
            .EquipFn((friendly) => {
            friendly.incrementStatistics({ hp: 20 });
            return { message: `New Health: ${friendly.ShipStatistics.totalHp}`, success: true };
        })
            .UnequipFn((friendly) => {
            friendly.decrementStatistics({ hp: 20 });
            return { message: `New Health: ${friendly.ShipStatistics.totalHp}`, success: true };
        })
            .Build(),
    ];
};
