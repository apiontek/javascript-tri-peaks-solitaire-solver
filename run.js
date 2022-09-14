const solver = require("./solver");

// // Easy MS Tripeaks level
// let userCardsInput = " js as ts ad tc qd 9s 4s 2h 9h 8s jh 6c 3d ks 5s  5c 6h 9c 2c  ac 8c 6d 5d th 8d kc kd 9d 4c 5h 8h qh 6s "
// userCardsInput = " 2d 7c 7d 3s kh qs jc 2s 7s " + userCardsInput
// userCardsInput = " qc 3h 3c 7h td 4h " + userCardsInput
// userCardsInput = " jd 4d ah " + userCardsInput
// Unsolvable board
let userCardsInput =
  "2D 6D AD 9S 4C 7C 7S 7D 9C 2S AC 8D 6S 6H 3C 5H QS JS 4S JH 5C AS 3H 3S AH TD 4D 5S TH 7H KS QH 6C KD 8S 2C TC JC 5D 3D 2H TS 4H JD KC KH 8H QC 8C QD 9D 9H";

// continue!
userCardsInput = userCardsInput.toUpperCase();
let userCards = userCardsInput.split(" ").filter((s) => s);
userCards = Array(52 - userCards.length)
  .fill("0")
  .concat(userCards)
  .map((c) => (c === "0" ? 0 : c));

let start_time = process.hrtime.bigint();
let result = solver.solve(
  userCards.slice(0, 28),
  userCards.slice(28, 52),
  0,
  []
);
let end_time = process.hrtime.bigint();

let resultStr = JSON.stringify(result, null, 2);
process.stdout.write(resultStr + "\n");
process.stdout.write(`moves array length: ${result[1].length}\n`);
process.stdout.write(`best moves array length: ${result[2].length}\n`);

const MS_PER_NS = 1e-6;
const NS_PER_SEC = 1e9;
let elapsedMs = Number(end_time - start_time) * MS_PER_NS;
let elapsedS = Number(end_time - start_time) / NS_PER_SEC;
process.stdout.write(`solving took: ${elapsedMs} milliseconds\n`);
process.stdout.write(`solving took: ${elapsedS} seconds\n`);
