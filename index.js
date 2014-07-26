/*!
 * fasm
 * https://github.com/vincent/fasm
 *
 * Copyright 2014 Vincent Lark
 * Released under the MIT license
 */
/*jshint onevar: false, indent:4 */
/*global process, console, module, require, define */
(function () {
    'use strict';
    
    var fasm = {};

    // global on the server, window in the browser
    var root;

    var _          = require('lodash');
    var util       = require('util');
    var colors     = require('colors');
    
    var extractor  = require('./lib/extractor');
    var AssetsFile = require('./lib/assetsfile');
    
    var db         = new AssetsFile('./assets.json');

    function credits () {
        _.map(db.data.assets, function (asset) {
            console.log(util.format('%s by %s\n from %s', asset.title.green, asset.author.green, asset.canonicalLink.white.bold));
        });
    }

    function addAsset (err, asset) {
        db.add(asset);
    }

    // AssetsCommand

    var command = require('commander');

    command
        .version(require('./package').version)
        .parse(process.argv);

    if (! command.args.length) {
        command.help();
        process.exit(1);
    }

    for (var i = 0; i < command.args.length; i++) {

        var arg   = command.args[i];
        var next  = (command.args.length > i + 1) ? command.args[i + 1] : null;

        switch (arg) {

            case 'add':
            case 'install':
                // if we have an url
                extractor({ url: next }, addAsset);
                i++;
            break;

            case 'del':
            case 'uninstall':
                db.remove(next);
            break;

            case 'list':
            case 'credits':
                credits();
            break;

            case 'update':
                credits();
            break;
        }
        
    }


    // Node.js
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = fasm;
    }
    // AMD / RequireJS
    else if (typeof define !== 'undefined' && define.amd) {
        define([], function () {
            return fasm;
        });
    }
    // included directly via <script> tag
    else {
        root.fasm = fasm;
    }

}());