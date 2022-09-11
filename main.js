import "./style.scss";
import "./style-cards.css";
import Alpine from "alpinejs";
// import 'bootstrap/dist/js/bootstrap'

Alpine.store('global', {
  cardsToSolve: Array(52).fill(0)
})

Alpine.data("playingCardsPreview", () => ({
  rankText: {
    'A': 'Ace',
    '2': 'Two',
    '3': 'Three',
    '4': 'Four',
    '5': 'Five',
    '6': 'Six',
    '7': 'Seven',
    '8': 'Eight',
    '9': 'Nine',
    'T': 'Ten',
    'J': 'Jack',
    'Q': 'Queen',
    'K': 'King'
  },
  suitText: {
    'C': 'Clubs',
    'D': 'Diamonds',
    'H': 'Hearts',
    'S': 'Spades'
  },
  rankSlug(rank) {
    return `rank-${rank === 'T' ? '10' : rank}`
  },
  suitSlug: {
    'C': 'clubs',
    'D': 'diams',
    'H': 'hearts',
    'S': 'spades'
  },
  cardHtml(card, index) {
    if (card === '0' || card === 0) {
      return `<abbr title="Unknown" class="card" style="z-index:${this.stockCard(index)};"></abbr>`
    } else {
      return `<abbr title="${this.rankText[card[0]]} of ${this.suitText[card[1]]}" class="card ${this.rankSlug(card[0])} ${this.suitSlug[card[1]]}" style="z-index:${this.stockCard(index)};"><abbr class="rank" aria-hidden="true">${card[0]}</abbr><abbr class="suit" aria-hidden="true">&${this.suitSlug[card[1]]};</abbr><abbr class="suit-b" aria-hidden="true">&${this.suitSlug[card[1]]};</abbr><abbr class="rank-b" aria-hidden="true">${card[0]}</abbr></abbr>`
    }
  },
  stockCard(index) {
    return 500 - (10 * index)
  }
}));

Alpine.data("cardsInputForm", () => ({
  // "constants" for validation etc
  nonAlphaNumRegEx: /[\W_]+/g,
  suits: [],
  ranks: [],
  deck: [],
  minCards: 34,
  stockCount: 24,
  peaksCount: 28,
  onInit() {
    this.suits = "CDHS".split("");
    this.ranks = "A23456789TJQK".split("");
    this.deck = this.suits.flatMap((suit) => {
      return this.ranks.map((cval) => {
        return cval + suit;
      });
    });
    console.log(this.deck.join(", "));
    console.log(`deck size: ${this.deck.length}`);
  },

  // input validation
  inputValue: "",
  validCards: [],
  dupedCards: [],
  invalidCards: [],
  validMessages: [],
  invalidMessages: [],
  cardsToSolve: [],
  get isFormValid() {
    return this.isValidCardsLengthInRange && this.invalidMessages.length === 0;
  },
  get isValidCardsLengthTooSmall() {
    return this.validCards.length < this.minCards;
  },
  get isValidCardsLengthTooBig() {
    return this.validCards.length > this.deck.length;
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
        .replace(this.nonAlphaNumRegEx,' ')
        .split(' ')
        .filter((c) => c)
      : this.inputValue
        .toUpperCase()
        .split(/0|(..)/g)
        .filter(c => c !== '')
        .map(c => !c ? '0' : c);

    // check the input
    userCards.forEach((card) => {
      if (card === "0") {
        // user marking a slot with an unknown card
        this.validCards.push(card);
      } else if (this.validCards.includes(card)) {
        // this card was already seen in user's input, now it's a duplicate
        this.dupedCards.push(card);
      } else if (this.deck.includes(card)) {
        // not a duplicate, and in the reference deck? Valid, add to valid cards
        this.validCards.push(card);
      } else {
        // not a dupe, but not in reference deck: invalid, add to invalid cards
        this.invalidCards.push(card);
      }
    });

    // set validation messages based on length
    if (this.isValidCardsLengthTooSmall) {
      this.invalidMessages.push(`Must enter at least ${this.minCards} cards`);
    } else if (this.isValidCardsLengthTooBig) {
      this.invalidMessages.push(
        `Must not enter more than ${this.deck.length} cards`
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
    this.$store.global.cardsToSolve = Array(this.deck.length - this.validCards.length)
      .fill(0)
      .concat(this.validCards)
      .map((c) => (c === "0" ? 0 : c));
  },
}));

window.Alpine = Alpine;

Alpine.start();
