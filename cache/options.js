var async = require('async')
  , _ = require('lodash')
  , property = _.property
  , clone = _.clone
  , extend = _.extend

var cacheOptions = function (bigC, cb) {

  //get values for this option then returned composite object
  var getOptionWithValues = function (option, cb) {
    bigC.getOptionValues(bigC, option.id, function (err, values) {
      var values = values || [];
      
      return cb(err, extend(clone(option), {values: values}));
    });
  };

  bigC.getOptions(bigC, {}, function (err, options) {
    var options = options || [];

    if (err) return cb(err, null); 
    async.map(options, getOptionWithValues, function (err, optionsWithValues) {
      //TODO: actually....cache something
      bigC.cache.options = optionsWithValues;
      cb(err, optionsWithValues);
    });
  })
};

module.exports = {
  cacheOptions: cacheOptions
};
