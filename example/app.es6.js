"use strict";

import co from 'co';
import Koa from 'koa';
import KoaRouter from'koa-router';
import koaViews from 'koa-views';
import koaError from 'koa-error';
import koaConvert from 'koa-convert';
import koaMincer from '..';

const app = module.exports = new Koa();
const router = new KoaRouter();

app.use(koaConvert(koaError()));

app.use(koaConvert(koaViews(__dirname + '/views', {
    extension: 'jade',
    default: 'jade'
})));

app.use(co.wrap(function *(ctx, next) {
    ctx.render = co.wrap(ctx.render);
    yield next();
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

router.get('/', async (ctx) => {
    ctx.state.pretty = true;
    await ctx.render('index', {});
});

app.use(router.routes());
app.use(router.allowedMethods());

if (!module.parent) app.listen(process.env.PORT || 3000);
