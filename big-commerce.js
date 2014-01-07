var request = require('request')
  , extend = require('lodash').extend
  , partial = require('lodash').partial

var BigCommerce = function (user, pass, storeURL) {
  this.user = user;
  this.pass = pass;
  this.storeURL = storeURL;
};

/**
 *Helper function used to build a complete request options object
 *given a bigCommerce instance, urlSuffix, and querystring object
 */
var buildBaseOptions = function (bigC, urlSuffix) {
  return {
    url: bigC.storeURL + urlSuffix + ".json",
    auth: {
      user: bigC.user,
      pass: bigC.pass,
      sendImmediately: true       
    },
    headers: {
      "Content-type": "application/json",
    },
    "pool.maxSockets": 1000
  };
};

//generic get multiple function
var getMultiple = function (type, qs, cb) {
  var options = extend(
    buildBaseOptions(this, type),
    { qs: qs }
  );
  return request(options, cb);
};

//generic get single function
var getSingle = function (type, id, cb) {
  var options = buildBaseOptions(this, type + "/" + String(id));
  return request(options, cb);
};

//generic create function
var create = function (type, attributes, cb) {
  var options = extend(
    buildBaseOptions(this, type), 
    { body: JSON.stringify(attributes) }
  );
  return request.post(options, cb);
};

//generic update function
var update = function (type, id, attributes, cb) {
  var options = extend(
    buildBaseOptions(this, type + "/" + String(id)), 
    { body: JSON.stringify(attributes) }
  );
  return request.put(options, cb);
};

/**
 * PRODUCTS 
 * */
BigCommerce.prototype.getProducts = partial(getMultiple, "products");
BigCommerce.prototype.getProduct = partial(getSingle, "products");
BigCommerce.prototype.createProduct = partial(create, "products");
BigCommerce.prototype.updateProduct = partial(update, "products");

/*
 * This is an alternative way to search for a product by its SKU
 * TODO: In the future, this could be expanded to allow for returns of 
 * options SKUs as well as top level (see their API docs)
*/
BigCommerce.prototype.getProductsBySKU = function (sku, cb) {
  var options = extend(
    buildBaseOptions(this, "products"),
    { qs: {sku: sku} }
  );
  return request(options, cb);
};

/**
 * COUPONS
 * */
BigCommerce.prototype.getCoupons = partial(getMultiple, "coupons");
BigCommerce.prototype.getCoupon = partial(getSingle, "coupons");
BigCommerce.prototype.createCoupon = partial(create, "coupons");
BigCommerce.prototype.updateCoupon = partial(update, "coupons");

module.exports = BigCommerce
