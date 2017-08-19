var config = require('./config.js');

module.exports = {
    isAlive : {
        method: 'GET',
        path: '/monitoring/isAlive',
        handler: function( request, reply ) {
            return reply( 'true\n' ).type('application/json').header('X-Application-API-Version', config.apiVersion);
        }
    }
};