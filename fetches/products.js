var async = require('async')
  , _ = require('lodash')
  , formatProduct = require('../transforms/product')
  , formatOptions = require('../transforms/options')
  , formatBrand = require('../transforms/brand')
  , formatImages = require('../transforms/images')
  , formatCategories = require('../transforms/categories')
  , partial = _.partial
  , extend = _.extend
  , clone = _.clone

//TODO: Should improve the bigC interface to return an error if no resouce
//is found AKA status is 404
var fetchProduct = function (bigC, id, cb) {
  bigC.getProduct(bigC, id, function (err, product) {
    if (err) return cb(err, null);
    else return buildFullProduct(bigC, product, cb);
  });
};

module.exports = fetchProduct;
