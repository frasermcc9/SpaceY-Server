const { performance } = require("perf_hooks");

const n = 1000000; //array size

const Base = [];
for (let i = 0; i < n; i++) {
    Base.push(Math.random() * 1000);
}

ForLoop();
Spread();
Slice();
ArrayFrom();
Concat();

function ForLoop() {
    const TimerStart = performance.now();
    const newArray = [];
    for (let i = 0; i < n; i++) {
        newArray.push(Base[i]);
    }
    const TimerEnd = performance.now();
    console.log(`ForLoop method: ${TimerEnd - TimerStart}`);
}

function Spread() {
    const TimerStart = performance.now();
    const newArray = [...Base];
    const TimerEnd = performance.now();
    console.log(`Spread method: ${TimerEnd - TimerStart}`);
}
function Slice() {
    const TimerStart = performance.now();
    const newArray = Base.slice();
    const TimerEnd = performance.now();
    console.log(`Slice method: ${TimerEnd - TimerStart}`);
}
function ArrayFrom() {
    const TimerStart = performance.now();
    const newArray = Array.from(Base);
    const TimerEnd = performance.now();
    console.log(`ArrayFrom method: ${TimerEnd - TimerStart}`);
}
function Concat() {
    const TimerStart = performance.now();
    const newArray = Base.concat();
    const TimerEnd = performance.now();
    console.log(`Concat method: ${TimerEnd - TimerStart}`);
}
