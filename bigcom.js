var BigCommerce = require('./big-commerce')
  , through = require('through')
  , JSONStream = require('JSONStream')
  , config = require('./config.json')
  , printer = through(console.log.bind(console));

var bigC = new BigCommerce(config.api.username, config.api.key, config.api.url);

//bigC.getProducts({limit: 1})
//.pipe(JSONStream.parse())
//.pipe(printer)

//bigC.getProduct(32)
//.pipe(JSONStream.parse())
//.pipe(printer)

//var newProduct = {
//  "name":"WHOA THIS IS GREAT",
//  "price":19.99,
//  "categories":[2],
//  "type":"physical",
//  "availability":"available", 
//  "weight":0
//};

//bigC.createProduct(newProduct)
//.pipe(JSONStream.parse())
//.pipe(printer)

//bigC.updateProduct(84, {name: "ManChild"})
//.pipe(JSONStream.parse("name"))
//.pipe(printer)

//bigC.getProductsBySKU("bestfish")
//.pipe(JSONStream.parse())
//.pipe(printer)

//bigC.getCoupon(2)
//.pipe(JSONStream.parse())
//.pipe(printer)

//var newCoupon = {
//  "code": "50OFF",
//  "type": "percentage_discount",
//  "name": "testcoupon1",
//  "amount": 50.00,
//  "enabled": "true",
//
//  "applies_to": {
//    "entity": "products", 
//    "ids": [32]
//  }
//};
//
//bigC.createCoupon(newCoupon)
//.pipe(JSONStream.parse())
//.pipe(printer)
//
//bigC.updateCoupon(5, {name: "fancy ole coupon"})
//.pipe(JSONStream.parse())
//.pipe(printer)


