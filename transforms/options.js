var _ = require('lodash')
  , map = _.map
  , partial = _.partial
  , permutagen = require('../modules/permutagen/permutagen')
  , calculatePermutationsAsArrays = permutagen.calculatePermutationsAsArrays

/* 
 * BigCommerce's api has a different notion of options
 * an option for them is a "type" e.g. Color or Size
 * and it can have multiple values e.g. "XL" or "Red"
 * Groupon's system appears to need all permutations
 * of option combinations and also additional data such as
 * price, discount, availability etc 
 */

//produce a trait for a given value and option
var createTrait = function (option, value) {
  return {
    name: option.display_name,
    value: value.label
  };
};

//expand our option into a list of trait permutations with price and name data
var transformToTrait = function (product, option) {
   return map(option.values, partial(createTrait, option));
};

//add product data like price and eventually images to each traitCombo
var addProductData = function (product, traitCombo) {
  return {
    price_amount: product.price,
    value_amount: product.sale_price,  
    traits: traitCombo
  };
};

var formatOptions = function (product, options) {
  if (!options) return [];
  var traits = map(options, partial(transformToTrait, product))
    , traitCombinations = calculatePermutationsAsArrays(traits);

  return map(traitCombinations, partial(addProductData, product));
};

module.exports = formatOptions;
