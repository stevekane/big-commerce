var path = require('path')
  , _ = require('lodash')
  , compose = _.compose
  , map = _.map
  , partial = _.partial
  , property = _.property
  , buildImageUrl = require('../utils').buildImageUrl

//format images returned by BigCommerce for groupon's api
var formatImages = function (bigC, images) {
  if (!images) return [];
  return map(images, compose(partial(buildImageUrl, bigC), property("image_file")));
};

module.exports = formatImages;
