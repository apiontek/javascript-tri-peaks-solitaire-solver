import encouragements from "./encouragements";
import SolverWorker from "./solverWorker?worker";

export default {
  encouragements,
  encourageIndex: null,
  solverWorker: null,
  headerText: "Solution",
  moveCount: 23,
  statusMessages: [],
  solutionMoves: [],
  nodesTried: 0,
  nodesTriedFloor: 0,
  reset() {
    this.$store.global.solvingInProgress = false;
    this.moveCount = 0;
    this.statusMessages = [];
    this.nodesTried = 0;
    this.nodesTriedFloor = 0;
    this.encourageIndex = null;
  },
  onInit() {
    this.solverWorker = new SolverWorker();
    this.solverWorker.addEventListener("message", async (e) => {
      if (e.data.msg === "solve-progress") {
        this.nodesTried++;
        this.moveCount = e.data.moveCount;
        this.statusMessages[0] = `${this.moveCount} card-clearing moves found so far.`;

        let newFloor = Math.floor(this.nodesTried / 10000) * 10000;
        if (newFloor > this.nodesTriedFloor) {
          this.nodesTriedFloor = newFloor;
          if (this.nodesTriedFloor > 50000) {
            this.statusMessages[1] = `Over ${this.nodesTriedFloor.toLocaleString(
              "en"
            )} possibilities tried. Still working…`;
          }
          if (this.nodesTriedFloor % 250000 === 0) {
            if (this.encourageIndex === null) {
              this.encourageIndex = Math.floor(
                Math.random() * this.encouragements.length
              );
            }
            this.statusMessages.splice(
              2,
              0,
              this.encouragements[this.encourageIndex]
            );
            let newEncourageIndex = this.encourageIndex + 1;
            this.encourageIndex =
              newEncourageIndex === this.encouragements.length
                ? 0
                : newEncourageIndex;
          }
        }
      } else if (e.data.msg === "solve-result") {
        if (e.data.result[0]) {
          this.headerText = "Solution found:";
          this.solutionMoves = e.data.result[1];
          this.reset();
        } else {
          this.headerText = "Could not solve. Best moves found:";
          this.solutionMoves = e.data.result[2];
          this.reset();
        }
      }
    });
  },
  async startSolver() {
    this.headerText = "Solving…";
    this.solutionMoves = [];
    this.$store.global.solvingInProgress = true;
    await this.$nextTick();
    let game = JSON.parse(JSON.stringify(this.$store.global.cardsToSolve));
    this.solverWorker.postMessage({ msg: "try-to-solve", game: game });
  },
};
