var async = require('async')
  , _ = require('lodash')
  , formatProduct = require('../transforms/product')
  , formatOptions = require('../transforms/options')
  , formatBrand = require('../transforms/brand')
  , formatImages = require('../transforms/images')
  , formatCategories = require('../transforms/categories')
  , find = _.find
  , partial = _.partial
  , map = _.map
  , extend = _.extend
  , clone = _.clone

/*
 * To save on redundant requests to the server we will first check
 * bigC.cache for cached values of options and categories and use them
 * instead of requesting them from the BigCommerce API.
 *
 * Ultimately, this route will request all needed data from the bigCommerce
 * api and transform it into something resembling the object graph expected
 * by the groupon Api.  
* */

//function to check a sub-cache for values
var retrieveFromSubCache = function (subCache, value) {
  return find(subCache, {id: value});
};

/*
TODO: In the future, we'll make this more sophisticated and determine
which values we have cached and which we need to actually request.
we will also add support to cache values retrieved in these calls if needed
*/
var getCategories = function (bigC, categories, cb) {
  var cached = map(categories, partial(retrieveFromSubCache, bigC.cache.categories));
  return cb(null, cached);
  //return async.map(categories, partial(bigC.getCategory, bigC), cb);
};


//get values for this option then returned composite object
var getOptionWithValues = function (bigC, option, cb) {
  bigC.getOptionValues(bigC, option.option_id, function (err, values) {
    var values = values || [];
    return cb(err, extend(clone(option), {values: values}));
  });
};

//given a url, build a complete options object with values
var getOptionsWithValues = function (bigC, url, cb) {
  bigC.get(bigC, url, function (err, options) {
    var options = options || [];
    if (err) return cb(err, options);
    else return async.map(options, partial(getOptionWithValues, bigC), cb);
  });
};

var buildFullProduct = function (bigC, product, cb) {
  async.parallel({
    brand: partial(bigC.get, bigC, product.brand.url),
    images: partial(bigC.get, bigC, product.images.url),
    categories: partial(getCategories, bigC, product.categories),
    options: partial(getOptionsWithValues, bigC, product.options.url)
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

var getProduct = function (bigC, id, cb) {
  bigC.getProduct(bigC, id, function (err, product) {
    if (err) return cb(err, null);
    else return buildFullProduct(bigC, product, cb);
  });
};

var getProducts = function (bigC, cb) {
  var query = {limit: 10};

  bigC.getProducts(bigC, query, function (err, products) {
    if (err) return cb(err, null);
    else return async.map(products, partial(buildFullProduct, bigC), cb);
  });
};

module.exports = {
  getProduct: getProduct,
  getProducts: getProducts
};
