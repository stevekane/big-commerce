var removeSlashes = require('../utils').removeSlashes;

//transform product attribute according to groupon's schema
var formatProduct = function (product) {
  console.log(product);
  return {
    title: product.name,
    uuid: "bigc-product-"+product.id,
    slug: removeSlashes(product.custom_url)
  };
};

module.exports = formatProduct;
