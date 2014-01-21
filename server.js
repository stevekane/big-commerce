var express = require('express')
  , path = require('path')
  , config = require('./config.json')
  , BigCommerce = require('./apis/big-commerce')
  , getProduct = require('./routes/product').getProduct
  , getProducts = require('./routes/product').getProducts
  , bigC = new BigCommerce(config.api.username, config.api.key, config.api.url)
  , app = express()
  , apiUri = "/api/v1"

/*
To avoid redundant hits on the API, we are going to implement a very simple
cache.  In the future, we may wish to make this layer a more exhaustive cache
and perhaps store both raw returned AND transformed data.  Perhaps we would only
cache raw returned data and transform it on demand only.  For example, when requested
by a web client or another groupon service
*/

var bigCache = {};

//TODO: implement
//utiltiy to fetch options w/ values from BigCommerce API and store in cache
var seedOptions = function (cache, cb) {
  bigC.getOptions(function () {
   
  }); 
};

//here we seed the cache with categories and option values


var bigC = new BigCommerce({
  user: config.api.username,
  pass: config.api.key,
  storeURL: config.api.url,
  cache: bigCache,
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

app.listen(1234);
