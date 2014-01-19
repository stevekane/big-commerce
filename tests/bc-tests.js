var path = require('path')
  , async = require('async')
  , _ = require('lodash')
  , BigCommerce = require('../big-commerce')
  , allCombinations = require('../utils').allCombinations
  , removeSlashes = require('../utils').removeSlashes
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
var formatProduct = function (product) {
  console.log(product);
  return {
    title: product.name,
    uuid: "bigc-product-"+product.id,
    slug: removeSlashes(product.custom_url)
  };
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

//format the brand object returned by BigCommerce for groupon's api
var formatBrand = function (brand) {
  return {
    name: brand.name ? brand.name : undefined,
    uuid: "bigc-brand-"+brand.id,
    image: formatImage(brand.image_file)
  }
};

//produce a trait for a given value and option
var createTrait = function (option, value) {
  return {
    name: option.display_name,
    value: value.label
  };
};

//expand our option into a list of trait permutations with price and name data
var transformToTrait = function (product, option) {
   return map(option.values, partial(createTrait, option));
};

//add product data like price and eventually images to each traitCombo
var addProductData = function (product, traitCombo) {
  return {
    price_amount: product.price,
    value_amount: product.sale_price,  
    traits: traitCombo
  };
};

/* 
 * BigCommerce's api has a different notion of options
 * an option for them is a "type" e.g. Color or Size
 * and it can have multiple values e.g. "XL" or "Red"
 * Groupon's system appears to need all permutations
 * of option combinations and also additional data such as
 * price, discount, availability etc 
 */
var formatOptions = function (product, options) {
  var traits = map(options, partial(transformToTrait, product))
    , traitCombinations = allCombinations(traits);

  return map(traitCombinations, partial(addProductData, product));
};

//format an image_file by building a full url path
var formatImage = function (image_file) {
  return buildPath(image_file);
};

//format images returned by BigCommerce for groupon's api
var formatImages = function (images) {
  return map(images, compose(formatImage, property("image_file")));
};

//format categories returned by BigCommerce for groupon's api
var formatCategories = function (categories) {
  return pluck(categories, "name");
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

//bigC.getProducts({limit: 10}, function (err, products) {
//  async.map(products, buildFullProduct, function (err, fullProducts) {
//    console.log(fullProducts);
//  });
//});

bigC.getProduct(37, function (err, product) {
  buildFullProduct(product, function (err, fullProduct) {
    console.error(err); 
    console.log(fullProduct); 
  });
});
