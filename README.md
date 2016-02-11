# koa-mincer

[![npm version](https://badge.fury.io/js/koa-mincer.svg)](https://badge.fury.io/js/koa-mincer)
[![Build Status](https://travis-ci.org/naxmefy/koa-mincer.svg?branch=master)](https://travis-ci.org/naxmefy/koa-mincer)

[![Codacy Badge](https://api.codacy.com/project/badge/grade/96a5be91b535493f9acce7b73b8d19ff)](https://www.codacy.com/app/naxmefy/koa-mincer)
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

## contributing

* Found a bug? Create an issue!
* Missing Feature? Create an issue or fork the repo, implement the feature and start an pull request.

## license

[MIT](https://github.com/naxmefy/koa-mincer/blob/master/LICENSE)