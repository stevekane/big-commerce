var path = require('path')
  , async = require('async')
  , _ = require('lodash')
  , config = require('./config.json')
  , partial = _.partial
  , map = _.map

//here with flip the arguments to async.map so that it's composable...shameful
var flipMap = function (fn, list, cb) {
  return async.map(list, fn, cb); 
};

var removeSlashes = function (str) {
  return str.replace(/\//g, "");
};

var buildPath = partial(path.join, config.store.url, "product_images/");

module.exports = {
  flipMap: flipMap,
  removeSlashes: removeSlashes,
  buildPath: buildPath
};
