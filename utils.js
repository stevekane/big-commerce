var async = require('async')
var _ = require('lodash')
  , map = _.map
  , flatten = _.flatten

//here with flip the arguments to async.map so that it's composable...shameful
var flipMap = function (fn, list, cb) {
  return async.map(list, fn, cb); 
};

var allCombinations = function (listOfArrays) {
  var res = [];
  map(listOfArrays, function inner (i, val) {
    var iter = i, current = val;
    return function(x) {
      var next = current + x;
      if(iter == listOfArrays.length - 1) { 
        res.push(next); 
      } else { 
        listOfArrays[i+1].map(inner(i + 1, next)); 
      }
    }
  }(0, ""));
  return res;
}
module.exports = {
  flipMap: flipMap,
  listAllPermutations: listAllPermutations
};

