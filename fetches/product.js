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

/*
TODO: Eventually, we'll need to associate the options with images. 

each function takes a cb which async provides
categories is an array of ids.  must get each in seperate request
options returns options which in turn contain values that we must
fetch in subsequent requests
*/ 
var buildFullProduct = function (bigC, product, cb) {
  var get = partial(bigC.get, bigC)
    , getCategory = partial(bigC.getCategory, bigC)
    , getOptionValues = partial(bigC.getOptionValues, bigC);
  
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
      else return async.map(options, getOptionWithValues, cb);
    });
  };

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

//TODO: Should improve the bigC interface to return an error if no resouce
//is found AKA status is 404
var fetchProduct = function (bigC, id, cb) {
  bigC.getProduct(bigC, id, function (err, product) {
    if (err) return cb(err, null);
    else return buildFullProduct(bigC, product, cb);
  });
};

module.exports = fetchProduct;
