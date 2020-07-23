const { performance } = require("perf_hooks");

const n = 10000; //array size
const k = 1000000; //iterations

const arr1 = [];
const arr2 = [];
for (let i = 0; i < n; i++) {
    arr1.push(Math.random());
    arr2.push(Math.random());
}

let concatTime = 0;
let spreadTime = 0;

for (let i = 0; i < k; i++) {
    Concat();
}
for (let i = 0; i < k; i++) {
    Spread();
}

console.log(`Concat method: ${concatTime}`);
console.log(`Spread method: ${spreadTime}`);

function Concat() {
    const copy1 = new Array(arr1);
    const copy2 = new Array(arr2);
    const TimerStart = performance.now();

    const result = copy1.concat(copy2);

    const TimerEnd = performance.now();
    concatTime += TimerEnd - TimerStart;
}

function Spread() {
    const copy1 = new Array(arr1);
    const copy2 = new Array(arr2);
    const TimerStart = performance.now();

    const result = copy1.push(...copy2);

    const TimerEnd = performance.now();
    spreadTime += TimerEnd - TimerStart;
}
