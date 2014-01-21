var express = require('express')
  , path = require('path')
  , config = require('./config.json')
  , BigCommerce = require('./apis/big-commerce')
  , fetchProduct = require('./fetches/product')
  , bigC = new BigCommerce(config.api.username, config.api.key, config.api.url)
  , app = express()
  , apiUri = "/api/v1"

app.use(express.logger());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.bodyParser());

//super thin wrapper around express to enforce an api prefix uri
var api = {
  get: function (uri, cb) { return app.get(path.join(apiUri, uri), cb) },
  post: function (uri, cb) { return app.post(path.join(apiUri, uri), cb) },
  put: function (uri, cb) { return app.put(path.join(apiUri, uri), cb) },
  delete: function (uri, cb) { return app.delete(path.join(apiUri, uri), cb) }
};

api.get('/products/:product_id', function (req, res) {
  var id = req.params.product_id;

  if (id) {
    return fetchProduct(bigC, id, function (err, product) {
      return res.json(product);
    });
  } else {
    return res.send(404); 
  }
});

api.get('/products/', function (req, res) {
  fetchProducts(bigC, function (err, products) {
    return res.json(products); 
  });
});

app.listen(1234);
