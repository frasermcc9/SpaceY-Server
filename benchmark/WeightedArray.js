const { performance } = require("perf_hooks");

const k = 550; //number of random extracts
const maxW = 12; //maximum weight
const n = 40; //iterations

const Weight = [];
const Selections = [];
for (let i = 0; i < n; i++) {
	Weight.push(~~Math.random() * maxW);
	Selections.push(Math.floor(Math.random()));
}

FlatArray();
WeightSum();

function FlatArray() {
	const TimerStart = performance.now();

	const out = [];
	for (let i = 0; i < Selections.length; ++i) {
		for (let j = 0; j < Weight[i]; ++j) {
			out.push(Selections[i]);
		}
	}
	const Final = [];
	for (let i = 0; i < k; i++) {
		Final.push(out[Math.floor(Math.random() * out.length)]);
	}

	const TimerEnd = performance.now();
	console.log(`FlatArray method: ${TimerEnd - TimerStart}`);
}

function WeightSum() {
	const TimerStart = performance.now();

	const Final2 = [];
	var sum = Weight.reduce((acc, el) => acc + el, 0);
	var acc = 0;
	var chances = Weight.map((el) => (acc = el + acc));
	for (let i = 0; i < k; ++i) {
		var rand = Math.random() * sum;
		Final2.push(Selections[chances.filter((el) => el <= rand).length]);
	}

	const TimerEnd = performance.now();
	console.log(`WeightSum method: ${TimerEnd - TimerStart}`);
}

