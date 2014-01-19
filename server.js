var express = require('express')
  , config = require('./config.json')
  , BigCommerce = require('./apis/big-commerce')
  , fetchProduct = require('./fetches/product')
  , bigC = new BigCommerce(config.api.username, config.api.key, config.api.url)
  , app = express();

app.get('/', function (req, res) {
  fetchProduct(bigC, 37, function (err, product) {
    return res.json(product);
  });
});

app.listen(1234);
