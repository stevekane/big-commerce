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

/*
 * This function contains the necessary plumbing to do the recursive
 * analysis of an array of arrays and return an array of all possible
 * permutations of the elements of each array.  The function passed as
 * first argument detemines how the components from each array are joined
 * together.  EG. string concatenation, new arrays, composite object, tce
* */
var listPermutationsWith = function (fn, listOfArrays) {
  var res = []
    , listOfArrays = listOfArrays || [];

  map(listOfArrays[0], function inner (i, val, fn) {
    var iter = i
      , current = val;

    return function (x) {
      var next = fn(current, x);

      if (iter == listOfArrays.length - 1) { 
        res.push(next); 
      } else { 
        map(listOfArrays[i+1], inner(i+1, next, fn));
      }
    }
  }(0, [], fn));
  return res;
}

//create a new array with new element appended to it
var pushToNewArray = function (ar, el) {
  var newAr = clone(ar);
  newAr.push(el);
  return newAr;
};

var calculatePermutationsAsArrays = partial(listPermutationsWith, pushToNewArray);

var removeSlashes = function (str) {
  return str.replace(/\//g, "");
};

var buildPath = partial(path.join, config.store.url, "product_images/");

module.exports = {
  flipMap: flipMap,
  calculatePermutationsAsArrays: calculatePermutationsAsArrays,
  removeSlashes: removeSlashes,
  buildPath: buildPath
};
