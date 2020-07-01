"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorePublisher = void 0;
const events_1 = require("events");
class StorePublisher extends events_1.EventEmitter {
    constructor() {
        super(...arguments);
        this.intervals = new Map();
    }
    StartLoop(loopName, eventName, interval) {
        const handle = setInterval(() => {
            this.emit(eventName);
        }, 1000 * interval);
        this.intervals.set(loopName, handle);
        return this;
    }
    TerminateLoop(loopName) {
        const handle = this.intervals.get(loopName);
        if (handle)
            clearInterval(handle);
        return this.intervals.delete(loopName);
    }
    RegisterStore(baseStore, updateInterval, storeName) {
        this.on("Update", () => {
            baseStore.Update();
        });
        return this.StartLoop(storeName, "Update", updateInterval);
    }
    DeregisterStore(Store) {
        return this.TerminateLoop(Store);
    }
}
exports.StorePublisher = StorePublisher;
