var request = require('request')
  , qs = require('querystring')
  , pick = require('lodash').pick
  , clone = require('lodash').clone
  , extend = require('lodash').extend

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
    "pool.maxSockets": 300
  };
};

/**
 * PRODUCTS 
 * */

BigCommerce.prototype.getProducts = function (qs, cb) {
  var options = extend(
    buildBaseOptions(this, "products"),
    { qs: qs }
  );
  return request(options, cb);
};

BigCommerce.prototype.getProduct = function (id, cb) {
  var options = buildBaseOptions(this, "products/" + String(id));
  return request(options, cb);
};

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

BigCommerce.prototype.createProduct = function (attributes, cb) {
  var options = extend(
    buildBaseOptions(this, "products"), 
    { body: JSON.stringify(attributes) }
  );
  return request.post(options, cb);
};

BigCommerce.prototype.updateProduct = function (id, attributes, cb) {
  var options = extend(
    buildBaseOptions(this, "products/" + String(id)), 
    { body: JSON.stringify(attributes) }
  );
  return request.put(options, cb);
};


/**
 * COUPONS
 * */
BigCommerce.prototype.getCoupons = function (qs, cb) {
  var options = extend(
    buildBaseOptions(this, "coupons"),
    { qs: qs }
  );
  return request(options, cb);
};

BigCommerce.prototype.getCoupon = function (id, cb) {
  var options = buildBaseOptions(this, "coupons/" + String(id));
  return request(options, cb);
};

BigCommerce.prototype.createCoupon = function (attributes, cb) {
  var options = extend(
    buildBaseOptions(this, "coupons"), 
    { body: JSON.stringify(attributes) }
  );
  return request.post(options, cb);
};

BigCommerce.prototype.updateCoupon = function (id, attributes, cb) {
  var options = extend(
    buildBaseOptions(this, "coupons/" + String(id)), 
    { body: JSON.stringify(attributes) }
  );
  return request.put(options, cb);
};


module.exports = BigCommerce
