#!/usr/bin/env node
/*jshint node: true */
'use strict';

/**
 * command-line utility
 */
(function() {
    var verbose = false;
    var program = require('commander');
    var thisPackage = require(__dirname + '/../package.json');
    program._name = thisPackage.name;
    var app = require('../index');
    var serverPort = process.env.PORT ? process.env.PORT : 3008;

    // Setup the commands of the program
    program
        .version(thisPackage.version)
        .description('Starts the server that will listen on <port>')
        .option("-v, --verbose", "Verbose mode", Boolean, false)
        .option("-p, --port <PORT-NUMBER>", "The port of the server (default: 3001)", Number, serverPort)
        .option("-c --config <CONFIG-FILE-NAME>", "The name of the server config file (default: <server-root>/config.json)", String, "config.json")
        .parse(process.argv);

    app.server.start({
            port: program.port,
            configFileName: program.config
        }, program.verbose);
})();
