var request = require('request')
  , _ = require('lodash')
  , async = require('async')
  , storesHost = require('../config.json').stores.url;

//create a new deal based on a big-commerce product
var createDeal = function (product, cb) {
  var deal = {
    title: product.title,
    source_id: product.source_id,
    source_type: product.source_type
  }
  var options = {
    url: storesHost + "deals",
    headers: {
      "Content-type": "application/json" 
    },
    json: true,
    body: JSON.stringify({deal: deal})
  };

  return request.post(options, function (err, res, data) {
    console.log("createDeal", options.url);
    console.log("createDeal", err, data);
    return cb(err, data); 
  });
};

//create new brand with brand from big commerce api
var createBrand = function (brand, cb) {
  var options = {
    url: storesHost + "brands",
    headers: {
      "Content-type": "application/json" 
    },
    json: true,
    body: JSON.stringify({brand: brand})
  };

  return request.post(options, function (err, res, data) {
    console.log("createBrand", options.url);
    console.log("createBrand", err, data);
    return cb(err, data);   
  });
};

/*
add a groupon brand to an existing groupon deal.  
NOTE: This must be called after both the brand and deal
exist inside the store's db
*/
var addBrandToDeal = function (deal, brand, cb) {
  var options = {
    url: storesHost + "deals/" + deal.id + "/brands/" + brand.id,
    headers: {
      "Content-type": "application/json" 
    },
    json: true,
  };

  return request.put(options, function (err, res, data) {
    console.log("addBrandToDeal", options.url);
    console.log("addBrandToDeal", err, data);
    return cb(err, data); 
  });
};

//add an option to an existing deal
var addOptionToDeal = function (deal, option, cb) {
  var options = {
    url: storesHost + "deals/" + deal.id + "/options",
    headers: {
      "Content-type": "application/json" 
    },
    json: true,
    body: JSON.stringify({option: option})
  };

  return request.post(options, function (err, res, data) {
    console.log("addOptionToDeal", options.url);
    console.log("addOptionToDeal", err, data);
    return cb(err, data); 
  });
};

module.exports = {
  createDeal: createDeal,
  createBrand: createBrand,
  addOptionToDeal: addOptionToDeal,
  addBrandToDeal: addBrandToDeal
};
