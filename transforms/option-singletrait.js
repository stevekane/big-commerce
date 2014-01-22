var _ = require('lodash')
  , map = _.map
  , partial = _.partial
  , reject = _.reject
  , flatten = _.flatten

/* 
 * BigCommerce's api has a different notion of options
 * an option for them is a "type" e.g. Color or Size
 * and it can have multiple values e.g. "XL" or "Red"
 * Groupon's system appears to need all permutations
 * of option combinations and also additional data such as
 * price, discount, availability etc 
 */


//expand our option into a list of trait permutations with price and name data
var transformToTraits = function (option) {
  return map(option.values, function (value) {
    return {
      name: option.display_name,
      value: value.label
    };
  });
};

var formatOptions = function (bigC, product, imageAlt, options) {
  if (!options) return [];
  var nonSizeOptions = reject(options, {display_name: "Size"})
    , traits = flatten(map(nonSizeOptions, transformToTraits))

  return map(traits, function (trait) {
    return {
      name: trait.name,
      value: trait.value,
      price_amount: product.calculated_price * 100,
      value_amount: product.price * 100,  
      quantity_sold: product.total_sold,
      image_uri: imageAlt,
    }; 
  });
};

module.exports = formatOptions;
