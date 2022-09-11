# javascript-tri-peaks-solitaire-solver

A brute force solver for Microsoft Tri-Peaks solitaire written in javascript.

This is a fork of [Courtney Pitcher's project](https://github.com/IgniparousTempest/javascript-tri-peaks-solitaire-solver), with several changes.

## Changes

- fixed card matching, implemented card matching tests
- solver now returns a "first best set of moves found" for unsolvable games (the first set of moves found that removes the most cards from the board)

## Notes

- Unsolvable games can take 6 or more minutes to solve, so be patient.
- Per Courtney Pitcher, "This is probably quite a poor implementation." Please don't fault either of us, he was teaching himself javascript, and I'm probably even less qualified...

## TODO

- [ ] HTML ui/demo _in progress_
