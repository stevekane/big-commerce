var path = require('path')
  , async = require('async')
  , _ = require('lodash')

//here with flip the arguments to async.map so that it's composable...shameful
var flipMap = function (fn, list, cb) {
  return async.map(list, fn, cb); 
};

var removeSlashes = function (str) {
  return str.replace(/\//g, "");
};

var buildImageUrl = function (bigC, slug) {
  return path.join(bigC.storeURL, "product_images", slug);
};
var buildUrl = function (bigC, slug) {
  return path.join(bigC.storeURL, slug);
};

module.exports = {
  flipMap: flipMap,
  removeSlashes: removeSlashes,
  buildImageUrl: buildImageUrl,
  buildUrl: buildUrl
};
