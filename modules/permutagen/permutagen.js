var _ = require('lodash')
  , clone = _.clone
  , extend = _.extend
  , partial = _.partial
  , map = _.map

/*
 * This function contains the necessary plumbing to do the recursive
 * analysis of an array of arrays and return an array of all possible
 * permutations of the elements of each array.  The function passed as
 * first argument detemines how the components from each array are joined
 * together.  EG. string concatenation, new arrays, composite object, tce
* */
var listPermutationsWith = function (fn, initial, listOfArrays) {
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
  }(0, initial, fn));
  return res;
}

//create a new array with new element appended to it
var pushToNewArray = function (cur, next) {
  var newAr = clone(cur);
  newAr.push(next);
  return newAr;
};

//create new object and extend it w/ next value
var extendObject = function (cur, next) {
  var newObj = clone(cur);
  extend(newObj, next);
  return newObj;
};

//string concatenation
var concat = function (cur, next) {
  return cur.concat(next); 
};

var calculatePermutationsAsArrays = partial(listPermutationsWith, pushToNewArray, []);
var calculatePermutationsWithConcat = partial(listPermutationsWith, concat, "");
var calculatePermutationsAsObjects = partial(listPermutationsWith, extendObject, {});

module.exports = {
  listPermutationsWith: listPermutationsWith,
  calculatePermutationsAsArrays: calculatePermutationsAsArrays,
  calculatePermutationsAsObjects: calculatePermutationsAsObjects,
  calculatePermutationsWithConcat: calculatePermutationsWithConcat
};
