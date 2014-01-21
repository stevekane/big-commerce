var path = require('path')
  , _ = require('lodash')
  , partial = _.partial
  , buildPath = require('../utils').buildPath

//format the brand object returned by BigCommerce for groupon's api
var formatBrand = function (bigC, brand) {
  if (!brand) return {};
  else return {
    name: brand.name ? brand.name : undefined,
    uuid: "bigc-brand-" + brand.id,
    image: brand.image_file ? buildPath(bigC, brand.image_file) : undefined
  }
};

module.exports = formatBrand;
