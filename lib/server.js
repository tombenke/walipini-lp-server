#!/usr/bin/env node
/*jshint node: true */
'use strict';

var verbose = false;
var _ = require('underscore');
var Hapi = require('hapi');
var Good = require('good');
var monitoring = require('./monitoring.js');
var config = require('./config.js');

var setupRoutes = function(server, documentRoot) {

    // Define the REST API services
    _.each([
        monitoring.isAlive
        // list here the modules and API calls
    ], function(route) {
        route.path = config.urlPrefix + route.path;
        server.route(route);
    });

    // Define the document root path and the static content service
    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: documentRoot
            }
        }
    });
};

/**
 * Start the server
 * 
 * @param  {Object} config   Configuration parameters
 * @param  {bool} mode       Work in verbose mode if `true`
 */
exports.start = function(cfg, mode) {
    verbose = mode;
    var defaultConfig = {
        "apiVersion": "v1.0.0",
        "urlPrefix": "/rest",
        "port": cfg.port,
        "documentRoot": "../webui",
    };

    // Load the configuration parameters
    config.load(cfg.configFileName, defaultConfig);
    if (verbose) console.log(config);
    console.log(config)

    var server = new Hapi.Server({ app: config });

    server.connection({ port: config.port });
    setupRoutes(server, config.documentRoot);

    server.register({
        register: Good,
        options: {
            reporters: [{
                reporter: require('good-console'),
                events: [{ log: '*', response: '*' }]
            }, {
                reporter: require('good-file'),
                events: { ops: '*' },
                config: './server.log'
            }]
        }
    }, function (err) {
        if (err) {
            throw err; // something bad happened loading the plugin
        }

        server.start(function() {
            server.log('info', 'Server running at: ' + server.info.uri);
        });
    });
};
