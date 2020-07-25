import { AttachmentBuilder, AttachmentType, Attachment } from "../lib/GameTypes/GameAsset/Attachment/Attachment";
import { Blueprint, BlueprintBuilder } from "../lib/GameTypes/GameAsset/Blueprint/Blueprint";

export const AttachmentGenerator = (): Attachment[] => {
    return [
        //#region Primary
        ...PrimaryGenerator(),
        //#endregion Primary
        //#region SHIELDS
        ...ShieldGenerator(),
        //#endregion shields
        //#region PLATING
        new AttachmentBuilder({
            name: "Iron Plating",
            description:
                "Not particularity impressive, but its a simple plating that provides some protection. Adds 25 hull.",
            type: AttachmentType.GENERAL,
            techLevel: 1,
            strength: 12,
        })
            .EnableSellable(24000)
            .EnableBuildable(new BlueprintBuilder().DefinedBuild(BlueprintBuilder.SIMPLE_BUILD(11000), "Iron Plating"))
            .EquipFn(({ friendly }) => {
                friendly.incrementStatistics({ hp: 25 });
                return { message: `New Health: ${friendly.ShipStatistics.totalHp}`, success: true };
            })
            .UnequipFn(({ friendly }) => {
                friendly.decrementStatistics({ hp: 25 });
                return { message: `New Health: ${friendly.ShipStatistics.totalHp}`, success: true };
            })
            .Build(),

        new AttachmentBuilder({
            name: "Steel Plating",
            description: "A slightly improved armoured plating, much tougher than iron plating. Adds 35 hull.",
            type: AttachmentType.GENERAL,
            techLevel: 3,
            strength: 14,
        })
            .EnableSellable(64000)
            .EnableBuildable(new BlueprintBuilder().DefinedBuild(BlueprintBuilder.SIMPLE_BUILD(38000), "Steel Plating"))
            .EquipFn(({ friendly }) => {
                friendly.incrementStatistics({ hp: 35 });
                return { message: `New Health: ${friendly.ShipStatistics.totalHp}`, success: true };
            })
            .UnequipFn(({ friendly }) => {
                friendly.decrementStatistics({ hp: 35 });
                return { message: `New Health: ${friendly.ShipStatistics.totalHp}`, success: true };
            })
            .Build(),

        new AttachmentBuilder({
            name: "Titanium Plating",
            description:
                "A tough and resistant shell that adds a solid chunk of strength to a ships hull. Adds 50 hull.",
            type: AttachmentType.GENERAL,
            techLevel: 4,
            strength: 17,
        })
            .EnableSellable(224000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.SIMPLE_BUILD(175000), "Titanium Plating")
            )
            .EquipFn(({ friendly }) => {
                friendly.incrementStatistics({ hp: 50 });
                return { message: `New Health: ${friendly.ShipStatistics.totalHp}`, success: true };
            })
            .UnequipFn(({ friendly }) => {
                friendly.decrementStatistics({ hp: 50 });
                return { message: `New Health: ${friendly.ShipStatistics.totalHp}`, success: true };
            })
            .Build(),

        new AttachmentBuilder({
            name: "Advanced Alloy Plating",
            description: "An advanced armour made from highly engineered advanced alloys. Adds 80 hull.",
            type: AttachmentType.GENERAL,
            techLevel: 6,
            strength: 22,
        })
            .EnableSellable(760000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.MODERATE_BUILD(530000), "Advanced Alloy Plating")
            )
            .EquipFn(({ friendly }) => {
                friendly.incrementStatistics({ hp: 80 });
                return { message: `New Health: ${friendly.ShipStatistics.totalHp}`, success: true };
            })
            .UnequipFn(({ friendly }) => {
                friendly.decrementStatistics({ hp: 80 });
                return { message: `New Health: ${friendly.ShipStatistics.totalHp}`, success: true };
            })
            .Build(),

        new AttachmentBuilder({
            name: "Ty'Linian Exoplate",
            description:
                "A tough and resistant shell that adds a solid chunk of strength to a ships hull. Adds 125 hull.",
            type: AttachmentType.GENERAL,
            techLevel: 7,
            strength: 28,
        })
            .EnableSellable(1120000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.ADVANCED_BUILD(920000), "Ty'Linian Exoplate")
            )
            .EquipFn(({ friendly }) => {
                friendly.incrementStatistics({ hp: 125 });
                return { message: `New Health: ${friendly.ShipStatistics.totalHp}`, success: true };
            })
            .UnequipFn(({ friendly }) => {
                friendly.decrementStatistics({ hp: 125 });
                return { message: `New Health: ${friendly.ShipStatistics.totalHp}`, success: true };
            })
            .Build(),

        new AttachmentBuilder({
            name: "Antimatter Plating",
            description:
                "Rare and expensive antimatter technology provides plating that is charged by the ships shield. Adds ship base shield value to hull.",
            type: AttachmentType.GENERAL,
            techLevel: 10,
            strength: 45,
        })
            .EnableSellable(3800000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.ADVANCED_BUILD(3100000), "Antimatter Plating")
            )
            .EquipFn(({ friendly }) => {
                const shieldValue = friendly.BaseStatistics.baseShield;
                friendly.incrementStatistics({ hp: shieldValue });
                return { message: `New Health: ${friendly.ShipStatistics.totalHp}`, success: true };
            })
            .UnequipFn(({ friendly }) => {
                const shieldValue = friendly.BaseStatistics.baseShield;
                friendly.decrementStatistics({ hp: shieldValue });
                return { message: `New Health: ${friendly.ShipStatistics.totalHp}`, success: true };
            })
            .Build(),

        //#endregion plating
        //#region RESERVES
        ...ReserveGenerator(),
        //#endregion reserves
        //#region CARGO
        ...CargoGenerator(),
        //#endregion cargo
        //#region THRUSTERS
        ...ThrusterGenerator(),
        //#endregion thrusters

        //#region ABILITIES
        ...TierOneAbility(),
        ...TierTwoAbility(),

        ...TierFiveAbility(),
        ...TierSixAbility(),
        //#endregion

        //#region MINING
        ...MiningGenerator(),
        //#endregion
    ];
};

const PrimaryGenerator = (): Attachment[] => {
    return [
        new AttachmentBuilder({
            name: "Standard Blaster",
            description: "Old, common but reliable blaster that has been around for centuries. Damage: 4-12.",
            strength: 16,
            techLevel: 2,
            type: AttachmentType.PRIMARY,
        })
            .EnableSellable(32000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.SIMPLE_BUILD(14000), "Standard Blaster")
            )
            .BattlePreTurnFn(({ battle }) => {
                const rnd = rb(4, 12);
                battle.Enemy.damage(rnd);
                return { success: true, message: `Standard Blaster: ${rnd} damage.` };
            })
            .Build(),

        new AttachmentBuilder({
            name: "Hardened Blaster",
            description:
                "A common modification done to the Standard Blaster to slightly increase its reliability. Damage: 8-12.",
            strength: 18,
            techLevel: 3,
            type: AttachmentType.PRIMARY,
        })
            .EnableSellable(65000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.SIMPLE_BUILD(42000), "Hardened Blaster")
            )
            .BattlePreTurnFn(({ battle }) => {
                const rnd = rb(8, 12);
                battle.Enemy.damage(rnd);
                return { success: true, message: `Hardened Blaster: ${rnd} damage.` };
            })
            .Build(),

        new AttachmentBuilder({
            name: "Rapidfire Blaster",
            description: "A fast firing but inaccurate blaster. Has a wide spread of potential damage. Damage: 8-18.",
            strength: 19,
            techLevel: 4,
            type: AttachmentType.PRIMARY,
        })
            .EnableSellable(195000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.SIMPLE_BUILD(145000), "Rapidfire Blaster")
            )
            .BattlePreTurnFn(({ battle }) => {
                const rnd = rb(8, 18);
                battle.Enemy.damage(rnd);
                return { success: true, message: `Hardened Blaster: ${rnd} damage.` };
            })
            .Build(),

        new AttachmentBuilder({
            name: "Mini Scattergun",
            description:
                "A weapon that focuses on covering as large of an area as possible. Damage: 10 + 10 per 100 opponent hp. Halved vs shield.",
            strength: 21,
            techLevel: 5,
            type: AttachmentType.PRIMARY,
        })
            .EnableSellable(385000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.SIMPLE_BUILD(295000), "Mini Scattergun")
            )
            .BattlePreTurnFn(({ battle }) => {
                const base = 10;
                const bonus = ~~(battle.Enemy.getStat("hp") / 100);
                const effective = Math.max(base + bonus - battle.Enemy.getStat("shield"), (base + bonus) / 2); //damage cant be less than half the base + bonus
                battle.Enemy.damage(effective);
                return { success: true, message: `Mini Scattergun: ${effective} damage.` };
            })
            .Build(),

        new AttachmentBuilder({
            name: "Thermic Focuser",
            description:
                "The most basic of the thermic weapons. Increases in heat and damage as the battle continues. Damage: 4 + 1 per turn.",
            strength: 21,
            techLevel: 5,
            type: AttachmentType.PRIMARY,
        })
            .EnableSellable(360000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.SIMPLE_BUILD(275000), "Thermic Focuser")
            )
            .BattlePreTurnFn(({ battle }) => {
                const base = 4;
                const bonus = battle.TurnNumber * 1;
                const effective = base + bonus; //damage cant be less than half the base + bonus
                battle.Enemy.damage(effective);
                return { success: true, message: `Thermic Focuser: ${base} + ${bonus} damage.` };
            })
            .Build(),

        new AttachmentBuilder({
            name: "Precision Railgun",
            description: "A precise weapon capable of piercing through even the strongest shields. Hull damage: 8-10.",
            strength: 20,
            techLevel: 4,
            type: AttachmentType.PRIMARY,
        })
            .EnableSellable(275000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.SIMPLE_BUILD(200000), "Precision Railgun")
            )
            .BattlePreTurnFn(({ battle }) => {
                const base = rb(8, 12);
                battle.Enemy.damage(base);
                return { success: true, message: `Precision Railgun: ${base} hull damage.` };
            })
            .Build(),

        new AttachmentBuilder({
            name: "Plasma Cannon",
            description: "A rapid firing cannon that shoots hot balls of damaging plasma. Damage: 15-25.",
            strength: 24,
            techLevel: 6,
            type: AttachmentType.PRIMARY,
        })
            .EnableSellable(674000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.MODERATE_BUILD(520000), "Plasma Cannon")
            )
            .BattlePreTurnFn(({ battle }) => {
                const base = rb(15, 25);
                battle.Enemy.damage(base);
                return { success: true, message: `Plasma Cannon: ${base} damage.` };
            })
            .Build(),

        new AttachmentBuilder({
            name: "Flak Cannon",
            description:
                "A direct improvement of the Mini Scattergun. Damage: 10 per 50 opponent hp. Halved vs shield.",
            strength: 21,
            techLevel: 5,
            type: AttachmentType.PRIMARY,
        })
            .EnableSellable(385000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.MODERATE_BUILD(295000), "Flak Cannon")
            )
            .BattlePreTurnFn(({ battle }) => {
                const base = 0;
                const bonus = ~~(battle.Enemy.getStat("hp") / 50);
                const effective = Math.max(base + bonus - battle.Enemy.getStat("shield"), (base + bonus) / 2); //damage cant be less than half the base + bonus
                battle.Enemy.damage(effective);
                return { success: true, message: `Flak Cannon: ${effective} damage.` };
            })
            .Build(),

        new AttachmentBuilder({
            name: "Sunfire Beam",
            description:
                "A beam that starts off very weak, but ramps up after continuous fire. Damage: 2 + 2 per turn.",
            strength: 21,
            techLevel: 5,
            type: AttachmentType.PRIMARY,
        })
            .EnableSellable(360000)
            .EnableBuildable(new BlueprintBuilder().DefinedBuild(BlueprintBuilder.SIMPLE_BUILD(275000), "Sunfire Beam"))
            .BattlePreTurnFn(({ battle }) => {
                const base = 2;
                const bonus = battle.TurnNumber * 2;
                const effective = base + bonus; //damage cant be less than half the base + bonus
                battle.Enemy.damage(effective);
                return { success: true, message: `Thermic Focuser: ${base} + ${bonus} damage.` };
            })
            .Build(),

        new AttachmentBuilder({
            name: "Void Ray",
            description:
                "A destructive weapon that can do extreme damage, but firing it is unsustainable. Damage: 50 - 5 per turn.",
            strength: 21,
            techLevel: 5,
            type: AttachmentType.PRIMARY,
        })
            .EnableSellable(360000)
            .EnableBuildable(new BlueprintBuilder().DefinedBuild(BlueprintBuilder.SIMPLE_BUILD(275000), "Void Ray"))
            .BattlePreTurnFn(({ battle }) => {
                const base = 50;
                const bonus = battle.TurnNumber * -5;
                const effective = Math.max(base + bonus, 0); //damage cant be less than half the base + bonus
                battle.Enemy.damage(effective);
                return { success: true, message: `Void Ray: ${effective} damage.` };
            })
            .Build(),

        new AttachmentBuilder({
            name: "Quasar Cannon",
            description: "Incredibly consistent weapon effective against any type of ship. Damage: 30.",
            strength: 21,
            techLevel: 5,
            type: AttachmentType.PRIMARY,
        })
            .EnableSellable(360000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.SIMPLE_BUILD(275000), "Quasar Cannon")
            )
            .BattlePreTurnFn(({ battle }) => {
                const effective = 30;
                battle.Enemy.damage(effective);
                return { success: true, message: `Quasar Cannon: ${effective} damage.` };
            })
            .Build(),

        new AttachmentBuilder({
            name: "Heavy Flak Launcher",
            description:
                "A direct improvement of the Mini Scattergun. Damage: 10 per 50 opponent hp. Halved vs shield.",
            strength: 21,
            techLevel: 5,
            type: AttachmentType.PRIMARY,
        })
            .EnableSellable(385000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.MODERATE_BUILD(295000), "Heavy Flak Launcher")
            )
            .BattlePreTurnFn(({ battle }) => {
                const base = 0;
                const bonus = ~~(battle.Enemy.getStat("hp") / 50);
                const effective = Math.max(base + bonus - battle.Enemy.getStat("shield"), (base + bonus) / 2); //damage cant be less than half the base + bonus
                battle.Enemy.damage(effective);
                return { success: true, message: `Heavy Flak Launcher: ${effective} damage.` };
            })
            .Build(),
    ];
};

const ReserveGenerator = (): Attachment[] => {
    const levelOneSingle = 4,
        levelTwoSingle = 8,
        levelTwoMulti = 4,
        levelThreeSingle = 12,
        levelThreeMulti = 6,
        levelThreeShield = 25,
        levelFourSingle = 20,
        levelFourMulti = 10,
        levelFourShield = 50,
        levelFiveSingle = 28,
        levelFiveMulti = 14;

    return [
        new AttachmentBuilder({
            name: "Basic Weapon Reserves",
            description: `Basic additional storage for weapons energy. Max weapon: +${levelOneSingle}.`,
            strength: 3,
            techLevel: 2,
            type: AttachmentType.GENERAL,
        })
            .EnableSellable(15000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.SIMPLE_BUILD(5000), "Basic Weapon Reserves")
            )
            .EquipFn(({ friendly: ship }) => {
                ship.incrementStatistics({ energy: [levelOneSingle, 0, 0] });
                return { message: `New Weapon Energy: ${ship.ShipStatistics.totalEnergy[0]}`, success: true };
            })
            .UnequipFn(({ friendly: ship }) => {
                ship.decrementStatistics({ energy: [levelOneSingle, 0, 0] });
                return { message: `New Weapon Energy: ${ship.ShipStatistics.totalEnergy[0]}`, success: true };
            })
            .Build(),
        new AttachmentBuilder({
            name: "Basic Engine Reserves",
            description: `Basic additional storage for engine energy. Max engine: +${levelOneSingle}.`,
            strength: 3,
            techLevel: 2,
            type: AttachmentType.GENERAL,
        })
            .EnableSellable(15000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.SIMPLE_BUILD(5000), "Basic Engine Reserves")
            )
            .EquipFn(({ friendly: ship }) => {
                ship.incrementStatistics({ energy: [0, levelOneSingle, 0] });
                return { message: `New Engine Energy: ${ship.ShipStatistics.totalEnergy[1]}`, success: true };
            })
            .UnequipFn(({ friendly: ship }) => {
                ship.decrementStatistics({ energy: [0, levelOneSingle, 0] });
                return { message: `New Engine Energy: ${ship.ShipStatistics.totalEnergy[1]}`, success: true };
            })
            .Build(),
        new AttachmentBuilder({
            name: "Basic Computer Reserves",
            description: `Basic additional storage for computer energy. Max computer: +${levelOneSingle}.`,
            strength: 3,
            techLevel: 2,
            type: AttachmentType.GENERAL,
        })
            .EnableSellable(15000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.SIMPLE_BUILD(5000), "Basic Computer Reserves")
            )
            .EquipFn(({ friendly: ship }) => {
                ship.incrementStatistics({ energy: [0, 0, levelTwoSingle] });
                return { message: `New Computer Energy: ${ship.ShipStatistics.totalEnergy[2]}`, success: true };
            })
            .UnequipFn(({ friendly: ship }) => {
                ship.decrementStatistics({ energy: [0, 0, levelTwoSingle] });
                return { message: `New Computer Energy: ${ship.ShipStatistics.totalEnergy[2]}`, success: true };
            })
            .Build(),

        new AttachmentBuilder({
            name: "Weapons Battery",
            description: `Advanced battery for storing excess weapon energy. Max weapon: +${levelTwoSingle}.`,
            strength: 5,
            techLevel: 3,
            type: AttachmentType.GENERAL,
        })
            .EnableSellable(150000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.SIMPLE_BUILD(75000), "Weapons Battery")
            )
            .EquipFn(({ friendly: ship }) => {
                ship.incrementStatistics({ energy: [levelTwoSingle, 0, 0] });
                return { message: `New Weapon Energy: ${ship.ShipStatistics.totalEnergy[0]}`, success: true };
            })
            .UnequipFn(({ friendly: ship }) => {
                ship.decrementStatistics({ energy: [levelTwoSingle, 0, 0] });
                return { message: `New Weapon Energy: ${ship.ShipStatistics.totalEnergy[0]}`, success: true };
            })
            .Build(),
        new AttachmentBuilder({
            name: "Engine Battery",
            description: `Advanced battery for storing excess engine energy. Max engine: +${levelTwoSingle}.`,
            strength: 5,
            techLevel: 3,
            type: AttachmentType.GENERAL,
        })
            .EnableSellable(150000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.SIMPLE_BUILD(75000), "Engine Battery")
            )
            .EquipFn(({ friendly: ship }) => {
                ship.incrementStatistics({ energy: [0, levelTwoSingle, 0] });
                return { message: `New Engine Energy: ${ship.ShipStatistics.totalEnergy[1]}`, success: true };
            })
            .UnequipFn(({ friendly: ship }) => {
                ship.decrementStatistics({ energy: [0, levelTwoSingle, 0] });
                return { message: `New Engine Energy: ${ship.ShipStatistics.totalEnergy[1]}`, success: true };
            })
            .Build(),
        new AttachmentBuilder({
            name: "Computer Battery",
            description: `Advanced battery for storing excess computer energy. Max computer: +${levelTwoSingle}.`,
            strength: 5,
            techLevel: 3,
            type: AttachmentType.GENERAL,
        })
            .EnableSellable(150000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.SIMPLE_BUILD(75000), "Computer Battery")
            )
            .EquipFn(({ friendly: ship }) => {
                ship.incrementStatistics({ energy: [0, 0, levelTwoSingle] });
                return { message: `New Computer Energy: ${ship.ShipStatistics.totalEnergy[2]}`, success: true };
            })
            .UnequipFn(({ friendly: ship }) => {
                ship.decrementStatistics({ energy: [0, 0, levelTwoSingle] });
                return { message: `New Computer Energy: ${ship.ShipStatistics.totalEnergy[2]}`, success: true };
            })
            .Build(),
        new AttachmentBuilder({
            name: "Full Spectrum Battery",
            description: `Advanced battery for storing excess computer energy. Max of all energy types: +${levelTwoMulti}.`,
            strength: 7,
            techLevel: 3,
            type: AttachmentType.GENERAL,
        })
            .EnableSellable(225000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.SIMPLE_BUILD(150000), "Full Spectrum Battery")
            )
            .EquipFn(({ friendly: ship }) => {
                ship.incrementStatistics({ energy: [levelTwoMulti, levelTwoMulti, levelTwoMulti] });
                return { message: `New Energy (W,E,C): ${ship.ShipStatistics.totalEnergy}`, success: true };
            })
            .UnequipFn(({ friendly: ship }) => {
                ship.decrementStatistics({ energy: [levelTwoMulti, levelTwoMulti, levelTwoMulti] });
                return { message: `New Energy (W,E,C): ${ship.ShipStatistics.totalEnergy}`, success: true };
            })
            .Build(),

        //Tier 3

        new AttachmentBuilder({
            name: "Weapons Energy Cell",
            description: `Dense energy cell that stores a large amount of excess weapon energy. Max weapon: +${levelThreeSingle}.`,
            strength: 10,
            techLevel: 4,
            type: AttachmentType.GENERAL,
        })
            .EnableSellable(500000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.MODERATE_BUILD(390000), "Weapons Energy Cell")
            )
            .EquipFn(({ friendly: ship }) => {
                ship.incrementStatistics({ energy: [levelThreeSingle, 0, 0] });
                return { message: `New Weapon Energy: ${ship.ShipStatistics.totalEnergy[0]}`, success: true };
            })
            .UnequipFn(({ friendly: ship }) => {
                ship.decrementStatistics({ energy: [levelThreeSingle, 0, 0] });
                return { message: `New Weapon Energy: ${ship.ShipStatistics.totalEnergy[0]}`, success: true };
            })
            .Build(),
        new AttachmentBuilder({
            name: "Engine Fuel Deposit",
            description: `Dense fuel depository that allows for greater engine capacity. Max engine: +${levelThreeSingle}.`,
            strength: 10,
            techLevel: 4,
            type: AttachmentType.GENERAL,
        })
            .EnableSellable(500000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.MODERATE_BUILD(390000), "Engine Fuel Deposit")
            )
            .EquipFn(({ friendly: ship }) => {
                ship.incrementStatistics({ energy: [0, levelThreeSingle, 0] });
                return { message: `New Engine Energy: ${ship.ShipStatistics.totalEnergy[1]}`, success: true };
            })
            .UnequipFn(({ friendly: ship }) => {
                ship.decrementStatistics({ energy: [0, levelThreeSingle, 0] });
                return { message: `New Engine Energy: ${ship.ShipStatistics.totalEnergy[1]}`, success: true };
            })
            .Build(),
        new AttachmentBuilder({
            name: "Computational Reserves",
            description: `Densely packed computational reserves that allow for greater computer capacity. Max computer: +${levelThreeSingle}.`,
            strength: 10,
            techLevel: 4,
            type: AttachmentType.GENERAL,
        })
            .EnableSellable(500000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.MODERATE_BUILD(390000), "Computer Battery")
            )
            .EquipFn(({ friendly: ship }) => {
                ship.incrementStatistics({ energy: [0, 0, levelThreeSingle] });
                return { message: `New Computer Energy: ${ship.ShipStatistics.totalEnergy[2]}`, success: true };
            })
            .UnequipFn(({ friendly: ship }) => {
                ship.decrementStatistics({ energy: [0, 0, levelThreeSingle] });
                return { message: `New Computer Energy: ${ship.ShipStatistics.totalEnergy[2]}`, success: true };
            })
            .Build(),
        new AttachmentBuilder({
            name: "Full Spectrum Battery",
            description: `Advanced battery for storing excess computer energy. Max of all energy types: +${levelThreeMulti}.`,
            strength: 12,
            techLevel: 5,
            type: AttachmentType.GENERAL,
        })
            .EnableSellable(675000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.MODERATE_BUILD(595000), "Full Spectrum Battery")
            )
            .EquipFn(({ friendly: ship }) => {
                ship.incrementStatistics({ energy: [levelThreeMulti, levelThreeMulti, levelThreeMulti] });
                return { message: `New Energy (W,E,C): ${ship.ShipStatistics.totalEnergy}`, success: true };
            })
            .UnequipFn(({ friendly: ship }) => {
                ship.decrementStatistics({ energy: [levelThreeMulti, levelThreeMulti, levelThreeMulti] });
                return { message: `New Energy (W,E,C): ${ship.ShipStatistics.totalEnergy}`, success: true };
            })
            .Build(),

        new AttachmentBuilder({
            name: "Shield Cells",
            description: `Advanced battery that increases maximum shield capacity. Max shield: +${levelThreeShield}.`,
            strength: 13,
            techLevel: 5,
            type: AttachmentType.GENERAL,
        })
            .EnableSellable(825000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.MODERATE_BUILD(715000), "Shield Cells")
            )
            .EquipFn(({ friendly: ship }) => {
                ship.incrementStatistics({ shield: levelThreeShield });
                return { message: `New Shield: ${ship.ShipStatistics.totalShield}`, success: true };
            })
            .UnequipFn(({ friendly: ship }) => {
                ship.decrementStatistics({ shield: levelThreeShield });
                return { message: `New Shield: ${ship.ShipStatistics.totalShield}`, success: true };
            })
            .Build(),

        //tier 4

        new AttachmentBuilder({
            name: "Weapons Energy Matrix",
            description: `Highly engineered weapon energy storage system. Max weapon: +${levelFourSingle}.`,
            strength: 16,
            techLevel: 6,
            type: AttachmentType.GENERAL,
        })
            .EnableSellable(1500000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.MODERATE_BUILD(1290000), "Weapons Energy Matrix")
            )
            .EquipFn(({ friendly: ship }) => {
                ship.incrementStatistics({ energy: [levelFourSingle, 0, 0] });
                return { message: `New Weapon Energy: ${ship.ShipStatistics.totalEnergy[0]}`, success: true };
            })
            .UnequipFn(({ friendly: ship }) => {
                ship.decrementStatistics({ energy: [levelFourSingle, 0, 0] });
                return { message: `New Weapon Energy: ${ship.ShipStatistics.totalEnergy[0]}`, success: true };
            })
            .Build(),
        new AttachmentBuilder({
            name: "Engine Energy Matrix",
            description: `Highly engineered engine energy storage system. Max engine: +${levelFourSingle}.`,
            strength: 16,
            techLevel: 6,
            type: AttachmentType.GENERAL,
        })
            .EnableSellable(1500000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.MODERATE_BUILD(1290000), "Engine Energy Matrix")
            )
            .EquipFn(({ friendly: ship }) => {
                ship.incrementStatistics({ energy: [0, levelFourSingle, 0] });
                return { message: `New Engine Energy: ${ship.ShipStatistics.totalEnergy[1]}`, success: true };
            })
            .UnequipFn(({ friendly: ship }) => {
                ship.decrementStatistics({ energy: [0, levelFourSingle, 0] });
                return { message: `New Engine Energy: ${ship.ShipStatistics.totalEnergy[1]}`, success: true };
            })
            .Build(),
        new AttachmentBuilder({
            name: "Computational Matrix",
            description: `Highly engineered computer system layout. Max computer: +${levelFourSingle}.`,
            strength: 16,
            techLevel: 6,
            type: AttachmentType.GENERAL,
        })
            .EnableSellable(1500000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.MODERATE_BUILD(1290000), "Computational Matrix")
            )
            .EquipFn(({ friendly: ship }) => {
                ship.incrementStatistics({ energy: [0, 0, levelFourSingle] });
                return { message: `New Computer Energy: ${ship.ShipStatistics.totalEnergy[2]}`, success: true };
            })
            .UnequipFn(({ friendly: ship }) => {
                ship.decrementStatistics({ energy: [0, 0, levelFourSingle] });
                return { message: `New Computer Energy: ${ship.ShipStatistics.totalEnergy[2]}`, success: true };
            })
            .Build(),
        new AttachmentBuilder({
            name: "Spectral Matrix",
            description: `Advanced storage mechanism that increases energy capacities. Max of all energy types: +${levelFourMulti}.`,
            strength: 20,
            techLevel: 7,
            type: AttachmentType.GENERAL,
        })
            .EnableSellable(1750000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.ADVANCED_BUILD(1450000), "Spectral Matrix")
            )
            .EquipFn(({ friendly: ship }) => {
                ship.incrementStatistics({ energy: [levelFourMulti, levelFourMulti, levelFourMulti] });
                return { message: `New Energy (W,E,C): ${ship.ShipStatistics.totalEnergy}`, success: true };
            })
            .UnequipFn(({ friendly: ship }) => {
                ship.decrementStatistics({ energy: [levelFourMulti, levelFourMulti, levelFourMulti] });
                return { message: `New Energy (W,E,C): ${ship.ShipStatistics.totalEnergy}`, success: true };
            })
            .Build(),

        new AttachmentBuilder({
            name: "Shield Matrix",
            description: `Advanced shield storage technology. Max shield: +${levelFourShield}.`,
            strength: 21,
            techLevel: 7,
            type: AttachmentType.GENERAL,
        })
            .EnableSellable(2000000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.ADVANCED_BUILD(1750000), "Shield Matrix")
            )
            .EquipFn(({ friendly: ship }) => {
                ship.incrementStatistics({ shield: levelFourShield });
                return { message: `New Shield: ${ship.ShipStatistics.totalShield}`, success: true };
            })
            .UnequipFn(({ friendly: ship }) => {
                ship.decrementStatistics({ shield: levelFourShield });
                return { message: `New Shield: ${ship.ShipStatistics.totalShield}`, success: true };
            })
            .Build(),

        //tier 5

        new AttachmentBuilder({
            name: "Modular Weapons System",
            description: `Modular weapons system installation allows for much more energy storage. Max weapon: +${levelFiveSingle}.`,
            strength: 20,
            techLevel: 8,
            type: AttachmentType.GENERAL,
        })
            .EnableSellable(3500000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.MODERATE_BUILD(2800000), "Modular Weapons System")
            )
            .EquipFn(({ friendly: ship }) => {
                ship.incrementStatistics({ energy: [levelFiveSingle, 0, 0] });
                return { message: `New Weapon Energy: ${ship.ShipStatistics.totalEnergy[0]}`, success: true };
            })
            .UnequipFn(({ friendly: ship }) => {
                ship.decrementStatistics({ energy: [levelFiveSingle, 0, 0] });
                return { message: `New Weapon Energy: ${ship.ShipStatistics.totalEnergy[0]}`, success: true };
            })
            .Build(),
        new AttachmentBuilder({
            name: "Modular Fuel Cells",
            description: `Modular engine system installation allows for much more energy storage. Max engine: +${levelFiveSingle}.`,
            strength: 20,
            techLevel: 8,
            type: AttachmentType.GENERAL,
        })
            .EnableSellable(3500000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.MODERATE_BUILD(2800000), "Modular Fuel Cells")
            )
            .EquipFn(({ friendly: ship }) => {
                ship.incrementStatistics({ energy: [0, levelFiveSingle, 0] });
                return { message: `New Engine Energy: ${ship.ShipStatistics.totalEnergy[1]}`, success: true };
            })
            .UnequipFn(({ friendly: ship }) => {
                ship.decrementStatistics({ energy: [0, levelFiveSingle, 0] });
                return { message: `New Engine Energy: ${ship.ShipStatistics.totalEnergy[1]}`, success: true };
            })
            .Build(),
        new AttachmentBuilder({
            name: "Modular Supercomputer",
            description: `Modular computer system installation allows for much more energy storage. Max computer: +${levelFiveSingle}.`,
            strength: 20,
            techLevel: 8,
            type: AttachmentType.GENERAL,
        })
            .EnableSellable(3500000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.MODERATE_BUILD(2800000), "Modular Supercomputer")
            )
            .EquipFn(({ friendly: ship }) => {
                ship.incrementStatistics({ energy: [0, 0, levelFiveSingle] });
                return { message: `New Computer Energy: ${ship.ShipStatistics.totalEnergy[2]}`, success: true };
            })
            .UnequipFn(({ friendly: ship }) => {
                ship.decrementStatistics({ energy: [0, 0, levelFiveSingle] });
                return { message: `New Computer Energy: ${ship.ShipStatistics.totalEnergy[2]}`, success: true };
            })
            .Build(),
        new AttachmentBuilder({
            name: "Modular Spectral Array",
            description: `Modular spectral storage allows for all energy storage types to have much greater capacity. Max of all energy types: +${levelFiveMulti}.`,
            strength: 23,
            techLevel: 9,
            type: AttachmentType.GENERAL,
        })
            .EnableSellable(3750000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.ADVANCED_BUILD(3100000), "Modular Spectral Array")
            )
            .EquipFn(({ friendly: ship }) => {
                ship.incrementStatistics({ energy: [levelFiveMulti, levelFiveMulti, levelFiveMulti] });
                return { message: `New Energy (W,E,C): ${ship.ShipStatistics.totalEnergy}`, success: true };
            })
            .UnequipFn(({ friendly: ship }) => {
                ship.decrementStatistics({ energy: [levelFiveMulti, levelFiveMulti, levelFiveMulti] });
                return { message: `New Energy (W,E,C): ${ship.ShipStatistics.totalEnergy}`, success: true };
            })
            .Build(),

        new AttachmentBuilder({
            name: "Modular Shield Superchargers",
            description: `Advanced shield technology allows shields to be stored alongside other energy types. Max shield increased by total of other energy capacities.`,
            strength: 26,
            techLevel: 9,
            type: AttachmentType.GENERAL,
        })
            .EnableSellable(4600000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(
                    BlueprintBuilder.ADVANCED_BUILD(3700000),
                    "Modular Shield Superchargers"
                )
            )
            .EquipFn(({ friendly: ship }) => {
                const value = ship.BaseStatistics.baseEnergy.reduce((u, v) => u + v);
                ship.incrementStatistics({ shield: value });
                return {
                    message: `New Shield: ${ship.ShipStatistics.totalShield}. Increased by ${value}.`,
                    success: true,
                };
            })
            .UnequipFn(({ friendly: ship }) => {
                const value = ship.BaseStatistics.baseEnergy.reduce((u, v) => u + v);
                ship.decrementStatistics({ shield: value });
                return {
                    message: `New Shield: ${ship.ShipStatistics.totalShield}. Increased by ${value}.`,
                    success: true,
                };
            })
            .Build(),

        //tier 6

        new AttachmentBuilder({
            name: "Multidimensional Energy Tesseract",
            description: `Overcome the limitations of your ship by storing energy across dimensions. Max energy (including shield) doubled.`,
            strength: 54,
            techLevel: 10,
            type: AttachmentType.GENERAL,
        })
            .EnableSellable(9250000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(
                    BlueprintBuilder.ADVANCED_BUILD(8000000),
                    "Multidimensional Energy Tesseract"
                )
            )
            .EquipFn(({ friendly: ship }) => {
                const values = ship.BaseStatistics;
                ship.incrementStatistics({ shield: values.baseShield, energy: values.baseEnergy });
                return {
                    message: `New Shield: ${ship.ShipStatistics.totalShield}. New Energy: ${ship.ShipStatistics.totalEnergy}.`,
                    success: true,
                };
            })
            .UnequipFn(({ friendly: ship }) => {
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

const CargoGenerator = (): Attachment[] => {
    const levelOne = 750;
    const levelTwo = 1500;
    const levelThree = 3000;
    const levelFour = 6000;
    const levelFive = 12000;

    return [
        new AttachmentBuilder({
            name: "Small Cargo Hold",
            description: `A small cargo hold so you can carry more items. Max cargo: +${levelOne}.`,
            strength: 0,
            techLevel: 1,
            type: AttachmentType.GENERAL,
        })
            .EnableSellable(70000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.SIMPLE_BUILD(45000), "Small Cargo Hold")
            )
            .EquipFn(({ friendly: ship }) => {
                ship.incrementStatistics({ cargo: levelOne });
                return { message: `New Cargo: ${ship.ShipStatistics.totalCargo}`, success: true };
            })
            .UnequipFn(({ friendly: ship }) => {
                ship.decrementStatistics({ cargo: levelOne });
                return { message: `New Cargo: ${ship.ShipStatistics.totalCargo}`, success: true };
            })
            .Build(),

        new AttachmentBuilder({
            name: "Medium Cargo Hold",
            description: `A medium sized cargo hold that carries more items whilst using more lightweight materials. Max cargo: +${levelTwo}.`,
            strength: 0,
            techLevel: 2,
            type: AttachmentType.GENERAL,
        })
            .EnableSellable(380000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.SIMPLE_BUILD(300000), "Medium Cargo Hold")
            )
            .EquipFn(({ friendly: ship }) => {
                ship.incrementStatistics({ cargo: levelTwo });
                return { message: `New Cargo: ${ship.ShipStatistics.totalCargo}`, success: true };
            })
            .UnequipFn(({ friendly: ship }) => {
                ship.decrementStatistics({ cargo: levelTwo });
                return { message: `New Cargo: ${ship.ShipStatistics.totalCargo}`, success: true };
            })
            .Build(),

        new AttachmentBuilder({
            name: "Large Cargo Hold",
            description: `A large cargo hold that uses high tech, lightweight materials. Max cargo: +${levelThree}.`,
            strength: 0,
            techLevel: 4,
            type: AttachmentType.GENERAL,
        })
            .EnableSellable(680000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.MODERATE_BUILD(560000), "Large Cargo Hold")
            )
            .EquipFn(({ friendly: ship }) => {
                ship.incrementStatistics({ cargo: levelThree });
                return { message: `New Cargo: ${ship.ShipStatistics.totalCargo}`, success: true };
            })
            .UnequipFn(({ friendly: ship }) => {
                ship.decrementStatistics({ cargo: levelThree });
                return { message: `New Cargo: ${ship.ShipStatistics.totalCargo}`, success: true };
            })
            .Build(),

        new AttachmentBuilder({
            name: "Compressing Cargo Hold",
            description: `An advanced cargo hold that physically compresses items, without causing damage. Max cargo: +${levelFour}.`,
            strength: 0,
            techLevel: 6,
            type: AttachmentType.GENERAL,
        })
            .EnableSellable(1120000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.MODERATE_BUILD(975000), "Compressing Cargo Hold")
            )
            .EquipFn(({ friendly: ship }) => {
                ship.incrementStatistics({ cargo: levelFour });
                return { message: `New Cargo: ${ship.ShipStatistics.totalCargo}`, success: true };
            })
            .UnequipFn(({ friendly: ship }) => {
                ship.decrementStatistics({ cargo: levelFour });
                return { message: `New Cargo: ${ship.ShipStatistics.totalCargo}`, success: true };
            })
            .Build(),

        new AttachmentBuilder({
            name: "Interdimensional Cargo Hold",
            description: `A miniature wormhole that links to another dimension, allowing for extremely more cargo space. Max cargo: +${levelFive}.`,
            strength: 0,
            techLevel: 8,
            type: AttachmentType.GENERAL,
        })
            .EnableSellable(3800000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(
                    BlueprintBuilder.ADVANCED_BUILD(3200000),
                    "Interdimensional Cargo Hold"
                )
            )
            .EquipFn(({ friendly: ship }) => {
                ship.incrementStatistics({ cargo: levelFive });
                return { message: `New Cargo: ${ship.ShipStatistics.totalCargo}`, success: true };
            })
            .UnequipFn(({ friendly: ship }) => {
                ship.decrementStatistics({ cargo: levelFive });
                return { message: `New Cargo: ${ship.ShipStatistics.totalCargo}`, success: true };
            })
            .Build(),
    ];
};

const ThrusterGenerator = (): Attachment[] => {
    const levelOne = 1;
    const levelTwo = 2;

    return [
        new AttachmentBuilder({
            name: "Basic Thruster",
            description: `A simple booster drive that is attached to your ship to make it handle better and move faster. Handling: +${levelOne}.`,
            strength: 0,
            techLevel: 4,
            type: AttachmentType.GENERAL,
        })
            .EnableSellable(1360000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.MODERATE_BUILD(1060000), "Basic Thruster")
            )
            .EquipFn(({ friendly: ship }) => {
                ship.incrementStatistics({ handling: levelOne });
                return { message: `New Handling: ${ship.ShipStatistics.totalHandling}`, success: true };
            })
            .UnequipFn(({ friendly: ship }) => {
                ship.decrementStatistics({ handling: levelOne });
                return { message: `New Handling: ${ship.ShipStatistics.totalHandling}`, success: true };
            })
            .Build(),

        new AttachmentBuilder({
            name: "Full Phase Thrusters",
            description: `An advanced thruster setup that provides optimal speed and handling improvements. Handling: +${levelTwo}.`,
            strength: 0,
            techLevel: 8,
            type: AttachmentType.GENERAL,
        })
            .EnableSellable(4360000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.ADVANCED_BUILD(3860000), "Full Phase Thrusters")
            )
            .EquipFn(({ friendly: ship }) => {
                ship.incrementStatistics({ handling: levelTwo });
                return { message: `New Handling: ${ship.ShipStatistics.totalHandling}`, success: true };
            })
            .UnequipFn(({ friendly: ship }) => {
                ship.decrementStatistics({ handling: levelTwo });
                return { message: `New Handling: ${ship.ShipStatistics.totalHandling}`, success: true };
            })
            .Build(),
    ];
};

const ShieldGenerator = (): Attachment[] => {
    return [
        new AttachmentBuilder({
            name: "Blink Shield",
            description: `An emergency shield system that activates before ship destruction. If you would die: +15 shield & +1 hull.`,
            strength: 5,
            techLevel: 2,
            type: AttachmentType.SHIELD,
        })
            .EnableSellable(35000)
            .EnableBuildable(new BlueprintBuilder().DefinedBuild(BlueprintBuilder.SIMPLE_BUILD(21000), "Blink Shield"))
            .CriticalDamageFn(({ friendly, enemy, dmg }) => {
                friendly.increaseStat("hp", 1);
                friendly.increaseStat("shield", 15);
                return { message: "Critical Damage Taken! Adding 15 shield and 1 hull.", success: true };
            })
            .Build(),
        new AttachmentBuilder({
            name: "Rusty Shield Charger",
            description: `A rusty system used to charge up small shield systems, repurposed for ships. Shield recharge: 0-3.`,
            strength: 3,
            techLevel: 1,
            type: AttachmentType.SHIELD,
        })
            .EnableSellable(8790)
            .BattlePreTurnFn(({ battle }) => {
                const rnd = rb(0, 3);
                battle.Friendly.increaseStat("shield", rnd);
                return { message: `Shield increased by ${rnd}.`, success: true };
            })
            .Build(),

        new AttachmentBuilder({
            name: "Emergency Shield Systems",
            description: `Enhanced emergency shield system that improves your ships condition if facing immediate doom. If you would die: +30 shield & +1 hull.`,
            strength: 11,
            techLevel: 3,
            type: AttachmentType.SHIELD,
        })
            .EnableSellable(465000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.SIMPLE_BUILD(390000), "Emergency Shield Systems")
            )
            .CriticalDamageFn(({ friendly, enemy, dmg }) => {
                friendly.increaseStat("hp", 1);
                friendly.increaseStat("shield", 30);
                return { message: "Critical Damage Taken! Adding 30 shield and 1 hull.", success: true };
            })
            .Build(),
        new AttachmentBuilder({
            name: "Holo-Shield",
            description: `A conventional ship shield charger. Shield recharge: 4-8.`,
            strength: 14,
            techLevel: 4,
            type: AttachmentType.SHIELD,
        })
            .EnableSellable(535000)
            .EnableBuildable(new BlueprintBuilder().DefinedBuild(BlueprintBuilder.SIMPLE_BUILD(425000), "Holo-Shield"))
            .BattlePreTurnFn(({ battle }) => {
                const rnd = rb(4, 8);
                battle.Friendly.increaseStat("shield", rnd);
                return { message: `Shield increased by ${rnd}.`, success: true };
            })
            .Build(),
        new AttachmentBuilder({
            name: "Energising Shield",
            description: `An energy charging module that slightly regenerates all energy types (including shields). Energy recharge: 2-5.`,
            strength: 16,
            techLevel: 4,
            type: AttachmentType.SHIELD,
        })
            .EnableSellable(617000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.SIMPLE_BUILD(505000), "Energising Shield")
            )
            .BattlePreTurnFn(({ battle }) => {
                const rnd = rb(2, 5);
                battle.Friendly.multiIncrease({ shield: rnd, w: rnd, e: rnd, c: rnd });
                return { message: `All energy types (including shield) increased by ${rnd}.`, success: true };
            })
            .Build(),
    ];
};

const TierOneAbility = (): Attachment[] => {
    return [
        new AttachmentBuilder({
            name: "Disruption Burst",
            description: `Deal 5 damage. Do 12 bonus damage for each energy type your opponent has higher than you (includes shield).`,
            strength: 10,
            techLevel: 2,
            type: AttachmentType.HEAVY,
            energyCost: [4, 2, 8],
            cooldown: 4,
        })
            .EnableSellable(23000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.SIMPLE_BUILD(13000), "Disruption Burst")
            )
            .addFunction("onBattleInvoked", ({ battle }) => {
                let dmg = 5;
                if (battle.Enemy.getStat("w") > battle.Friendly.getStat("w")) dmg += 12;
                if (battle.Enemy.getStat("e") > battle.Friendly.getStat("e")) dmg += 12;
                if (battle.Enemy.getStat("c") > battle.Friendly.getStat("c")) dmg += 12;
                if (battle.Enemy.getStat("shield") > battle.Friendly.getStat("shield")) dmg += 12;
                battle.Enemy.damage(dmg);
                return { success: true, message: `Disruption Burst: ${dmg} damage.` };
            })
            .Build(),

        new AttachmentBuilder({
            name: "Basic Capacitor",
            description: `Add 2 to maximum weapon, engine and computer energy. Doesn't end your turn.`,
            strength: 12,
            techLevel: 2,
            type: AttachmentType.HEAVY,
            energyCost: [3, 3, 3],
            cooldown: 3,
        })
            .EnableSellable(42000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.SIMPLE_BUILD(25000), "Basic Capacitor")
            )
            .addFunction("onBattleInvoked", ({ battle }) => {
                battle.Friendly.multiMaxIncrease({ w: 2, e: 2, c: 2 });
                return {
                    success: true,
                    message: `Basic Capacitor: +2 to weapon, engine and computer max.`,
                    keepTurn: true,
                };
            })
            .Build(),

        new AttachmentBuilder({
            name: "Zap",
            description: `Deal 5-12 damage based on opponents current hull. Doesn't end your turn.`,
            strength: 15,
            techLevel: 2,
            type: AttachmentType.HEAVY,
            energyCost: [4, 0, 0],
            cooldown: 0,
        })
            .EnableSellable(28000)
            .EnableBuildable(new BlueprintBuilder().DefinedBuild(BlueprintBuilder.SIMPLE_BUILD(19000), "Zap"))
            .addFunction("onBattleInvoked", ({ battle }) => {
                const ratio = battle.Enemy.getStat("hp") / battle.Enemy.getMaxOfStat("hp");
                const dmg = ~~(5 + 7 * ratio);
                battle.Enemy.damage(dmg);
                return { success: true, message: `Zap: +${dmg} damage.`, keepTurn: true };
            })
            .Build(),

        new AttachmentBuilder({
            name: "Viral Drone",
            description: `Drains 10 CPU from your opponent, +1 per 3 engine energy, adding twice the amount to your shield. Doesn't end your turn.`,
            strength: 18,
            techLevel: 3,
            type: AttachmentType.HEAVY,
            energyCost: [2, 2, 6],
            cooldown: 4,
        })
            .EnableSellable(48000)
            .EnableBuildable(new BlueprintBuilder().DefinedBuild(BlueprintBuilder.SIMPLE_BUILD(31000), "Viral Drone"))
            .addFunction("onBattleInvoked", ({ battle }) => {
                const drain = ~~(battle.Friendly.getStat("e") / 3) + 10;
                const enemyDrain = battle.Enemy.decreaseStat("c", drain);
                const friendlyGain = battle.Friendly.increaseStat("c", 2 * enemyDrain);

                return {
                    success: true,
                    message: `Viral Drone: Opponent lost ${enemyDrain} CPU energy. You gained ${friendlyGain} shield.`,
                    keepTurn: true,
                };
            })
            .Build(),

        new AttachmentBuilder({
            name: "Heat Seeking Missiles",
            description: `Does 1 damage per point of your opponents highest energy amount (excluding shield).`,
            strength: 15,
            techLevel: 2,
            type: AttachmentType.HEAVY,
            energyCost: [8, 5, 0],
            cooldown: 5,
        })
            .EnableSellable(27000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.SIMPLE_BUILD(15000), "Heat Seeking Missiles")
            )
            .addFunction("onBattleInvoked", ({ battle }) => {
                const highest = Math.max(
                    battle.Enemy.getStat("w"),
                    battle.Enemy.getStat("e"),
                    battle.Enemy.getStat("c")
                );
                const dmg = battle.Enemy.damage(highest);

                return {
                    success: true,
                    message: `Heat Seeking Missiles: +${dmg} damage.`,
                    keepTurn: false,
                };
            })
            .Build(),

        new AttachmentBuilder({
            name: "Shield Nullifier",
            description: `Prevent your opponents shield from regenerating for 3 turns.`,
            strength: 25,
            techLevel: 3,
            type: AttachmentType.HEAVY,
            energyCost: [0, 5, 7],
            cooldown: 6,
        })
            .EnableSellable(44000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.SIMPLE_BUILD(30000), "Shield Nullifier")
            )
            .addFunction("onBattleInvoked", ({ battle }) => {
                battle.Enemy.onPersist("shieldIncrease", 3, (player, amount) => {
                    player.decreaseStat("shield", amount);
                    battle.notify(`Shield Nullifier: Denied ${amount} shield.`);
                });
                return { success: true, message: `Shield Nullifier: Opponent cannot gain shield for 3 turns.` };
            })
            .Build(),

        new AttachmentBuilder({
            name: "Cyber Attack",
            description: `Drains 3 shield from your opponent for 5 turns, adding it to your own.`,
            strength: 13,
            techLevel: 3,
            type: AttachmentType.HEAVY,
            energyCost: [5, 0, 8],
            cooldown: 6,
        })
            .EnableSellable(27000)
            .EnableBuildable(new BlueprintBuilder().DefinedBuild(BlueprintBuilder.SIMPLE_BUILD(15000), "Cyber Attack"))
            .addFunction("onBattleInvoked", ({ battle }) => {
                battle.Enemy.onPersist("turnStart", 5, (player) => {
                    const amount = player.decreaseStat("shield", 3);
                    battle.getEnemyOf(player).increaseStat("shield", amount);
                    battle.notify(`Cyber Attach: Siphoned ${amount} shield.`);
                });
                return { success: true, message: `Cyber Attack: 5 turns of up to 3 shield siphon.` };
            })
            .Build(),

        new AttachmentBuilder({
            name: "Shield Transformer",
            description: `Drain up to 20 points from your weapon, engine and computing energy, adding it to your shield.`,
            strength: 15,
            techLevel: 3,
            type: AttachmentType.HEAVY,
            energyCost: [0, 0, 0],
            cooldown: 3,
        })
            .EnableSellable(52000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.SIMPLE_BUILD(39000), "Shield Transformer")
            )
            .addFunction("onBattleInvoked", ({ battle }) => {
                let inc = 0;
                inc += battle.Friendly.decreaseStat("w", 20);
                inc += battle.Friendly.decreaseStat("e", 20);
                inc += battle.Friendly.decreaseStat("c", 20);
                const amountIncrease = battle.Friendly.increaseStat("shield", inc);
                return {
                    success: true,
                    message: `Shield Transformer: Drained up to 20 from each energy type, adding ${amountIncrease} to shields.`,
                    keepTurn: true,
                };
            })
            .Build(),

        new AttachmentBuilder({
            name: "Repair Scanner",
            description: `Drains your Engine, adding 1 point to your hull for each point drained. Doesn't end your turn.`,
            strength: 19,
            techLevel: 4,
            type: AttachmentType.HEAVY,
            energyCost: [0, 0, 7],
            cooldown: 4,
        })
            .EnableSellable(25000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.SIMPLE_BUILD(15000), "Repair Scanner")
            )
            .addFunction("onBattleInvoked", ({ battle }) => {
                const engine = battle.Friendly.minimizeStat("e");
                const amountIncrease = battle.Friendly.increaseStat("shield", engine);
                return {
                    success: true,
                    message: `Repair Scanner: Drained ${engine} engine energy, adding ${amountIncrease} to hull.`,
                    keepTurn: true,
                };
            })
            .Build(),

        new AttachmentBuilder({
            name: "Energy Hyperdrive",
            description: `Increases all energy gains by 50% for 3 turns.`,
            strength: 26,
            techLevel: 4,
            type: AttachmentType.HEAVY,
            energyCost: [2, 10, 6],
            cooldown: 4,
        })
            .EnableSellable(51000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.SIMPLE_BUILD(39000), "Energy Hyperdrive")
            )
            .addFunction("onBattleInvoked", ({ battle }) => {
                battle.Friendly.onPersist("weaponIncrease", 3, (player, amount) => {
                    player.increaseStat("w", ~~(amount * 1.5));
                    battle.notify(`Increased players weapon by extra ${amount}.`);
                });
                battle.Friendly.onPersist("engineIncrease", 3, (player, amount) => {
                    player.increaseStat("e", ~~(amount * 1.5));
                    battle.notify(`Increased players engine by extra ${amount}.`);
                });
                battle.Friendly.onPersist("cpuIncrease", 3, (player, amount) => {
                    player.increaseStat("c", ~~(amount * 1.5));
                    battle.notify(`Increased players computer by extra ${amount}.`);
                });
                return {
                    success: true,
                    message: `Energy Hyperdrive: 50% increased weapon, engine and computer energy gain for 3 turns.`,
                };
            })
            .Build(),
    ];
};

const TierTwoAbility = (): Attachment[] => {
    return [
        new AttachmentBuilder({
            name: "Weapons Uplink",
            description: `Permanently increase maximum weapon energy by 20. Doesn't end your turn.`,
            strength: 23,
            techLevel: 4,
            type: AttachmentType.HEAVY,
            energyCost: [0, 10, 10],
            cooldown: 12,
        })
            .EnableSellable(622000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.SIMPLE_BUILD(450000), "Weapons Uplink")
            )
            .addFunction("onBattleInvoked", ({ battle }) => {
                battle.Friendly.increaseMaxOfStat("w", 20);
                return { success: true, message: `Weapons Uplink: +20 max weapon energy`, keepTurn: true };
            })
            .Build(),

        new AttachmentBuilder({
            name: "Improved Capacitor",
            description: `Add 4 to maximum Weapon, CPU and Engine energy. Doesn't end your turn.`,
            strength: 19,
            techLevel: 5,
            type: AttachmentType.HEAVY,
            energyCost: [5, 5, 5],
            cooldown: 4,
        })
            .EnableSellable(704000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.SIMPLE_BUILD(529000), "Improved Capacitor")
            )
            .addFunction("onBattleInvoked", ({ battle }) => {
                battle.Friendly.multiMaxIncrease({ w: 4, e: 4, c: 4 });
                return {
                    success: true,
                    message: `Improved Capacitor: +2 to weapon, engine and computer max.`,
                    keepTurn: true,
                };
            })
            .Build(),

        new AttachmentBuilder({
            name: "Armour Piercing Laser",
            description: `Damage: 1 per 3 weapon energy you have. Double damage if your opponent has less than 20 shield.`,
            strength: 23,
            techLevel: 5,
            type: AttachmentType.HEAVY,
            energyCost: [11, 0, 5],
            cooldown: 4,
        })
            .EnableSellable(562000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.SIMPLE_BUILD(409100), "Armour Piercing Laser")
            )
            .addFunction("onBattleInvoked", ({ battle }) => {
                let dmg = battle.Friendly.getStat("w") / 3;
                if (battle.Enemy.getStat("shield") < 20) dmg *= 2;
                battle.Enemy.damage(dmg);
                return {
                    success: true,
                    message: `Armour Piercing Laser: +${dmg} damage.`,
                    keepTurn: false,
                };
            })
            .Build(),

        new AttachmentBuilder({
            name: "Equalizer",
            description: `Does damage equal to your missing health, up to 30% of your opponents max health.`,
            strength: 27,
            techLevel: 5,
            type: AttachmentType.HEAVY,
            energyCost: [10, 4, 4],
            cooldown: 5,
        })
            .EnableSellable(504000)
            .EnableBuildable(new BlueprintBuilder().DefinedBuild(BlueprintBuilder.SIMPLE_BUILD(390000), "Equalizer"))
            .addFunction("onBattleInvoked", ({ battle }) => {
                let base = battle.Friendly.getMaxOfStat("hp") - battle.Friendly.getStat("hp");
                let cap = ~~(battle.Enemy.getMaxOfStat("hp") * 0.3);
                const dmg = Math.max(base, cap);

                battle.Enemy.damage(dmg);
                return {
                    success: true,
                    message: `Equalizer: +${dmg} damage.`,
                    keepTurn: false,
                };
            })
            .Build(),

        new AttachmentBuilder({
            name: "Weapons Surge",
            description: `Reduces cooldown on all your abilities by 2 turns. Doesn't end your turn.`,
            strength: 24,
            techLevel: 5,
            type: AttachmentType.HEAVY,
            energyCost: [6, 6, 6],
            cooldown: 5,
        })
            .EnableSellable(634000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.SIMPLE_BUILD(515000), "Weapons Surge")
            )
            .addFunction("onBattleInvoked", ({ battle }) => {
                battle.Friendly.reduceCooldowns(2);
                return {
                    success: true,
                    message: `Weapons Surge: Cooldowns reduced by 2 turns.`,
                    keepTurn: true,
                };
            })
            .Build(),

        new AttachmentBuilder({
            name: "Phase Adjuster",
            description: `Maximises both players energy (not shield). Doesn't end your turn.`,
            strength: 20,
            techLevel: 5,
            type: AttachmentType.HEAVY,
            energyCost: [0, 10, 8],
            cooldown: 6,
        })
            .EnableSellable(438000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.SIMPLE_BUILD(315000), "Phase Adjuster")
            )
            .addFunction("onBattleInvoked", ({ battle }) => {
                battle.Friendly.multiMaximize("w", "e", "c");
                battle.Enemy.multiMaximize("w", "e", "c");
                return {
                    success: true,
                    message: `Phase Adjuster: Maximized both players energies.`,
                    keepTurn: true,
                };
            })
            .Build(),

        new AttachmentBuilder({
            name: "Repair Bot",
            description: `Restore 20 hull points + 1% of your missing hull per 4 engine energy you have.`,
            strength: 32,
            techLevel: 5,
            type: AttachmentType.HEAVY,
            energyCost: [0, 12, 4],
            cooldown: 5,
        })
            .EnableSellable(473000)
            .EnableBuildable(new BlueprintBuilder().DefinedBuild(BlueprintBuilder.SIMPLE_BUILD(360000), "Repair Bot"))
            .addFunction("onBattleInvoked", ({ battle }) => {
                const player = battle.Friendly;
                let amount = 20;
                const onePercentHp = (player.getMaxOfStat("hp") - player.getStat("hp")) / 100;
                const multiplier = ~~(player.getStat("e") / 4);
                amount += ~~(onePercentHp * multiplier);
                player.increaseStat("hp", amount);
                return {
                    success: true,
                    message: `Repair Bot: +${amount} hull.`,
                    keepTurn: false,
                };
            })
            .Build(),

        new AttachmentBuilder({
            name: "Energy Beam",
            description: `Drains 10 from each of your opponents energy (including shield) adding it to your own.`,
            strength: 36,
            techLevel: 5,
            type: AttachmentType.HEAVY,
            energyCost: [8, 2, 12],
            cooldown: 4,
        })
            .EnableSellable(458000)
            .EnableBuildable(new BlueprintBuilder().DefinedBuild(BlueprintBuilder.SIMPLE_BUILD(347000), "Energy Beam"))
            .addFunction("onBattleInvoked", ({ battle }) => {
                const sDrain = battle.Enemy.decreaseStat("shield", 10);
                const wDrain = battle.Enemy.decreaseStat("w", 10);
                const eDrain = battle.Enemy.decreaseStat("e", 10);
                const cDrain = battle.Enemy.decreaseStat("c", 10);
                battle.Friendly.increaseStat("shield", sDrain);
                battle.Friendly.increaseStat("w", wDrain);
                battle.Friendly.increaseStat("e", eDrain);
                battle.Friendly.increaseStat("c", cDrain);
                return {
                    success: true,
                    message: `Energy Beam: Siphoned ${sDrain} shield, ${wDrain} weapon, ${eDrain} engine and ${cDrain} computer. `,
                    keepTurn: false,
                };
            })
            .Build(),

        new AttachmentBuilder({
            name: "Data Matrix",
            description: `Add 10 to your CPU energy. Doesn't end your turn.`,
            strength: 27,
            techLevel: 4,
            type: AttachmentType.HEAVY,
            energyCost: [0, 6, 0],
            cooldown: 3,
        })
            .EnableSellable(410000)
            .EnableBuildable(new BlueprintBuilder().DefinedBuild(BlueprintBuilder.SIMPLE_BUILD(298000), "Data Matrix"))
            .addFunction("onBattleInvoked", ({ battle }) => {
                const cGain = battle.Friendly.increaseStat("c", 10);
                return {
                    success: true,
                    message: `Data Matrix: +${cGain} computer energy. `,
                    keepTurn: true,
                };
            })
            .Build(),

        new AttachmentBuilder({
            name: "Phase Laser",
            description: `Damage: 10 + 1 per 3 weapon energy. If weapon energy is at max, does hull damage.`,
            strength: 38,
            techLevel: 5,
            type: AttachmentType.HEAVY,
            energyCost: [12, 0, 8],
            cooldown: 4,
        })
            .EnableSellable(694000)
            .EnableBuildable(new BlueprintBuilder().DefinedBuild(BlueprintBuilder.SIMPLE_BUILD(514000), "Phase Laser"))
            .addFunction("onBattleInvoked", ({ battle }) => {
                const isMax = battle.Friendly.getStat("w") == battle.Friendly.getMaxOfStat("w");
                const dmg = 10 + ~~(battle.Friendly.getStat("w") / 3);
                let msg: string;
                if (isMax) {
                    battle.Enemy.hullDamage(dmg);
                    msg = `Phase Laser: +${dmg} hull damage.`;
                } else {
                    battle.Enemy.damage(dmg);
                    msg = `Phase Laser: +${dmg} damage.`;
                }
                return {
                    success: true,
                    message: msg,
                    keepTurn: false,
                };
            })
            .Build(),
    ];
};

const TierFiveAbility = (): Attachment[] => {
    return [
        new AttachmentBuilder({
            name: "Erisnian Temporal Accelerator",
            description: `All abilities have their cooldown reduced to 0. Doesn't end your turn.`,
            strength: 140,
            techLevel: 9,
            type: AttachmentType.HEAVY,
            energyCost: [12, 12, 12],
            cooldown: 7,
        })
            .EnableSellable(4760000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(
                    BlueprintBuilder.ADVANCED_BUILD(4060000),
                    "Erisnian Temporal Accelerator"
                )
            )
            .addFunction("onBattleInvoked", ({ battle }) => {
                battle.Friendly.reduceCooldowns(99);
                return {
                    success: true,
                    message: `Erisnian Temporal Accelerator: All cooldowns reduced to 0.`,
                    keepTurn: true,
                };
            })
            .Build(),

        new AttachmentBuilder({
            name: "Alairan Dark Beam",
            description: `Reduces all opponent energy to 0, including shield.`,
            strength: 130,
            techLevel: 9,
            type: AttachmentType.HEAVY,
            energyCost: [14, 6, 18],
            cooldown: 6,
        })
            .EnableSellable(5120000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.ADVANCED_BUILD(4320000), "Alairan Dark Beam")
            )
            .addFunction("onBattleInvoked", ({ battle }) => {
                battle.Enemy.multiMinimize("shield", "w", "e", "c");
                return {
                    success: true,
                    message: `Alairan Dark Beam: All opponent energy reduced to 0.`,
                    keepTurn: false,
                };
            })
            .Build(),

        new AttachmentBuilder({
            name: "Quargic Prismatic Death Ray",
            description: `Halves your opponents current hull.`,
            strength: 165,
            techLevel: 10,
            type: AttachmentType.HEAVY,
            energyCost: [28, 18, 0],
            cooldown: 8,
        })
            .EnableSellable(6150000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(
                    BlueprintBuilder.ADVANCED_BUILD(5520000),
                    "Quargic Prismatic Death Ray"
                )
            )
            .addFunction("onBattleInvoked", ({ battle }) => {
                const dmg = battle.Enemy.getStat("hp");
                battle.Enemy.hullDamage(dmg);
                return {
                    success: true,
                    message: `Quargic Prismatic Death Ray: ${dmg} hull damage.`,
                    keepTurn: false,
                };
            })
            .Build(),

        new AttachmentBuilder({
            name: "Supernova Drive",
            description: `Maximises Weapon, CPU and Engine.`,
            strength: 134,
            techLevel: 9,
            type: AttachmentType.HEAVY,
            energyCost: [0, 6, 9],
            cooldown: 8,
        })
            .EnableSellable(5060000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.ADVANCED_BUILD(4320000), "Supernova Drive")
            )
            .addFunction("onBattleInvoked", ({ battle }) => {
                battle.Friendly.multiMaximize("w", "e", "c");
                return {
                    success: true,
                    message: `Supernova Drive: Maximized weapon, engine and computer.`,
                    keepTurn: false,
                };
            })
            .Build(),

        new AttachmentBuilder({
            name: "Lumissian Harbinger",
            description: `Damage: 1 per 2 points of any energy (excluding shield) across both players.`,
            strength: 152,
            techLevel: 10,
            type: AttachmentType.HEAVY,
            energyCost: [16, 12, 12],
            cooldown: 6,
        })
            .EnableSellable(5320000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.ADVANCED_BUILD(4520000), "Lumissian Harbinger")
            )
            .addFunction("onBattleInvoked", ({ battle }) => {
                const dmg = ~~(
                    (battle.Friendly.getStat("w") +
                        battle.Friendly.getStat("e") +
                        battle.Friendly.getStat("c") +
                        battle.Enemy.getStat("w") +
                        battle.Enemy.getStat("e") +
                        battle.Enemy.getStat("c")) /
                    2
                );
                return {
                    success: true,
                    message: `Lumissian Harbinger: +${dmg} damage.`,
                    keepTurn: false,
                };
            })
            .Build(),

        new AttachmentBuilder({
            name: "Ty'Linic Shield",
            description: `Reduces the opponents weapon energy to 0. Adds 5 shield for every point drained.`,
            strength: 139,
            techLevel: 10,
            type: AttachmentType.HEAVY,
            energyCost: [0, 17, 22],
            cooldown: 7,
        })
            .EnableSellable(4990000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.ADVANCED_BUILD(4120000), "Ty'Linic Shield")
            )
            .addFunction("onBattleInvoked", ({ battle }) => {
                const multiplier = battle.Enemy.minimizeStat("w");
                const shieldInc = battle.Friendly.increaseStat("shield", 5 * multiplier);
                return {
                    success: true,
                    message: `Ty'Linic Shield: -${multiplier} opponent weapon energy, +${shieldInc} shield.`,
                    keepTurn: false,
                };
            })
            .Build(),

        new AttachmentBuilder({
            name: "Terrian Superblaster",
            description: `Damage: 100. Doesn't end your turn.`,
            strength: 129,
            techLevel: 9,
            type: AttachmentType.HEAVY,
            energyCost: [20, 0, 0],
            cooldown: 4,
        })
            .EnableSellable(4010000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.ADVANCED_BUILD(3200000), "Terrian Superblaster")
            )
            .addFunction("onBattleInvoked", ({ battle }) => {
                battle.Enemy.damage(100);
                return {
                    success: true,
                    message: `Terrian Superblaster: +100 damage.`,
                    keepTurn: true,
                };
            })
            .Build(),

        new AttachmentBuilder({
            name: "Volian Solar Flare",
            description: `For 5 turns, drain 6 of each energy type from your opponent.`,
            strength: 147,
            techLevel: 9,
            type: AttachmentType.HEAVY,
            energyCost: [0, 20, 15],
            cooldown: 9,
        })
            .EnableSellable(5670000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.ADVANCED_BUILD(4770000), "Volian Solar Flare")
            )
            .addFunction("onBattleInvoked", ({ battle }) => {
                battle.Enemy.onPersist("turnStart", 5, (player) => {
                    player.multiDecrease({ w: 6, e: 6, c: 6 });
                    battle.notify(`Volian Solar Flare: 6 of each energy type drained.`);
                });
                return {
                    success: true,
                    message: `Volian Solar Flare: For 5 turns, each opponent energy type is drained by 6.`,
                    keepTurn: false,
                };
            })
            .Build(),

        new AttachmentBuilder({
            name: "Volian Modular Repair",
            description: `Drains your weapon energy. Adds 2 to hull and shield for each point removed.`,
            strength: 140,
            techLevel: 9,
            type: AttachmentType.HEAVY,
            energyCost: [0, 7, 11],
            cooldown: 5,
        })
            .EnableSellable(3980000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.ADVANCED_BUILD(3080000), "Volian Modular Repair")
            )
            .addFunction("onBattleInvoked", ({ battle }) => {
                const wDrain = battle.Friendly.minimizeStat("w");
                const hGain = battle.Friendly.increaseStat("hp", wDrain * 2);
                const sGain = battle.Friendly.increaseStat("shield", wDrain * 2);
                return {
                    success: true,
                    message: `Volian Modular Repair: -${wDrain} weapon, +${sGain} shield, +${hGain} hull.`,
                    keepTurn: false,
                };
            })
            .Build(),

        new AttachmentBuilder({
            name: "Kalian Pacifier",
            description: `For the next 3 turns, your opponent's weapon energy is drained. Deal 1% of max hull per 2 points drained.`,
            strength: 149,
            techLevel: 9,
            type: AttachmentType.HEAVY,
            energyCost: [0, 16, 18],
            cooldown: 9,
        })
            .EnableSellable(4970000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.ADVANCED_BUILD(4000000), "Kalian Pacifier")
            )
            .addFunction("onBattleInvoked", ({ battle }) => {
                battle.Enemy.onPersist("turnStart", 3, (player) => {
                    const wDrain = player.minimizeStat("w");
                    const onePercent = player.getMaxOfStat("hp") / 100;
                    const dmg = player.hullDamage(~~(onePercent * ~~(wDrain / 2)));
                    battle.notify(`Kalian Pacifier: ${dmg} hull damage taken. ${wDrain} weapon energy lost.`);
                });
                return {
                    success: true,
                    message: `Kalian Pacifier: For 3 turns, reduce your opponent's weapon energy to 0 and deal 1% of max hull per 2 points drained.`,
                    keepTurn: false,
                };
            })
            .Build(),
    ];
};

const TierSixAbility = (): Attachment[] => {
    return [
        new AttachmentBuilder({
            name: "Cosmic Unravelling",
            description: `Apply the Unravelling effect on your opponent for 10 turns, damaging 10% of their current hull each turn.`,
            strength: 195,
            techLevel: 11,
            type: AttachmentType.HEAVY,
            energyCost: [30, 30, 30],
            cooldown: 15,
        })
            .EnableSellable(9010000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.ADVANCED_BUILD(7510000), "Cosmic Unravelling")
            )
            .addFunction("onBattleInvoked", ({ battle }) => {
                battle.Enemy.onPersist("turnStart", 10, (player) => {
                    const dmg = player.getStat("hp");
                    player.hullDamage(dmg);
                    battle.notify(`Cosmic Unravelling: ${dmg} hull damage taken.`);
                });
                return {
                    success: true,
                    message: `Cosmic Unravelling: For 10 turns, your opponent will lose 10% of their current hull.`,
                    keepTurn: false,
                };
            })
            .Build(),

        new AttachmentBuilder({
            name: "Harmony",
            description: `Completely replenish your Hull, Shield, Weapon, CPU and Engine energy.`,
            strength: 186,
            techLevel: 11,
            type: AttachmentType.HEAVY,
            energyCost: [0, 20, 35],
            cooldown: 50,
        })
            .EnableSellable(11310000)
            .EnableBuildable(new BlueprintBuilder().DefinedBuild(BlueprintBuilder.ADVANCED_BUILD(9310000), "Harmony"))
            .addFunction("onBattleInvoked", ({ battle }) => {
                battle.Friendly.multiMaximize("hp", "shield", "w", "e", "c");
                return {
                    success: true,
                    message: `Harmony: Maximized all ship statistics.`,
                    keepTurn: false,
                };
            })
            .Build(),

        new AttachmentBuilder({
            name: "Transcend",
            description: `Apply the Transcendence effect on your ship for 3 turns, rendering its hull immune to damage.`,
            strength: 179,
            techLevel: 11,
            type: AttachmentType.HEAVY,
            energyCost: [6, 10, 13],
            cooldown: 12,
        })
            .EnableSellable(10600000)
            .EnableBuildable(new BlueprintBuilder().DefinedBuild(BlueprintBuilder.ADVANCED_BUILD(8110000), "Transcend"))
            .addFunction("onBattleInvoked", ({ battle }) => {
                battle.Friendly.onPersist("hullDecrease", 3, (player, amount) => {
                    const hGain = player.increaseStat("hp", amount);
                    battle.notify(`Transcend: Restored ${hGain} hull.`);
                });
                return {
                    success: true,
                    message: `Transcend: Replenish all hull damage for the next 3 turns.`,
                    keepTurn: false,
                };
            })
            .Build(),

        new AttachmentBuilder({
            name: "Gravitational Collapse",
            description: `Your opponent takes damage equal to the sum of their weapon, engine and CPU energy at the end of their turn, for the rest of the battle.`,
            strength: 195,
            techLevel: 11,
            type: AttachmentType.HEAVY,
            energyCost: [30, 20, 25],
            cooldown: 50,
        })
            .EnableSellable(12780000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.ADVANCED_BUILD(9510000), "Gravitational Collapse")
            )
            .addFunction("onBattleInvoked", ({ battle }) => {
                battle.Friendly.onPersist("turnEnd", 99, (player) => {
                    const dmg = player.getStat("w") + player.getStat("e") + player.getStat("c");
                    player.damage(dmg);
                    battle.notify(`Gravitational Collapse: ${dmg} damage taken.`);
                });
                return {
                    success: true,
                    message: `Gravitational Collapse: Opponent takes damage equal to the sum of their energies (not shield) for the rest of the game.`,
                    keepTurn: false,
                };
            })
            .Build(),
    ];
};

const MiningGenerator = (): Attachment[] => {
    return [
        new AttachmentBuilder({
            name: "Recovered Mining Laser",
            description: `Yield from mining increased by 20%.`,
            strength: 0,
            techLevel: 1,
            type: AttachmentType.MINER,
        })
            .EnableSellable(13000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.SIMPLE_BUILD(5000), "Recovered Mining Laser")
            )
            .addFunction("onMine", ({ asteroid }) => {
                asteroid.buffCollection(1.2);
                return { success: true, message: "Recovered Mining Laser: 20% increased mining gains." };
            })
            .Build(),

        new AttachmentBuilder({
            name: "Basic Mining Laser",
            description: `Yield from mining increased by 30%.`,
            strength: 0,
            techLevel: 1,
            type: AttachmentType.MINER,
        })
            .EnableSellable(65000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.SIMPLE_BUILD(36000), "Basic Mining Laser")
            )
            .addFunction("onMine", ({ asteroid }) => {
                asteroid.buffCollection(1.3);
                return { success: true, message: "30% increased mining gains." };
            })
            .Build(),

        new AttachmentBuilder({
            name: "Hardened Mining Laser",
            description: `Yield from mining increased by 40%.`,
            strength: 0,
            techLevel: 2,
            type: AttachmentType.MINER,
        })
            .EnableSellable(156000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.SIMPLE_BUILD(100000), "Hardened Mining Laser")
            )
            .addFunction("onMine", ({ asteroid }) => {
                asteroid.buffCollection(1.4);
                return { success: true, message: "Hardened Mining Laser: 40% increased mining gains." };
            })
            .Build(),

        new AttachmentBuilder({
            name: "Accelerant Mining Laser",
            description: `Yield from mining increased by 50%.`,
            strength: 0,
            techLevel: 3,
            type: AttachmentType.MINER,
        })
            .EnableSellable(275000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.SIMPLE_BUILD(197000), "Accelerant Mining Laser")
            )
            .addFunction("onMine", ({ asteroid }) => {
                asteroid.buffCollection(1.5);
                return { success: true, message: "Accelerant Mining Laser: 50% increased mining gains." };
            })
            .Build(),

        new AttachmentBuilder({
            name: "Industrial Mining Laser",
            description: `Yield from mining increased by 60%.`,
            strength: 0,
            techLevel: 4,
            type: AttachmentType.MINER,
        })
            .EnableSellable(398000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.MODERATE_BUILD(295000), "Industrial Mining Laser")
            )
            .addFunction("onMine", ({ asteroid }) => {
                asteroid.buffCollection(1.6);
                return { success: true, message: "Industrial Mining Laser: 60% increased mining gains." };
            })
            .Build(),

        new AttachmentBuilder({
            name: "Advanced Mining Laser",
            description: `Yield from mining increased by 70%.`,
            strength: 0,
            techLevel: 5,
            type: AttachmentType.MINER,
        })
            .EnableSellable(590000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.MODERATE_BUILD(485000), "Advanced Mining Laser")
            )
            .addFunction("onMine", ({ asteroid }) => {
                asteroid.buffCollection(1.7);
                return { success: true, message: "Advanced Mining Laser: 70% increased mining gains." };
            })
            .Build(),
        new AttachmentBuilder({
            name: "Enterprise Grade Mining Laser",
            description: `Yield from mining increased by 80%.`,
            strength: 0,
            techLevel: 6,
            type: AttachmentType.MINER,
        })
            .EnableSellable(670000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(
                    BlueprintBuilder.MODERATE_BUILD(545000),
                    "Enterprise Grade Mining Laser"
                )
            )
            .addFunction("onMine", ({ asteroid }) => {
                asteroid.buffCollection(1.8);
                return { success: true, message: "Enterprise Grade Mining Laser: 80% increased mining gains." };
            })
            .Build(),
        new AttachmentBuilder({
            name: "Superior Mining Laser",
            description: `Yield from mining increased by 90%.`,
            strength: 0,
            techLevel: 7,
            type: AttachmentType.MINER,
        })
            .EnableSellable(931000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.ADVANCED_BUILD(780000), "Superior Mining Laser")
            )
            .addFunction("onMine", ({ asteroid }) => {
                asteroid.buffCollection(1.9);
                return { success: true, message: "Superior Mining Laser: 90% increased mining gains." };
            })
            .Build(),
        new AttachmentBuilder({
            name: "Precision Mining Laser",
            description: `Yield from mining doubled.`,
            strength: 0,
            techLevel: 8,
            type: AttachmentType.MINER,
        })
            .EnableSellable(1190000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.ADVANCED_BUILD(995000), "Precision Mining Laser")
            )
            .addFunction("onMine", ({ asteroid }) => {
                asteroid.buffCollection(2);
                return { success: true, message: "Precision Mining Laser: double mining gains." };
            })
            .Build(),
        new AttachmentBuilder({
            name: "Kalian Perfected Mining Laser",
            description: `Mining yields 150% more resources.`,
            strength: 0,
            techLevel: 9,
            type: AttachmentType.MINER,
        })
            .EnableSellable(2250000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(
                    BlueprintBuilder.ADVANCED_BUILD(1950000),
                    "Kalian Perfected Mining Laser"
                )
            )
            .addFunction("onMine", ({ asteroid }) => {
                asteroid.buffCollection(2.5);
                return { success: true, message: "Kalian Perfected Mining Laser: 150% increased mining yield." };
            })
            .Build(),
        new AttachmentBuilder({
            name: "Alairan UltraExtractor",
            description: `Triple mining yield. Double gain from public asteroids.`,
            strength: 0,
            techLevel: 10,
            type: AttachmentType.MINER,
        })
            .EnableSellable(6755000)
            .EnableBuildable(
                new BlueprintBuilder().DefinedBuild(BlueprintBuilder.ADVANCED_BUILD(5855000), "Alairan UltraExtractor")
            )
            .addFunction("onMine", ({ asteroid }) => {
                asteroid.buffCollection(3);
                if (asteroid.hasTag("public")) {
                    asteroid.buffCollection(2);
                }
                return {
                    success: true,
                    message: "Alairan UltraExtractor: Triple mining yield. Double gain from public asteroids.",
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
function rb(lo: number, hi: number) {
    return ~~(Math.random() * (lo - hi + 1) + lo);
}
