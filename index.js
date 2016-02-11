"use strict";

//require('coffee-script/register');
//module.exports = require('./lib');

const koa = require('koa');
const koaMount = require('koa-mount');
const koaConnect = require('koa-connect');
const koaCompose = require('koa-compose');
const connectMincer = require('connect-mincer');

module.exports = function (opts) {
    const cm = new connectMincer(opts);

    if(opts.mountPath == null) {
        opts.mountPath = "/assets";
    }

    if (opts.configure == null) {
        opts.configure = function () {
        };
    }

    opts.configure(cm);

    const _assets = cm.assets();
    cm.assets = function () {
        return koaCompose([
            function*(next) {
                this.res.locals = {};
                yield next;
            },
            koaConnect(_assets),
            function*(next) {
                this.state = this.res.locals;
                yield next;
            }
        ]);
    };

    const _createServer = cm.createServer();
    cm.createServer = function () {
        const serverApp = koa();
        serverApp.use(koaConnect(_createServer));
        return koaMount(opts.mountPath, serverApp);
    };

    const middlewares = [cm.assets()];

    if(opts.production === false) {
        middlewares.push(cm.createServer());
    }

    return koaCompose(middlewares);
};
