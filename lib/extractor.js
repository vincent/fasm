/*jshint strict: false, onevar: false, indent:4 */
/*global module, require, console */
module.exports = extract;

var request   = require('request');
var unfluff   = require('unfluff');
var colors    = require('colors');

var modifiers = require('./modifiers');

function extract (source, assetCallback) {
    
    this.source   = source;
    this.callback = assetCallback;

    function fromRequest(error, response, body) {

        if (error) {
            console.log('error'.red, '\t', error);
            assetCallback(error, null);
        }

        // basic extract by Unfluff
        var extracted = unfluff(body);

        // custom data
        extracted = modifiers(extracted, body);

        var log = [ 'found asset'.white.bold, '\t', extracted.title.green ];

        if (extracted.author) { log.push('by', extracted.author.yellow); }
        else if (extracted.author_url) { log.push('by', extracted.author_url.yellow); }

        if (extracted.license) { log.push('-', extracted.license.green, '-'); }

        if (extracted.community) { log.push('on', extracted.community.magenta); }

        console.log.apply(console.log, log);

        assetCallback(null, extracted);
    }

    // Load an url

    if (source.url) {
        console.log('extract from url'.white.bold, source.url);
        request(source.url, fromRequest);
    }
}
