var _ = require('lodash')
  , map = _.map
  , partial = _.partial
  , partialRight = _.partialRight
  , compose = _.compose
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
var expandTraits = function (options) {
  return flatten(
    map(options, function (option) {
      return map(option.values, function (value) {
        return {
          name: option.display_name,
          value: value.label
        };
      });
    })
  );
};

//map over our traits converting them into expected option format
var buildOptions = function (product, imageAlt, traits) {
  return map(traits, function (trait) {
    return {
      name: trait.name,
      value: trait.value,
      price_amount: product.calculated_price * 100,
      value_amount: product.price * 100,  
      quantity_sold: product.total_sold,
      image_uri: imageAlt
    }; 
  });
};

var removeSizeOptions = partialRight(reject, {display_name: "Size"})

var formatOptions = function (bigC, product, imageAlt, options) {
  var options = options || []
    , format = partial(buildOptions, product, imageAlt)
    , formatPipeline = compose(format, expandTraits, removeSizeOptions);

  return formatPipeline(options);
};

module.exports = formatOptions;
