var allCombinations = require('../utils').allCombinations
  , ar1 = [
    {name: "alfons"},
    {name: "bruno"},
    {name: "jenna"},
    {name: "wilbert"},
  ]
  , ar2 = [
    {title: "lord"},
    {title: "wanker"},
    {title: "doctor"},
    {title: "lardass"},
  ]
  , ar3 = [
    {position: "pawn"},
    {position: "striker"},
    {position: "forward"},
    {position: "queen"},
  ]
  , arOfArs = [ar1, ar2, ar3];

console.log(allCombinations(arOfArs));
