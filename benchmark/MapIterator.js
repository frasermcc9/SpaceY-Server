const { performance } = require("perf_hooks");

const n = 10; //array size

const Base = new Map();
for (let i = 0; i < n; i++) {
    Base.set(i, Math.random() * 1000);
}

DirectForEach();
Spread();

function DirectForEach() {
    const copy = new Map(Base);
    const TimerStart = performance.now();

    copy.forEach((_, key) => copy.set(key, 0));

    const TimerEnd = performance.now();
    console.log(`ForLoop method: ${TimerEnd - TimerStart}`);
}

function Spread() {
    const copy = new Map(Base);
    const TimerStart = performance.now();

    [...copy.keys()].forEach((key) => {
        copy.set(key, false);
    });

    const TimerEnd = performance.now();
    console.log(`Spread method: ${TimerEnd - TimerStart}`);
}
