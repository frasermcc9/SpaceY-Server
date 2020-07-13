"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttachmentGenerator = void 0;
const Attachment_1 = require("../lib/GameTypes/GameAsset/Attachment/Attachment");
const Blueprint_1 = require("../lib/GameTypes/GameAsset/Blueprint/Blueprint");
exports.AttachmentGenerator = () => {
    return [
        //#region Primary
        new Attachment_1.AttachmentBuilder({
            name: "Standard Blaster",
            description: "Old, common but reliable blaster that has been around for centuries. Damage: 4-12.",
            strength: 16,
            techLevel: 2,
            type: Attachment_1.AttachmentType.PRIMARY,
        })
            .EnableSellable(32000)
            .EnableBuildable(new Blueprint_1.BlueprintBuilder().DefinedBuild(Blueprint_1.BlueprintBuilder.SIMPLE_BUILD(14000), "Standard Blaster"))
            .BattlePreTurnFn((battle) => {
            const rnd = rb(4, 12);
            battle.Enemy.standardDamage(rnd);
            return { success: true, message: `Standard Blaster: ${rnd} damage.` };
        })
            .Build(),
        new Attachment_1.AttachmentBuilder({
            name: "Hardened Blaster",
            description: "A common modification done to the Standard Blaster to slightly increase its reliability. Damage: 8-12.",
            strength: 18,
            techLevel: 3,
            type: Attachment_1.AttachmentType.PRIMARY,
        })
            .EnableSellable(65000)
            .EnableBuildable(new Blueprint_1.BlueprintBuilder().DefinedBuild(Blueprint_1.BlueprintBuilder.SIMPLE_BUILD(42000), "Hardened Blaster"))
            .BattlePreTurnFn((battle) => {
            const rnd = rb(8, 12);
            battle.Enemy.standardDamage(rnd);
            return { success: true, message: `Hardened Blaster: ${rnd} damage.` };
        })
            .Build(),
        new Attachment_1.AttachmentBuilder({
            name: "Rapidfire Blaster",
            description: "A fast firing but inaccurate blaster. Has a wide spread of potential damage. Damage: 8-18.",
            strength: 19,
            techLevel: 4,
            type: Attachment_1.AttachmentType.PRIMARY,
        })
            .EnableSellable(195000)
            .EnableBuildable(new Blueprint_1.BlueprintBuilder().DefinedBuild(Blueprint_1.BlueprintBuilder.SIMPLE_BUILD(145000), "Rapidfire Blaster"))
            .BattlePreTurnFn((battle) => {
            const rnd = rb(8, 18);
            battle.Enemy.standardDamage(rnd);
            return { success: true, message: `Hardened Blaster: ${rnd} damage.` };
        })
            .Build(),
        new Attachment_1.AttachmentBuilder({
            name: "Mini Scattergun",
            description: "A weapon that focuses on covering as large of an area as possible. Damage: 10 + 10 per 100 opponent hp. Halved vs shield.",
            strength: 21,
            techLevel: 5,
            type: Attachment_1.AttachmentType.PRIMARY,
        })
            .EnableSellable(385000)
            .EnableBuildable(new Blueprint_1.BlueprintBuilder().DefinedBuild(Blueprint_1.BlueprintBuilder.SIMPLE_BUILD(295000), "Mini Scattergun"))
            .BattlePreTurnFn((battle) => {
            const base = 10;
            const bonus = ~~(battle.Enemy.Hp / 100);
            const effective = Math.max(base + bonus - battle.Enemy.Shield, (base + bonus) / 2); //damage cant be less than half the base + bonus
            battle.Enemy.standardDamage(effective);
            return { success: true, message: `Mini Scattergun: ${effective} damage.` };
        })
            .Build(),
        new Attachment_1.AttachmentBuilder({
            name: "Thermic Focuser",
            description: "The most basic of the thermic weapons. Increases in heat and damage as the battle continues. Damage: 4 + 1 per turn.",
            strength: 21,
            techLevel: 5,
            type: Attachment_1.AttachmentType.PRIMARY,
        })
            .EnableSellable(360000)
            .EnableBuildable(new Blueprint_1.BlueprintBuilder().DefinedBuild(Blueprint_1.BlueprintBuilder.SIMPLE_BUILD(275000), "Thermic Focuser"))
            .BattlePreTurnFn((battle) => {
            const base = 4;
            const bonus = battle.TurnNumber * 1;
            const effective = base + bonus; //damage cant be less than half the base + bonus
            battle.Enemy.standardDamage(effective);
            return { success: true, message: `Thermic Focuser: ${base} + ${bonus} damage.` };
        })
            .Build(),
        new Attachment_1.AttachmentBuilder({
            name: "Precision Railgun",
            description: "A precise weapon capable of piercing through even the strongest shields. Hull damage: 8-10.",
            strength: 20,
            techLevel: 4,
            type: Attachment_1.AttachmentType.PRIMARY,
        })
            .EnableSellable(275000)
            .EnableBuildable(new Blueprint_1.BlueprintBuilder().DefinedBuild(Blueprint_1.BlueprintBuilder.SIMPLE_BUILD(200000), "Precision Railgun"))
            .BattlePreTurnFn((battle) => {
            const base = rb(8, 12);
            battle.Enemy.standardDamage(base);
            return { success: true, message: `Precision Railgun: ${base} hull damage.` };
        })
            .Build(),
        new Attachment_1.AttachmentBuilder({
            name: "Plasma Cannon",
            description: "A rapid firing cannon that shoots hot balls of damaging plasma. Damage: 15-25.",
            strength: 24,
            techLevel: 6,
            type: Attachment_1.AttachmentType.PRIMARY,
        })
            .EnableSellable(674000)
            .EnableBuildable(new Blueprint_1.BlueprintBuilder().DefinedBuild(Blueprint_1.BlueprintBuilder.MODERATE_BUILD(520000), "Plasma Cannon"))
            .BattlePreTurnFn((battle) => {
            const base = rb(15, 25);
            battle.Enemy.standardDamage(base);
            return { success: true, message: `Plasma Cannon: ${base} damage.` };
        })
            .Build(),
        new Attachment_1.AttachmentBuilder({
            name: "Flak Cannon",
            description: "A direct improvement of the Mini Scattergun. Damage: 10 per 50 opponent hp. Halved vs shield.",
            strength: 21,
            techLevel: 5,
            type: Attachment_1.AttachmentType.PRIMARY,
        })
            .EnableSellable(385000)
            .EnableBuildable(new Blueprint_1.BlueprintBuilder().DefinedBuild(Blueprint_1.BlueprintBuilder.MODERATE_BUILD(295000), "Flak Cannon"))
            .BattlePreTurnFn((battle) => {
            const base = 0;
            const bonus = ~~(battle.Enemy.Hp / 50);
            const effective = Math.max(base + bonus - battle.Enemy.Shield, (base + bonus) / 2); //damage cant be less than half the base + bonus
            battle.Enemy.standardDamage(effective);
            return { success: true, message: `Flak Cannon: ${effective} damage.` };
        })
            .Build(),
        new Attachment_1.AttachmentBuilder({
            name: "Sunfire Beam",
            description: "A beam that starts off very weak, but ramps up after continuous fire. Damage: 2 + 2 per turn.",
            strength: 21,
            techLevel: 5,
            type: Attachment_1.AttachmentType.PRIMARY,
        })
            .EnableSellable(360000)
            .EnableBuildable(new Blueprint_1.BlueprintBuilder().DefinedBuild(Blueprint_1.BlueprintBuilder.SIMPLE_BUILD(275000), "Sunfire Beam"))
            .BattlePreTurnFn((battle) => {
            const base = 2;
            const bonus = battle.TurnNumber * 2;
            const effective = base + bonus; //damage cant be less than half the base + bonus
            battle.Enemy.standardDamage(effective);
            return { success: true, message: `Thermic Focuser: ${base} + ${bonus} damage.` };
        })
            .Build(),
        new Attachment_1.AttachmentBuilder({
            name: "Void Ray",
            description: "A destructive weapon that can do extreme damage, but firing it is unsustainable. Damage: 50 - 5 per turn.",
            strength: 21,
            techLevel: 5,
            type: Attachment_1.AttachmentType.PRIMARY,
        })
            .EnableSellable(360000)
            .EnableBuildable(new Blueprint_1.BlueprintBuilder().DefinedBuild(Blueprint_1.BlueprintBuilder.SIMPLE_BUILD(275000), "Void Ray"))
            .BattlePreTurnFn((battle) => {
            const base = 50;
            const bonus = battle.TurnNumber * -5;
            const effective = Math.max(base + bonus, 0); //damage cant be less than half the base + bonus
            battle.Enemy.standardDamage(effective);
            return { success: true, message: `Void Ray: ${effective} damage.` };
        })
            .Build(),
        new Attachment_1.AttachmentBuilder({
            name: "Quasar Cannon",
            description: "Incredibly consistent weapon effective against any type of ship. Damage: 30.",
            strength: 21,
            techLevel: 5,
            type: Attachment_1.AttachmentType.PRIMARY,
        })
            .EnableSellable(360000)
            .EnableBuildable(new Blueprint_1.BlueprintBuilder().DefinedBuild(Blueprint_1.BlueprintBuilder.SIMPLE_BUILD(275000), "Quasar Cannon"))
            .BattlePreTurnFn((battle) => {
            const effective = 30;
            battle.Enemy.standardDamage(effective);
            return { success: true, message: `Quasar Cannon: ${effective} damage.` };
        })
            .Build(),
        new Attachment_1.AttachmentBuilder({
            name: "Heavy Flak Launcher",
            description: "A direct improvement of the Mini Scattergun. Damage: 10 per 50 opponent hp. Halved vs shield.",
            strength: 21,
            techLevel: 5,
            type: Attachment_1.AttachmentType.PRIMARY,
        })
            .EnableSellable(385000)
            .EnableBuildable(new Blueprint_1.BlueprintBuilder().DefinedBuild(Blueprint_1.BlueprintBuilder.MODERATE_BUILD(295000), "Heavy Flak Launcher"))
            .BattlePreTurnFn((battle) => {
            const base = 0;
            const bonus = ~~(battle.Enemy.Hp / 50);
            const effective = Math.max(base + bonus - battle.Enemy.Shield, (base + bonus) / 2); //damage cant be less than half the base + bonus
            battle.Enemy.standardDamage(effective);
            return { success: true, message: `Heavy Flak Launcher: ${effective} damage.` };
        })
            .Build(),
        //#endregion Primary
        //#region PLATING
        new Attachment_1.AttachmentBuilder({
            name: "Iron Plating",
            description: "Not particularity impressive, but its a simple plating that provides some protection. Adds 25 hull.",
            type: Attachment_1.AttachmentType.GENERAL,
            techLevel: 1,
            strength: 12,
        })
            .EnableSellable(24000)
            .EnableBuildable(new Blueprint_1.BlueprintBuilder().DefinedBuild(Blueprint_1.BlueprintBuilder.SIMPLE_BUILD(11000), "Iron Plating"))
            .EquipFn((friendly) => {
            friendly.incrementStatistics({ hp: 25 });
            return { message: `New Health: ${friendly.ShipStatistics.totalHp}`, success: true };
        })
            .UnequipFn((friendly) => {
            friendly.decrementStatistics({ hp: 25 });
            return { message: `New Health: ${friendly.ShipStatistics.totalHp}`, success: true };
        })
            .Build(),
        new Attachment_1.AttachmentBuilder({
            name: "Steel Plating",
            description: "A slightly improved armoured plating, much tougher than iron plating. Adds 35 hull.",
            type: Attachment_1.AttachmentType.GENERAL,
            techLevel: 3,
            strength: 14,
        })
            .EnableSellable(64000)
            .EnableBuildable(new Blueprint_1.BlueprintBuilder().DefinedBuild(Blueprint_1.BlueprintBuilder.SIMPLE_BUILD(38000), "Steel Plating"))
            .EquipFn((friendly) => {
            friendly.incrementStatistics({ hp: 35 });
            return { message: `New Health: ${friendly.ShipStatistics.totalHp}`, success: true };
        })
            .UnequipFn((friendly) => {
            friendly.decrementStatistics({ hp: 35 });
            return { message: `New Health: ${friendly.ShipStatistics.totalHp}`, success: true };
        })
            .Build(),
        new Attachment_1.AttachmentBuilder({
            name: "Titanium Plating",
            description: "A tough and resistant shell that adds a solid chunk of strength to a ships hull. Adds 50 hull.",
            type: Attachment_1.AttachmentType.GENERAL,
            techLevel: 4,
            strength: 17,
        })
            .EnableSellable(224000)
            .EnableBuildable(new Blueprint_1.BlueprintBuilder().DefinedBuild(Blueprint_1.BlueprintBuilder.SIMPLE_BUILD(175000), "Titanium Plating"))
            .EquipFn((friendly) => {
            friendly.incrementStatistics({ hp: 50 });
            return { message: `New Health: ${friendly.ShipStatistics.totalHp}`, success: true };
        })
            .UnequipFn((friendly) => {
            friendly.decrementStatistics({ hp: 50 });
            return { message: `New Health: ${friendly.ShipStatistics.totalHp}`, success: true };
        })
            .Build(),
        new Attachment_1.AttachmentBuilder({
            name: "Advanced Alloy Plating",
            description: "An advanced armour made from highly engineered advanced alloys. Adds 80 hull.",
            type: Attachment_1.AttachmentType.GENERAL,
            techLevel: 6,
            strength: 22,
        })
            .EnableSellable(760000)
            .EnableBuildable(new Blueprint_1.BlueprintBuilder().DefinedBuild(Blueprint_1.BlueprintBuilder.MODERATE_BUILD(530000), "Advanced Alloy Plating"))
            .EquipFn((friendly) => {
            friendly.incrementStatistics({ hp: 80 });
            return { message: `New Health: ${friendly.ShipStatistics.totalHp}`, success: true };
        })
            .UnequipFn((friendly) => {
            friendly.decrementStatistics({ hp: 80 });
            return { message: `New Health: ${friendly.ShipStatistics.totalHp}`, success: true };
        })
            .Build(),
        new Attachment_1.AttachmentBuilder({
            name: "Ty'Linian Exoplate",
            description: "A tough and resistant shell that adds a solid chunk of strength to a ships hull. Adds 125 hull.",
            type: Attachment_1.AttachmentType.GENERAL,
            techLevel: 7,
            strength: 28,
        })
            .EnableSellable(1120000)
            .EnableBuildable(new Blueprint_1.BlueprintBuilder().DefinedBuild(Blueprint_1.BlueprintBuilder.ADVANCED_BUILD(920000), "Ty'Linian Exoplate"))
            .EquipFn((friendly) => {
            friendly.incrementStatistics({ hp: 125 });
            return { message: `New Health: ${friendly.ShipStatistics.totalHp}`, success: true };
        })
            .UnequipFn((friendly) => {
            friendly.decrementStatistics({ hp: 125 });
            return { message: `New Health: ${friendly.ShipStatistics.totalHp}`, success: true };
        })
            .Build(),
        new Attachment_1.AttachmentBuilder({
            name: "Antimatter Plating",
            description: "Rare and expensive antimatter technology provides plating that is charged by the ships shield. Adds ship base shield value to hull.",
            type: Attachment_1.AttachmentType.GENERAL,
            techLevel: 10,
            strength: 45,
        })
            .EnableSellable(3800000)
            .EnableBuildable(new Blueprint_1.BlueprintBuilder().DefinedBuild(Blueprint_1.BlueprintBuilder.ADVANCED_BUILD(3100000), "Antimatter Plating"))
            .EquipFn((friendly) => {
            const shieldValue = friendly.BaseStatistics.baseShield;
            friendly.incrementStatistics({ hp: shieldValue });
            return { message: `New Health: ${friendly.ShipStatistics.totalHp}`, success: true };
        })
            .UnequipFn((friendly) => {
            const shieldValue = friendly.BaseStatistics.baseShield;
            friendly.decrementStatistics({ hp: shieldValue });
            return { message: `New Health: ${friendly.ShipStatistics.totalHp}`, success: true };
        })
            .Build(),
        //#endregion plating
        //#region RESERVES
        ...ReserveGenerator(),
    ];
};
const ReserveGenerator = () => {
    const levelOneSingle = 4, levelTwoSingle = 8, levelTwoMulti = 4, levelThreeSingle = 12, levelThreeMulti = 6, levelThreeShield = 25, levelFourSingle = 20, levelFourMulti = 10, levelFourShield = 50, levelFiveSingle = 28, levelFiveMulti = 14;
    return [
        new Attachment_1.AttachmentBuilder({
            name: "Basic Weapon Reserves",
            description: `Basic additional storage for weapons energy. Max weapon: +${levelOneSingle}.`,
            strength: 3,
            techLevel: 2,
            type: Attachment_1.AttachmentType.GENERAL,
        })
            .EnableSellable(15000)
            .EnableBuildable(new Blueprint_1.BlueprintBuilder().DefinedBuild(Blueprint_1.BlueprintBuilder.SIMPLE_BUILD(5000), "Basic Weapon Reserves"))
            .EquipFn((ship) => {
            ship.incrementStatistics({ energy: [levelOneSingle, 0, 0] });
            return { message: `New Weapon Energy: ${ship.ShipStatistics.totalEnergy[0]}`, success: true };
        })
            .UnequipFn((ship) => {
            ship.decrementStatistics({ energy: [levelOneSingle, 0, 0] });
            return { message: `New Weapon Energy: ${ship.ShipStatistics.totalEnergy[0]}`, success: true };
        })
            .Build(),
        new Attachment_1.AttachmentBuilder({
            name: "Basic Engine Reserves",
            description: `Basic additional storage for engine energy. Max engine: +${levelOneSingle}.`,
            strength: 3,
            techLevel: 2,
            type: Attachment_1.AttachmentType.GENERAL,
        })
            .EnableSellable(15000)
            .EnableBuildable(new Blueprint_1.BlueprintBuilder().DefinedBuild(Blueprint_1.BlueprintBuilder.SIMPLE_BUILD(5000), "Basic Engine Reserves"))
            .EquipFn((ship) => {
            ship.incrementStatistics({ energy: [0, levelOneSingle, 0] });
            return { message: `New Engine Energy: ${ship.ShipStatistics.totalEnergy[1]}`, success: true };
        })
            .UnequipFn((ship) => {
            ship.decrementStatistics({ energy: [0, levelOneSingle, 0] });
            return { message: `New Engine Energy: ${ship.ShipStatistics.totalEnergy[1]}`, success: true };
        })
            .Build(),
        new Attachment_1.AttachmentBuilder({
            name: "Basic Computer Reserves",
            description: `Basic additional storage for computer energy. Max computer: +${levelOneSingle}.`,
            strength: 3,
            techLevel: 2,
            type: Attachment_1.AttachmentType.GENERAL,
        })
            .EnableSellable(15000)
            .EnableBuildable(new Blueprint_1.BlueprintBuilder().DefinedBuild(Blueprint_1.BlueprintBuilder.SIMPLE_BUILD(5000), "Basic Computer Reserves"))
            .EquipFn((ship) => {
            ship.incrementStatistics({ energy: [0, 0, levelTwoSingle] });
            return { message: `New Computer Energy: ${ship.ShipStatistics.totalEnergy[2]}`, success: true };
        })
            .UnequipFn((ship) => {
            ship.decrementStatistics({ energy: [0, 0, levelTwoSingle] });
            return { message: `New Computer Energy: ${ship.ShipStatistics.totalEnergy[2]}`, success: true };
        })
            .Build(),
        new Attachment_1.AttachmentBuilder({
            name: "Weapons Battery",
            description: `Advanced battery for storing excess weapon energy. Max weapon: +${levelTwoSingle}.`,
            strength: 5,
            techLevel: 3,
            type: Attachment_1.AttachmentType.GENERAL,
        })
            .EnableSellable(150000)
            .EnableBuildable(new Blueprint_1.BlueprintBuilder().DefinedBuild(Blueprint_1.BlueprintBuilder.SIMPLE_BUILD(75000), "Weapons Battery"))
            .EquipFn((ship) => {
            ship.incrementStatistics({ energy: [levelTwoSingle, 0, 0] });
            return { message: `New Weapon Energy: ${ship.ShipStatistics.totalEnergy[0]}`, success: true };
        })
            .UnequipFn((ship) => {
            ship.decrementStatistics({ energy: [levelTwoSingle, 0, 0] });
            return { message: `New Weapon Energy: ${ship.ShipStatistics.totalEnergy[0]}`, success: true };
        })
            .Build(),
        new Attachment_1.AttachmentBuilder({
            name: "Engine Battery",
            description: `Advanced battery for storing excess engine energy. Max engine: +${levelTwoSingle}.`,
            strength: 5,
            techLevel: 3,
            type: Attachment_1.AttachmentType.GENERAL,
        })
            .EnableSellable(150000)
            .EnableBuildable(new Blueprint_1.BlueprintBuilder().DefinedBuild(Blueprint_1.BlueprintBuilder.SIMPLE_BUILD(75000), "Engine Battery"))
            .EquipFn((ship) => {
            ship.incrementStatistics({ energy: [0, levelTwoSingle, 0] });
            return { message: `New Engine Energy: ${ship.ShipStatistics.totalEnergy[1]}`, success: true };
        })
            .UnequipFn((ship) => {
            ship.decrementStatistics({ energy: [0, levelTwoSingle, 0] });
            return { message: `New Engine Energy: ${ship.ShipStatistics.totalEnergy[1]}`, success: true };
        })
            .Build(),
        new Attachment_1.AttachmentBuilder({
            name: "Computer Battery",
            description: `Advanced battery for storing excess computer energy. Max computer: +${levelTwoSingle}.`,
            strength: 5,
            techLevel: 3,
            type: Attachment_1.AttachmentType.GENERAL,
        })
            .EnableSellable(150000)
            .EnableBuildable(new Blueprint_1.BlueprintBuilder().DefinedBuild(Blueprint_1.BlueprintBuilder.SIMPLE_BUILD(75000), "Computer Battery"))
            .EquipFn((ship) => {
            ship.incrementStatistics({ energy: [0, 0, levelTwoSingle] });
            return { message: `New Computer Energy: ${ship.ShipStatistics.totalEnergy[2]}`, success: true };
        })
            .UnequipFn((ship) => {
            ship.decrementStatistics({ energy: [0, 0, levelTwoSingle] });
            return { message: `New Computer Energy: ${ship.ShipStatistics.totalEnergy[2]}`, success: true };
        })
            .Build(),
        new Attachment_1.AttachmentBuilder({
            name: "Full Spectrum Battery",
            description: `Advanced battery for storing excess computer energy. Max of all energy types: +${levelTwoMulti}.`,
            strength: 7,
            techLevel: 3,
            type: Attachment_1.AttachmentType.GENERAL,
        })
            .EnableSellable(225000)
            .EnableBuildable(new Blueprint_1.BlueprintBuilder().DefinedBuild(Blueprint_1.BlueprintBuilder.SIMPLE_BUILD(150000), "Full Spectrum Battery"))
            .EquipFn((ship) => {
            ship.incrementStatistics({ energy: [levelTwoMulti, levelTwoMulti, levelTwoMulti] });
            return { message: `New Energy (W,E,C): ${ship.ShipStatistics.totalEnergy}`, success: true };
        })
            .UnequipFn((ship) => {
            ship.decrementStatistics({ energy: [levelTwoMulti, levelTwoMulti, levelTwoMulti] });
            return { message: `New Energy (W,E,C): ${ship.ShipStatistics.totalEnergy}`, success: true };
        })
            .Build(),
        //Tier 3
        new Attachment_1.AttachmentBuilder({
            name: "Weapons Energy Cell",
            description: `Dense energy cell that stores a large amount of excess weapon energy. Max weapon: +${levelThreeSingle}.`,
            strength: 10,
            techLevel: 4,
            type: Attachment_1.AttachmentType.GENERAL,
        })
            .EnableSellable(500000)
            .EnableBuildable(new Blueprint_1.BlueprintBuilder().DefinedBuild(Blueprint_1.BlueprintBuilder.MODERATE_BUILD(390000), "Weapons Energy Cell"))
            .EquipFn((ship) => {
            ship.incrementStatistics({ energy: [levelThreeSingle, 0, 0] });
            return { message: `New Weapon Energy: ${ship.ShipStatistics.totalEnergy[0]}`, success: true };
        })
            .UnequipFn((ship) => {
            ship.decrementStatistics({ energy: [levelThreeSingle, 0, 0] });
            return { message: `New Weapon Energy: ${ship.ShipStatistics.totalEnergy[0]}`, success: true };
        })
            .Build(),
        new Attachment_1.AttachmentBuilder({
            name: "Engine Fuel Deposit",
            description: `Dense fuel depository that allows for greater engine capacity. Max engine: +${levelThreeSingle}.`,
            strength: 10,
            techLevel: 4,
            type: Attachment_1.AttachmentType.GENERAL,
        })
            .EnableSellable(500000)
            .EnableBuildable(new Blueprint_1.BlueprintBuilder().DefinedBuild(Blueprint_1.BlueprintBuilder.MODERATE_BUILD(390000), "Engine Fuel Deposit"))
            .EquipFn((ship) => {
            ship.incrementStatistics({ energy: [0, levelThreeSingle, 0] });
            return { message: `New Engine Energy: ${ship.ShipStatistics.totalEnergy[1]}`, success: true };
        })
            .UnequipFn((ship) => {
            ship.decrementStatistics({ energy: [0, levelThreeSingle, 0] });
            return { message: `New Engine Energy: ${ship.ShipStatistics.totalEnergy[1]}`, success: true };
        })
            .Build(),
        new Attachment_1.AttachmentBuilder({
            name: "Computational Reserves",
            description: `Densely packed computational reserves that allow for greater computer capacity. Max computer: +${levelThreeSingle}.`,
            strength: 10,
            techLevel: 4,
            type: Attachment_1.AttachmentType.GENERAL,
        })
            .EnableSellable(500000)
            .EnableBuildable(new Blueprint_1.BlueprintBuilder().DefinedBuild(Blueprint_1.BlueprintBuilder.MODERATE_BUILD(390000), "Computer Battery"))
            .EquipFn((ship) => {
            ship.incrementStatistics({ energy: [0, 0, levelThreeSingle] });
            return { message: `New Computer Energy: ${ship.ShipStatistics.totalEnergy[2]}`, success: true };
        })
            .UnequipFn((ship) => {
            ship.decrementStatistics({ energy: [0, 0, levelThreeSingle] });
            return { message: `New Computer Energy: ${ship.ShipStatistics.totalEnergy[2]}`, success: true };
        })
            .Build(),
        new Attachment_1.AttachmentBuilder({
            name: "Full Spectrum Battery",
            description: `Advanced battery for storing excess computer energy. Max of all energy types: +${levelThreeMulti}.`,
            strength: 12,
            techLevel: 5,
            type: Attachment_1.AttachmentType.GENERAL,
        })
            .EnableSellable(675000)
            .EnableBuildable(new Blueprint_1.BlueprintBuilder().DefinedBuild(Blueprint_1.BlueprintBuilder.MODERATE_BUILD(595000), "Full Spectrum Battery"))
            .EquipFn((ship) => {
            ship.incrementStatistics({ energy: [levelThreeMulti, levelThreeMulti, levelThreeMulti] });
            return { message: `New Energy (W,E,C): ${ship.ShipStatistics.totalEnergy}`, success: true };
        })
            .UnequipFn((ship) => {
            ship.decrementStatistics({ energy: [levelThreeMulti, levelThreeMulti, levelThreeMulti] });
            return { message: `New Energy (W,E,C): ${ship.ShipStatistics.totalEnergy}`, success: true };
        })
            .Build(),
        new Attachment_1.AttachmentBuilder({
            name: "Shield Cells",
            description: `Advanced battery that increases maximum shield capacity. Max shield: +${levelThreeShield}.`,
            strength: 13,
            techLevel: 5,
            type: Attachment_1.AttachmentType.GENERAL,
        })
            .EnableSellable(825000)
            .EnableBuildable(new Blueprint_1.BlueprintBuilder().DefinedBuild(Blueprint_1.BlueprintBuilder.MODERATE_BUILD(715000), "Shield Cells"))
            .EquipFn((ship) => {
            ship.incrementStatistics({ shield: levelThreeShield });
            return { message: `New Shield: ${ship.ShipStatistics.totalShield}`, success: true };
        })
            .UnequipFn((ship) => {
            ship.decrementStatistics({ shield: levelThreeShield });
            return { message: `New Shield: ${ship.ShipStatistics.totalShield}`, success: true };
        })
            .Build(),
        //tier 4
        new Attachment_1.AttachmentBuilder({
            name: "Weapons Energy Matrix",
            description: `Highly engineered weapon energy storage system. Max weapon: +${levelFourSingle}.`,
            strength: 16,
            techLevel: 6,
            type: Attachment_1.AttachmentType.GENERAL,
        })
            .EnableSellable(1500000)
            .EnableBuildable(new Blueprint_1.BlueprintBuilder().DefinedBuild(Blueprint_1.BlueprintBuilder.MODERATE_BUILD(1290000), "Weapons Energy Matrix"))
            .EquipFn((ship) => {
            ship.incrementStatistics({ energy: [levelFourSingle, 0, 0] });
            return { message: `New Weapon Energy: ${ship.ShipStatistics.totalEnergy[0]}`, success: true };
        })
            .UnequipFn((ship) => {
            ship.decrementStatistics({ energy: [levelFourSingle, 0, 0] });
            return { message: `New Weapon Energy: ${ship.ShipStatistics.totalEnergy[0]}`, success: true };
        })
            .Build(),
        new Attachment_1.AttachmentBuilder({
            name: "Engine Energy Matrix",
            description: `Highly engineered engine energy storage system. Max engine: +${levelFourSingle}.`,
            strength: 16,
            techLevel: 6,
            type: Attachment_1.AttachmentType.GENERAL,
        })
            .EnableSellable(1500000)
            .EnableBuildable(new Blueprint_1.BlueprintBuilder().DefinedBuild(Blueprint_1.BlueprintBuilder.MODERATE_BUILD(1290000), "Engine Energy Matrix"))
            .EquipFn((ship) => {
            ship.incrementStatistics({ energy: [0, levelFourSingle, 0] });
            return { message: `New Engine Energy: ${ship.ShipStatistics.totalEnergy[1]}`, success: true };
        })
            .UnequipFn((ship) => {
            ship.decrementStatistics({ energy: [0, levelFourSingle, 0] });
            return { message: `New Engine Energy: ${ship.ShipStatistics.totalEnergy[1]}`, success: true };
        })
            .Build(),
        new Attachment_1.AttachmentBuilder({
            name: "Computational Matrix",
            description: `Highly engineered computer system layout. Max computer: +${levelFourSingle}.`,
            strength: 16,
            techLevel: 6,
            type: Attachment_1.AttachmentType.GENERAL,
        })
            .EnableSellable(1500000)
            .EnableBuildable(new Blueprint_1.BlueprintBuilder().DefinedBuild(Blueprint_1.BlueprintBuilder.MODERATE_BUILD(1290000), "Computational Matrix"))
            .EquipFn((ship) => {
            ship.incrementStatistics({ energy: [0, 0, levelFourSingle] });
            return { message: `New Computer Energy: ${ship.ShipStatistics.totalEnergy[2]}`, success: true };
        })
            .UnequipFn((ship) => {
            ship.decrementStatistics({ energy: [0, 0, levelFourSingle] });
            return { message: `New Computer Energy: ${ship.ShipStatistics.totalEnergy[2]}`, success: true };
        })
            .Build(),
        new Attachment_1.AttachmentBuilder({
            name: "Spectral Matrix",
            description: `Advanced storage mechanism that increases energy capacities. Max of all energy types: +${levelFourMulti}.`,
            strength: 20,
            techLevel: 7,
            type: Attachment_1.AttachmentType.GENERAL,
        })
            .EnableSellable(1750000)
            .EnableBuildable(new Blueprint_1.BlueprintBuilder().DefinedBuild(Blueprint_1.BlueprintBuilder.ADVANCED_BUILD(1450000), "Spectral Matrix"))
            .EquipFn((ship) => {
            ship.incrementStatistics({ energy: [levelFourMulti, levelFourMulti, levelFourMulti] });
            return { message: `New Energy (W,E,C): ${ship.ShipStatistics.totalEnergy}`, success: true };
        })
            .UnequipFn((ship) => {
            ship.decrementStatistics({ energy: [levelFourMulti, levelFourMulti, levelFourMulti] });
            return { message: `New Energy (W,E,C): ${ship.ShipStatistics.totalEnergy}`, success: true };
        })
            .Build(),
        new Attachment_1.AttachmentBuilder({
            name: "Shield Matrix",
            description: `Advanced shield storage technology. Max shield: +${levelFourShield}.`,
            strength: 21,
            techLevel: 7,
            type: Attachment_1.AttachmentType.GENERAL,
        })
            .EnableSellable(2000000)
            .EnableBuildable(new Blueprint_1.BlueprintBuilder().DefinedBuild(Blueprint_1.BlueprintBuilder.ADVANCED_BUILD(1750000), "Shield Matrix"))
            .EquipFn((ship) => {
            ship.incrementStatistics({ shield: levelFourShield });
            return { message: `New Shield: ${ship.ShipStatistics.totalShield}`, success: true };
        })
            .UnequipFn((ship) => {
            ship.decrementStatistics({ shield: levelFourShield });
            return { message: `New Shield: ${ship.ShipStatistics.totalShield}`, success: true };
        })
            .Build(),
        //tier 5
        new Attachment_1.AttachmentBuilder({
            name: "Modular Weapons System",
            description: `Modular weapons system installation allows for much more energy storage. Max weapon: +${levelFiveSingle}.`,
            strength: 20,
            techLevel: 8,
            type: Attachment_1.AttachmentType.GENERAL,
        })
            .EnableSellable(3500000)
            .EnableBuildable(new Blueprint_1.BlueprintBuilder().DefinedBuild(Blueprint_1.BlueprintBuilder.MODERATE_BUILD(2800000), "Modular Weapons System"))
            .EquipFn((ship) => {
            ship.incrementStatistics({ energy: [levelFiveSingle, 0, 0] });
            return { message: `New Weapon Energy: ${ship.ShipStatistics.totalEnergy[0]}`, success: true };
        })
            .UnequipFn((ship) => {
            ship.decrementStatistics({ energy: [levelFiveSingle, 0, 0] });
            return { message: `New Weapon Energy: ${ship.ShipStatistics.totalEnergy[0]}`, success: true };
        })
            .Build(),
        new Attachment_1.AttachmentBuilder({
            name: "Modular Fuel Cells",
            description: `Modular engine system installation allows for much more energy storage. Max engine: +${levelFiveSingle}.`,
            strength: 20,
            techLevel: 8,
            type: Attachment_1.AttachmentType.GENERAL,
        })
            .EnableSellable(3500000)
            .EnableBuildable(new Blueprint_1.BlueprintBuilder().DefinedBuild(Blueprint_1.BlueprintBuilder.MODERATE_BUILD(2800000), "Modular Fuel Cells"))
            .EquipFn((ship) => {
            ship.incrementStatistics({ energy: [0, levelFiveSingle, 0] });
            return { message: `New Engine Energy: ${ship.ShipStatistics.totalEnergy[1]}`, success: true };
        })
            .UnequipFn((ship) => {
            ship.decrementStatistics({ energy: [0, levelFiveSingle, 0] });
            return { message: `New Engine Energy: ${ship.ShipStatistics.totalEnergy[1]}`, success: true };
        })
            .Build(),
        new Attachment_1.AttachmentBuilder({
            name: "Modular Supercomputer",
            description: `Modular computer system installation allows for much more energy storage. Max computer: +${levelFiveSingle}.`,
            strength: 20,
            techLevel: 8,
            type: Attachment_1.AttachmentType.GENERAL,
        })
            .EnableSellable(3500000)
            .EnableBuildable(new Blueprint_1.BlueprintBuilder().DefinedBuild(Blueprint_1.BlueprintBuilder.MODERATE_BUILD(2800000), "Modular Supercomputer"))
            .EquipFn((ship) => {
            ship.incrementStatistics({ energy: [0, 0, levelFiveSingle] });
            return { message: `New Computer Energy: ${ship.ShipStatistics.totalEnergy[2]}`, success: true };
        })
            .UnequipFn((ship) => {
            ship.decrementStatistics({ energy: [0, 0, levelFiveSingle] });
            return { message: `New Computer Energy: ${ship.ShipStatistics.totalEnergy[2]}`, success: true };
        })
            .Build(),
        new Attachment_1.AttachmentBuilder({
            name: "Modular Spectral Array",
            description: `Modular spectral storage allows for all energy storage types to have much greater capacity. Max of all energy types: +${levelFiveMulti}.`,
            strength: 23,
            techLevel: 9,
            type: Attachment_1.AttachmentType.GENERAL,
        })
            .EnableSellable(3750000)
            .EnableBuildable(new Blueprint_1.BlueprintBuilder().DefinedBuild(Blueprint_1.BlueprintBuilder.ADVANCED_BUILD(3100000), "Modular Spectral Array"))
            .EquipFn((ship) => {
            ship.incrementStatistics({ energy: [levelFiveMulti, levelFiveMulti, levelFiveMulti] });
            return { message: `New Energy (W,E,C): ${ship.ShipStatistics.totalEnergy}`, success: true };
        })
            .UnequipFn((ship) => {
            ship.decrementStatistics({ energy: [levelFiveMulti, levelFiveMulti, levelFiveMulti] });
            return { message: `New Energy (W,E,C): ${ship.ShipStatistics.totalEnergy}`, success: true };
        })
            .Build(),
        new Attachment_1.AttachmentBuilder({
            name: "Modular Shield Superchargers",
            description: `Advanced shield technology allows shields to be stored alongside other energy types. Max shield increased by total of other energy capacities.`,
            strength: 26,
            techLevel: 9,
            type: Attachment_1.AttachmentType.GENERAL,
        })
            .EnableSellable(4600000)
            .EnableBuildable(new Blueprint_1.BlueprintBuilder().DefinedBuild(Blueprint_1.BlueprintBuilder.ADVANCED_BUILD(3700000), "Modular Shield Superchargers"))
            .EquipFn((ship) => {
            const value = ship.BaseStatistics.baseEnergy.reduce((u, v) => u + v);
            ship.incrementStatistics({ shield: value });
            return { message: `New Shield: ${ship.ShipStatistics.totalShield}. Increased by ${value}.`, success: true };
        })
            .UnequipFn((ship) => {
            const value = ship.BaseStatistics.baseEnergy.reduce((u, v) => u + v);
            ship.decrementStatistics({ shield: value });
            return { message: `New Shield: ${ship.ShipStatistics.totalShield}. Increased by ${value}.`, success: true };
        })
            .Build(),
        //tier 6
        new Attachment_1.AttachmentBuilder({
            name: "Multidimensional Energy Tesseract",
            description: `Overcome the limitations of your ship by storing energy across dimensions. Max energy (including shield) doubled.`,
            strength: 54,
            techLevel: 10,
            type: Attachment_1.AttachmentType.GENERAL,
        })
            .EnableSellable(9250000)
            .EnableBuildable(new Blueprint_1.BlueprintBuilder().DefinedBuild(Blueprint_1.BlueprintBuilder.ADVANCED_BUILD(8000000), "Multidimensional Energy Tesseract"))
            .EquipFn((ship) => {
            const values = ship.BaseStatistics;
            ship.incrementStatistics({ shield: values.baseShield, energy: values.baseEnergy });
            return {
                message: `New Shield: ${ship.ShipStatistics.totalShield}. New Energy: ${ship.ShipStatistics.totalEnergy}.`,
                success: true,
            };
        })
            .UnequipFn((ship) => {
            const values = ship.BaseStatistics;
            ship.decrementStatistics({ shield: values.baseShield, energy: values.baseEnergy });
            return {
                message: `New Shield: ${ship.ShipStatistics.totalShield}. New Energy: ${ship.ShipStatistics.totalEnergy}.`,
                success: true,
            };
        })
            .Build(),
    ];
};
/**
 * Random between two numbers (inclusive)
 * @param lo minimum number
 * @param hi maximum number
 */
function rb(lo, hi) {
    return ~~(Math.random() * (lo - hi + 1) + lo);
}
