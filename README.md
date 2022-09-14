# Tripeaks Solitaire Solver 73k

A brute force solver for Microsoft Tripeaks solitaire written in javascript. The solver can provide a "best moves" list (the first set of moves found that removes the most cards from the board) for unsolvable games, and games-in-progress (when you don't already know all the cards).

A live demo is available at [tripeaks.73k.us](https://tripeaks.73k.us/) where you can input cards and get solutions. The same files published there are available in this repo's `dist` directory.

This began as a fork of [Courtney Pitcher's project](https://github.com/IgniparousTempest/javascript-tri-peaks-solitaire-solver), and I'm grateful for the solving algorithm & inspiration.

## Notes

- Unsolvable games can take 6 or more minutes to solve, so be patient.
- Per Courtney Pitcher, "This is probably quite a poor implementation." Please don't fault either of us, he was teaching himself javascript, and I'm just having fun.
- The HTML+JS interface is built with [Vite](https://vitejs.dev/), [Alpine.js](https://alpinejs.dev/), [Bootstrap](https://getbootstrap.com/), and some [free customized SVG playing cards](https://www.me.uk/cards/). Linting & formatting is included.
