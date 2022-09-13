import "./style.scss";
import Alpine from "alpinejs";
import cardSvgs from "./cardSvgs";

// Some helpful constants
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

// Do some SVG processing
const cardSvgTitle = (ckey) => {
  return deck.includes(ckey)
    ? `${ranks[ckey[0]]} of ${suits[ckey[1]]}`
    : "Unknown Card";
};
Object.keys(cardSvgs).forEach((ckey) => {
  var cardDoc = new DOMParser().parseFromString(
    cardSvgs[ckey],
    "image/svg+xml"
  );
  var svgRoot = cardDoc.documentElement;
  svgRoot.removeAttribute("height");
  svgRoot.removeAttribute("width");
  svgRoot.removeAttribute("class");
  var titleEl = cardDoc.createElementNS(
    svgRoot.lookupNamespaceURI(null),
    "title"
  );
  var titleText = document.createTextNode(cardSvgTitle(ckey));
  titleEl.appendChild(titleText);
  svgRoot.insertBefore(titleEl, svgRoot.firstElementChild);
  cardSvgs[ckey] = new XMLSerializer().serializeToString(
    cardDoc.documentElement
  );
});

// Keep some constants in global store for components
Alpine.store("global", {
  deck,
  cardsToSolve: Array(deck.length).fill(0),
});

// card preview component data
Alpine.data("playingCardsPreview", () => ({
  cardSvgs,
  cardsBySlice(start, length) {
    return this.$store.global.cardsToSolve.slice(start, length);
  },
  cardSvg(card) {
    return card === 0 ? this.cardSvgs["2B"] : this.cardSvgs[card];
  },
}));

// input component data
Alpine.data("cardsInputForm", () => ({
  // "constants" for validation etc
  nonAlphaNumRegEx: /[\W_]+/g,

  // input validation
  inputValue: "",
  validCards: [],
  dupedCards: [],
  invalidCards: [],
  validMessages: [],
  invalidMessages: [],
  get isFormValid() {
    return this.isValidCardsLengthInRange && this.invalidMessages.length === 0;
  },
  get isValidCardsLengthTooSmall() {
    return this.validCards.length < 34;
  },
  get isValidCardsLengthTooBig() {
    return this.validCards.length > this.$store.global.deck.length;
  },
  get isValidCardsLengthInRange() {
    return !this.isValidCardsLengthTooSmall && !this.isValidCardsLengthTooBig;
  },
  validateCardsInput() {
    // reset arrays and parse the input
    this.validCards = [];
    this.invalidCards = [];
    this.dupedCards = [];
    this.validMessages = [];
    this.invalidMessages = [];
    // handle if input has alphanum chars - treat them as delimeters
    // if no alphanum chars, split by 2 chars except for 0
    let userCards = this.nonAlphaNumRegEx.test(this.inputValue)
      ? this.inputValue
          .toUpperCase()
          .replace(this.nonAlphaNumRegEx, " ")
          .split(" ")
          .filter((c) => c)
      : this.inputValue
          .toUpperCase()
          .split(/0|(..)/g)
          .filter((c) => c !== "")
          .map((c) => (!c ? "0" : c));

    // check the input
    userCards.forEach((card) => {
      if (card === "0") {
        // user marking a slot with an unknown card
        this.validCards.push(card);
      } else if (this.validCards.includes(card)) {
        // this card was already seen in user's input, now it's a duplicate
        this.dupedCards.push(card);
      } else if (this.$store.global.deck.includes(card)) {
        // not a duplicate, and in the reference deck? Valid, add to valid cards
        this.validCards.push(card);
      } else {
        // not a dupe, but not in reference deck: invalid, add to invalid cards
        this.invalidCards.push(card);
      }
    });

    // set validation messages based on length
    if (this.isValidCardsLengthTooSmall) {
      this.invalidMessages.push(`Must enter at least 34 cards`);
    } else if (this.isValidCardsLengthTooBig) {
      this.invalidMessages.push(
        `Must not enter more than ${this.$store.global.deck.length} cards`
      );
    }
    if (this.validCards.slice(this.validCards.length - 34).includes("0")) {
      this.invalidMessages.push(
        `Stock + bottom row (last 34 cards) must not contain unknown ('0') cards`
      );
    }

    // set other validation messages
    if (this.dupedCards.length > 0) {
      let s = this.dupedCards.length > 1 ? "s" : "";
      this.invalidMessages.push(
        `${this.dupedCards.length} duplicate card${s}: ${this.dupedCards.join(
          " "
        )}`
      );
    }
    if (this.invalidCards.length > 0) {
      let s = this.invalidCards.length > 1 ? "s" : "";
      this.invalidMessages.push(
        `${this.invalidCards.length} invalid card${s}: ${this.invalidCards.join(
          " "
        )}`
      );
    }
    if (this.validCards.length > 0) {
      let s = this.validCards.length > 1 ? "s" : "";
      this.validMessages.push(
        `${this.validCards.length} valid card${s}: ${this.validCards.join(" ")}`
      );
    }

    // set the game cards to try solving, based on current input
    this.$store.global.cardsToSolve = Array(
      this.$store.global.deck.length - this.validCards.length
    )
      .fill(0)
      .concat(this.validCards)
      .map((c) => (c === "0" ? 0 : c));
  },
}));

window.Alpine = Alpine;

Alpine.start();
