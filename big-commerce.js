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

var getCount = function (type, cb) {
  var options = buildBaseOptions(this, type + "/" + "count");
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

//generic delete multiple function
var deleteMultiple = function (type, cb) {
  var options = buildBaseOptions(this, type);
  return request.delete(options, cb);
};

//generic delete single function
var deleteSingle = function (type, id, cb) {
  var options = buildBaseOptions(this, type + "/" + String(id));
  return request.delete(options, cb);
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

extend(BigCommerce.prototype, {
  getProducts: partial(getMultiple, "products"),
  getProduct: partial(getSingle, "products"),
  getProductCount: partial(getCount, "products"),
  createProduct: partial(create, "products"),
  updateProduct: partial(update, "products"),
  deleteProducts: partial(deleteMultiple, "products"),
  deleteProduct: partial(deleteSingle, "products"),

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
