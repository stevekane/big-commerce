var path = require('path')
  , BigCommerce = require('../big-commerce')
  , async = require('async')
  , _ = require('lodash')
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
  , get = bind(bigC.get, bigC)
  , getCategory = bind(bigC.getCategory, bigC)
  , getOptionValues = bind(bigC.getOptionValues, bigC)
  , buildPath = partial(path.join, config.api.url, "product_images/");

//transform product attribute according to groupon's schema
var transformProduct = function (product) {
  return {};
};

//fetch the values for an option and return a new optionWithValues object
var buildOptionWithValues = function (option, cb) {
  getOptionValues(option.option_id, function (err, values) {
    var optionWithValues = extend(clone(option), {
      values: values 
    }); 
    return cb(err, optionWithValues);
  });
};

//format an image_file by building a full url path
var formatImage = function (image_file) {
  if (!image_file) return undefined;
  return buildPath(image_file);
};

//format the brand object returned by BigCommerce for groupon's api
var formatBrand = function (brand) {
  if (!brand) return undefined;
  return {
    name: brand.name ? brand.name : undefined,
    keywords: brand.meta_keywords ? brand.meta_keywords : undefined,
    image: formatImage(brand.image_file)
  }
};

//format options 
var formatOptions = function (options) {
  if (!options) return undefined;
  return options;
  //return {
  //   
  //}; 
};

//format images returned by BigCommerce for groupon's api
var formatImages = function (images) {
  if (!images) return undefined;
  return map(images, compose(formatImage, property("image_file")));
};

/*
each function takes a cb which async provides
categories is an array of ids.  must get each in seperate request
options returns options which in turn contain values that we must
fetch in subsequent requests
*/ 
var buildFullProduct = function (product, cb) {
  var transformed = transformProduct(product);
  
  var getBrand = partial(get, product.brand.url);
  var getImages = partial(get, product.images.url);
  var getCategories = partial(async.map, product.categories, getCategory);
  var getOptions = function (cb) {
    get(product.options.url, function (err, options) {
      async.map(options, buildOptionWithValues, function (err, optionsWithValues) {
        cb(err, optionsWithValues); 
      });
    }); 
  };

  async.parallel({
    brand: getBrand,
    images: getImages,
    categories: getCategories,
    options: getOptions
  }, function (err, productDetails) {
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

bigC.getProduct(33, function (err, product) {
  buildFullProduct(product, function (err, fullProduct) {
    console.error(err); 
    console.log(fullProduct); 
  });
});
