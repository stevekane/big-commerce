var BigCommerce = require('../big-commerce')
  , async = require('async')
  , _ = require('lodash')
  , map = _.map
  , pluck = _.pluck
  , forEach = _.forEach
  , partial = _.partial
  , bind = _.bind
  , property = _.property
  , compose = _.compose
  , through = require('through')
  , JSONStream = require('JSONStream')
  , config = require('../config.json')
  , boundConsoleLog = bind(console.log, console)
  , printer = through(boundConsoleLog)
  , bigC = new BigCommerce(config.api.username, config.api.key, config.api.url)
  , get = bind(bigC.get, bigC)
  , getCategory = bind(bigC.getCategory, bigC)

var transformProduct = function (product) {
  return {};
};

//we need to fetch brand, options, images, categories
//return a new composite product with transformations
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
  /*
  TODO: implement categories.  you have an array of IDs meaning
  you need to call async.map and get the aggregate information
  back before you can call the outer async.parallel's callback
  NOTE: the implementation below may be correct but we're leaving it 
  out for now to make things simpler to test
  */
  //var getCategories = function (cb) { 
  //  return async.map(categories, getCategory, cb );
  //};

  async.parallel({
    brand: getBrand,
    options: getOptions,
    images: getImages,
    //categories: getCategories
  }, function (err, productDetails) {
    console.error(err);
    console.log(productDetails);
    return cb("squankle!");
  });

};

/**
 * group products w/ options and fetch the option details
 *
 */
bigC.getProduct(35, function (err, product) {
  buildFullProduct(product, function (err, fullProduct) {
    console.error(err);
    console.log(fullProduct);
  }); 
});

//bigC.getProducts()
//.pipe(JSONStream.parse(".*.options"))
//.pipe(printer, {end: false});

//bigC.getOrderStatuses()
//.pipe(JSONStream.parse())
//.pipe(printer, {end: false})
//
//bigC.getOrderStatus(1)
//.pipe(JSONStream.parse())
//.pipe(printer, {end: false})

//bigC.getCategories()
//.pipe(JSONStream.parse())
//.pipe(printer, {end: false})
//
//bigC.getCategory(1)
//.pipe(JSONStream.parse())
//.pipe(printer, {end: false})
//
//bigC.getCategoryCount()
//.pipe(JSONStream.parse())
//.pipe(printer, {end: false})


//bigC.getBrands()
//.pipe(JSONStream.parse())
//.pipe(printer, {end: false})

//bigC.getBrand(34)
//.pipe(JSONStream.parse())
//.pipe(printer, {end: false})
//
//bigC.getBrandCount()
//.pipe(JSONStream.parse())
//.pipe(printer, {end: false})

//bigC.getProductCount()
//.pipe(JSONStream.parse())
//.pipe(printer, {end: false})
//

//bigC.getProducts()
//.pipe(JSONStream.parse())
//.pipe(printer, {end: false})

//bigC.getProduct(32)
//.pipe(JSONStream.parse())
//.pipe(printer, {end: false})

//var newProduct = {
//  "name":"Jankity",
//  "price":19.99,
//  "categories":[2],
//  "type":"physical",
//  "availability":"available", 
//  "weight":0
//};
//
//bigC.createProduct(newProduct)
//.pipe(JSONStream.parse())
//.pipe(printer, {end: false})
//
//
//bigC.updateProduct(84, {name: "Ladybug"})
//.pipe(JSONStream.parse())
//.pipe(printer, {end: false})
//
//bigC.getProductsBySKU("bestfish")
//.pipe(JSONStream.parse())
//.pipe(printer, {end: false})

//bigC.getCoupon(2)
//.pipe(JSONStream.parse())
//.pipe(printer, {end: false})
//
//var newCoupon = {
//  "code": "60OFF",
//  "type": "percentage_discount",
//  "name": "testcoupon1",
//  "amount": 50.00,
//  "enabled": "true",
//
//  "applies_to": {
//    "entity": "products", 
//    "ids": [32]
//  }
//};
//
//bigC.createCoupon(newCoupon)
//.pipe(JSONStream.parse())
//.pipe(printer, {end: false})
//
//bigC.updateCoupon(5, {name: "fancy ole coupon"})
//.pipe(JSONStream.parse())
//.pipe(printer, {end: false})
