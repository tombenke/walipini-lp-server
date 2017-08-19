var path = require('path');
var _ = require('underscore');

var config = module.exports = {
    load : function(configFileName, defaultCfg) {
        config = _.extend(config, defaultCfg);

        try {
            var configData = require(path.resolve(configFileName));
            config = _.extend(config, configData);
        } catch(err) {
            console.error("Does not found the '%s' config file, so use the default configuration");
        }
    }
};