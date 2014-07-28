/*!
 * fasm tests
 * https://github.com/vincent/fasm
 *
 * Copyright 2014 Vincent Lark
 * Released under the MIT license
 */
/*jshint onevar: false, indent:4 */
/*global exports: true, require: true */
'use strict';

var fs           = require('fs');
var os           = require('os');

var AssetsFile   = require('./lib/assetsfile');
var Extractor    = require('./lib/extractor');

var testFileName = os.tmpdir() + '/test-fasm.json';

function removeFile (path) {
    try {
        fs.unlinkSync(path);
    } catch (error) {
        // no such file or directory
    }
}

exports.setUp = function (callback) {
    removeFile (testFileName);
    this.file = new AssetsFile(testFileName);
    callback();
};

exports.tearDown = function (callback) {
    removeFile (testFileName);
    callback();
},

exports['assets file methods'] = function (test) {

    var self = this;

    test.expect(14);

    test.ok(this.file.data, 'Main data object');

    var defaults = this.file.itemDefaults();

    test.ok(defaults.hasOwnProperty('title'),         'Default item has a title property');
    test.ok(defaults.hasOwnProperty('author'),        'Default item has a author property');
    test.ok(defaults.hasOwnProperty('author_url'),    'Default item has a author_url property');
    test.ok(defaults.hasOwnProperty('license'),       'Default item has a license property');
    test.ok(defaults.hasOwnProperty('canonicalLink'), 'Default item has a canonicalLink property');

    test.throws(
        function() {
            self.file.add(defaults);
        },
        Error,
        'Fail to add a non consistent item'
    );

    test.throws(
        function() {
            self.file.remove(defaults.canonicalLink);
        },
        Error,
        'Fail to remove a non existent item'
    );

    defaults.title = 'Test item';
    defaults.canonicalLink = '/unique-test-item';    

    test.doesNotThrow(
        function() {
            self.file.add(defaults);
        },
        Error,
        'Can add a valid item'
    );

    test.strictEqual(this.file.data.assets.length, 1);

    test.doesNotThrow(
        function() {
            self.file.add(defaults);
        },
        Error,
        'Does not duplicate items'
    );

    test.strictEqual(this.file.data.assets.length, 1);

    test.doesNotThrow(
        function() {
            self.file.remove(defaults.canonicalLink);
        },
        Error,
        'Can add a valid item'
    );

    test.strictEqual(this.file.data.assets.length, 0);

    test.done();
};

