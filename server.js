var path = require('path')
  , express = require('express')
  , async = require('async')
  , _ = require('lodash')
  , partial = _.partial
  , compact = _.compact
  , config = require('./config.json')
  , BigCommerce = require('./apis/big-commerce')
  , storesApi = require('./apis/stores')
  , getProduct = require('./routes/product').getProduct
  , getProducts = require('./routes/product').getProducts
  , cacheOptions = require('./cache/options').cacheOptions
  , cacheCategories = require('./cache/categories').cacheCategories
  , createDeal = storesApi.createDeal
  , createBrand = storesApi.createBrand
  , addOptionToDeal = storesApi.addOptionToDeal
  , addBrandToDeal = storesApi.addBrandToDeal
  , app = express()

var bigC = new BigCommerce({
  user: config.api.username,
  pass: config.api.key,
  apiURL: config.api.url,
  storeURL: config.store.url,
  cache: {},
  //debug: true
});

//app.use(express.logger());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.json());
app.use(express.urlencoded());

var pushProduct = function (product, cb) {
  async.parallel({
    brand: partial(createBrand, product.brand),
    deal: partial(createDeal, product)
  }, function (err, results) {
    if (err) return cb(err); 

    async.parallel({
      options: function (cb) { 
        async.map(product.options, partial(addOptionToDeal, results.deal.deal), cb)
      },
      brand: partial(addBrandToDeal, results.deal.deal, results.brand.brand)
    }, function (err, updateData) {
      return cb(err, product);
    });   
  });
};

app.get('/api/v1/products/:product_id', function (req, res) {
  getProduct(bigC, req.params.product_id, function (err, product) {
    if (err) return res.json(400, {error: "bummer"});
    pushProduct(product, function (err, product) {
      if (err) return res.json(400, {error: "bummer"});
      else return res.json(200, product); 
    }); 
  });
});

app.get('/api/v1/products', function (req, res) {
  getProducts(bigC, function (err, products) {
    //FIXME: TEMP CHECK AROUND ERR
    var goodProducts = compact(products, null);
    console.log(goodProducts.length, products.length);
    //if (err) return res.json(400, {error: "bummer"});
    async.map(goodProducts, pushProduct, function (err, products) {
      if (err) return res.json(400, {error: "bummer"}); 
      else return res.json(200, products);
    });
  });
});

/*
To avoid redundant hits on the API, we are going to implement a very simple
cache.  In the future, we may wish to make this layer a more exhaustive cache
and perhaps store both raw returned AND transformed data.  Perhaps we would only
cache raw returned data and transform it on demand only.  For example, when requested
by a web client or another groupon service
*/
async.parallel({
  options: partial(cacheOptions, bigC),
  categories: partial(cacheCategories, bigC)
}, function (err, results) {
  app.listen(1234);
});
