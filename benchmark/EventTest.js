const events = require("events");

const myEmitter = new events.EventEmitter();

const storage = new Map();

const fnA = (amount) => {
	console.log("A");
};
const fnB = (amount) => {
	console.log("B");
};

myEmitter.on("shieldIncrease", fnA);
myEmitter.on("shieldIncrease", fnB);

storage.set(["shieldIncrease", fnA], 3);

for (let i = 0; i < 5; i++) {
	myEmitter.emit("shieldIncrease");
	storage.forEach((duration, event) => {
		storage.set(event, duration - 1);
		if (duration - 1 == -1) {
			myEmitter.removeListener(event[0], event[1]);
		}
	});
}
