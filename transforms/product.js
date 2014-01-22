var _ = require('lodash')
  , compose = _.compose
  , partial = _.partial
  , invoke = _.invoke
  , removeSlashes = require('../utils').removeSlashes
  , buildUrl = require('../utils').buildUrl
  , stripFrom = require('../utils').stripFrom

var stripSample = partial(stripFrom, "[Sample]");
var trim = function (str) { return str.trim() };
var stripSampleAndTrim = compose(trim, stripSample);

//transform product attribute according to groupon's schema
var formatProduct = function (bigC, product) {
  return {
    title: stripSampleAndTrim(product.name),
    deal_url: buildUrl(bigC, product.custom_url),
    source_id: product.id,
    source_type: "big-commerce",
    slug: removeSlashes(product.custom_url)
  };
};

module.exports = formatProduct;
