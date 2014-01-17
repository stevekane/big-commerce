var BigCommerce = require('../big-commerce')
  , through = require('through')
  , JSONStream = require('JSONStream')
  , config = require('../config.json')
  , bigC = new BigCommerce(config.api.username, config.api.key, config.api.url)
  , boundConsoleLog = bind(console.log, console)
  , printer = through(boundConsoleLog)

//bigC.getProducts()
//.pipe(JSONStream.parse(".*.options"))
//.pipe(printer, {end: false});

//bigC.getOrderStatuses()
//.pipe(JSONStream.parse())
//.pipe(printer, {end: false})
//
//bigC.getOrderStatus(1)
//.pipe(JSONStream.parse())
//.pipe(printer, {end: false})

//bigC.getCategories()
//.pipe(JSONStream.parse())
//.pipe(printer, {end: false})
//
//bigC.getCategory(1)
//.pipe(JSONStream.parse())
//.pipe(printer, {end: false})
//
//bigC.getCategoryCount()
//.pipe(JSONStream.parse())
//.pipe(printer, {end: false})


//bigC.getBrands()
//.pipe(JSONStream.parse())
//.pipe(printer, {end: false})

//bigC.getBrand(34)
//.pipe(JSONStream.parse())
//.pipe(printer, {end: false})
//
//bigC.getBrandCount()
//.pipe(JSONStream.parse())
//.pipe(printer, {end: false})

//bigC.getProductCount()
//.pipe(JSONStream.parse())
//.pipe(printer, {end: false})
//

//bigC.getProducts()
//.pipe(JSONStream.parse())
//.pipe(printer, {end: false})

//bigC.getProduct(32)
//.pipe(JSONStream.parse())
//.pipe(printer, {end: false})

//var newProduct = {
//  "name":"Jankity",
//  "price":19.99,
//  "categories":[2],
//  "type":"physical",
//  "availability":"available", 
//  "weight":0
//};
//
//bigC.createProduct(newProduct)
//.pipe(JSONStream.parse())
//.pipe(printer, {end: false})
//
//
//bigC.updateProduct(84, {name: "Ladybug"})
//.pipe(JSONStream.parse())
//.pipe(printer, {end: false})
//
//bigC.getProductsBySKU("bestfish")
//.pipe(JSONStream.parse())
//.pipe(printer, {end: false})

//bigC.getCoupon(2)
//.pipe(JSONStream.parse())
//.pipe(printer, {end: false})
//
//var newCoupon = {
//  "code": "60OFF",
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
//.pipe(printer, {end: false})
//
//bigC.updateCoupon(5, {name: "fancy ole coupon"})
//.pipe(JSONStream.parse())
//.pipe(printer, {end: false})
