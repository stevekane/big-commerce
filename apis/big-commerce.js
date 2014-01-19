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
    json: true,
    headers: {
      "Content-type": "application/json",
    },
    "pool.maxSockets": 1000
  };
};

//generic get multiple function
var getMultiple = function (type, bigC, qs, cb) {
  var options = extend(
    buildBaseOptions(bigC, type),
    { qs: qs }
  );
  return request(options, function (err, res, result) {
    return cb(err, result); 
  });
};

//generic get single function
var getSingle = function (type, bigC, id, cb) {
  var options = buildBaseOptions(bigC, type + "/" + String(id));
  return request(options, function (err, res, result) {
    return cb(err, result); 
  });
};

var getSingleWithSuffix = function (type, suffix, bigC, id, cb) {
  var options = buildBaseOptions(bigC, type + "/" + String(id) + "/" + suffix);
  return request(options, function (err, res, result) {
    return cb(err, result); 
  });
};

var getCount = function (type, bigC, cb) {
  var options = buildBaseOptions(bigC, type + "/" + "count");
  return request(options, function (err, res, result) {
    return cb(err, result); 
  });
};

//generic create function
var create = function (type, bigC, attributes, cb) {
  var options = extend(
    buildBaseOptions(bigC, type), 
    { body: JSON.stringify(attributes) }
  );
  return request(options, function (err, res, result) {
    return cb(err, result); 
  });
};

//generic update function
var update = function (type, bigC, id, attributes, cb) {
  var options = extend(
    buildBaseOptions(bigC, type + "/" + String(id)), 
    { body: JSON.stringify(attributes) }
  );
  return request(options, function (err, res, result) {
    return cb(err, result); 
  });
};

//generic delete multiple function
var deleteMultiple = function (type, bigC, cb) {
  var options = buildBaseOptions(bigC, type);
  return request(options, function (err, res, result) {
    return cb(err, result); 
  });
};

//generic delete single function
var deleteSingle = function (type, bigC, id, cb) {
  var options = buildBaseOptions(bigC, type + "/" + String(id));
  return request(options, function (err, res, result) {
    return cb(err, result); 
  });
};

/*
 * This is an alternative way to search for a product by its SKU
 * TODO: In the future, this could be expanded to allow for returns of 
 * options SKUs as well as top level (see their API docs)
*/
BigCommerce.prototype.getProductsBySKU = function (bigC, sku, cb) {
  var options = extend(
    buildBaseOptions(bigC, "products"),
    { qs: {sku: sku} }
  );
  return request(options, function (err, res, result) {
    return cb(err, result); 
  });
};

/*
 * Used when you already have a url path to a resource
 */
BigCommerce.prototype.get = function (bigC, resourcePath, cb) {
  var options = extend(
    buildBaseOptions(bigC), 
    { url: resourcePath }
  );
  return request(options, function (err, res, result) {
    return cb(err, result); 
  });
};

extend(BigCommerce.prototype, {
  getProducts: partial(getMultiple, "products"),
  getProduct: partial(getSingle, "products"),
  getProductCount: partial(getCount, "products"),
  createProduct: partial(create, "products"),
  updateProduct: partial(update, "products"),
  deleteProducts: partial(deleteMultiple, "products"),
  deleteProduct: partial(deleteSingle, "products"),

  getOptions: partial(getMultiple, "options"),
  getOption: partial(getSingle, "options"),
  getOptionCount: partial(getCount, "options"),
  createOption: partial(create, "options"),
  updateOption: partial(update, "options"),
  deleteOptions: partial(deleteMultiple, "options"),
  deleteOption: partial(deleteSingle, "options"),

  //TODO: need to add all suffixy endpoints here and elsewhere
  getOptionValues: partial(getSingleWithSuffix, "options", "values"),

  getCoupons: partial(getMultiple, "coupons"),
  getCoupon: partial(getSingle, "coupons"),
  createCoupon: partial(create, "coupons"),
  updateCoupon: partial(update, "coupons"),
  deleteCoupons: partial(deleteMultiple, "coupons"),
  deleteCoupon: partial(deleteSingle, "coupons"),

  getBrands: partial(getMultiple, "brands"),
  getBrand: partial(getSingle, "brands"),
  getBrandCount: partial(getCount, "brands"),
  createBrand: partial(create, "brands"),
  updateBrand: partial(update, "brands"),
  deleteBrands: partial(deleteMultiple, "brands"),
  deleteBrand: partial(deleteSingle, "brands"),

  getCategories: partial(getMultiple, "categories"),
  getCategory: partial(getSingle, "categories"),
  getCategoryCount: partial(getCount, "categories"),
  createCategory: partial(create, "categories"),
  updateCategory: partial(update, "categories"),
  deleteCategorys: partial(deleteMultiple, "categories"),
  deleteCategory: partial(deleteSingle, "categories"),

  getOrderStatuses: partial(getMultiple, "orderstatuses"),
  getOrderStatus: partial(getSingle, "orderstatuses"),

  getCustomerGroups: partial(getMultiple, "customer_groups"),
  getCustomerGroup: partial(getSingle, "customer_groups"),
  getCustomerGroupCount: partial(getCount, "customer_groups"),
  createCustomerGroup: partial(create, "customer_groups"),
  updateCustomerGroup: partial(update, "customer_groups"),
  deleteCustomerGroups: partial(deleteMultiple, "customer_groups"),
  deleteCustomerGroup: partial(deleteSingle, "customer_groups"),

  getTime: partial(getMultiple, "time"),

  getStore: partial(getMultiple, "store"),
  
  getCountries: partial(getMultiple, "countries"),
  getCountry: partial(getSingle, "countries"),
  getCountryCount: partial(getCount, "countries"),

  getStates: partial(getMultiple, "countries/states"),
  getState: partial(getSingle, "countries/states"),
  getStateCount: partial(getCount, "countries/states"),

  getCustomers: partial(getMultiple, "customers"),
  getCustomer: partial(getSingle, "customers"),
  getCustomerCount: partial(getCount, "customers"),
  createCustomer: partial(create, "customers"),
  updateCustomer: partial(update, "customers"),
  deleteCustomers: partial(deleteMultiple, "customers"),
  deleteCustomer: partial(deleteSingle, "customers"),
});

module.exports = BigCommerce
