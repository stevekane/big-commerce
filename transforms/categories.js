var _ = require('lodash')
  , pluck = _.pluck;

//format categories returned by BigCommerce for groupon's api
var formatCategories = function (categories) {
  return pluck(categories, "name");
};

module.exports = formatCategories;