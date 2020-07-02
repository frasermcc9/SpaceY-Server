import { GameAsset, Sellable, ISellInfo, IGameAsset, IBlueprintInfo, Buildable } from "./GameAsset";
import { Client } from "../../Client/Client";
import { Player } from "./Player/Player";

export abstract class GameAssetDecorator implements IGameAsset {
	protected asset: GameAsset;

	public constructor(asset: GameAsset) {
		this.asset = asset;
	}

	public get Name(): string {
		return this.asset.Name;
	}
	public get Description(): string {
		return this.asset.Description;
	}
}

export class SellableDecorator extends GameAssetDecorator implements Sellable {
	public constructor(item: string | GameAsset) {
		if (typeof item == "string") {
			const obj = Client.Reg.AnyResolve(item);
			if (obj == undefined) throw new TypeError(`Item named ${item} instantiated as SellableDecorator when item does not exist in registry.`);
			super(obj);
		} else super(item);
	}

	public get PriceData(): ISellInfo {
		return this.asset.Cost == undefined ? { success: false } : { success: true, cost: this.asset.Cost };
	}
}

export class BuildableDecorator extends GameAssetDecorator implements Buildable {
	public constructor(item: GameAsset) {
		super(item);
	}

	public get Blueprint(): IBlueprintInfo {
		return this.asset.Blueprint;
	}
	/**
	 * @param player
	 * @returns codes: 200-Success, 403-Insufficient resources, 405-Item not buildable, 500-Internal Error
	 */
	public async Build(player: Player): Promise<{ code: number; failures: string[] }> {
		const bp = this.Blueprint.blueprint;
		if (bp == undefined) return { code: 405, failures: [] };
		const result = await player.InventorySubtract("materials", bp);
		if (result.code != 200) return result;
		const editResult = await player.AutoInventoryEdit(this.asset.Name, 1);
		if (editResult.success) return result;
		else return { code: 500, failures: [] };
	}
}
