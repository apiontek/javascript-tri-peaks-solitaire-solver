import "../scss/style.scss";
import Alpine from "alpinejs";
import cardSvgs from "./cardSvgs";
import SolverWorker from "./solverWorker?worker";

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
  solvingInProgress: false,
});

// card preview component logic
Alpine.data("playingCardsPreview", () => ({
  cardSvgs,
  cardsBySlice(start, length) {
    return this.$store.global.cardsToSolve.slice(start, length);
  },
  cardSvg(card) {
    return card === 0 ? this.cardSvgs["2B"] : this.cardSvgs[card];
  },
}));

// input component logic
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

// long-running solve messages
const encouragements = [
  "Hang in there!",
  "Let go like a bird flies, not fighting the wind but gliding on it",
  "Stay patient and trust the journey.",
  "Everything is coming together…",
  "Solitaire is a journey, not a destination.",
  "For things to reveal themselves to us, we need to be ready to abandon our views about them.",
  "Patience is bitter, but its fruit is sweet.",
  "Strive for progress, not perfection.",
  "I wish only to be alive and to experience this living to the fullest.",
  "This too shall pass.",
  "Patience is the companion of wisdom.",
  "The mountains are calling and I must go.",
  "Give time time.",
  "If you find a path with no obstacles, it probably doesn't lead anywhere",
  "A smooth sea never made a good sailor.",
  "Stick with the winners.",
  "I immerse myself in the experience of living without having to evaluate or understand it.",
  "Why fit in when you were born to stand out?",
  "Don't let yesterday take up too much of today.",
  "The least I owe the mountains is a body.",
  "Getting so close!",
  "Many people think excitement is happiness. But when you are excited you are not peaceful.",
  "Misery is optional.",
  "Mistakes are proof that you're trying.",
  "Life would be so much easier if we only had the source code.",
  "A computer once beat me at chess, but it was no match for me at kickboxing.",
  "Patience is not simply the ability to wait, it's how we behave while we're waiting.",
  "We must let go of the life we have planned so as to accept the one that is waiting for us.",
  "Somewhere, something incredible is waiting to be known.",
  "If you spend your whole life waiting for the storm, you'll never enjoy the sunshine.",
];

// game solving component logic
Alpine.data("gameSolving", () => ({
  encouragements,
  solverWorker: null,
  headerText: "Solution will go here:",
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
  },
  onInit() {
    this.solverWorker = new SolverWorker();
    this.solverWorker.addEventListener("message", async (e) => {
      if (e.data.msg === "solve-progress") {
        this.nodesTried++;
        this.moveCount = e.data.moveCount;
        this.statusMessages[0] = `Most moves found so far: ${this.moveCount}`;

        let newFloor = Math.floor(this.nodesTried / 10000) * 10000;
        if (newFloor > this.nodesTriedFloor) {
          this.nodesTriedFloor = newFloor;
          if (this.nodesTriedFloor > 50000) {
            this.statusMessages[1] = `Over ${this.nodesTriedFloor.toLocaleString(
              "en"
            )} possibilities tried. Still working…`;
          }
          if (this.nodesTriedFloor % 250000 === 0) {
            let randInRange = Math.floor(
              Math.random() * this.encouragements.length
            );
            this.statusMessages.push(this.encouragements[randInRange]);
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
}));

window.Alpine = Alpine;

Alpine.start();
