import { solve } from "./solver";

const runSolve = async (game) => {
  let result = await solve(game.slice(0, 28), game.slice(28, 52), self);
  postMessage({ msg: "solve-result", result: result });
};

addEventListener("message", async (e) => {
  if (e.data.msg === "try-to-solve") {
    runSolve(e.data.game);
  }
});
