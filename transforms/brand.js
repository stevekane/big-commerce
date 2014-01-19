var path = require('path')
  , _ = require('lodash')
  , partial = _.partial
  , buildPath = require('../utils').buildPath

//format the brand object returned by BigCommerce for groupon's api
var formatBrand = function (brand) {
  return {
    name: brand.name ? brand.name : undefined,
    uuid: "bigc-brand-" + brand.id,
    image: buildPath(brand.image_file)
  }
};

module.exports = formatBrand;
