var removeSlashes = require('../utils').removeSlashes
  , buildUrl = require('../utils').buildUrl

//transform product attribute according to groupon's schema
var formatProduct = function (bigC, product) {
  return {
    title: product.name,
    deal_url: buildUrl(bigC, product.custom_url),
    source_id: product.id,
    source_type: "big-commerce",
    slug: removeSlashes(product.custom_url)
  };
};

module.exports = formatProduct;
