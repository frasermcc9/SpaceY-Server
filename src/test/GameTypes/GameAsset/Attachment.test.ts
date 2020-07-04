import { PlayerModel } from "../../../lib/GameApi/Database/Player/PlayerModel";
import { AttachmentBuilder, AttachmentReport, AttachmentType, BattleEvent } from "../../../lib/GameTypes/GameAsset/Attachment/Attachment";
import { Ship } from "../../../lib/GameTypes/GameAsset/Ship/Ship";
import { ShipWrapper } from "../../../lib/GameTypes/GameAsset/Ship/ShipWrapper";
import { default as must } from "must";
require("must/register");

describe("Attachment Tests", async () => {
	describe("General Attachment Tests", async () => {
		it("Declaring the attachments function and invoking it will work", async () => {
			const P1 = await PlayerModel.findOneOrCreate({ uId: "22" });
			const P2 = await PlayerModel.findOneOrCreate({ uId: "33" });
			await P1.setShip("Shuttle");
			await P2.setShip("Warship");

			const fn: (friendly: ShipWrapper, opponent: ShipWrapper) => AttachmentReport = (friend, opponent) => {
				return { message: friend.ShipStatistics.totalHp + opponent.ShipStatistics.totalShield + "" };
			};
			const attachment = new AttachmentBuilder({ name: "Blaster", description: "A really cool blaster", techLevel: 2, type: AttachmentType.PRIMARY })
				.BattleStartFn(fn)
				.Build();
			attachment.BattleUpdate(BattleEvent.BATTLE_START, { friendly: P1.getShipWrapper(), opponent: P2.getShipWrapper() }).message.must.eql("190");
		});

		it("Changing one players ship doesn't result in changes for another player with the same ship", async () => {
			const S1 = new Ship({ description: "A small but agile ship", name: "Shuttle" });
			const preSaveP1 = await PlayerModel.findOneOrCreate({ uId: "22" });
			const preSaveP2 = await PlayerModel.findOneOrCreate({ uId: "33" });
			await preSaveP1.setShip(S1);
			await preSaveP2.setShip(S1);
			const P1 = await PlayerModel.findOneOrCreate({ uId: "22" });
			const P2 = await PlayerModel.findOneOrCreate({ uId: "33" });

			await P1.addAttachmentToShip("Blaster");
			P1.getShipWrapper().stringifyAttachments().length.must.equal(1);
			P2.getShipWrapper().stringifyAttachments().length.must.equal(0);
		});

		it("Database correctly saves attachments that are equipped to a user", async () => {
			const S1 = new Ship({ description: "A small but agile ship", name: "Shuttle", primaryCap: 1 });
			const preSaveP1 = await PlayerModel.findOneOrCreate({ uId: "22" });
			await preSaveP1.setShip(S1);
			preSaveP1.addAttachmentToShip("Blaster");
			const P1 = await PlayerModel.findOneOrCreate({ uId: "22" });
			P1.getShipWrapper().stringifyAttachments().length.must.equal(1);
		});

		it("Should update ship statistics when passive components are added", async () => {
            const preSaveP1 = await PlayerModel.findOneOrCreate({ uId: "22" });
            await preSaveP1.setShip("Shuttle");
            
            await preSaveP1.addAttachmentToShip("Iron Plating");
            preSaveP1.getShipWrapper().ShipStatistics.totalHp.must.eql(120);
            
			await preSaveP1.removeAttachmentFromShip("Iron Plating");
			preSaveP1.getShipWrapper().ShipStatistics.totalHp.must.eql(100);
			preSaveP1.AutoInventoryRetrieve("Iron Plating").amount.must.eql(1);
		});
	});
});
