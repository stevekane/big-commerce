var path = require('path')
  , express = require('express')
  , async = require('async')
  , _ = require('lodash')
  , partial = _.partial
  , config = require('./config.json')
  , BigCommerce = require('./apis/big-commerce')
  , getProduct = require('./routes/product').getProduct
  , getProducts = require('./routes/product').getProducts
  , cacheOptions = require('./cache/options').cacheOptions
  , cacheCategories = require('./cache/categories').cacheCategories
  , app = express()

var bigC = new BigCommerce({
  user: config.api.username,
  pass: config.api.key,
  apiURL: config.api.url,
  storeURL: config.store.url,
  cache: {},
  debug: true
});

app.use(express.logger());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.json());
app.use(express.urlencoded());

app.get('/api/v1/products/:product_id', function (req, res) {
  var id = req.params.product_id;

  if (id) {
    return getProduct(bigC, id, function (err, product) {
      return res.json(product);
    });
  } else {
    return res.send(404); 
  }
});

app.get('/api/v1/products', function (req, res) {
  return getProducts(bigC, function (err, products) {
    return res.json(products); 
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
