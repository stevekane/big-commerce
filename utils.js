var async = require('async')
  , _ = require('lodash')
  , extend = _.extend
  , clone = _.clone
  , map = _.map
  , flatten = _.flatten

//here with flip the arguments to async.map so that it's composable...shameful
var flipMap = function (fn, list, cb) {
  return async.map(list, fn, cb); 
};

//takes an array of arrays of objects and returns a single array of 
//all possible combinations of each arrays objects....ya.
var allCombinations = function (listOfArrays) {
  var res = [];

  map(listOfArrays[0], function inner (i, val) {
    var iter = i
      , current = val;

    return function (x) {
      var next = clone(current);
      next.push(x);

      if (iter == listOfArrays.length - 1) { 
        res.push(next); 
      } else { 
        map(listOfArrays[i+1], inner(i+1, next));
      }
    }
  }(0, []));
  return res;
}

var removeSlashes = function (str) {
  return str.replace(/\//g, "");
};
module.exports = {
  flipMap: flipMap,
  allCombinations: allCombinations,
  removeSlashes: removeSlashes
};
