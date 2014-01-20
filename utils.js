var path = require('path')
  , async = require('async')
  , _ = require('lodash')
  , config = require('./config.json')
  , extend = _.extend
  , partial = _.partial
  , clone = _.clone
  , map = _.map

//here with flip the arguments to async.map so that it's composable...shameful
var flipMap = function (fn, list, cb) {
  return async.map(list, fn, cb); 
};

//takes an array of arrays of objects and returns a single array of 
//all possible combinations of each arrays objects....ya.
var allCombinations = function (listOfArrays) {
  var res = []
    , listOfArrays = listOfArrays || [];

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

var buildPath = partial(path.join, config.api.url, "product_images/");

module.exports = {
  flipMap: flipMap,
  allCombinations: allCombinations,
  removeSlashes: removeSlashes,
  buildPath: buildPath
};
