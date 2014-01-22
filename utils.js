var path = require('path')
  , async = require('async')
  , _ = require('lodash')

//here with flip the arguments to async.map so that it's composable...shameful
var flipMap = function (fn, list, cb) {
  return async.map(list, fn, cb); 
};

var buildImageUrl = function (url, slug) {
  return url + "product_images/" + slug.replace("/", "");
};
var buildUrl = function (url, slug) {
  return url + slug.replace("/", "");
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
