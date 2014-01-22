var path = require('path')
  , _ = require('lodash')
  , map = _.map
  , partial = _.partial
  , buildImageUrl = require('../utils').buildImageUrl

var formatImage = function (url, image) {
  var image = image || {};

  return buildImageUrl(url, image.image_file);
};

//format images returned by BigCommerce for groupon's api
var formatImages = function (bigC, images) {
  var images = images || [];

  return map(images, partial(formatImage, bigC.storeURL));
};

module.exports = formatImages;
