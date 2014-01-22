var path = require('path')
  , async = require('async')
  , _ = require('lodash')

//here with flip the arguments to async.map so that it's composable...shameful
var flipMap = function (fn, list, cb) {
  return async.map(list, fn, cb); 
};

var buildImageUrl = function (bigC, slug) {
  return bigC.storeURL + "product_images/" + slug;
};
var buildUrl = function (bigC, slug) {
  return bigC.storeURL + slug;
};

var stripFrom = function (sub, str) {
  return str.replace(sub, "");
};

module.exports = {
  flipMap: flipMap,
  buildImageUrl: buildImageUrl,
  buildUrl: buildUrl,
  stripFrom: stripFrom
};
