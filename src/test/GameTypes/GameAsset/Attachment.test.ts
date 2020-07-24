import { PlayerModel } from "../../../lib/Database/Models/Player/PlayerModel";
import {
    AttachmentBuilder,
    AttachmentReport,
    AttachmentType,
} from "../../../lib/GameTypes/GameAsset/Attachment/Attachment";
import { Ship, ShipBuilder } from "../../../lib/GameTypes/GameAsset/Ship/Ship";
import { ShipWrapper } from "../../../lib/GameTypes/GameAsset/Ship/ShipWrapper";
import { default as must } from "must";
import { Client, Setup } from "../../../lib/main";
import { Battle, IBattleData } from "../../../lib/GameTypes/GameBattle/Battle";
import { Battleship } from "../../../lib/GameTypes/GameAsset/Ship/Battleship";
import { MaterialBuilder } from "../../../lib/GameTypes/GameAsset/Material/Material";
import { BlueprintBuilder } from "../../../lib/GameTypes/GameAsset/Blueprint/Blueprint";
import { Asteroid } from "../../../lib/GameTypes/GameMechanics/Asteroid";
import { FactionBuilder } from "../../../lib/GameTypes/GameAsset/Faction/Faction";
import { SpacemapNodeBuilder, WarpPower } from "../../../lib/GameTypes/GameSpacemap/SpacemapNode";
require("must/register");

describe("Attachment Tests", async () => {
    describe("General Attachment Tests", async () => {
        it("Declaring the attachments function and invoking it will work", async () => {
            const P1 = await PlayerModel.findOneOrCreate({ uId: "22" });
            const P2 = await PlayerModel.findOneOrCreate({ uId: "33" });
            await P1.setShip("Shuttle");
            await P2.setShip("Warship");

            const attachment = new AttachmentBuilder({
                name: "Blaster",
                description: "A really cool blaster",
                techLevel: 2,
                type: AttachmentType.PRIMARY,
                strength: 2,
            })
                .addFunction("onBattleStart", ({ battle }) => {
                    return {
                        message: battle.Friendly.Hp + battle.Enemy.Ship.ShipStatistics.totalShield + "",
                        success: true,
                    };
                })
                .Build()
                .emit("onBattleStart", {
                    battle: {
                        TurnNumber: 0,
                        Friendly: new Battleship(P1.getShipWrapper()),
                        Enemy: new Battleship(P2.getShipWrapper()),
                    },
                })
                .message.must.eql("190");
        }).timeout(100000);

        it("Changing one players ship doesn't result in changes for another player with the same ship", async () => {
            const S1 = new Ship({ description: "A small but agile ship", name: "Shuttle", techLevel: 5 });
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
            const S1 = new Ship({
                description: "A small but agile ship",
                name: "Shuttle",
                primaryCap: 1,
                techLevel: 4,
            });
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

            await preSaveP1.unequipAttachment("Iron Plating");
            preSaveP1.getShipWrapper().ShipStatistics.totalHp.must.eql(100);
            preSaveP1.AutoInventoryRetrieve("Iron Plating").amount.must.eql(1);
        });

        it("Cannot equip attachment that will overload tech level", async () => {
            const preSaveP1 = await PlayerModel.findOneOrCreate({ uId: "22" });
            await preSaveP1.setShip("Shuttle");
            const ACH1 = new AttachmentBuilder({
                name: "SuperTech",
                description: "Extremely high tech attachment",
                techLevel: 100,
                strength: 10,
                type: AttachmentType.GENERAL,
            }).Build();
            Client.Reg.RegisterAttachments({ attachments: [ACH1] });
            (await preSaveP1.addAttachmentToShip("SuperTech")).code.must.eql(403);
        });
    });
});
