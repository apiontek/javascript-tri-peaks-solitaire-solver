import { deck } from "./deck";

export default {
  deck,
  cardsToSolve: Array(deck.length).fill(0),
  solvingInProgress: false,
};
