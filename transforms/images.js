var path = require('path')
  , _ = require('lodash')
  , compose = _.compose
  , map = _.map
  , property = _.property
  , buildPath = require('../utils').buildPath

//format images returned by BigCommerce for groupon's api
var formatImages = function (images) {
  return map(images, compose(buildPath, property("image_file")));
};

module.exports = formatImages;
