# javascript-tri-peaks-solitaire-solver

A brute force solver for Microsoft Tri-Peaks solitaire written in javascript.

This is a fork of [Courtney Pitcher's project](https://github.com/IgniparousTempest/javascript-tri-peaks-solitaire-solver), which I've modified for my own purposes.

## Unsolvable Boards

The most significant addition is that this solver will return one possible "best path" for unsolvable games — a set of moves that clears the most cards from the board.

This can help with games where the goal is not clearing the board, but clearing a certain set of cards or hitting a threshold of points.

_NOTE:_ The "best path" returned is the first one found that clears the most cards. Hypothetically, a board could have multiple paths to clear the same number of cards. The path the solver returns might not clear the cards you need to clear. A possible future improvement could be returning, say, the top 5 best paths.

_NOTE:_ Unsolvable boards can take a long time to process, so be patient. The sample unsolvable board below takes my computer almost 6 minutes to conclude.

## Playing

I have yet to implement this in a website but it can be run directly in node. Eventually I'll put up a sample into which you can enter a string like one of these and get a solution:

- solvable: "8S TS 4D 7S 5D 7C 2D JH AC 3S 2H 3H 9H KC QC TD 8D 9C 7H 9D JS QS 4H 5C 5S 4C 2C QD 8C KD 3D KS JD 2S 7D KH AH 5H 9S 4S QH 6S 6D 3C JC TC 8H 6C TH AS AD 6H"
- partial board: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 2D KH 8C 6S 6H 2C 8H JC 9C 4D AD TH 2S AS QH 5H AH 3H 2H 4S 6D 3C TS JD 9H KD AC JS 9S 4H 4C 5S 5D 5C"
- unsolvable: "2D 6D AD 9S 4C 7C 7S 7D 9C 2S AC 8D 6S 6H 3C 5H QS JS 4S JH 5C AS 3H 3S AH TD 4D 5S TH 7H KS QH 6C KD 8S 2C TC JC 5D 3D 2H TS 4H JD KC KH 8H QC 8C QD 9D 9H"

## Notes

Per Courtney Pitcher, "This is probably quite a poor implementation." Please don't fault either of us, he was teaching himself javascript, and I'm probably even less qualified...

## Tests

The test for an unsolvable board will cause the tests to take a long time to complete, almost 6 minutes on my computer.
