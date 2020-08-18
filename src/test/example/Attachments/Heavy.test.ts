import { default as must } from "must";
require("must/register");

import { MockBattle } from "../../../lib/GameTypes/GameBattle/MockBattle";
import { Client, PlayerModel } from "../../../lib/main";
import { Battleship } from "../../../lib/GameTypes/GameBattle/Battleship";
import { ShipWrapper } from "../../../lib/GameTypes/GameAsset/Ship/ShipWrapper";
import { BlankShip } from "../../../lib/Server/Registry";

describe.only("Heavy Weapon Attachment Tests", async () => {
    describe("Tier 1", async () => {
        it("Kinetic Missile Base", async () => {
            const f = new ShipWrapper(BlankShip, await PlayerModel.findOneOrCreate({ uId: "10" }));
            const e = new ShipWrapper(BlankShip, await PlayerModel.findOneOrCreate({ uId: "20" }));
            const B = new MockBattle(new Battleship(f), new Battleship(e));

            Client.Reg.ResolveAttachmentFromName("Kinetic Missile").emit("onBattleInvoked", { battle: B });
            (B.Enemy.getStat("shield") + 6).must.eql(B.Enemy.getMaxOfStat("shield"));
        });
        it("Kinetic Missile Energy", async () => {
            const f = new ShipWrapper(BlankShip, await PlayerModel.findOneOrCreate({ uId: "10" }));
            const e = new ShipWrapper(BlankShip, await PlayerModel.findOneOrCreate({ uId: "20" }));
            const B = new MockBattle(new Battleship(f), new Battleship(e));
            B.Friendly.increaseMaxOfStat("w", 15);
            B.Friendly.maximizeStat("w");
            Client.Reg.ResolveAttachmentFromName("Kinetic Missile").emit("onBattleInvoked", { battle: B });
            (B.Enemy.getStat("shield") + 9).must.eql(B.Enemy.getMaxOfStat("shield"));
        });

        it("Jet Rocket Base", async () => {
            const f = new ShipWrapper(BlankShip, await PlayerModel.findOneOrCreate({ uId: "10" }));
            const e = new ShipWrapper(BlankShip, await PlayerModel.findOneOrCreate({ uId: "20" }));
            const B = new MockBattle(new Battleship(f), new Battleship(e));

            Client.Reg.ResolveAttachmentFromName("Jet Rocket").emit("onBattleInvoked", { battle: B });
            (B.Enemy.getStat("shield") + 8).must.eql(B.Enemy.getMaxOfStat("shield"));
        });
        it("Jet Rocket Energy", async () => {
            const f = new ShipWrapper(BlankShip, await PlayerModel.findOneOrCreate({ uId: "10" }));
            const e = new ShipWrapper(BlankShip, await PlayerModel.findOneOrCreate({ uId: "20" }));
            const B = new MockBattle(new Battleship(f), new Battleship(e));
            B.Friendly.increaseMaxOfStat("w", 16);
            B.Friendly.maximizeStat("w");
            Client.Reg.ResolveAttachmentFromName("Jet Rocket").emit("onBattleInvoked", { battle: B });
            (B.Enemy.getStat("shield") + 12).must.eql(B.Enemy.getMaxOfStat("shield"));
        });
    });
});
