"use strict";

const debug = require('debug');
const Koa = require('koa');
const koaMount = require('koa-mount');
const koaConvert = require('koa-convert');
const koaConnect = require('koa-connect');
const koaCompose = require('koa-compose');
const KoaRouter = require('koa-router');
const connectMincer = require('connect-mincer');

module.exports = function (opts) {
    const log = debug('koa-mincer');

    log("setup start");
    const cm = new connectMincer(opts);

    if (opts.mountPath == null) {
        opts.mountPath = "/assets";
    }

    if (opts.configure == null) {
        opts.configure = function () {
        };
    }

    log("run configure");
    opts.configure(cm);

    log("setup asset helper middleware");
    const _assets = cm.assets();
    cm.assets = function () {
        return koaCompose([
            koaConvert(function *(next) {
                this.res.locals = {};
                yield next;
            }),
            koaConvert(koaConnect(_assets)),
            koaConvert(function *(next) {
                this.state = this.res.locals;
                yield next;
            })
        ]);
    };

    log("setup asset server middleware");
    const assetServer = function () {
        return koaConvert(koaMount(opts.mountPath, koaConnect(cm.createServer())));
    };

    const middlewares = [cm.assets()];

    if (opts.production === false) {
        middlewares.push(assetServer());
    }

    log("setup finished");
    log("compose middlewares");
    return koaCompose(middlewares);
};
