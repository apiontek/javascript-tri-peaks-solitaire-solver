const suits = {
  C: "Clubs",
  D: "Diamonds",
  H: "Hearts",
  S: "Spades",
};
const ranks = {
  A: "Ace",
  2: "Two",
  3: "Three",
  4: "Four",
  5: "Five",
  6: "Six",
  7: "Seven",
  8: "Eight",
  9: "Nine",
  T: "Ten",
  J: "Jack",
  Q: "Queen",
  K: "King",
};
const deck = Object.keys(suits).flatMap((suit) => {
  return Object.keys(ranks).map((cval) => {
    return cval + suit;
  });
});

export { suits, ranks, deck };
