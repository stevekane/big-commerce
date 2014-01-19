var async = require('async')
  , _ = require('lodash')
  , BigCommerce = require('../big-commerce')
  , formatProduct = require('../transforms/product')
  , formatOptions = require('../transforms/options')
  , formatBrand = require('../transforms/brand')
  , formatImages = require('../transforms/images')
  , formatCategories = require('../transforms/categories')
  , config = require('../config.json')
  , partial = _.partial
  , property = _.property
  , map = _.map
  , pluck = _.pluck
  , extend = _.extend
  , clone = _.clone
  , bind = _.bind
  , bigC = new BigCommerce(config.api.username, config.api.key, config.api.url)

//helper functions used in compositions
var get = bind(bigC.get, bigC);
var getCategory = bind(bigC.getCategory, bigC);
var getOptionValues = bind(bigC.getOptionValues, bigC);

//get values for this option then returned composite object
var getOptionWithValues = function (option, cb) {
  getOptionValues(option.option_id, function (err, values) {
    return cb(err, extend(clone(option), {values: values}));
  });
};

//given a url, build a complete options object with values
var getOptionsWithValues = function (url, cb) {
  get(url, function (err, options) {
    if (err) return cb(err, options);

    async.map(options, getOptionWithValues, function (err, optionsWithValues) {
      return cb(err, optionsWithValues);
    });
  });
};

/*
TODO: Eventually, we'll need to associate the options with images. 

each function takes a cb which async provides
categories is an array of ids.  must get each in seperate request
options returns options which in turn contain values that we must
fetch in subsequent requests
*/ 
var buildFullProduct = function (product, cb) {
  async.parallel({
    brand: partial(get, product.brand.url),
    images: partial(get, product.images.url),
    categories: partial(async.map, product.categories, getCategory),
    options: partial(getOptionsWithValues, product.options.url)
  }, function (err, productDetails) {
    var transformed = extend(formatProduct(product), {
      brand: formatBrand(productDetails.brand),
      images: formatImages(productDetails.images),
      categories: formatCategories(productDetails.categories),
      options: formatOptions(product, productDetails.options)
    });
    return cb(err, transformed);
  });
};

bigC.getProduct(37, function (err, product) {
  buildFullProduct(product, function (err, fullProduct) {
    console.error(err); 
    console.log(fullProduct); 
  });
});
