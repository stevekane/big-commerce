var test = require('tape')
  , _ = require('lodash')
  , isEqual = _.isEqual
  , map = _.map
  , partial = _.partial
  , forEach = _.forEach
  , find = _.find
  , permutagen = require('./permutagen')
  , calculatePermutationsAsArrays = permutagen.calculatePermutationsAsArrays
  , calculatePermutationsWithConcat = permutagen.calculatePermutationsWithConcat
  , calculatePermutationsAsObjects = permutagen.calculatePermutationsAsObjects

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

test("caculatePermutationsAsArrays returns arrays of possible permutations",
function (t) {
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

var star1 = [
  "chris",
  "jenny",
];
var star2 = [
  "hot",
  "cold",
];
var star3 = [
  "bark",
  "meow",
];
var arOfStars = [star1, star2, star3];

test("calculatePermutationsWithConcat returns a string of possible permutations",
function (t) {
  t.plan(8);
  var expectedPerms = [
    "chrishotbark",
    "chriscoldbark",
    "chrishotmeow",
    "chriscoldmeow",
    "jennyhotbark",
    "jennycoldbark",
    "jennyhotmeow",
    "jennycoldmeow"
  ];
  var permutations = calculatePermutationsWithConcat(arOfStars);

  forEach(expectedPerms, function (expected) {
    var matchingVal = find(permutations, partial(isEqual, expected));
    t.ok(isEqual(matchingVal, expected), "found matching value");
  });
});

var obAr1 = [
  {name: "flower"},
  {name: "angel"}
];
var obAr2 = [
  {title: "lady"},
  {title: "gentleman"}
];
var obAr3 = [
  {ranking: 1},
  {ranking: 2}
];
var arOfObars = [obAr1, obAr2, obAr3];

test("calculatePermutationsWithConcat returns a string of possible permutations",
function (t) {
  t.plan(8);
  var expectedPerms = [
    {name: "flower", title: "lady", ranking: 1},
    {name: "flower", title: "lady", ranking: 2},
    {name: "flower", title: "gentleman", ranking: 1},
    {name: "flower", title: "gentleman", ranking: 2},
    {name: "angel", title: "lady", ranking: 1},
    {name: "angel", title: "lady", ranking: 2},
    {name: "angel", title: "gentleman", ranking: 1},
    {name: "angel", title: "gentleman", ranking: 2}
  ];
  var permutations = calculatePermutationsAsObjects(arOfObars);

  forEach(expectedPerms, function (expected) {
    var matchingVal = find(permutations, partial(isEqual, expected));
    t.ok(isEqual(matchingVal, expected), "found matching value");
  });
});
