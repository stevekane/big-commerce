var async = require('async')
  , _ = require('lodash')
  , clone = _.clone
  , extend = _.extend

var cacheCategories = function (bigC, cb) {
  bigC.getCategories(bigC, {}, function (err, categories) {
    bigC.cache.categories = categories;  
    return cb(err, categories);
  }); 
};

module.exports = {
  cacheCategories: cacheCategories
};
