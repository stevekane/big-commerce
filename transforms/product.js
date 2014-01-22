var _ = require('lodash')
  , compose = _.compose
  , partial = _.partial
  , invoke = _.invoke
  , buildUrl = require('../utils').buildUrl
  , stripFrom = require('../utils').stripFrom

var removeSample = partial(stripFrom, "[Sample]");
var formatAsSlug = partial(stripFrom, /\//g);
var trim = function (str) { return str.trim() };
var formatTitle = compose(trim, removeSample);

//transform product attribute according to groupon's schema
var formatProduct = function (bigC, product) {
  return {
    title: formatTitle(product.name),
    deal_url: buildUrl(bigC, product.custom_url),
    source_id: product.id,
    source_type: "big-commerce",
    slug: formatAsSlug(product.custom_url)
  };
};

module.exports = formatProduct;
