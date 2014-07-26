/*jshint strict: false, onevar: false, indent:4 */
/*global console, module, require */
module.exports = AssetsFile;

var _      = require('lodash');
var fs     = require('fs');
var colors = require('colors');

function AssetsFile (path) {
    
    this.path = path;
    this.read();
}

AssetsFile.prototype.rootDefaults = function() {
    return {
        install_dir: './assets/',
        assets: []
    };
};

AssetsFile.prototype.itemDefaults = function() {
    return {
        title:      false,
        author:     false,
        author_url: false,
        license:    false,
        text:       false,
        tags:       [],
        canonicalLink: ''
    };
};

AssetsFile.prototype.read = function() {
    try {
        this.data = JSON.parse(fs.readFileSync(this.path).toString());
    } catch (error) {
        this.data = this.rootDefaults();
    }
};

AssetsFile.prototype.write = function() {
    console.log('write file'.white.bold, '\t', this.path);
    fs.writeFileSync(this.path, JSON.stringify(this.data, null, 4));
};

AssetsFile.prototype.has = function(canonicalLink) {
    return _.any(this.data.assets, function (asset) {
        return asset.canonicalLink === canonicalLink;
    });
};

AssetsFile.prototype.remove = function(canonicalLink) {
    this.data.assets = _.where(this.data.assets, function (asset) {
        return asset.canonicalLink != canonicalLink;
    });
};

AssetsFile.prototype.add = function(asset) {

    if (asset) {
        if (this.has(asset.canonicalLink)) {
            console.log('replace'.magenta.bold, '\t', asset.title);
            this.remove(asset.canonicalLink);
        
        } else {
            console.log('add asset'.white.bold, '\t', asset.title);
        }

        var item = this.itemDefaults();
        item = _.merge(item, asset);

        this.data.assets.push(item);

        this.write();            
    }
};
