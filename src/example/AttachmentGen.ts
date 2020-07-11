import { AttachmentBuilder, AttachmentType, Attachment } from "../lib/GameTypes/GameAsset/Attachment/Attachment";

export const AttachmentGenerator = (): Attachment[] => {
	return [
		new AttachmentBuilder({
			name: "Iron Plating",
			description: "Not particularity impressive, but its a simple plating that provides some protection.",
			type: AttachmentType.GENERAL,
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
	] as Attachment[];
};
