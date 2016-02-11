# koa-mincer

Provides a koa middleware for assets.

[![npm version](https://badge.fury.io/js/koa-mincer.svg)](https://badge.fury.io/js/koa-mincer)
[![Build Status](https://travis-ci.org/naxmefy/koa-mincer.svg?branch=master)](https://travis-ci.org/naxmefy/koa-mincer)

[![Code Climate](https://codeclimate.com/github/naxmefy/koa-mincer/badges/gpa.svg)](https://codeclimate.com/github/naxmefy/koa-mincer)
[![Test Coverage](https://codeclimate.com/github/naxmefy/koa-mincer/badges/coverage.svg)](https://codeclimate.com/github/naxmefy/koa-mincer/coverage)

[![Issue Count](https://codeclimate.com/github/naxmefy/koa-mincer/badges/issue_count.svg)](https://codeclimate.com/github/naxmefy/koa-mincer)
[![Dependency Status](https://gemnasium.com/naxmefy/koa-mincer.svg)](https://gemnasium.com/naxmefy/koa-mincer)

## installation

```
$ npm install --save koa-mincer
```

## usage

```JavaScript
"use strict";

const koa = require('koa');
const koaMincer = require('koa-mincer');

const app = module.exports = koa();

// ...

app.use(koaMincer({
    root: __dirname,
    production: app.env === 'production',
    mountPoint: '/assets',
    manifestFile: __dirname + "/public/assets/manifest.json",
    paths: [
        'assets/css',
        'assets/js',
        'assets/templates'
    ]
}));

// ...

if (!module.parent) app.listen(process.env.PORT || 3000);
```

## options

Infos can be found at connect-mincer (https://github.com/clarkdave/connect-mincer#in-more-detail)

## about mincer

Information can be found [here](https://github.com/nodeca/mincer).

## about connect-mincer

Information can be found [here](https://github.com/clarkdave/connect-mincer).

## Precompiling for production

Simple Precompile Script:

```JavaScript
var Mincer = require('mincer');

var env = new Mincer.Environment('./');
env.appendPath('assets/js');
env.appendPath('assets/css');
env.appendPath('vendor/js');

var manifest = new Mincer.Manifest(env, './public/assets');
manifest.compile(['*', '*/**'], function(err, data) {
  console.info('Finished precompile:');
  console.dir(data);
});
```

More infos at connect-mincer (https://github.com/clarkdave/connect-mincer#precompiling).

## example usage with bower

use an ``` .bowerrc ``` to locate your assets/vendor folder like this

```JSON
{
    "directory": "app/assets/vendor"
}
```

add a .gitignore file inside the vendor folder

```
# app/assets/vendor/.gitignore

# Ignore everything here
*

# Except this file
!.gitignore
```

add a bower.json file (near package.json) and add your dependencies like this

```JSON
{
    "name": "my-app",
    "version": "1.0.0",
    "dependencies": {
        "jquery": "*",
        "angular": "*",
        "bootstrap": "*"
    }
}
```

**Contgratulations. You can use bower assets now**

## precompiling with bower deps and/or fonts etc.

these scripts may help you!

```JavaScript
// app/config.js

module.exports = {
    //...
    assets: {
        root: __dirname,
        production: process.env.NODE_ENV === 'production',
        mountPoint: '/assets',
        manifestFile: __dirname + "/public/assets/manifest.json",
        paths: [
            'assets/css',
            'assets/js',
            'assets/templates',
            'assets/vendor'
        ]
    },
    
    precompile: { 
        target: __dirname + "/public/assets",
        files: [
            // Your targeted ASSETS which required the whole rest like bootstrap etc.
            'app.js', 
            'app.css',
            
            // IMAGES AND FONTS
            '*.eot',
            '*.svg',
            '*.ttf',
            '*.woff',
            '*.woff2',
            '*.png',
            '*.gif',
            '*.jpg',
            '*.ico',
            '**/*.eot',
            '**/*.svg',
            '**/*.ttf',
            '**/*.woff',
            '**/*.woff2',
            '**/*.png',
            '**/*.gif',
            '**/*.jpg',
            '**/*.ico',
        ]
    }
    //...
};
```

```JavaScript
// bin/precompile.js

var Mincer = require('mincer');
var config = require('../app/config.js'); // the assets config

var env = new Mincer.Environment(config.assets.root); // Environment with defined root path

// add all your asset paths
for(var i = 0; i < config.assets.paths; i++) {
    env.appendPath(config.assets.paths[i]);
}

// Register an Helper for using inside Assets
env.registerHelper('asset_path', function(name, opts) {
  var assetPath = null;
  var asset = env.findAsset(name, opts);
  if (!asset) throw new Error("File [" + name + "] not found");
  if (config.assets.production) {
    assetPath = '/assets/' + asset.digestPath;
  } else {
    assetPath = '/assets/' + asset.logicalPath;
  }
  return assetPath;
});

// __dirname == "bin" folder
var manifest = new Mincer.Manifest(env, config.precompile.target);
manifest.compile(config.precompile.files, function(err, data) {
  if(err) {
    console.error(err);
  } else {
    console.info('Finished precompile:');
    console.dir(data);
  }
});
```

fonts are a problem because normally they won't be found if you using e.g. 
font-awesome. here is a fix for this problem (it using the 
registered helper ``` asset_path() ```)

```Stylus
//= require bootstrap/bootstrap.min.css
//= require font-awesome/css/font-awesome.css

@font-face {
  font-family: 'FontAwesome';
  src: url(asset_path('font-awesome/fonts/fontawesome-webfont.eot')+'?v=4.4.0');
  src: url(asset_path('font-awesome/fonts/fontawesome-webfont.eot')+'?#iefix&v=4.4.0') format('embedded-opentype'), 
       url(asset_path('font-awesome/fonts/fontawesome-webfont.woff2')+'?v=4.4.0') format('woff2'), 
       url(asset_path('font-awesome/fonts/fontawesome-webfont.woff')+'?v=4.4.0') format('woff'), 
       url(asset_path('font-awesome/fonts/fontawesome-webfont.ttf')+'?v=4.4.0') format('truetype'), 
       url(asset_path('font-awesome/fonts/fontawesome-webfont.svg')+'?v=4.4.0#fontawesomeregular') format('svg');
  font-weight: normal;
  font-style: normal;
}

body
  padding-top: 60px
```


## contributing

* Found a bug? Create an issue!
* Missing Feature? Create an issue or fork the repo, implement the feature and start an pull request.

## license

[MIT](https://github.com/naxmefy/koa-mincer/blob/master/LICENSE)
