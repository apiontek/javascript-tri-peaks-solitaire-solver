import cardSvgs from "./cardSvgs";

export default {
  cardSvgs,
  cardsBySlice(start, length) {
    return this.$store.global.cardsToSolve.slice(start, length);
  },
  cardSvg(card) {
    return card === 0 ? this.cardSvgs["2B"] : this.cardSvgs[card];
  },
};
