var test = require('tape')
  , _ = require('lodash')
  , isEqual = _.isEqual
  , allCombinations = require('../utils').allCombinations

var ar1 = [
  {name: "alfons"},
  {name: "bruno"},
];
var ar2 = [
  {title: "lord"},
  {title: "wanker"},
];
var ar3 = [
  {position: "pawn"},
  {position: "knight"},
];
var arOfArs = [ar1, ar2, ar3];

test("it returns an array of all permutations of the input arrays", function (t) {
  t.plan(8);
  var expectedPermutations = [
    [{name: "alfons"}, {title: "lord"}, {position: "pawn"}], 
    [{name: "alfons"}, {title: "wanker"}, {position: "pawn"}], 
    [{name: "bruno"}, {title: "lord"}, {position: "pawn"}], 
    [{name: "bruno"}, {title: "wanker"}, {position: "pawn"}], 
    [{name: "alfons"}, {title: "lord"}, {position: "knight"}], 
    [{name: "alfons"}, {title: "wanker"}, {position: "knight"}], 
    [{name: "bruno"}, {title: "lord"}, {position: "knight"}], 
    [{name: "bruno"}, {title: "wanker"}, {position: "knight"}], 
  ];
  var permutations = allCombinations(arOfArs);
  for (var i = 0; i < expectedPermutations.length; i++) {
    t.true(expectedPermutations[i], permutations[i]); 
  }
});
