var BigCommerce = require('../big-commerce')
  , async = require('async')
  , _ = require('lodash')
  , config = require('../config.json')
  , extend = _.extend
  , bind = _.bind
  , bigC = new BigCommerce(config.api.username, config.api.key, config.api.url)
  , get = bind(bigC.get, bigC)
  , getCategory = bind(bigC.getCategory, bigC)

var transformProduct = function (product) {
  return {};
};

//fetch brand, options, images, categories async return composite product
var buildFullProduct = function (product, cb) {
  var transformed = transformProduct(product)
    , brandUrl = product.brand.url
    , optionsUrl = product.options.url
    , imagesUrl = product.images.url
    , categories = product.categories;

  //used in our async parallel calls
  var getBrand = function (cb) { return get(brandUrl, cb) };
  var getOptions = function (cb) { return get(optionsUrl, cb) };
  var getImages = function (cb) { return get(imagesUrl, cb) };
  //categories is an array of ids.  must get each in seperate request
  var getCategories = function (cb) { 
    return async.map(categories, getCategory, cb);
  };

  async.parallel({
    brand: getBrand,
    options: getOptions,
    images: getImages,
    categories: getCategories
  }, function (err, productDetails) {
    return cb(err, extend(transformed, productDetails));
  });
};

bigC.getProducts({limit: 1}, function (err, products) {
  async.map(products, buildFullProduct, function (err, fullProducts) {
    console.log(fullProducts);
  });
});
