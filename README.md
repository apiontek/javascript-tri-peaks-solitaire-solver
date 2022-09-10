# javascript-tri-peaks-solitaire-solver

A brute force solver for Microsoft Tri-Peaks solitaire written in javascript.

This is a fork of [Courtney Pitcher's project](https://github.com/IgniparousTempest/javascript-tri-peaks-solitaire-solver), which I've modified for my own purposes.

_NOTE:_ Due to a "hard" game being included in `test.js` now, testing takes longer (almost 3 minutes to complete on my computer).

## Fix Card Matching

It seemed I was getting solutions that didn't make sense, which I tracked down to the logic used to compare cards. I believe I've fixed this, and have now been getting real solutions.

In fact, it's now able to solve the test game I thought was "unsolvable," so I had to disable that test until I can identify another unsolvable game! But the logic for unsolvable games should still work.

## Unsolvable Games

For unsolvable games, this solver will return one possible "best path" — a set of moves that clears the most cards from the board. If you're playing a game with a goal like "clear all Aces," and the full board is unsolvable, this might help you at least clear those Aces!

However, it could be that a given board has more than one path to removing most of the cards, and the one this solver returns might not remove the cards you need. If I get around to it, a better improvement might be to return, say, the top 5 best paths.

_NOTE:_ Unsolvable boards could take up to 10 minutes to process, so be patient.

## Playing

I have yet to implement this in a website but it can be run directly in node. Eventually I'll put up a sample into which you can enter a string like one of these and get a solution:

- solvable: "8S TS 4D 7S 5D 7C 2D JH AC 3S 2H 3H 9H KC QC TD 8D 9C 7H 9D JS QS 4H 5C 5S 4C 2C QD 8C KD 3D KS JD 2S 7D KH AH 5H 9S 4S QH 6S 6D 3C JC TC 8H 6C TH AS AD 6H"
- partial board: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 2D KH 8C 6S 6H 2C 8H JC 9C 4D AD TH 2S AS QH 5H AH 3H 2H 4S 6D 3C TS JD 9H KD AC JS 9S 4H 4C 5S 5D 5C"
  ~~- unsolvable: "2D 6D AD 9S 4C 7C 7S 7D 9C 2S AC 8D 6S 6H 3C 5H QS JS 4S JH 5C AS 3H 3S AH TD 4D 5S TH 7H KS QH 6C KD 8S 2C TC JC 5D 3D 2H TS 4H JD KC KH 8H QC 8C QD 9D 9H"~~

## Notes

Per Courtney Pitcher, "This is probably quite a poor implementation." Please don't fault either of us, he was teaching himself javascript, and I'm probably even less qualified...
