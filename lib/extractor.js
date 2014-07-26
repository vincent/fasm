/*jshint strict: false, onevar: false, indent:4 */
/*global module, require, console */
module.exports = extract;

var _       = require('lodash');
var request = require('request');
var cheerio = require('cheerio');
var unfluff = require('unfluff');
var colors  = require('colors');

function extract (source, assetCallback) {
    
    this.source   = source;
    this.callback = assetCallback;

    function fromRequest(error, response, body) {

        if (error) {
            console.log('error'.red, '\t', error);
            assetCallback(null);
        }

        // basic extract by Unfluff
        var extracted = unfluff(body);

        // custom extracts
        var $ = cheerio.load(body);

        function mergeIfFound (selector, merge) {
            var element = $(selector);

            if (element.length) {

                var override = merge(element);

                if (override) {
                    console.log('found', Object.keys(override).join(', ').white.bold);
                    _.merge(extracted, override);
                }
            }
        }

        // twitter page author
        mergeIfFound('[name="twitter:creator"]', function (element) {
            if (element.attr('content')) {
                return {
                    author_url: '@' + element.attr('content')
                };
            }
        });

        // blendswap model author
        mergeIfFound('[role="main"] .user_link', function (element) {
            return {
                author:     element.text(),
                author_url: element.attr('href')
            };
        });

        // opengameart post author
        mergeIfFound('#maincontent .username a', function (element) {
            return {
                author:     element.text(),
                author_url: element.attr('href')
            };
        });

        console.log('found asset'.white.bold, '\t', extracted.title.green, 'by',
            (extracted.author ? extracted.author :
                (extracted.author_url ? extracted.author_url : extracted.canonicalLink)).green);

        assetCallback(extracted);
    }

    // Load an url

    if (source.url) {
        console.log('extract from url'.white.bold, source.url);
        request(source.url, fromRequest);
    }
}
