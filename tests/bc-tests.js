var path = require('path')
  , async = require('async')
  , _ = require('lodash')
  , BigCommerce = require('../big-commerce')
  , flipMap = require('../utils').flipMap
  , config = require('../config.json')
  , compose = _.compose
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
var buildPath = partial(path.join, config.api.url, "product_images/");

//transform product attribute according to groupon's schema
var transformProduct = function (product) {
  return {};
};

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

//format an image_file by building a full url path
var formatImage = function (image_file) {
  return buildPath(image_file);
};

//format the brand object returned by BigCommerce for groupon's api
var formatBrand = function (brand) {
  return {
    name: brand.name ? brand.name : undefined,
    keywords: brand.meta_keywords ? brand.meta_keywords : undefined,
    image: formatImage(brand.image_file)
  }
};

//format options 
//TODO: IMPLEMENT THIS.  we want all permutations zipped together
var formatOptions = function (options) {
  var allPermutations = [];
  console.log(pluck(options, "values"));
  return [];
};

//format images returned by BigCommerce for groupon's api
var formatImages = function (images) {
  return map(images, compose(formatImage, property("image_file")));
};

/*
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
    var transformed = transformProduct(product);
    var formatted = {
      brand: formatBrand(productDetails.brand),
      images: formatImages(productDetails.images),
      categories: {},
      options: formatOptions(productDetails.options)
    };
    return cb(err, extend(transformed, formatted));
  });
};

//bigC.getProducts({limit: 10}, function (err, products) {
//  async.map(products, buildFullProduct, function (err, fullProducts) {
//    console.log(fullProducts);
//  });
//});

bigC.getProduct(37, function (err, product) {
  buildFullProduct(product, function (err, fullProduct) {
    //console.error(err); 
    //console.log(fullProduct); 
  });
});