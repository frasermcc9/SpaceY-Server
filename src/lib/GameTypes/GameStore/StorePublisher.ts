import { EventEmitter } from "events";
import { BaseStore } from "./BaseStore";
import { GameAsset } from "../GameAsset/GameAsset";

export class StorePublisher extends EventEmitter {
	private intervals = new Map<string, NodeJS.Timeout>();

	public StartLoop(loopName: string, eventName: string, interval: number) {
		const handle = setInterval(() => {
			this.emit(eventName);
		}, 1000 * interval);
		this.intervals.set(loopName, handle);
		return this;
	}

	public TerminateLoop(loopName: string): boolean {
		const handle = this.intervals.get(loopName);
		if (handle) clearInterval(handle);
		return this.intervals.delete(loopName);
	}

	public RegisterStore<K extends GameAsset>(baseStore: BaseStore<K>, updateInterval: number, storeName: string) {
		this.on("Update", () => {
			baseStore.Update();
		});
		return this.StartLoop(storeName, "Update", updateInterval);
	}
	public DeregisterStore(Store: string) {
		return this.TerminateLoop(Store);
	}
}
