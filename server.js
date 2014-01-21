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
  , bigC = new BigCommerce(config.api.username, config.api.key, config.api.url)
  , app = express()
  , apiUri = "/api/v1"

var bigC = new BigCommerce({
  user: config.api.username,
  pass: config.api.key,
  storeURL: config.api.url,
  cache: {},
  debug: true
});

app.use(express.logger());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.json());
app.use(express.urlencoded());

//super thin wrapper around express to enforce an api prefix uri
var api = {
  get: function (uri, cb) { return app.get(path.join(apiUri, uri), cb) },
  post: function (uri, cb) { return app.post(path.join(apiUri, uri), cb) },
  put: function (uri, cb) { return app.put(path.join(apiUri, uri), cb) },
  delete: function (uri, cb) { return app.delete(path.join(apiUri, uri), cb) }
};

api.get('/products/:product_id/', function (req, res) {
  var id = req.params.product_id;

  if (id) {
    return getProduct(bigC, id, function (err, product) {
      return res.json(product);
    });
  } else {
    return res.send(404); 
  }
});

//FIXME: cannot fetch all as too many redundant requests causes timeouts
//with the BigCommerce API.  can probably easily fix w/ caching
//for commonly requested things such as option values and categories
//current approach is pretty simplistic
//TODO: for now, we throttle to {limit: 20} for demo purposes
api.get('/products/', function (req, res) {
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
  if (err) throw new Error("precaching failed");
  else {
    console.log(results.options, "have been cached");
    console.log(results.categories, "have been cached");
    app.listen(1234);
  }
});
