import "../scss/style.scss";
import Alpine from "alpinejs";
import globalStore from "./store";
import navbar from "./navbar";
import cardsInputForm from "./cardsInputForm";
import playingCardsPreview from "./playingCardsPreview";
import gameSolving from "./gameSolving";

// Keep some constants in global store for components
Alpine.store("global", globalStore);

// navbar logic
Alpine.data("navbar", () => navbar);

// input component logic
Alpine.data("cardsInputForm", () => cardsInputForm);

// card preview component logic
Alpine.data("playingCardsPreview", () => playingCardsPreview);

// game solving component logic
Alpine.data("gameSolving", () => gameSolving);

window.Alpine = Alpine;

Alpine.start();
