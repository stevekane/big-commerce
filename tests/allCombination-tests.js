var test = require('tape')
  , _ = require('lodash')
  , isEqual = _.isEqual
  , map = _.map
  , partial = _.partial
  , forEach = _.forEach
  , find = _.find
  , calculatePermutationsAsArrays = require('../utils').calculatePermutationsAsArrays

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
  var expectedPerms = [
    [{name: "alfons"}, {title: "lord"}, {position: "pawn"}], 
    [{name: "alfons"}, {title: "wanker"}, {position: "pawn"}], 
    [{name: "bruno"}, {title: "lord"}, {position: "pawn"}], 
    [{name: "bruno"}, {title: "wanker"}, {position: "pawn"}], 
    [{name: "alfons"}, {title: "lord"}, {position: "knight"}], 
    [{name: "alfons"}, {title: "wanker"}, {position: "knight"}], 
    [{name: "bruno"}, {title: "lord"}, {position: "knight"}], 
    [{name: "bruno"}, {title: "wanker"}, {position: "knight"}]
  ];
  var permutations = calculatePermutationsAsArrays(arOfArs);

  forEach(expectedPerms, function (expected) {
    var matchingVal = find(permutations, partial(isEqual, expected));
    t.ok(isEqual(matchingVal, expected), "found matching value");
  });
});

test("it should return an empty array if nothing provided", function (t) {
  t.plan(1);
  var expected = [];
  var permutations = calculatePermutationsAsArrays();
  t.ok(isEqual(expected, permutations), "returns an empty array if nothingprovided");
});

test("it should return an empty array if empty arrays provided", function (t) {
  t.plan(1);
  var expected = [];
  var permutations = calculatePermutationsAsArrays([[], [], []]);
  t.ok(isEqual(expected, permutations), "returns an empty array for empty arrays");
});
