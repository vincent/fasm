/*jshint strict: false, onevar: false, indent:4 */
/*global module, require, console */
var _       = require('lodash');
var cheerio = require('cheerio');

module.exports = function (extracted, body) {

    // // custom extracts
    var $ = cheerio.load(body);

    function mergeIfFound (selector, merge) {
        var element = $(selector);

        if (element.length) {

            var override = merge(element);

            if (override) {
                // console.log('found', Object.keys(override).join(', ').white.bold);
                _.merge(extracted, override);
            }
        }
    }

    ///////////////////////////////////////

    // twitter page author
    mergeIfFound('[name="twitter:creator"]', function (element) {
        if (element.attr('content')) {
            return {
                author_url: '@' + element.attr('content')
            };
        }
    });

    // opengraph page title
    mergeIfFound('[property="og:title"]', function (element) {
        if (element.attr('content')) {
            return {
                title: element.attr('content')
            };
        }
    });

    // general license
    mergeIfFound('[href*="//creativecommons.org/licenses"]', function (element) {
        return {
            license:     'CC ' + element.attr('href').replace(/.*licenses\/([^\/]+)\/([^\/$]+).*/g, '$1 $2').trim().toUpperCase(),
            license_url: element.attr('href')
        };
    });
    mergeIfFound('[href*="//creativecommons.org/publicdomain"]', function (element) {
        return {
            license:     'CC0 Public Domain',
            license_url: element.attr('href')
        };
    });

    ///////////////////////////////////////

    // blendswap model author
    mergeIfFound('[role="main"] .user_link', function (element) {
        return {
            author:     element.text(),
            author_url: element.attr('href')
        };
    });

    // blendswap asset license
    mergeIfFound('.blendAuthorData .accordion .acc-tab-content a', function (element) {
        return {
            license:     element.text().replace(/[^A-Z- ]/g, '').trim(),
            license_url: element.parent().attr('href'),
            community:   'Blendswap'
        };
    });

    // opengameart post author
    mergeIfFound('#maincontent .username a', function (element) {
        return {
            author:     element.text(),
            author_url: element.attr('href'),
            community:  'OpenGameArt'
        };
    });
    

    return extracted;
};
