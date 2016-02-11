"use strict";

const koa = require('koa');
const r = require('koa-router')();
const views = require('koa-views');
const koaError = require('koa-error');
const koaMincer = require('..');

const app = module.exports = koa();
app.use(koaError());

app.use(views(__dirname + '/views', {
    jade: 'jade',
    extension: 'jade'
}));

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

r.get('/', function*() {
    this.state.pretty = true;
    yield this.render('index', {});
});

app.use(r.routes());
app.use(r.allowedMethods());

if (!module.parent) app.listen(process.env.PORT || 3000);
