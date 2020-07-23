for (let i = 0; i <= 20; i++) {
    console.log(`${i} - ${fx(i)}`);
}
for (let i = 0; i <= 20; i++) {
    console.log(`${i} - ${fx(i - 1)}`);
}
for (let i = 0; i <= 20; i++) {
    console.log(`${i} - ${fx2(i)}`);
}

function fx(i) {
    return 2 * ~~(i / 5) + Math.ceil((i % 5) / 2);
}
function fx2(i) {
    return ~~(i / 5);
}
